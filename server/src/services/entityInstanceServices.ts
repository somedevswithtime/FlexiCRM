import { createSupabaseServerClient } from "@/supabaseClient";

interface EntityInstance {
  id: string;
  schema_id: string;
  user_id: string;
  data: any;
  created_at: string;
  updated_at: string;
}

export async function getAllInstances(
  schemaId: string,
  userAccessToken: string
): Promise<{ data: EntityInstance[] | null; error: any }> {
  try {
    const supabase = createSupabaseServerClient(userAccessToken);

    const { data, error } = await supabase
      .from("entity_instances")
      .select(
        `
        *,
        user_instance_permissions (
          permission_level
        )
      `
      )
      .eq("schema_id", schemaId)
      .order("created_at", { ascending: false });

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

export async function createInstance(
  schemaId: string,
  userId: string,
  instanceData: any,
  userAccessToken: string
): Promise<{ data: EntityInstance | null; error: any }> {
  try {
    const supabase = createSupabaseServerClient(userAccessToken);

    const { data, error } = await supabase
      .from("entity_instances")
      .insert([
        {
          schema_id: schemaId,
          user_id: userId,
          data: instanceData,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating entity instance:", error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    console.error("Unexpected error creating entity instance:", err);
    return { data: null, error: err };
  }
}
