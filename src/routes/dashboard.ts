import DashboardIndex from "@/pages/dashboard/";
import { Hono } from "hono";

const dashboard = new Hono()

dashboard.get("/", c => {
  return c.render(DashboardIndex(), { title: "Dashboard" });
});

dashboard.get("/profile", c => c.text("user profile page"));

// App management routes
// > Views
dashboard.get("/apps/:id", c => c.text(`app details for ${c.req.param("id")}`));
dashboard.get("/apps/:id/visit", c => c.text(`app visit redirect ${c.req.param('id')}`));
dashboard.get("/apps/:id/unlink", c => c.text(`app unlink confirmation for ${c.req.param('id')}`));
// > Actions
dashboard.post("/apps/:id/unlink", c => c.text(`app unlink action for ${c.req.param('id')}`));

export { dashboard };
