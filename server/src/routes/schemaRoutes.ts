import express from "express";
import {
  getSchemaById,
  getAllAccessibleSchemas,
} from "@/services/entitySchemaService";

const router = express.Router();

// GET /api/schemas/:schemaId
router.get("/:schemaId", async (req, res) => {
  const { schemaId } = req.params;
  try {
    const { data: schema, error } = await getSchemaById(schemaId);

    if (error && error.code === "PGRST116") {
      // Row not found
      return res
        .status(404)
        .json({ message: "Schema not found or not accessible." });
    } else if (error) {
      // Other Supabase errors were already logged in the service
      return res
        .status(500)
        .json({ message: "Error fetching schema.", error: error.message });
    }

    if (!schema) {
      // Should be covered by PGRST116, but as a fallback
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
});

// GET /api/schemas
router.get("/", async (req, res) => {
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
});

export default router;
