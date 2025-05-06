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
};

async function insertTask(rawData: HyperbrowserAgentResult): Promise<number> {
  console.debug("Inserting pending task with raw data:", rawData);
  const result =
    (await sql`INSERT INTO tasks (type, raw, status) VALUES ('ebi', ${JSON.stringify(
      rawData
    )}, 'pending') RETURNING id`) as { id: number }[];
  console.debug("Inserted task with ID:", result[0].id);
  return result[0].id;
}

async function updateTaskSuccess(taskId: number, data: EBIResult) {
  console.debug(`Updating task ${taskId} to successful with data:`, data);
  await sql`UPDATE tasks SET status = 'successful', data = ${JSON.stringify(
    data
  )} WHERE id = ${taskId}`;
  console.debug(`Task ${taskId} updated to successful.`);
}

async function updateTaskFailure(taskId: number, error: Error) {
  console.debug(`Updating task ${taskId} to failed. Error:`, error.message);
  await sql`UPDATE tasks SET status = 'failed', error = ${error.message}, data = NULL WHERE id = ${taskId}`;
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

export async function getEBIDetails(): Promise<EBIResult | null> {
  // Use the defined type and initialize
  let result: HyperbrowserAgentResult | undefined = undefined;
  let taskId: number | undefined = undefined; // Declare taskId here

  try {
    console.log("Starting EBI check");
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
    taskId = await insertTask(result); // Assign taskId here

    if (!result?.data?.finalResult) {
      console.error("Final result not found in response:", result);
      throw new Error("Final result not found in Hyperbrowser response");
    }

    const finalResult = JSON.parse(result.data.finalResult) as EBIResult;

    if (!finalResult.premium_discount) {
      console.error(
        `No premium discount found: ${JSON.stringify(finalResult)}`
      );
      throw new Error("No premium discount found");
    }

    await updateTaskSuccess(taskId, finalResult); // Use taskId here
    return finalResult;
  } catch (error) {
    console.error("Error getting EBI details", error, result);
    // Send email notification first
    await sendDetailsUnavailable(error as Error, result || {});

    // Update task status to failed if taskId is available
    if (taskId !== undefined) {
      await updateTaskFailure(taskId, error as Error); // Check taskId before using
    } else {
      console.error(
        "Task ID is undefined, cannot update task status to failed."
      );
      // Optionally, attempt to insert a failed task record here if needed
      // await sql`INSERT INTO tasks (type, status, raw, data) VALUES ('ebi', 'failed', ${JSON.stringify(result || {})}, ${JSON.stringify({ errorMessage: (error as Error).message })})`;
    }

    throw error;
  }
}
