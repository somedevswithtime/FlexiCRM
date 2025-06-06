"use client";

import { use, useState, useEffect } from "react";
import { EntityTable, EntityDetail, EntityForm } from "@components/entity"; // Added EntityForm
import { useSchemaData } from "@hooks/useSchemaData";

// Interface for page props to expect params from dynamic route
interface EntityManagerPageProps {
  params: Promise<{
    entityName: string;
  }>;
}

export default function EntityManagerPage({ params }: EntityManagerPageProps) {
  const { entityName } = use(params);

  const {
    schema: fetchedSchema,
    entities,
    loading,
    error,
    refetch,
  } = useSchemaData(entityName);

  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false); // Added state for form visibility
  const selectedEntity =
    entities.find((e) => e.id === selectedEntityId) || null;

  useEffect(() => {
    if (fetchedSchema?.name) {
      document.title = fetchedSchema.name + " Manager";
    } else if (entityName) {
      const titleEntityName =
        entityName.charAt(0).toUpperCase() + entityName.slice(1);
      document.title = titleEntityName + " Manager";
    }
    return () => {
      document.title = "Dynamic Entity Manager";
    };
  }, [fetchedSchema, entityName]);

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
        {/* Retry? */}
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

  const handleCreateNew = () => {
    setSelectedEntityId(null); // Clear selected entity
    setShowCreateForm(true);
  };

  const handleFormSubmitSuccess = async (data: any) => {
    console.log("Form submitted successfully (in page):", data);
    await refetch();
    setShowCreateForm(false);
  };

  const handleFormCancel = () => {
    setShowCreateForm(false);
  };

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">
          {fetchedSchema?.name
            ? `${fetchedSchema.name} Manager`
            : `${
                entityName.charAt(0).toUpperCase() + entityName.slice(1)
              } Manager`}
        </h1>
        {fetchedSchema &&
          !showCreateForm && ( // Show button only if schema is loaded and form is not visible
            <button
              onClick={handleCreateNew}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Create New {fetchedSchema.name}
            </button>
          )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ensure fetchedSchema is not null before passing to components */}
        {fetchedSchema && (
          <EntityTable
            entities={entities}
            onSelectEntity={setSelectedEntityId}
            schema={fetchedSchema}
          />
        )}
        <div>
          {showCreateForm && fetchedSchema ? (
            <EntityForm
              entitySchema={fetchedSchema}
              onSubmitSuccess={handleFormSubmitSuccess}
              onCancel={handleFormCancel}
            />
          ) : selectedEntity && fetchedSchema ? (
            <EntityDetail entity={selectedEntity} schema={fetchedSchema} />
          ) : null}
        </div>
      </div>
    </main>
  );
}
