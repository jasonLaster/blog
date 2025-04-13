import { Hyperbrowser } from "@hyperbrowser/sdk";
import {
  EBIUpdate,
  EBIDetailsUnavailableEmail,
} from "../components/emails/ebi";
import { Resend } from "resend";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

const hbClient = new Hyperbrowser({
  apiKey: process.env.HYPERBROWSER_API_KEY,
});

const resend = new Resend(process.env.RESEND_API_KEY);

export type EBIResult = Partial<{
  etf_ticker: string;
  exchange: string;
  cusip: string;
  premium_discount: string;
  median_30_day_spread: string;
  gross_expense_ratio: string;
}>;

type Task = {
  id: number;
  created_at: Date;
  type: string;
  data: unknown;
};

async function insertTask(data: EBIResult) {
  return (await sql`INSERT INTO tasks (type, data) VALUES ('ebi', ${JSON.stringify(
    data
  )}) RETURNING *`) as Task[];
}

export async function sendUpdate(data: EBIResult, email: string) {
  return resend.emails.send({
    from: "Notifications <notifications@jlast.io>",
    to: [email],
    subject: "EBI's Premium Discount is dangerously low",
    react: await EBIUpdate(data),
  });
}

export async function sendDetailsUnavailable(error: Error, email: string) {
  const errorMessage = error instanceof Error ? error.message : "Unknown error";

  return resend.emails.send({
    from: "Notifications <notifications@jlast.io>",
    to: [email],
    subject: "EBI Details are not available",
    react: await EBIDetailsUnavailableEmail({ errorMessage }),
  });
}

export async function getEBIDetails(): Promise<EBIResult> {
  const result = await hbClient.agents.browserUse.startAndWait({
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
  });

  let finalResult: EBIResult;
  try {
    finalResult = JSON.parse(result.data!.finalResult!) as EBIResult;
  } catch (error) {
    console.error(
      `Failed to parse EBI details: ${(JSON.stringify(result), null, 2)} ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
    throw new Error(
      `Failed to parse EBI details: ${JSON.stringify(result)} ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }

  if (!finalResult.premium_discount) {
    console.error(`No premium discount found: ${JSON.stringify(finalResult)}`);
    throw new Error("No premium discount found");
  }

  await insertTask(finalResult);
  return finalResult;
}
