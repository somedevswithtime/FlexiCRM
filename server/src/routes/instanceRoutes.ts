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
  const userAccessToken = req.token; // Might be undefined if no Authorization header
  const userIdFromAuth = req.user?.id; // From a valid JWT, if present

  // Determine the user ID for the operation: authenticated user or demo user.
  const userId = userIdFromAuth || DEFAULT_DEMO_USER_ID;

  if (!schemaId) {
    return res.status(400).json({ error: "Missing schemaId parameter" });
  }

  // Scenario 1: Authenticated user is present (userIdFromAuth exists).
  // In this case, a token MUST be provided.
  if (userIdFromAuth && !userAccessToken) {
    return res
      .status(401)
      .json({ error: "Unauthorized: Missing token for authenticated user." });
  }

  // Scenario 2: No authenticated user (userIdFromAuth is null).
  // Try DEFAULT_DEMO_USER_ID
  if (!userId) {
    return res.status(400).json({
      error:
        "User ID could not be determined (no authenticated user and no demo user configured).",
    });
  }

  const effectiveToken = userIdFromAuth ? userAccessToken : undefined;

  try {
    // effectiveToken can be undefined here for demo users; service layer handles it.
    const { data, error } = await getAllInstances(schemaId, effectiveToken);

    if (error) {
      console.error("Error fetching instances:", error);
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
// TODO: need to fix
router.post("/:schemaId", async (req: AuthenticatedRequest, res: Response) => {
  const { schemaId } = req.params;
  const instanceData = req.body;
  const userAccessToken = req.token; // Might be undefined
  const userIdFromAuth = req.user?.id; // From a valid JWT, if present

  // Determine the user ID for the operation: authenticated user or demo user.
  const userId = userIdFromAuth || DEFAULT_DEMO_USER_ID;

  if (!schemaId) {
    return res.status(400).json({ error: "Missing schemaId parameter" });
  }

  // Scenario 1: Authenticated user is present (userIdFromAuth exists).
  // In this case, a token MUST be provided.
  if (userIdFromAuth && !userAccessToken) {
    return res
      .status(401)
      .json({ error: "Unauthorized: Missing token for authenticated user." });
  }

  // Scenario 2: No authenticated user (userIdFromAuth is null).
  // We might be operating as a demo user if DEFAULT_DEMO_USER_ID is configured.
  // If neither userIdFromAuth nor DEFAULT_DEMO_USER_ID is available, we cannot proceed.
  if (!userId) {
    return res.status(400).json({
      error:
        "User ID could not be determined (no authenticated user and no demo user configured).",
    });
  }

  // The effectiveToken is passed to the service layer.
  // If userIdFromAuth is present, effectiveToken is userAccessToken (which we've asserted is present).
  // If userIdFromAuth is null (i.e., we're using DEFAULT_DEMO_USER_ID), effectiveToken will be undefined.
  // The service layer is responsible for handling an undefined token by using a service role client.
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
