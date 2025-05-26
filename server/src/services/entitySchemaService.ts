import { supabase } from "../lib/supabaseClient";
import { EntitySchema } from "../lib/crm-core";

export const getAllSchemas = async (): Promise<EntitySchema[]> => {
  const { data, error } = await supabase.from("entity_schemas").select("*");

  if (error) {
    console.error("Error fetching schemas:", error);
    throw error;
  }
  return data as EntitySchema[];
};

export const getSchemaById = async (
  id: string
): Promise<EntitySchema | null> => {
  const { data, error } = await supabase
    .from("entity_schemas")
    .select("*")
    .eq("id", id)
    .single(); // .single() expects one row or null

  if (error && error.code !== "PGRST116") {
    // PGRST116: Row not found by .single()
    console.error("Error fetching schema by ID:", error);
    throw error;
  }
  return data as EntitySchema | null;
};

// Add more functions as needed: createSchema, updateSchema, deleteSchema
// Remember to handle permissions and user roles for these operations.
