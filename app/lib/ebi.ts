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

export async function getEBIDetails(): Promise<EBIResult | null> {
  let taskId: number | undefined = undefined;
  let result: HyperbrowserAgentResult | undefined = undefined;

  try {
    console.log("Starting EBI check");
    taskId = await createInitialTask(); // Create task first

    try {
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
    } catch (hbError) {
      // Handle Hyperbrowser client error specifically
      console.error("Error during Hyperbrowser call", hbError);
      if (taskId !== undefined) {
        // Pass null for rawData as the call failed
        await updateTaskFailure(taskId, hbError as Error, null);
      } else {
        // This case should ideally not happen if createInitialTask succeeded
        console.error("Task ID is undefined after Hyperbrowser call failure.");
      }
      // Send generic failure email
      await sendDetailsUnavailable(hbError as Error, {});
      throw hbError; // Re-throw to be caught by the outer catch
    }

    // --- Parsing and Validation ---
    let finalResult: EBIResult;
    try {
      if (!result?.data?.finalResult) {
        console.error("Final result not found in response:", result);
        throw new Error("Final result not found in Hyperbrowser response");
      }

      finalResult = JSON.parse(result.data.finalResult) as EBIResult;

      if (!finalResult.premium_discount) {
        console.error(
          `No premium discount found: ${JSON.stringify(finalResult)}`
        );
        throw new Error("No premium discount found");
      }
    } catch (parseError) {
      console.error(
        "Error parsing or validating EBI details",
        parseError,
        result
      );
      // Update task status to failed, passing the raw result received
      if (taskId !== undefined) {
        await updateTaskFailure(taskId, parseError as Error, result);
      } else {
        console.error("Task ID is undefined during parsing failure.");
      }
      // Send specific failure email with potentially available raw data
      await sendDetailsUnavailable(parseError as Error, result || {});
      throw parseError; // Re-throw to be caught by outer catch
    }

    // --- Success ---
    await updateTaskSuccess(taskId, finalResult); // Update task to successful
    console.debug("Task successfully completed and updated.");
    return finalResult;
  } catch (error) {
    // This outer catch handles errors re-thrown from inner blocks
    // or any unexpected errors before/after the main logic.
    console.error("Overall error in getEBIDetails", error);

    // Attempt to update task failure one last time if taskId exists and it wasn't handled
    // This might be redundant if inner catches worked, but acts as a safety net.
    if (taskId !== undefined) {
      try {
        // Check current status before potentially overwriting
        const taskStatusResult =
          await sql`SELECT status FROM tasks WHERE id = ${taskId}`;
        if (
          taskStatusResult.length > 0 &&
          taskStatusResult[0].status !== "failed"
        ) {
          console.warn(
            `Task ${taskId} status was ${taskStatusResult[0].status}, updating to failed in outer catch.`
          );
          // Pass the raw result if available, otherwise null
          await updateTaskFailure(taskId, error as Error, result);
        }
      } catch (updateError) {
        console.error(
          `Failed to update task ${taskId} to failed in outer catch block:`,
          updateError
        );
      }
    } else {
      console.error("Task ID is undefined in outer catch block.");
      // Potentially insert a minimal failure record if task creation itself failed
      // await sql`INSERT INTO tasks (type, status, error) VALUES ('ebi', 'failed', ${(error as Error).message})`;
    }

    // No need to send email here as inner catches should have handled it.
    throw error; // Re-throw the original error
  }
}
