import { serve } from "inngest/next";
import { inngest } from "@/app/inngest/inngest";
import { sendIntakeEmail } from "@/app/inngest/functions/sendIntakeEmail";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [sendIntakeEmail],
  servePath: "/api/inngest",
});
