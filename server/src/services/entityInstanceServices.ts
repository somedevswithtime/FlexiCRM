import {
  createSupabaseServerClient,
  supabaseServiceClient,
} from "@/supabaseClient";

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
  userAccessToken: string | undefined
): Promise<{ data: EntityInstance[] | null; error: any }> {
  try {
    const supabase = userAccessToken
      ? createSupabaseServerClient(userAccessToken)
      : supabaseServiceClient;

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
  userAccessToken: string | undefined
): Promise<{ data: EntityInstance | null; error: any }> {
  try {
    const supabase = userAccessToken
      ? createSupabaseServerClient(userAccessToken)
      : supabaseServiceClient;

    const { name, ...otherInstanceData } = instanceData; // Destructure name

    const { data, error } = await supabase
      .from("entity_instances")
      .insert([
        {
          schema_id: schemaId,
          user_id: userId,
          name: name, // Use destructured name
          field_values: otherInstanceData, // Use the rest for field_values
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
