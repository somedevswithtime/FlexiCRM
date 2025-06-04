import { Router, Request, Response } from "express";
import {
  getAllInstances,
  createInstance,
} from "@/services/entityInstanceServices";
import { DEFAULT_DEMO_USER_ID } from "@/lib/constants";

const router = Router();

router.get("/:schemaId", async (req: Request, res: Response) => {
  const { schemaId } = req.params;

  if (!schemaId) {
    return res.status(400).json({ error: "Missing schemaId parameter" });
  }

  try {
    const { data, error } = await getAllInstances(schemaId);

    if (error) {
      console.error("Error fetching instances:", error);
      // Differentiate between "not found" and other errors if possible
      // For now, treating all errors from service as potential server errors or not found
      if (error.message.includes("not found")) {
        return res.status(404).json({ error: "Instances not found" });
      }
      return res.status(500).json({ error: "Failed to fetch instances" });
    }

    if (!data || data.length === 0) {
      return res
        .status(404)
        .json({ error: "No instances found for the given criteria" });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error("Unexpected error in instance route:", err);
    return res.status(500).json({ error: "An unexpected error occurred" });
  }
});

// POST route
router.post("/:schemaId", async (req: Request, res: Response) => {
  const { schemaId } = req.params;
  const instanceData = req.body;

  // Determine userId: use authenticated user if available, otherwise fallback to demo user
  // Casting req to any to access user property, assuming it's added by authMiddleware
  const userIdFromAuth = (req as any).user?.id;
  const userId = userIdFromAuth || DEFAULT_DEMO_USER_ID;

  if (!schemaId) {
    return res.status(400).json({ error: "Missing schemaId parameter" });
  }

  if (!userId) {
    return res.status(400).json({ error: "User ID could not be determined" });
  }

  if (!instanceData || Object.keys(instanceData).length === 0) {
    return res
      .status(400)
      .json({ error: "Missing instance data in request body" });
  }

  try {
    const { data: newInstance, error } = await createInstance(
      schemaId,
      userId,
      instanceData
    );

    if (error) {
      console.error("Error creating instance:", error);
      // Check for specific Supabase errors if needed, e.g., foreign key violation if schemaId is invalid
      return res.status(500).json({ error: "Failed to create instance" });
    }

    return res.status(201).json(newInstance);
  } catch (err) {
    console.error("Unexpected error in instance POST route:", err);
    return res.status(500).json({ error: "An unexpected error occurred" });
  }
});

export default router;
