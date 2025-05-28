import { supabase } from "@/supabaseClient";

export const getSchemaById = async (schemaId: string) => {
  const { data, error } = await supabase
    .from("entity_schemas")
    .select("*")
    .eq("id", schemaId)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116: Row not found, which is a valid case
    console.error("Error fetching schema by ID:", error);
    throw new Error(`Supabase error: ${error.message}`);
  }

  return { data, error }; // error will be null if found, or PostgrestError if not found (PGRST116)
};

export const getAllAccessibleSchemas = async () => {
  const { data, error } = await supabase.from("entity_schemas").select("*");

  if (error) {
    console.error("Error fetching all accessible schemas:", error);
    throw new Error(`Supabase error: ${error.message}`);
  }

  return { data, error: null }; // error will be null on success
};
