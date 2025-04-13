import { inngest } from "./client";
import { EmailTemplate } from "../../app/components/email-template";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");

    const { data, error } = await step.run("send-welcome-email", async () => {
      const email = event.data.email;
      return resend.emails.send({
        from: "Jason <jason@jlast.io>",
        to: [email],
        subject: "Hello world",
        react: EmailTemplate({ firstName: "Jason" }),
      });
    });

    return { data, error };
  },
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
  },
);
