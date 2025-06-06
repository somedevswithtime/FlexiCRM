"use client";

import React from "react";
import type { EntitySchema, FieldDefinition } from "@core/types";
import { useEntityForm } from "@hooks";
import { getHtmlInputType } from "@lib/utils";

interface EntityFormProps {
  entitySchema: EntitySchema;
  onSubmitSuccess: (submittedData: any) => void;
  initialData?: Record<string, any>;
  onCancel?: () => void;
}

export function EntityForm({
  entitySchema,
  onSubmitSuccess,
  initialData,
  onCancel,
}: EntityFormProps) {
  const {
    formData,
    handleInputChange,
    handleSubmit,
    isSubmitting,
    submitError,
    resetForm,
  } = useEntityForm({ entitySchema, initialData });

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const submittedData = await handleSubmit();
      onSubmitSuccess(submittedData);
      resetForm();
    } catch (error) {
      console.error("Submission failed in component:", error);
    }
  };

  const groupedFields: Record<string, FieldDefinition[]> = {};
  entitySchema.fields.forEach((field) => {
    const groupName = field.uiGroup || "Other Details";
    if (!groupedFields[groupName]) {
      groupedFields[groupName] = [];
    }
    groupedFields[groupName].push(field);
  });
  const sortedGroupNames = Object.keys(groupedFields).sort((a, b) =>
    a.localeCompare(b)
  );

  // TODO: break this down
  return (
    <form
      onSubmit={handleFormSubmit}
      className="border border-zinc-300 dark:border-zinc-700 rounded p-4 space-y-6"
    >
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Create {entitySchema.name} Demo, all instances will be deleted
      </h2>

      {sortedGroupNames.map((groupName) => (
        <div key={groupName} className="mb-4">
          <h3 className="text-xl font-medium border-b border-zinc-300 dark:border-zinc-600 pb-1 mb-3">
            {groupName}
          </h3>
          <div className="space-y-4">
            {groupedFields[groupName].map((field) => {
              const inputType = getHtmlInputType(field);
              const fieldId = `field-${entitySchema.id}-${field.id}`;

              return (
                <div key={field.id} className="flex flex-col">
                  <label htmlFor={fieldId} className="mb-1 font-medium text-sm">
                    {field.name}
                    {field.isRequired && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </label>
                  {field.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      {field.description}
                    </p>
                  )}
                  {inputType === "textarea" ? (
                    <textarea
                      id={fieldId}
                      value={formData[field.id] || ""}
                      onChange={(e) =>
                        handleInputChange(field.id, e.target.value)
                      }
                      required={field.isRequired}
                      className="p-2 border rounded dark:bg-zinc-800 dark:border-zinc-600 focus:ring-2 focus:ring-blue-500"
                      rows={3}
                    />
                  ) : inputType === "select" ? (
                    <select
                      id={fieldId}
                      value={formData[field.id] || ""}
                      onChange={(e) =>
                        handleInputChange(field.id, e.target.value)
                      }
                      required={field.isRequired}
                      className="p-2 border rounded dark:bg-zinc-800 dark:border-zinc-600 focus:ring-2 focus:ring-blue-500 h-[42px]"
                    >
                      <option value="" disabled>
                        Select {field.name}
                      </option>
                      {field.options?.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.name}
                        </option>
                      ))}
                    </select>
                  ) : inputType === "checkbox" ? (
                    <input
                      type="checkbox"
                      id={fieldId}
                      checked={Boolean(formData[field.id])}
                      onChange={(e) =>
                        handleInputChange(field.id, e.target.checked)
                      }
                      className="h-5 w-5 rounded dark:bg-zinc-800 dark:border-zinc-600 focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <input
                      type={inputType}
                      id={fieldId}
                      value={formData[field.id] || ""}
                      onChange={(e) =>
                        handleInputChange(field.id, e.target.value)
                      }
                      required={field.isRequired}
                      className="p-2 border rounded dark:bg-zinc-800 dark:border-zinc-600 focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {submitError && (
        <p className="text-red-500 text-sm text-center">
          Error: {submitError.message}
        </p>
      )}

      <div className="flex justify-end space-x-3 pt-4">
        {onCancel && (
          <button
            type="button"
            onClick={() => {
              resetForm();
              if (onCancel) onCancel();
            }}
            className="px-4 py-2 border border-zinc-300 rounded hover:bg-zinc-100 dark:border-zinc-600 dark:hover:bg-zinc-700"
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : `Submit ${entitySchema.name}`}
        </button>
      </div>
    </form>
  );
}
