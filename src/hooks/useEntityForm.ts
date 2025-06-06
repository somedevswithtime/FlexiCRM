import { useState, useCallback } from "react";
import type {
  EntitySchema,
  FieldDefinition,
  TypedFieldValue,
} from "@core/types";
import { API_BASE_URL } from "@lib/constants";

const getInitialValue = (field: FieldDefinition): any => {
  switch (field.type) {
    case "text":
    case "url":
    case "enum":
    case "user":
    case "relation": // todo: figure out how to type better
      return "";
    case "number":
      return 0;
    case "date":
      return new Date().toISOString().split("T")[0]; // Default to today's date in YYYY-MM-DD
    case "boolean":
      return false;
    default:
      return "";
  }
};

// Helper to create initial form data structure from schema
const initializeFormData = (fields: FieldDefinition[]): Record<string, any> => {
  const initialData: Record<string, any> = {};
  fields.forEach((field) => {
    initialData[field.id] = getInitialValue(field);
  });
  return initialData;
};

export interface UseEntityFormProps {
  entitySchema: EntitySchema;
  initialData?: Record<string, any>; // Optional initial data for editing
}

export const useEntityForm = ({
  entitySchema,
  initialData,
}: UseEntityFormProps) => {
  const [formData, setFormData] = useState<Record<string, any>>(
    initialData || initializeFormData(entitySchema.fields)
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<Error | null>(null);

  const handleInputChange = useCallback((fieldId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
  }, []);

  const handleSubmit = useCallback(
    async (event?: React.FormEvent<HTMLFormElement>) => {
      if (event) {
        event.preventDefault();
      }
      setIsSubmitting(true);
      setSubmitError(null);

      // todo: makes more sense for use input then append schema name as prefix?
      const instanceName =
        typeof formData.name === "string" && formData.name.trim() !== ""
          ? formData.name
          : `${
              entitySchema.name
            } Instance created ${new Date().toLocaleDateString()}`;

      // todo: pull this out for testing purposes?
      const typedFieldValuesArray: Partial<TypedFieldValue>[] =
        entitySchema.fields.map((fieldDef) => {
          const value = formData[fieldDef.id];
          // todo: maybe bad idea?
          let coercedValue: any = value;
          if (value !== undefined && value !== null && value !== "") {
            switch (fieldDef.type) {
              case "number":
                coercedValue = Number(value);
                if (isNaN(coercedValue)) {
                  coercedValue = value;
                }
                break;
              case "boolean":
                coercedValue = Boolean(value);
                break;
            }
          }

          return {
            fieldId: fieldDef.id,
            name: fieldDef.name,
            type: fieldDef.type,
            value: coercedValue,
            uiGroup: fieldDef.uiGroup || undefined,
            tableVisible: fieldDef.isTableColumn || false,
          };
        });

      const bodyData = {
        name: instanceName,
        field_values: typedFieldValuesArray,
      };

      console.log("Submitting bodyData to API:", bodyData);

      try {
        console.log("B. DEBUG::: in tryCatch", bodyData);
        const response = await fetch(
          `${API_BASE_URL}/instances/${entitySchema.id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(bodyData),
          }
        );

        if (!response.ok) {
          const errorData = await response
            .json()
            .catch(() => ({ message: response.statusText }));
          throw new Error(
            `API Error: ${response.status} - ${
              errorData.message || "Failed to create entity"
            }`
          );
        }

        const responseData = await response.json();
        console.log("Form submitted successfully, API Response:", responseData);
        setIsSubmitting(false);
        return responseData; // Return the created entity from the API
      } catch (error) {
        console.error("Error submitting form:", error);
        setSubmitError(error as Error);
        setIsSubmitting(false);
        throw error;
      }
    },
    [formData, entitySchema]
  );

  const resetForm = useCallback(() => {
    setFormData(initializeFormData(entitySchema.fields));
    setSubmitError(null);
    setIsSubmitting(false);
  }, [entitySchema.fields]);

  return {
    formData,
    handleInputChange,
    handleSubmit,
    isSubmitting,
    submitError,
    resetForm,
  };
};
