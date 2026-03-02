import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "brandex-store",
  name: "Brandex Store",
  // In dev: use INNGEST_EVENT_KEY if set, otherwise fall back to the local
  // dev server (http://localhost:8288) — run `npx inngest-cli@latest dev`
  // alongside `pnpm dev` to enable background functions locally.
  // In production: INNGEST_EVENT_KEY must be set in env.
  eventKey: process.env.INNGEST_EVENT_KEY,
});
