interface BaseEntity {
  id: string; // unique identifier
  createdAt: number; // Unix timestamp
  updatedAt?: number;
}

/**
 * Defines the possible data types for a field.
 */
export type FieldType =
  | "text" // For short or long strings
  | "number" // For any kind of number (integer, float)
  | "date" // For ISO date strings or timestamps
  | "boolean" // For true/false values
  | "relation" // To link to another EntityInstance
  | "user" // To link to a user ID (specifics of user management are TBD)
  | "enum" // For a predefined list of string options
  | "url"; // For URLs

/**
 * Describes a single field in an entity schema.
 */
export interface FieldDefinition {
  id: string; // Unique field id
  name: string; // User friendly name
  type: FieldType;
  isRequired?: boolean;
  description?: string; // Tooltip, helper usage
  options?: { id: string; name: string }[]; // list implementations
  relatedEntitySchemaId?: string; // (ie if this field is "Assigned To" on a Task, this might be "userSchemaId")
  // UI hints
  uiGroup?: string; // Group name for organizing fields in UI (e.g., "Basic Info", "Stats")
  isTableColumn?: boolean; // Whether this field should be displayed as a column in a table view
  defaultSortOrder?: "asc" | "desc"; // Default sort order for this field in table views
  uiControlType?:
    | "text"
    | "textarea"
    | "number"
    | "date"
    | "select"
    | "checkbox"; // Preferred UI control for editing
}

/**
 * Describes the structure of an entity type.
 * Re-uses BaseEntity for id, createdAt, updatedAt.
 */
export interface EntitySchema extends BaseEntity {
  // id: inherited (unique identifier for this schema, e.g., "taskSchema", "playerSchema")
  name: string; // User-friendly name for this entity type (e.g., "Task", "Player Character")
  description?: string;
  fields: FieldDefinition[];
  icon?: string;
  // TODO: maybe an EntitySchema should inherently have more details
}

// Base interface for all field value types
interface BaseFieldValue {
  fieldId: string; // Corresponds to FieldDefinition.id
  name?: string; // User-friendly name, might be redundant if always looked up from schema
  tableVisible?: boolean; // UI hint
}

export interface TextFieldValue extends BaseFieldValue {
  type: "text";
  value: string;
}

export interface NumberFieldValue extends BaseFieldValue {
  type: "number";
  value: number;
}

export interface DateFieldValue extends BaseFieldValue {
  type: "date";
  value: string; // using string for now
}

export interface BooleanFieldValue extends BaseFieldValue {
  type: "boolean";
  value: boolean;
}

export interface RelationFieldValue extends BaseFieldValue {
  type: "relation";
  value: string; // ID of the related EntityInstance
}

export interface UserFieldValue extends BaseFieldValue {
  type: "user";
  value: string; // User ID
}

export interface EnumFieldValue extends BaseFieldValue {
  type: "enum";
  value: string; // ID of the selected option from FieldDefinition.options
}

export interface UrlFieldValue extends BaseFieldValue {
  type: "url";
  value: string;
}

/**
 * A discriminated union of all possible field value types.
 * The 'type' property is the discriminant.
 */
export type TypedFieldValue =
  | TextFieldValue
  | NumberFieldValue
  | DateFieldValue
  | BooleanFieldValue
  | RelationFieldValue
  | UserFieldValue
  | EnumFieldValue
  | UrlFieldValue;

/**
 * Represents an actual data record.
 * Re-uses BaseEntity for id, createdAt, updatedAt.
 */
export interface EntityInstance extends BaseEntity {
  schemaId: string; //The ID of the EntitySchema it conforms to (e.g., "taskSchema")
  /** Optional: A primary display name or title for the instance (e.g., "Fix the login bug", "Gandalf").
   * Some entities might derive their name from a specific field.
   */
  name?: string; // Primary display name, title for the instance
  fieldValues: TypedFieldValue[]; // Now uses the strongly-typed discriminated union
}

/**
 * Defines the overall state structure for the CRM.
 * This will hold all entity schemas (the "blueprints" for data types)
 * and all entity instances (the actual data records).
 */
export interface CrmState {
  /**
   * A collection of all available entity schemas in the system.
   * The key is the EntitySchema.id.
   */
  schemas: Record<string, EntitySchema>;
  /**
   * A collection of all entity instances (data records).
   * The key is the EntityInstance.id.
   * Instances from different schemas are stored together,
   * identifiable by their `schemaId` property.
   */
  instances: Record<string, EntityInstance>;
  // Optional: Add other global CRM state properties here later if needed,
  // for example, user preferences, view configurations, etc.
}
