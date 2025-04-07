import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  }
);

export const myScheduledFunction = inngest.createFunction(
  {
    id: "cron",
    name: "Run hourly",
  },
  {
    cron: "0 * * * *",
  },
  async ({ step }) => {
    await step.sleep("wait-a-moment", "1s");
    const date = new Date();
    return { message: `Hello ${date.toDateString()}!` };
  }
);
