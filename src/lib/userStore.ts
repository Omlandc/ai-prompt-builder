// 用户编辑层：localStorage 持久化
// 在静态部署下没有后端，把用户对内置案例的修改、用户自建案例保存在浏览器本地。
// 数据结构尽量与原始 server 路由返回的字段对齐，前端代码改动最小。

import type { CaseListItem, CaseDetail } from "@/types/case";

const STORAGE_KEY = "ipl_user_store_v1";

type UserCaseFields = {
  title?: string;
  category?: string;
  description?: string;
  tags?: string;
  image_filename?: string | null;
  image_path?: string | null;
  thumb_path?: string | null;
  prompt_raw?: string;
  prompt_display_cn?: string;
  prompt_template_cn?: string;
  prompt_engine_cn?: string;
};

type UserStore = {
  overrides: Record<string, UserCaseFields>;
  customCases: Record<string, CaseListItem>;
  deletedBuiltinIds: number[];
};

const EMPTY_STORE: UserStore = { overrides: {}, customCases: {}, deletedBuiltinIds: [] };

function load(): UserStore {
  if (typeof localStorage === "undefined") return EMPTY_STORE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_STORE;
    const parsed = JSON.parse(raw);
    return {
      overrides: parsed.overrides || {},
      customCases: parsed.customCases || {},
      deletedBuiltinIds: parsed.deletedBuiltinIds || [],
    };
  } catch {
    return EMPTY_STORE;
  }
}

function save(store: UserStore) {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function notify() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("ipl-user-store-change"));
  }
}

// ---------- 对外 API ----------

export function getOverride(caseId: number | string): UserCaseFields | null {
  const s = load();
  return s.overrides[String(caseId)] || null;
}

export function applyToListItem(item: CaseListItem): CaseListItem {
  if (item.source === "user") return item;
  const o = getOverride(item.id);
  const deleted = load().deletedBuiltinIds;
  if (deleted.includes(Number(item.id))) {
    return { ...item, source: "user-deleted" };
  }
  if (!o) return item;
  return { ...item, ...o };
}

export function applyToDetail(detail: CaseDetail, fields: UserCaseFields): CaseDetail {
  return {
    ...detail,
    case: { ...detail.case, ...stripFields(fields) },
  };
}

function stripFields(f: UserCaseFields): Partial<CaseDetail["case"]> {
  const out: Partial<CaseDetail["case"]> = {};
  if (f.title !== undefined) out.title = f.title;
  if (f.category !== undefined) out.category = f.category;
  if (f.description !== undefined) out.description = f.description;
  return out;
}

export function getCustomCases(): Record<string, CaseListItem> {
  return load().customCases;
}

export function getCustomCase(id: number | string): CaseListItem | null {
  const s = load();
  return s.customCases[String(id)] || null;
}

export function setOverride(caseId: number | string, fields: UserCaseFields) {
  const s = load();
  s.overrides[String(caseId)] = { ...s.overrides[String(caseId)], ...fields };
  save(s);
  notify();
}

export function addCustomCase(c: CaseListItem) {
  const s = load();
  s.customCases[String(c.id)] = c;
  save(s);
  notify();
}

export function deleteCustomCase(id: number | string) {
  const s = load();
  const k = String(id);
  if (s.customCases[k]) delete s.customCases[k];
  else if (typeof id === "number") s.deletedBuiltinIds.push(id);
  save(s);
  notify();
}

export function markBuiltinDeleted(id: number | string) {
  const s = load();
  if (typeof id === "number" && !s.deletedBuiltinIds.includes(id)) {
    s.deletedBuiltinIds.push(id);
    save(s);
    notify();
  }
}

export function clearAll() {
  save(EMPTY_STORE);
  notify();
}

type Listener = () => void;
const listeners = new Set<Listener>();

export function subscribe(fn: Listener) {
  listeners.add(fn);
  const handler = () => fn();
  if (typeof window !== "undefined") window.addEventListener("ipl-user-store-change", handler);
  return () => {
    listeners.delete(fn);
    if (typeof window !== "undefined") window.removeEventListener("ipl-user-store-change", handler);
  };
}

export type StoreAddCustomCaseFn = (c: CaseListItem) => void;
export const storeAddCustomCase = addCustomCase;
export const storeDeleteCustomCase = deleteCustomCase;
export const storeMarkBuiltinDeleted = markBuiltinDeleted;
