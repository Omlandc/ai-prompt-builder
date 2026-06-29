import type { ComponentType, SVGProps } from "react";
import type { Localized } from "@/lib/loc";

export type ToolIcon = ComponentType<SVGProps<SVGSVGElement> & { size?: number | string }>;

export type ToolFieldOption = { value: string; label: Localized };

export type ToolFieldColumn = {
  label: Localized;
  placeholder?: string;
};

export type ToolField =
  | {
      name: string;
      label: Localized;
      type: "text" | "textarea";
      placeholder?: Localized;
      hint?: Localized;
      rows?: number;
      default?: string;
    }
  | {
      name: string;
      label: Localized;
      type: "number";
      placeholder?: Localized;
      hint?: Localized;
      min?: number;
      max?: number;
      default?: number;
    }
  | {
      name: string;
      label: Localized;
      type: "select" | "radio";
      options: ToolFieldOption[];
      hint?: Localized;
      default?: string;
    }
  | {
      name: string;
      label: Localized;
      type: "checkbox";
      options: ToolFieldOption[];
      hint?: Localized;
    }
  | {
      name: string;
      label: Localized;
      type: "table";
      columns: ToolFieldColumn[];
      hint?: Localized;
      default?: string;
    }
  | {
      name: string;
      label: Localized;
      type: "tag-input";
      hint?: Localized;
      default?: string;
    };

export type ToolDefinition = {
  slug: string;
  filename: string;
  icon: ToolIcon; // lucide-react component
  title: Localized;
  description: Localized;
  hint?: Localized;
  fields: ToolField[];
  template: (values: Record<string, string | string[]>) => string;
  toRenderable?: (prompt: string) => { heading: string; sections: { title: string; body: string }[] };
};

export type Locale = "zh" | "en";
