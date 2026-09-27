import mongoose, { Document, Model, Schema } from "mongoose";

export interface IComponentProp {
  name: string;
  type: string;
  defaultValue?: string;
  description: string;
  required?: boolean;
}

export interface IComponent extends Document {
  name: string;
  slug: string;
  description: string;
  category: string;
  version: string;
  access: "free" | "premium";
  props: IComponentProp[];
  usage: string;
  sourceCode: string;
  previewData?: Record<string, unknown>;
  dependencies: string[];
  installCommand: string;
  agentPrompt: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PropSchema = new Schema<IComponentProp>(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    defaultValue: { type: String, default: "-" },
    description: { type: String, default: "" },
    required: { type: Boolean, default: false },
  },
  { _id: false }
);

const ComponentSchema = new Schema<IComponent>(
  {
    name: {
      type: String,
      required: [true, "Component name is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["Inputs", "Feedback", "Layout", "Data", "Navigation", "General"],
      default: "General",
    },
    version: {
      type: String,
      required: [true, "Version is required"],
      default: "1.0.0",
      trim: true,
    },
    access: {
      type: String,
      enum: ["free", "premium"],
      default: "free",
      required: true,
    },
    props: {
      type: [PropSchema],
      default: [],
    },
    usage: {
      type: String,
      required: [true, "Usage example is required"],
    },
    sourceCode: {
      type: String,
      required: [true, "Source code is required"],
    },
    previewData: {
      type: Schema.Types.Mixed,
      default: {},
    },
    dependencies: {
      type: [String],
      default: [],
    },
    installCommand: {
      type: String,
      required: [true, "Install command is required"],
    },
    agentPrompt: {
      type: String,
      required: [true, "AI Agent Prompt is required"],
    },
    published: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent mongoose re-compilation in development
export const Component: Model<IComponent> =
  mongoose.models.Component ||
  mongoose.model<IComponent>("Component", ComponentSchema);

export default Component;
