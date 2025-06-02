"use client";

import { use, useState, useEffect } from "react";
import { EntityTable } from "@components/entity/EntityTable";
import { EntityDetail } from "@components/entity/EntityDetail";
import { useSchemaData } from "@hooks/useSchemaData";

// Interface for page props to expect params from dynamic route
interface EntityManagerPageProps {
  params: Promise<{
    entityName: string;
  }>;
}

export default function EntityManagerPage({ params }: EntityManagerPageProps) {
  const { entityName } = use(params);

  // Use the custom hook to fetch schema and entities
  const {
    schema: fetchedSchema,
    entities,
    loading,
    error,
  } = useSchemaData(entityName);

  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
  const selectedEntity =
    entities.find((e) => e.id === selectedEntityId) || null;

  // Effect to set document title
  useEffect(() => {
    if (fetchedSchema?.name) {
      document.title = fetchedSchema.name + " Manager";
    } else if (entityName) {
      // Capitalize first letter of entityName for title
      const titleEntityName =
        entityName.charAt(0).toUpperCase() + entityName.slice(1);
      document.title = titleEntityName + " Manager";
    }
    // Cleanup function to reset title
    return () => {
      document.title = "Dynamic Entity Manager";
    };
  }, [fetchedSchema, entityName]);

  // Handle loading and error states from the hook
  if (loading) {
    return (
      <main className="min-h-screen bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 p-6 flex justify-center items-center">
        <p className="text-xl">Loading data for {entityName}...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 p-6 flex flex-col justify-center items-center">
        <p className="text-xl text-red-500">
          Error loading data for {entityName}:
        </p>
        <p className="text-md text-red-400">{error.message}</p>
        {/* You might want to add a retry button or more specific error handling here */}
      </main>
    );
  }

  if (!fetchedSchema) {
    return (
      <main className="min-h-screen bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 p-6 flex justify-center items-center">
        <p className="text-xl text-orange-500">
          Schema not found for: {entityName}. Cannot display data.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 p-6">
      <h1 className="text-2xl font-bold mb-4">
        {/* Ensure fetchedSchema is not null before accessing its name */}
        {fetchedSchema?.name
          ? `${fetchedSchema.name} Manager`
          : `${
              entityName.charAt(0).toUpperCase() + entityName.slice(1)
            } Manager`}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ensure fetchedSchema is not null before passing to components */}
        {fetchedSchema && (
          <EntityTable
            entities={entities}
            onSelectEntity={setSelectedEntityId}
            schema={fetchedSchema}
          />
        )}
        {selectedEntity && fetchedSchema && (
          <EntityDetail entity={selectedEntity} schema={fetchedSchema} />
        )}
      </div>
    </main>
  );
}
