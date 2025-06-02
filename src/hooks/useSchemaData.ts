"use client";

import { useState, useEffect } from "react";
import type { EntityInstance, EntitySchema } from "@/src/core/types";
import { API_BASE_URL, DEMO_SCHEMA_INFO } from "@lib/constants";
// TODO: HIGHLY SPECIFIC FALLBACK - The fallback schema logic below is still hardcoded to D&D's playerSchema.
// This needs to be generalized, perhaps by attempting to load a fallback schema
// dynamically based on entityName (e.g., from @lib/mocks/[entityName]/schemas)
// or by having a more generic fallback placeholder.
import { playerSchema as fallbackSchema } from "@lib/mocks/dungeonsdragons/schemas";
import { mockedPlayers as fallbackInstances } from "@lib/mocks/dungeonsdragons/constants";

interface UseSchemaDataReturn {
  schema: EntitySchema | null;
  entities: EntityInstance[];
  loading: boolean;
  error: Error | null;
}

export function useSchemaData(entityName: string | null): UseSchemaDataReturn {
  const [schema, setSchema] = useState<EntitySchema | null>(null);
  const [entities, setEntities] = useState<EntityInstance[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  //todo: fix, hardcoded and casted
  const entitySchemaId =
    DEMO_SCHEMA_INFO[entityName as keyof typeof DEMO_SCHEMA_INFO].id;

  useEffect(() => {
    if (!entityName || !entitySchemaId) {
      setLoading(false);
      setSchema(null);
      setEntities([]);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch schema
        let fetchedSchemaToSet: EntitySchema | null = null;
        try {
          const schemaResponse = await fetch(
            `${API_BASE_URL}/schemas/${entitySchemaId}`
          );
          if (!schemaResponse.ok) {
            throw new Error(
              `HTTP error! status: ${schemaResponse.status} for schema ${entityName}`
            );
          }
          fetchedSchemaToSet = await schemaResponse.json();
        } catch (schemaError: any) {
          console.error(
            `Failed to fetch schema for ${entityName}:`,
            schemaError.message
          );
          console.warn(
            `Loading local D&D fallback schema for ${entityName}. This is NOT a general solution.`
          );
          // TODO: CRITICAL - Implement a robust and generalized fallback mechanism for schema.
          // The current fallback to 'playerSchema' is D&D specific and incorrect for other entities.
          fetchedSchemaToSet = fallbackSchema as EntitySchema;
        }
        setSchema(fetchedSchemaToSet);

        // Fetch entities
        // Only proceed if schema was fetched or fallback was set successfully.
        if (fetchedSchemaToSet) {
          try {
            const entitiesResponse = await fetch(
              `${API_BASE_URL}/instances/${entitySchemaId}`
            );
            if (!entitiesResponse.ok) {
              throw new Error(
                `HTTP error! status: ${entitiesResponse.status} for instances ${entityName}`
              );
            }
            const result = await entitiesResponse.json();
            setEntities(Array.isArray(result) ? result : result.data || []);
          } catch (entitiesError: any) {
            console.error(
              `Failed to fetch entities for ${entityName}:`,
              entitiesError.message
            );
            setEntities([...fallbackInstances]); // Set empty array on entity fetch error
            // Optionally, you could set the main error state here as well
            // setError(entitiesError);
          }
        } else {
          // If schema is null even after fallback attempt (e.g. fallbackSchema was also bad)
          setEntities([]);
        }
      } catch (e: any) {
        // Catch any other unexpected errors during the process
        console.error(
          `Generic error in useSchemaData for ${entityName}:`,
          e.message
        );
        setError(e);
        setSchema(null); // Reset schema
        setEntities([]); // Reset entities
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [entityName]); // Re-run if entityName changes

  return { schema, entities, loading, error };
}
