import { Router, Response } from "express";
import { AuthenticatedRequest } from "@/middleware/authMiddleware";
import {
  getAllInstances,
  createInstance,
} from "@/services/entityInstanceServices";
import { DEFAULT_DEMO_USER_ID } from "@/lib/constants";

const router = Router();

router.get("/:schemaId", async (req: AuthenticatedRequest, res: Response) => {
  const { schemaId } = req.params;
  const userAccessToken = req.token;
  const userIdFromAuth = req.user?.id; // For determining if we *should* have a token

  if (!schemaId) {
    return res.status(400).json({ error: "Missing schemaId parameter" });
  }

  // If authenticated user, token must be present
  if (userIdFromAuth && !userAccessToken) {
    return res
      .status(401)
      .json({ error: "Unauthorized: Missing token for authenticated user" });
  }

  if (!userIdFromAuth && !DEFAULT_DEMO_USER_ID && !userAccessToken) {
    return res
      .status(400)
      .json({ error: "Cannot determine user or access token." });
  }

  // If no token, and we are relying on demo user, userAccessToken will be undefined.
  // The service function needs to handle undefined token for demo user scenarios.
  const effectiveToken = userIdFromAuth ? userAccessToken : undefined;

  try {
    const { data, error } = await getAllInstances(schemaId, effectiveToken!);

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
router.post("/:schemaId", async (req: AuthenticatedRequest, res: Response) => {
  const { schemaId } = req.params;
  const instanceData = req.body;
  const userAccessToken = req.token;
  const userIdFromAuth = req.user?.id;
  const userId = userIdFromAuth || DEFAULT_DEMO_USER_ID;

  if (!schemaId) {
    return res.status(400).json({ error: "Missing schemaId parameter" });
  }

  // If authenticated user, token must be present
  if (userIdFromAuth && !userAccessToken) {
    return res
      .status(401)
      .json({ error: "Unauthorized: Missing token for authenticated user" });
  }

  // If no userId can be determined (neither auth nor demo), it's an issue.
  if (!userId) {
    return res.status(400).json({
      error: "User ID could not be determined and no demo user configured.",
    });
  }

  // If no token, and we are relying on demo user, userAccessToken will be undefined.
  // The service function needs to handle undefined token for demo user scenarios.
  const effectiveToken = userIdFromAuth ? userAccessToken : undefined;

  if (!instanceData || Object.keys(instanceData).length === 0) {
    return res
      .status(400)
      .json({ error: "Missing instance data in request body" });
  }

  try {
    const { data: newInstance, error } = await createInstance(
      schemaId,
      userId,
      instanceData,
      effectiveToken
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
