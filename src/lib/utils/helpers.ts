import { TypedFieldValue, FieldDefinition } from "@/src/core/types";

// TODO: check in future to get rid of function
// TODO: better naming convention?
// TODO: slow? o(nmk), n: number of fieldValues
//       m: number of substrings
//       k: average/ammoritized fieldId length
export function filterFieldValuesByFieldIdSubstrings(
  substrings: string[],
  fieldValues: TypedFieldValue[]
): TypedFieldValue[] {
  return fieldValues.filter(({ fieldId }) =>
    substrings.some((substring) => fieldId.includes(substring))
  );
}

// Helper to get display value, especially for enums (similar to PlayerDetail)
export function getDisplayValue(
  fieldValue: TypedFieldValue | undefined,
  definition: FieldDefinition
): string | number | boolean {
  if (!fieldValue) return "N/A";

  if (definition.type === "enum") {
    if (!definition.options) return String(fieldValue.value) || "N/A";
    const option = definition.options.find(
      (opt) => opt.id === fieldValue.value
    );
    return option ? option.name : String(fieldValue.value); // Fallback to value if option not found
  }
  // TODO: Handle other types like 'date', 'relation' if specific formatting is needed
  return fieldValue.value !== undefined && fieldValue.value !== null
    ? String(fieldValue.value)
    : "N/A";
}

// Helper to determine input type from FieldDefinition
export const getHtmlInputType = (field: FieldDefinition): string => {
  if (field.uiControlType) {
    // Prefer uiControlType if specified
    switch (field.uiControlType) {
      case "textarea":
        return "textarea";
      case "select":
        return "select";
      case "checkbox":
        return "checkbox";
      case "number":
        return "number";
      case "date":
        return "date";
      case "text":
      default:
        return "text";
    }
  }
  switch (field.type) {
    case "text":
    case "url":
    case "enum": // Render as select by default if options available
      return field.options && field.options.length > 0 ? "select" : "text";
    case "number":
      return "number";
    case "date":
      return "date";
    case "boolean":
      return "checkbox";
    case "relation": // shouldn't fall to this level
    case "user":
      return "text"; // maybe something else?
    default:
      return "text";
  }
};
