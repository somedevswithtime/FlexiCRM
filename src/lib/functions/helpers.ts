import { FieldValue } from "@typeDefs/core";

// TODO: check in future to get rid of function
// TODO: better naming convention?
// TODO: slow? o(nmk), n: number of fieldValues
//       m: number of substrings
//       k: average/ammoritized fieldId length
export function filterFieldValuesByFieldIdSubstrings(
  substrings: string[],
  fieldValues: FieldValue[]
): FieldValue[] {
  return fieldValues.filter(({ fieldId }) =>
    substrings.some((substring) => fieldId.includes(substring))
  );
}
