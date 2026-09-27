export interface ValidationError {
  field: string;
  message: string;
}

export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validateSlug(slug: string): boolean {
  const re = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return re.test(slug);
}

export function validateComponentInput(data: Record<string, unknown>): {
  isValid: boolean;
  errors: ValidationError[];
} {
  const errors: ValidationError[] = [];

  if (!data.name || typeof data.name !== "string" || data.name.trim().length < 2) {
    errors.push({ field: "name", message: "Name must be at least 2 characters long." });
  }

  if (!data.slug || typeof data.slug !== "string" || !validateSlug(data.slug.trim())) {
    errors.push({
      field: "slug",
      message: "Slug must be lowercase alphanumeric characters separated by hyphens (e.g., 'data-table').",
    });
  }

  if (!data.description || typeof data.description !== "string" || data.description.trim().length < 5) {
    errors.push({ field: "description", message: "Description must be at least 5 characters long." });
  }

  const validCategories = ["Inputs", "Feedback", "Layout", "Data", "Navigation", "General"];
  if (!data.category || typeof data.category !== "string" || !validCategories.includes(data.category)) {
    errors.push({
      field: "category",
      message: `Category must be one of: ${validCategories.join(", ")}.`,
    });
  }

  if (!data.version || typeof data.version !== "string") {
    errors.push({ field: "version", message: "Version is required." });
  }

  if (!data.access || (data.access !== "free" && data.access !== "premium")) {
    errors.push({ field: "access", message: "Access must be either 'free' or 'premium'." });
  }

  if (!data.usage || typeof data.usage !== "string" || data.usage.trim().length < 5) {
    errors.push({ field: "usage", message: "Usage example code is required." });
  }

  if (!data.sourceCode || typeof data.sourceCode !== "string" || data.sourceCode.trim().length < 5) {
    errors.push({ field: "sourceCode", message: "Source code is required." });
  }

  if (!data.installCommand || typeof data.installCommand !== "string") {
    errors.push({ field: "installCommand", message: "Install command is required." });
  }

  if (!data.agentPrompt || typeof data.agentPrompt !== "string" || data.agentPrompt.trim().length < 10) {
    errors.push({ field: "agentPrompt", message: "AI Agent Prompt must be at least 10 characters long." });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
