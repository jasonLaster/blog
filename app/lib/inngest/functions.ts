import { inngest } from "./client";
import {
  EBIResult,
  getEBIDetails,
  sendDetailsUnavailable,
  sendUpdate,
} from "../ebi";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  }
);

export const getEBIDetail = inngest.createFunction(
  {
    id: "get-ebi-detail",
    name: "Get EBI Detail",
  },
  {
    cron: "0 0 * * *",
  },
  async ({ step }) => {
    const { data: ebiDetails, failed } = await step.run(
      "get-ebi-detail",
      async () => {
        try {
          const data = await getEBIDetails();
          return { data, failed: false };
        } catch (error) {
          console.error("Error getting EBI details", error);
          const emailResponse = await sendDetailsUnavailable(
            error as Error,
            "jason.laster.11@gmail.com"
          );

          return { data: emailResponse, failed: true };
        }
      }
    );

    if (failed) {
      return { message: "Failed to get EBI details" };
    }

    const emailResponse = await step.run("send-email", async () => {
      if (!ebiDetails) {
        return { message: "No EBI details" };
      }

      if (
        ebiDetails &&
        "premium_discount" in ebiDetails &&
        typeof ebiDetails.premium_discount === "string"
      ) {
        if (parseFloat(ebiDetails.premium_discount) < -0.2) {
          const email = await sendUpdate(
            ebiDetails as EBIResult,
            "jason.laster.11@gmail.com"
          );

          return { message: "Premium is low", email };
        }
      }

      return { message: "Premium is fine" };
    });

    return { emailResponse, ebiDetails };
  }
);
