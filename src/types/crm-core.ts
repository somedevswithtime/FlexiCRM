interface BaseEntity {
  id: string; // nanoid()
  createdAt: number; // Unix timestamp
  updatedAt?: number;
}

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

export type Activity = BaseEntity & {
  category: "task" | "note" | "event" | "followup";
  title: string;
  status: "pending" | "completed" | "scheduled";
  dueDate?: number;

  // Polymorphic relationships
  linkedTo?: {
    entityType: "contact" | "project" | "application";
    id: string;
  };
};
