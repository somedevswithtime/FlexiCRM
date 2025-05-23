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
/**
 * Stores the actual value of a field in an entity instance.
 */
export interface FieldValue {
  fieldId: string; // FieldDefinition.id
  name?: string; // User-friendly name
  type?: FieldType;
  tableVisible?: boolean; // Need to investigate clever ways of controlling UI visuals
  value: any; // TODO: needs to be strongly typed in future iteration
  //                   ties to FieldTypes
}
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
  fieldValues: FieldValue[]; // For flexibility value is at any, faster mvp
}

// DEPRECATED
// Left to illustrate example below
// TODO: remove in future
export type Contact = BaseEntity & {
  role: "business" | "personal" | "professional"; // Discriminator
  name: string;
  email?: string;
  phone?: string;
  tags: string[];

  // Generic context field to add details, maybe make specific context per CRM?
  context?: {
    company?: string;
    relationship?: string;
    lastContact?: number; // Unix timestamp
    customFields?: Record<string, unknown>;
  };
};
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
