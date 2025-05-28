import express, { Request, Response } from "express";
import {
  getAllAccessibleSchemas,
  getSchemaById,
} from "@/services/entitySchemaService";

const app = express();
const port = process.env.PORT || 3001;

async function main() {
  console.log("FlexiCRM Server Starting...");

  app.get("/api", (req: Request, res: Response) => {
    res.json({ message: "FlexiCRM Backend is running!" });
  });

  app.get("/api/schemas", async (req: Request, res: Response) => {
    try {
      const schemas = await getAllAccessibleSchemas();
      res.status(200).json(schemas);
    } catch (error) {
      console.error("Error fetching schemas:", error);
      res.status(500).json({ message: "Failed to fetch schemas" });
    }
  });

  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
}

main().catch(console.error);
