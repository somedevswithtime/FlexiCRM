import express, { Request, Response } from "express";
import cors from "cors";
import { authMiddleware } from "@/middleware/authMiddleware";
import { NETLIFY_URL } from "@/lib/constants";
import schemaRoutes from "@/routes/schemaRoutes"; // Added import
import instanceRoutes from "@/routes/instanceRoutes"; // Import instance routes

const app = express();
const port = process.env.PORT || 3001;

async function main() {
  console.log("FlexiCRM Server Starting...");

  // Allowed origins for CORS, need to rethink
  const allowedOrigins = [NETLIFY_URL, "http://localhost:3000"];

  app.use(
    cors({
      origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
          const msg =
            "The CORS policy for this site does not allow access from the specified Origin.";
          return callback(new Error(msg), false);
        }
        return callback(null, true);
      },
    })
  );

  // Middleware to parse JSON bodies
  app.use(express.json());

  // Add authMiddleware as global middleware
  app.use(authMiddleware);

  // Mount schemaRoutes
  app.use("/api/schemas", schemaRoutes);

  // Mount instanceRoutes
  app.use("/api/instances", instanceRoutes);

  // Add new health check route
  app.get("/api", (req: Request, res: Response) => {
    res.json({ message: "FlexiCRM Backend is running!" });
  });

  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
}

main().catch(console.error);
