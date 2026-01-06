import { Hono } from "hono";

import DashboardIndex from "@/pages/dashboard/";

const dashboard = new Hono()

declare module '@hono/react-renderer' {
  interface Props {
    title: string
  }
}

dashboard.get("/", c => {
  return c.render(DashboardIndex(), { title: "Dashboard" });
});

export { dashboard };