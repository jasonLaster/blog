import { inngest } from "./client";
import { neon } from "@neondatabase/serverless";
import { getEBIDetails } from "../ebi";
const sql = neon(process.env.DATABASE_URL!);

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  }
);

type Task = {
  id: number;
  created_at: Date;
  type: string;
  data: unknown;
};

export const getEBIDetail = inngest.createFunction(
  {
    id: "get-ebi-detail",
    name: "Get EBI Detail",
  },
  {
    cron: "0 0 * * *",
  },
  async ({ step }) => {
    await step.run("get-ebi-detail", async () => {
      const data = await getEBIDetails();

      const result =
        (await sql`INSERT INTO tasks (type, data) VALUES ('ebi', ${data}) RETURNING *`) as Task[];

      return { result };
    });
  }
);
