import { Router, Request, Response } from "express";
import { getAllInstances } from "@/services/entityInstanceServices";

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

export default router;
