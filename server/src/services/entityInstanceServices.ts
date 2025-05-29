import { supabase } from "@/supabaseClient";

interface EntityInstance {
  id: string;
  schema_id: string;
  data: any;
  created_at: string;
  updated_at: string;
}

export async function getAllInstances(
  userId: string,
  schemaId: string
): Promise<{ data: EntityInstance[] | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from("entity_instances")
      .select(
        `
        *,
        user_instance_permissions!inner (
          user_id
        )
      `
      )
      .eq("schema_id", schemaId)
      .eq("user_instance_permissions.user_id", userId);

    if (error) {
      console.error("Error fetching entity instances:", error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    console.error("Unexpected error fetching entity instances:", err);
    return { data: null, error: err };
  }
}
