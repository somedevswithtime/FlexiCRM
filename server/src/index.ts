import { getAllSchemas } from "./services/entitySchemaService";

async function main() {
  console.log("FlexiCRM Server Starting...");
  // Example: Fetch all schemas on start (for demonstration)
  try {
    const schemas = await getAllSchemas();
    // todo: clean this up? better sanity checks?
    console.log("Available Schemas:", JSON.stringify(schemas, null, 2));
  } catch (error) {
    console.error("Failed to fetch schemas on start:", error);
  }

  // Implement Express or something here, sanity checks
  console.log(
    "Server setup complete. Listening for requests (not really, this is a placeholder)..."
  );
}

main().catch(console.error);
