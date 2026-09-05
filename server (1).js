import express from "express";
import cors from "cors";
import salesRoutes from "./src/routes/sales.js";
import inventoryRoutes from "./src/routes/inventory.js";
import copilotRoutes from "./src/routes/copilot.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/sales", salesRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/copilot", copilotRoutes);

app.listen(PORT, () => {
  console.log(`Retail Copilot API listening on http://localhost:${PORT}`);
});
