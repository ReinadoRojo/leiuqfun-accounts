import { Hono } from "hono";

import DashboardIndex from "@/pages/dashboard/";

const dashboard = new Hono()

dashboard.get("/", c => {
  return c.render(DashboardIndex(), { title: "Dashboard" });
});

export { dashboard };