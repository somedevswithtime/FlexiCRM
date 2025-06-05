"use client";

import { useState, useEffect } from "react";
import type { EntityInstance, EntitySchema } from "@/src/core/types";
import { API_BASE_URL, DEMO_SCHEMA_INFO } from "@lib/constants";

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

  useEffect(() => {
    if (!entityName || !(entityName in DEMO_SCHEMA_INFO)) {
      setError(new Error(`Invalid or missing entityName: ${entityName}`));
      setSchema(null);
      setEntities([]);
      setLoading(false);
      return;
    }

    const entityInfo =
      DEMO_SCHEMA_INFO[entityName as keyof typeof DEMO_SCHEMA_INFO];
    const entitySchemaId = entityInfo?.id;

    if (!entitySchemaId) {
      setError(
        new Error(
          `Missing schema ID for entity: ${entityName}. Ensure it's defined in DEMO_SCHEMA_INFO.`
        )
      );
      setSchema(null);
      setEntities([]);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setSchema(null);
      setEntities([]);

      try {
        // Fetch schema
        const schemaResponse = await fetch(
          `${API_BASE_URL}/schemas/${entitySchemaId}`
        );
        if (!schemaResponse.ok) {
          throw new Error(
            `Schema fetch failed: ${schemaResponse.status} for ${entityName}`
          );
        }
        const fetchedSchema = await schemaResponse.json();
        setSchema(fetchedSchema);

        // Fetch entities (only if schema was fetched successfully)
        if (fetchedSchema) {
          const entitiesResponse = await fetch(
            `${API_BASE_URL}/instances/${entitySchemaId}`
          );
          if (!entitiesResponse.ok) {
            throw new Error(
              `Instances fetch failed: ${entitiesResponse.status} for ${entityName}`
            );
          }
          const result = await entitiesResponse.json();
          setEntities(result);
        } else {
          setEntities([]);
        }
      } catch (e: any) {
        console.error(`Error fetching data for ${entityName}:`, e.message);
        setError(e);
        setSchema(null);
        setEntities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [entityName]);

  return { schema, entities, loading, error };
}
