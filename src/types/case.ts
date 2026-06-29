// Mirror types from IPL — UI-only adapted
export type CaseListItem = {
  id: number | string;
  case_no: string;
  title: string;
  category: string;
  case_type_raw?: string;
  source: string;
  description: string;
  status: string;
  image_filename?: string | null;
  image_path?: string | null;
  thumb_path?: string | null;
  image_count: number;
  prompt_raw?: string;
  prompt_display_cn?: string;
  prompt_template_cn?: string;
  prompt_engine_cn?: string;
  variables_json?: string;
  prompt_style?: string;
  language_mode?: string;
  rewrite_status?: string;
  tags?: string;
  source_text?: string;
  created_at: string;
  updated_at: string;
};

export type CaseImage = {
  id: number | string;
  case_id: number | string;
  role: string;
  page_index: number;
  filename: string;
  file_path: string;
  thumb_path: string;
  width?: number;
  height?: number;
  aspect_ratio?: string;
};

export type PromptVersion = {
  id: number | string;
  case_id: number | string;
  version_name: string;
  prompt_raw: string;
  prompt_display_cn: string;
  prompt_template_cn: string;
  prompt_engine_cn: string;
  variables_json: string;
  language_mode: string;
  prompt_style: string;
  rewrite_status: string;
  created_at: string;
};

export type CaseDetail = {
  case: {
    id: number | string;
    case_no: string;
    title: string;
    category: string;
    source: string;
    description: string;
    status: string;
    created_at: string;
    updated_at: string;
  };
  images: CaseImage[];
  prompt: PromptVersion;
  versions: Array<Pick<PromptVersion, "id" | "version_name" | "language_mode" | "prompt_style" | "rewrite_status" | "created_at">>;
  tags: { name: string }[];
};

export type MetaData = {
  tags: { name: string; count: number }[];
  funSubTags: { name: string; count: number }[];
  categories: { name: string; count: number }[];
  sources: { name: string; count: number }[];
  promptStyles: { name: string; count: number }[];
  languages: { name: string; count: number }[];
  stats: { cases: number; images: number; builtin: number; user: number; tags: number };
};
