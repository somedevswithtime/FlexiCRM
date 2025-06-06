"use client";

import { useState, useEffect, useCallback } from "react";
import type { EntityInstance, EntitySchema } from "@core/types";
import { API_BASE_URL, DEMO_SCHEMA_INFO } from "@lib/constants";

interface UseSchemaDataReturn {
  schema: EntitySchema | null;
  entities: EntityInstance[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useSchemaData(entityName: string | null): UseSchemaDataReturn {
  const [schema, setSchema] = useState<EntitySchema | null>(null);
  const [entities, setEntities] = useState<EntityInstance[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchDataCallback = useCallback(async () => {
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

      // Wonder if refetching schema is necessary at this point in refetch
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
  }, [entityName]); // fetchDataCallback depends on entityName

  useEffect(() => {
    if (entityName) {
      // Only run if entityName is present
      fetchDataCallback(); // Call on mount and when entityName changes (via fetchDataCallback dependency)
    } else {
      // Handle the case where entityName is null initially or becomes null
      setSchema(null);
      setEntities([]);
      setLoading(false);
    }
  }, [entityName, fetchDataCallback]); // useEffect depends on entityName and fetchDataCallback

  const refetch = fetchDataCallback; // Alias for external use

  return { schema, entities, loading, error, refetch };
}
