import { Router, Response } from "express";
import { PostgrestError } from "@supabase/supabase-js";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import {
  getSchemaById,
  getAllAccessibleSchemas,
} from "@/services/entitySchemaService";

const router = Router();

// GET /api/schemas/:schemaId
const getSchemaByIdHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { schemaId } = req.params as { schemaId: string }; // Ensure schemaId is typed
  const userAccessToken = req.token;

  if (!userAccessToken) {
    console.warn("Unauthorized: Proceeding as anonymous");
  }

  try {
    const { data: schema, error } = await getSchemaById(
      schemaId,
      userAccessToken
    );

    // todo: cleaner way?
    if (error) {
      if (typeof error === "object" && error !== null && "code" in error) {
        const pgError = error as PostgrestError;

        if (pgError.code === "PGRST116") {
          return res
            .status(404)
            .json({ message: "Schema not found or not accessible." });
        }

        return res
          .status(500)
          .json({ message: "Error fetching schema.", error: pgError.message });
      }

      // Fallback for unexpected error shape
      return res
        .status(500)
        .json({ message: "Unknown error fetching schema." });
    }

    if (!schema) {
      return res
        .status(404)
        .json({ message: "Schema not found or not accessible." });
    }

    return res.status(200).json(schema);
  } catch (err: any) {
    console.error(`GET /api/schemas/${schemaId} - Uncaught error:`, err);
    return res
      .status(500)
      .json({ message: "Internal server error.", error: err.message });
  }
};

router.get("/:schemaId", getSchemaByIdHandler);

// GET /api/schemas
const getAllAccessibleSchemasHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const userAccessToken = req.token;

  if (!userAccessToken) {
    console.warn("Unauthorized: Proceeding as anonymous");
  }

  try {
    const { data: schemas, error } = await getAllAccessibleSchemas(
      userAccessToken
    );

    // todo: cleaner way?
    if (error) {
      if (typeof error === "object" && error !== null && "code" in error) {
        const pgError = error as PostgrestError;
        return res
          .status(500)
          .json({ message: "Error fetching schemas.", error: pgError.message });
      }
    }

    return res.status(200).json(schemas);
  } catch (err: any) {
    console.error("GET /api/schemas - Uncaught error:", err);
    return res
      .status(500)
      .json({ message: "Internal server error.", error: err.message });
  }
};

router.get("/", getAllAccessibleSchemasHandler);

export default router;
