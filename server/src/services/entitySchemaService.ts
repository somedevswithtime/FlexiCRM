import {
  createSupabaseServerClient,
  supabaseServiceClient,
} from "@/supabaseClient";

export const getSchemaById = async (
  schemaId: string,
  userAccessToken: string | undefined
) => {
  try {
    const supabase = userAccessToken
      ? createSupabaseServerClient(userAccessToken)
      : supabaseServiceClient;

    const { data, error } = await supabase
      .from("entity_schemas")
      .select("*")
      .eq("id", schemaId)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching schema by ID:", error);
      throw new Error(`Supabase error: ${error.message}`);
    }

    return { data, error };
  } catch (err) {
    console.error("Unexpected error fetching schema by ID:", err);
    return { data: null, error: err };
  }
};

export const getAllAccessibleSchemas = async (
  userAccessToken: string | undefined
) => {
  try {
    const supabase = userAccessToken
      ? createSupabaseServerClient(userAccessToken)
      : supabaseServiceClient;

    const { data, error } = await supabase.from("entity_schemas").select("*");

    if (error) {
      console.error("Error fetching all accessible schemas:", error);
    }

    return { data, error };
  } catch (err) {
    console.error("Unexpected error fetching all accessible schemas:", err);
    return { data: null, error: err };
  }
};
