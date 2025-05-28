import express from "express"; // Keep Request and Response scoped to express
import {
  getSchemaById,
  getAllAccessibleSchemas,
} from "@/services/entitySchemaService";

const router = express.Router();

// TODO: type errors

// GET /api/schemas/:schemaId
// Explicitly type req and res using express.Request and express.Response
const getSchemaByIdHandler = async (
  req: express.Request<{ schemaId: string }, any, any, any>,
  res: express.Response
) => {
  const { schemaId } = req.params;
  try {
    const { data: schema, error } = await getSchemaById(schemaId);

    if (error?.code === "PGRST116") {
      return res
        .status(404)
        .json({ message: "Schema not found or not accessible." });
    } else if (error) {
      return res
        .status(500)
        .json({ message: "Error fetching schema.", error: error.message });
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
// Explicitly type req and res using express.Request and express.Response
const getAllAccessibleSchemasHandler = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { data: schemas, error } = await getAllAccessibleSchemas();

    if (error) {
      // Supabase errors were already logged in the service
      return res
        .status(500)
        .json({ message: "Error fetching schemas.", error: error.message });
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
