import { Hyperbrowser } from "@hyperbrowser/sdk";
import {
  AlertEmail,
  EBIDetailsUnavailableEmail,
  EBIPremiumDiscountAlert,
} from "../components/emails/ebi";
import { Resend } from "resend";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

const hbClient = new Hyperbrowser({
  apiKey: process.env.HYPERBROWSER_API_KEY,
});

const resend = new Resend(process.env.RESEND_API_KEY);

const email = "jason.laster.11@gmail.com";

export type EBIResult = {
  etf_ticker: string;
  exchange: string;
  cusip: string;
  premium_discount: string;
  median_30_day_spread: string;
  gross_expense_ratio: string;
  net_assets: string;
};

// Define a more specific type for the Hyperbrowser result based on usage
type HyperbrowserAgentResult = {
  data?: {
    // Make data optional
    finalResult?: string; // Make finalResult optional
    [key: string]: unknown; // Use unknown instead of any
  } | null;
  [key: string]: unknown; // Use unknown instead of any
  status: string;
  error?: string;
};

async function createInitialTask(): Promise<number> {
  console.debug("Creating initial task with status 'starting'.");
  const result =
    (await sql`INSERT INTO tasks (type, status) VALUES ('ebi', 'starting') RETURNING id`) as {
      id: number;
    }[];
  const taskId = result[0].id;
  console.debug("Created initial task with ID:", taskId);
  return taskId;
}

async function updateTaskWithRawData(
  taskId: number,
  rawData: HyperbrowserAgentResult
) {
  console.debug(
    `Updating task ${taskId} with raw data and status 'pending':`,
    rawData
  );
  await sql`UPDATE tasks SET raw = ${JSON.stringify(
    rawData
  )}, status = 'pending' WHERE id = ${taskId}`;
  console.debug(`Task ${taskId} updated with raw data and status 'pending'.`);
}

async function updateTaskSuccess(taskId: number, data: EBIResult) {
  console.debug(`Updating task ${taskId} to successful with data:`, data);
  await sql`UPDATE tasks SET status = 'successful', data = ${JSON.stringify(
    data
  )} WHERE id = ${taskId}`;
  console.debug(`Task ${taskId} updated to successful.`);
}

async function updateTaskFailure(
  taskId: number,
  error: Error,
  rawData: HyperbrowserAgentResult | null = null
) {
  console.debug(
    `Updating task ${taskId} to failed. Error:`,
    error.message,
    "Raw data:",
    rawData
  );
  // Ensure raw data is stored even on failure, if available
  const rawJson = rawData ? JSON.stringify(rawData) : null;
  await sql`UPDATE tasks SET status = 'failed', error = ${error.message}, raw = ${rawJson}, data = NULL WHERE id = ${taskId}`;
  console.debug(`Task ${taskId} updated to failed.`);
}

export async function sendPremiumDiscountAlert(data: EBIResult) {
  return resend.emails.send({
    from: "Notifications <notifications@jlast.io>",
    to: [email],
    subject: "EBI's Premium Discount is dangerously low",
    react: await EBIPremiumDiscountAlert(data),
  });
}

export async function sendDetailsUnavailable(error: Error, result: object) {
  const emailData = {
    from: "Notifications <notifications@jlast.io>",
    to: [email],
    subject: "EBI Details are not available",
    react: await EBIDetailsUnavailableEmail({
      errorMessage: error instanceof Error ? error.message : "Unknown error",
      result,
    }),
  };

  return resend.emails.send(emailData);
}

export async function sendNetAssetsAlert(data: EBIResult) {
  return resend.emails.send({
    from: "Notifications <notifications@jlast.io>",
    to: [email],
    subject: "EBI Net Assets are low",
    react: await AlertEmail({
      title: "EBI Net Assets are low",
      message: `EBI has ${data.net_assets} net assets. This is below the threshold of 400 million.`,
    }),
  });
}

export function extractEbiJson(resultString: string): EBIResult {
  const match = resultString.match(/{[\s\S]*}/);
  if (!match) {
    console.error(
      "[EBI] No JSON object found in Hyperbrowser result",
      resultString
    );
    throw new Error("No JSON object found in Hyperbrowser result");
  }
  try {
    return JSON.parse(match[0]) as EBIResult;
  } catch (err) {
    console.error(
      "[EBI] Failed to parse JSON from Hyperbrowser result",
      err,
      match[0]
    );
    throw new Error("Failed to parse JSON from Hyperbrowser result: " + err);
  }
}

// Define the type for the /api/ebi endpoint response
export interface EbiApiPerformance {
  dateRange: { startDate: string; endDate: string };
  individualPerformance: Record<string, unknown>;
  performanceDeltas: { ebi_vti?: number; ebi_iwv?: number; vti_iwv?: number };
  historicalPrices: Record<string, unknown>;
  [key: string]: unknown;
}

export async function fetchEbiApiResult(): Promise<EbiApiPerformance | null> {
  console.log(`Fetching EBI API results`);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const url = `${baseUrl}/api/ebi`;
  console.debug("[EBI] Fetching /api/ebi endpoint", url);
  const res = await fetch(url);
  if (!res.ok) {
    console.error("[EBI] Failed to fetch /api/ebi", res.status, res.statusText);
    throw new Error(`Failed to fetch ${url}`);
  }
  const data = (await res.json()) as EbiApiPerformance;
  console.debug("[EBI] /api/ebi response", data);
  return data;
}

export async function maybeSendEbiPerformanceAlert(
  ebiApiResult: EbiApiPerformance | null
): Promise<unknown | null> {
  if (!ebiApiResult || !ebiApiResult.performanceDeltas) {
    console.debug("[EBI] No performanceDeltas in ebiApiResult");
    return null;
  }
  const { ebi_iwv, ebi_vti } = ebiApiResult.performanceDeltas;
  console.debug("[EBI] ebi_iwv:", ebi_iwv, "ebi_vti:", ebi_vti);
  let alertEmailResult: unknown = null;
  const iwvAtRisk = typeof ebi_iwv === "number" && ebi_iwv < -2.5;
  const vtiAtRisk = typeof ebi_vti === "number" && ebi_vti < -2.5;
  if (iwvAtRisk || vtiAtRisk) {
    const subject =
      iwvAtRisk && vtiAtRisk
        ? "EBI Alert: Underperforming both IWV and VTI"
        : iwvAtRisk
        ? "EBI Alert: Underperforming IWV"
        : "EBI Alert: Underperforming VTI";
    const title = "EBI Performance Alert";
    const message = [
      iwvAtRisk && `EBI vs IWV delta: ${ebi_iwv}% (below -2.5% threshold)`,
      vtiAtRisk && `EBI vs VTI delta: ${ebi_vti}% (below -2.5% threshold)`,
    ]
      .filter(Boolean)
      .join("\n");
    console.debug("[EBI] Sending alert email", { subject, title, message });
    alertEmailResult = await resend.emails.send({
      from: "Notifications <notifications@jlast.io>",
      to: [email],
      subject,
      react: AlertEmail({
        title,
        message,
      }),
    });
  }

  return alertEmailResult;
}

export async function getEBIDetails(): Promise<EBIResult | null> {
  let taskId: number | undefined = undefined;
  let result: HyperbrowserAgentResult | undefined = undefined;

  try {
    console.log("Starting EBI check");
    taskId = await createInitialTask(); // Create task first

    // Cast the result to the expected type via unknown
    result = (await hbClient.agents.browserUse.startAndWait({
      task: `
      What are the fund details for https://longviewresearchpartners.com/charts/

      Return the details as a JSON object. Do not include any other text.

      {
          "etf_ticker": "EBI",
          "exchange": "NASDAQ",
          "cusip": "75526L852",
          "inception": "Feb 26, 2025",
          "net_assets": "452,629,474.16",
          "shares_outstanding": "9,896,830",
          "nav": "45.73",
          "nav_change_dollar": "0.12",
          "nav_change_percent": "0.26",
          "market_price": "45.72",
          "market_price_change_dollar": "0.08",
          "market_price_change_percent": "0.18",
          "premium_discount": "-0.03",
          "median_30_day_spread": "0.14",
          "gross_expense_ratio": "0.35%",
          "net_expense_ratio": "0.25%",
      }`,
    })) as unknown as HyperbrowserAgentResult;

    console.log("EBI check complete", result);
    // Update task with raw data and 'pending' status
    await updateTaskWithRawData(taskId, result);

    if (!result?.data?.finalResult) {
      console.error("Final result not found in response:", result);
      throw new Error("Final result not found in Hyperbrowser response");
    }

    const finalResult: EBIResult = extractEbiJson(result.data.finalResult);

    if (!finalResult.premium_discount) {
      console.error(
        `No premium discount found: ${JSON.stringify(finalResult)}`
      );
      throw new Error("No premium discount found");
    }

    await updateTaskSuccess(taskId, finalResult);
    return finalResult;
  } catch (error) {
    console.error("Overall error in getEBIDetails", error);
    await updateTaskFailure(taskId!, error as Error, result);
    throw error; // Re-throw the original error
  }
}
