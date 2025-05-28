import express, { Request, Response } from "express";
import { authMiddleware } from "@/middleware/authMiddleware";
import cors from "cors";
import schemaRoutes from "@/routes/schemaRoutes"; // Added import

const app = express();
const port = process.env.PORT || 3001;

async function main() {
  console.log("FlexiCRM Server Starting...");

  // Netlify domain
  app.use(
    cors({
      origin: "https://boisterous-chebakia-842de7.netlify.app",
    })
  );
  // Add authMiddleware as global middleware
  app.use(authMiddleware);

  // Mount schemaRoutes
  app.use("/api/schemas", schemaRoutes);

  // Add new health check route
  app.get("/api", (req: Request, res: Response) => {
    res.json({ message: "FlexiCRM Backend is running!" });
  });

  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
}

main().catch(console.error);
