// Static-only API (no backend) — fetches built-in cases from public/data/.
import type { CaseDetail, CaseListItem, MetaData } from "@/types/case";
import {
  applyToDetail,
  applyToListItem,
  getCustomCase,
  getCustomCases,
  addCustomCase as storeAddCustomCase,
  deleteCustomCase as storeDeleteCustomCase,
  markBuiltinDeleted,
  getOverride,
  subscribe as subscribeUserStore,
} from "@/lib/userStore";

let casesPromise: Promise<CaseListItem[]> | null = null;
let metaPromise: Promise<MetaData> | null = null;
const detailCache = new Map<string, Promise<CaseDetail | null>>();

async function loadBuiltinList(): Promise<CaseListItem[]> {
  if (!casesPromise) {
    casesPromise = fetch(`${import.meta.env.BASE_URL}data/cases.json`).then(async (r) => {
      if (!r.ok) throw new Error("cases.json 加载失败");
      return (await r.json()) as CaseListItem[];
    });
  }
  return casesPromise;
}

async function loadMeta(): Promise<MetaData> {
  if (!metaPromise) {
    metaPromise = fetch(`${import.meta.env.BASE_URL}data/index.json`).then(async (r) => {
      if (!r.ok) throw new Error("index.json 加载失败");
      return (await r.json()) as MetaData;
    });
  }
  return metaPromise;
}

export type FetchCasesParams = {
  q?: string;
  tag?: string;
  tag_group?: string;
  source?: string;
  prompt_style?: string;
  language_mode?: string;
  limit?: number;
  offset?: number;
};

const MAIN_TAGS = [
  "信息图表",
  "UI界面",
  "海报排版",
  "插画艺术",
  "写实摄影",
  "建筑空间",
  "品牌标志",
  "人物角色",
  "商品电商",
  "文档出版",
  "历史古风",
  "场景叙事",
  "漫画条漫",
  "趣味配方",
];

function matches(item: CaseListItem, params: FetchCasesParams): boolean {
  if (item.source === "user-deleted") return false;
  if (params.tag && params.tag !== "全部") {
    if (params.tag_group === "fun") {
      const tagList = (item.tags || "").split("，");
      const isFun = tagList.some((t) => t === "趣味配方" || !MAIN_TAGS.includes(t));
      if (!isFun) return false;
    } else if (!(item.tags || "").split("，").includes(params.tag)) {
      return false;
    }
  }
  if (params.source && params.source !== "全部" && item.source !== params.source) return false;
  if (params.prompt_style && params.prompt_style !== "全部" && item.prompt_style !== params.prompt_style) return false;
  if (params.language_mode && params.language_mode !== "全部" && item.language_mode !== params.language_mode) return false;
  if (params.q) {
    const q = params.q.trim().toLowerCase();
    if (q) {
      const haystack = [
        item.case_no,
        item.title,
        item.category,
        item.tags || "",
        item.description || "",
        item.prompt_display_cn || "",
      ]
        .join("\n")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
  }
  return true;
}

export async function fetchCases(params: FetchCasesParams = {}): Promise<{ items: CaseListItem[]; total: number }> {
  const builtin = await loadBuiltinList();
  const filtered = builtin.filter((c) => matches(c, params));
  const overridden = filtered.map(applyToListItem);
  const customsRaw = getCustomCases();
  const customs: CaseListItem[] = Object.values(customsRaw).filter(
    (c) => !filtered.some((b) => b.id === c.id),
  );
  const merged = [...customs, ...overridden];
  const limit = params.limit || 1000;
  const offset = params.offset || 0;
  return {
    items: merged.slice(offset, offset + limit),
    total: merged.length,
  };
}

export async function fetchMeta(): Promise<MetaData> {
  const m = await loadMeta();
  return m;
}

export async function fetchCase(id: number | string): Promise<CaseDetail | null> {
  // User-defined cases first
  const custom = getCustomCase(id);
  if (custom) {
    // Reconstruct minimal detail
    const dummy: CaseDetail = {
      case: {
        id: custom.id,
        case_no: custom.case_no,
        title: custom.title,
        category: custom.category,
        source: custom.source,
        description: custom.description,
        status: custom.status,
        created_at: custom.created_at,
        updated_at: custom.updated_at,
      },
      images: custom.image_path
        ? [
            {
              id: `${custom.id}-img0`,
              case_id: custom.id,
              role: "main",
              page_index: 0,
              filename: custom.image_filename || "",
              file_path: custom.image_path,
              thumb_path: custom.thumb_path || custom.image_path,
            },
          ]
        : [],
      prompt: {
        id: `${custom.id}-pv0`,
        case_id: custom.id,
        version_name: "v1",
        prompt_raw: custom.prompt_raw || "",
        prompt_display_cn: custom.prompt_display_cn || "",
        prompt_template_cn: custom.prompt_template_cn || "",
        prompt_engine_cn: custom.prompt_engine_cn || "",
        variables_json: "[]",
        language_mode: custom.language_mode || "mixed",
        prompt_style: custom.prompt_style || "natural",
        rewrite_status: custom.rewrite_status || "user",
        created_at: custom.created_at,
      },
      versions: [],
      tags: (custom.tags || "").split("，").filter(Boolean).map((n) => ({ name: n })),
    };
    return dummy;
  }

  const cacheKey = String(id);
  if (!detailCache.has(cacheKey)) {
    detailCache.set(
      cacheKey,
      fetch(`${import.meta.env.BASE_URL}data/cases/${cacheKey}.json`).then(async (r) => {
        if (!r.ok) return null;
        const raw = (await r.json()) as CaseDetail;
        return raw;
      }),
    );
  }
  const detail = await detailCache.get(cacheKey);
  if (!detail) return null;

  // Static JSON is FLAT: { id, title, ..., image_path, prompt_raw, ... }
  // CaseDetail component expects NESTED: { case: {...}, images: [...], prompt: {...}, versions: [], tags: [...] }
  // Map flat → nested on the fly:
  const flat = detail as unknown as Record<string, any>;
  const imagePath = flat.image_path || flat.thumb_path;
  const tagList = String(flat.tags || "").split("，").filter(Boolean);
  const wrapped: CaseDetail = {
    case: {
      id: flat.id,
      case_no: flat.case_no,
      title: flat.title,
      category: flat.category,
      source: flat.source,
      description: flat.description,
      status: flat.status,
      created_at: flat.created_at,
      updated_at: flat.updated_at,
    },
    images: imagePath
      ? [
          {
            id: `${flat.id}-img0`,
            case_id: flat.id,
            role: "main",
            page_index: 0,
            filename: flat.image_filename || "",
            file_path: imagePath,
            thumb_path: flat.thumb_path || imagePath,
          },
        ]
      : [],
    prompt: {
      id: `${flat.id}-pv0`,
      case_id: flat.id,
      version_name: "v1",
      prompt_raw: flat.prompt_raw || "",
      prompt_display_cn: flat.prompt_display_cn || "",
      prompt_template_cn: flat.prompt_template_cn || "",
      prompt_engine_cn: flat.prompt_engine_cn || "",
      variables_json: flat.variables_json || "[]",
      language_mode: flat.language_mode || "mixed",
      prompt_style: flat.prompt_style || "natural",
      rewrite_status: flat.rewrite_status || "fully_optimized_sample",
      created_at: flat.created_at,
    },
    versions: [],
    tags: tagList.map((name) => ({ name })),
  };

  const override = getOverride(id);
  if (override) return applyToDetail(wrapped, override);
  return wrapped;
}

export { subscribeUserStore, storeAddCustomCase, storeDeleteCustomCase, markBuiltinDeleted };
