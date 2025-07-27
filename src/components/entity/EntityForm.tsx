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
      // Error is handled in the hook, but you can add extra logic here
      console.error("Submission failed in component:", error);
    }
  };

  const groupedFields: Record<string, FieldDefinition[]> = {};
  entitySchema.fields.forEach((field) => {
    const groupName = field.uiGroup || "General Information";
    if (!groupedFields[groupName]) {
      groupedFields[groupName] = [];
    }
    groupedFields[groupName].push(field);
  });
  const sortedGroupNames = Object.keys(groupedFields).sort((a, b) =>
    a.localeCompare(b)
  );

  const baseInputClasses =
    "p-2 w-full border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow";

  return (
    <form
      onSubmit={handleFormSubmit}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6 space-y-8"
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
          {initialData ? `Edit` : `Create`} {entitySchema.name}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          All instances will be deleted periodically.
        </p>
      </div>

      {sortedGroupNames.map((groupName) => (
        <div key={groupName}>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 border-b-2 border-gray-200 dark:border-gray-600 pb-2 mb-6">
            {groupName}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {groupedFields[groupName].map((field) => {
              const inputType = getHtmlInputType(field);
              const fieldId = `field-${entitySchema.id}-${field.id}`;

              return (
                <div key={field.id} className="flex flex-col space-y-1">
                  <label
                    htmlFor={fieldId}
                    className="font-medium text-sm text-gray-700 dark:text-gray-300"
                  >
                    {field.name}
                    {field.isRequired && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </label>
                  {field.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
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
                      className={`${baseInputClasses} h-24`}
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
                      className={`${baseInputClasses} h-[42px]`}
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
                    <div className="flex items-center h-full">
                      <input
                        type="checkbox"
                        id={fieldId}
                        checked={Boolean(formData[field.id])}
                        onChange={(e) =>
                          handleInputChange(field.id, e.target.checked)
                        }
                        className="h-5 w-5 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                    </div>
                  ) : (
                    <input
                      type={inputType}
                      id={fieldId}
                      value={formData[field.id] || ""}
                      onChange={(e) =>
                        handleInputChange(field.id, e.target.value)
                      }
                      required={field.isRequired}
                      className={baseInputClasses}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {submitError && (
        <p className="text-red-500 text-sm font-semibold text-center bg-red-100 p-2 rounded-md">
          Error: {submitError.message}
        </p>
      )}

      <div className="flex justify-end items-center space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        {onCancel && (
          <button
            type="button"
            onClick={() => {
              resetForm();
              if (onCancel) onCancel();
            }}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}
        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </div>
    </form>
  );
}
