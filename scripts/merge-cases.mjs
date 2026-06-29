#!/usr/bin/env node
// scripts/merge-cases.mjs
// 合并 awesome-gpt-image-2 原仓库 (505 条权威) + v2 中文版 (346 条带填空模板)
// 输出 public/data/cases.json + public/data/cases/<id>.json

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const ORIG_URL = "https://raw.githubusercontent.com/freestylefly/awesome-gpt-image-2/main/data/cases.json";
const V2_PATH = "/workspace/image-prompt-library/data/builtin/awesome_gpt_image_cases_v2_prompt_optimized_cn.json";
const OUT_DIR = path.join(ROOT, "public/data");
const CASES_OUT = path.join(OUT_DIR, "cases.json");
const INDEX_OUT = path.join(OUT_DIR, "index.json");
const CASES_DIR = path.join(OUT_DIR, "cases");

// 主分类（用于把英文 category 映射到中文主分类）
const MAIN_TAGS = [
  "信息图表", "UI界面", "海报排版", "插画艺术", "写实摄影", "建筑空间",
  "品牌标志", "人物角色", "商品电商", "文档出版", "历史古风", "场景叙事",
  "漫画条漫", "趣味配方",
];

// 英文 category → 中文主分类
function mapCategoryToTag(englishCategory) {
  if (!englishCategory) return "趣味配方";
  const c = String(englishCategory).toLowerCase();
  // 用 \b 起头 + (s|es|ics)? 可选复数 + \b 收尾，避免 typography 误匹到 graph、history 误匹到 story
  // 同时也匹配 charts/infographics 等复数
  if (/\b(info|infograph|chart|graph|diagram|visual)(s|es|ics)?\b/.test(c)) return "信息图表";
  if (/\b(ui|interface|dashboard|screen|app)(s|es)?\b/i.test(c)) return "UI界面";
  if (/\b(poster|pos|layout|campaign|cover|typography|typeface|广告|宣传)(s|es)?\b/i.test(c)) return "海报排版";
  if (/\b(illustration|art|painting|drawing|sketch)(s|es)?\b/i.test(c)) return "插画艺术";
  if (/\b(photo|photograph|realism|portrait|人物|写真|摄影|portraiture)(s|es)?\b/i.test(c)) return "写实摄影";
  if (/\b(architecture|building|space|interior|建筑|场所|spatial)(s|es)?\b/i.test(c)) return "建筑空间";
  if (/\b(brand|logo|标志|identity|vi|mark|trademark)(s|es)?\b/i.test(c)) return "品牌标志";
  if (/\b(character|person|profile|人物|角色|人物群|avatar)(s|es)?\b/i.test(c)) return "人物角色";
  if (/\b(commerce|product|包装|详情|商品|电商|shopping|shop)(s|es)?\b/i.test(c)) return "商品电商";
  if (/\b(document|publish|magazine|book|出版|书籍|杂志|文献|publication)(s|es)?\b/i.test(c)) return "文档出版";
  if (/\b(historic|ancient|古风|历史|classical|chinese|tradition|heritage|古)(s|es)?\b/i.test(c)) return "历史古风";
  if (/\b(scene|narrative|cinema|story|场景|电影|叙事|剧情|画面|氛围|filmic)(s|es)?\b/i.test(c)) return "场景叙事";
  if (/\b(comic|manga|webtoon|条漫|漫画|panel|sequential)(s|es)?\b/i.test(c)) return "漫画条漫";
  return "趣味配方";
}

// 补充检查：根据 styles/scenes 覆盖主分类（用于“漫画条漫”这类无对应 English category 的场景）
function refineByStyle(mainTag, oc) {
  const styles = (oc.styles || []).map((s) => String(s).toLowerCase());
  const scenes = (oc.scenes || []).map((s) => String(s).toLowerCase());
  const all = [...styles, ...scenes].join(" ");
  if (/\b(comic|manga|webtoon|panel|sequential|条漫|漫画)\b/i.test(all)) {
    return "漫画条漫";
  }
  return mainTag;
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.mkdirSync(CASES_DIR, { recursive: true });

  console.log("Fetching original cases.json from freestylefly/awesome-gpt-image-2 ...");
  const origResp = await fetch(ORIG_URL);
  if (!origResp.ok) throw new Error(`Failed: ${origResp.status}`);
  const orig = await origResp.json();
  const origCases = orig.cases || [];
  console.log(`  → ${origCases.length} cases`);

  console.log(`Loading v2 enriched data from ${V2_PATH} ...`);
  const v2Data = JSON.parse(fs.readFileSync(V2_PATH, "utf-8"));
  const v2Cases = v2Data.cases || [];
  console.log(`  → ${v2Cases.length} cases`);

  // Build v2 lookup by id
  const v2ById = new Map();
  for (const c of v2Cases) {
    if (c.id != null) v2ById.set(Number(c.id), c);
  }

  // Build cases
  const mergedCases = origCases.map((oc) => {
    const id = Number(oc.id);
    const v2 = v2ById.get(id);
    let mainTag = mapCategoryToTag(oc.category);
    mainTag = refineByStyle(mainTag, oc);
    const tags = Array.from(new Set([mainTag, ...(oc.styles || []).slice(0, 2)]));

    const imagePath = oc.image || `/images/case${id}.jpg`;
    // 规范化 image_filename：去掉前导 / 和 /images/ 前缀
    const imageFilename = imagePath.replace(/^.*\//, "");

    return {
      id,
      case_no: `case${id}`,
      title: oc.title || `案例 ${id}`,
      category: oc.category || "未分类",
      source: "builtin",
      description: oc.promptPreview || (oc.prompt ? oc.prompt.slice(0, 200) : ""),
      status: "ready",
      image_filename: imageFilename,
      // 我们的 public/data/images 部署路径 = 原仓库的 /images/ 路径加上 /data/ 前缀
      image_path: `/data/images/${imageFilename}`,
      thumb_path: `/data/images/${imageFilename}`,
      image_count: 1,
      // 来自原始
      prompt_raw: synthesizePromptRaw(oc, v2),
      prompt_preview: oc.promptPreview || "",
      // 来自 v2（如有），否则从 prompt 派生
      prompt_display_cn: v2?.prompt_display_cn || oc.promptPreview || "",
      prompt_template_cn: v2?.prompt_template_cn || "",
      // engine 与 template 一致时记为 null，前端不重复渲染
      prompt_engine_cn: v2?.prompt_engine_cn && v2.prompt_engine_cn !== v2.prompt_template_cn ? v2.prompt_engine_cn : null,
      // 从模板中拍占位符生成 variables_json
      // 优先 v2 的 variables 数组，其次 parse variables_json，最后从模板拍
      variables_json: JSON.stringify(
        v2?.variables
          || (v2?.variables_json ? safeParseJSON(v2.variables_json) : null)
          || extractVariablesFromTemplate(v2?.prompt_template_cn)
      ),
      language_mode: v2?.language_mode || "mixed",
      prompt_style: v2?.prompt_style || detectPromptStyle(oc.prompt || ""),
      rewrite_status: v2?.rewrite_status || "original",
      styles: oc.styles || [],
      scenes: oc.scenes || [],
      featured: !!oc.featured,
      tags: tags.join("，"),
      tags_array: tags,
      created_at: "2026-04-27T06:59:21",
      updated_at: "2026-04-27T06:59:21",
    };
  });

  // 排序：按 id 升序
  mergedCases.sort((a, b) => a.id - b.id);

  // 输出 list (lightweight)
  const LIST_FIELDS = [
    "id", "case_no", "title", "category", "source", "status",
    "image_filename", "image_path", "thumb_path", "image_count",
    "prompt_style", "language_mode", "rewrite_status",
    "created_at", "updated_at", "tags", "tags_array", "featured",
  ];
  const listCases = mergedCases.map((c) => {
    const out = {};
    for (const k of LIST_FIELDS) out[k] = c[k];
    return out;
  });
  fs.writeFileSync(CASES_OUT, JSON.stringify(listCases));
  console.log(`Wrote ${CASES_OUT} (${(fs.statSync(CASES_OUT).size / 1024).toFixed(0)} KB, ${listCases.length} cases)`);

  // 输出 detail
  for (const c of mergedCases) {
    fs.writeFileSync(path.join(CASES_DIR, `${c.id}.json`), JSON.stringify(c));
  }
  console.log(`Wrote ${mergedCases.length} detail files`);

  // 重新聚合 meta (按主分类统计)
  const tagCount = new Map();
  const styleCount = new Map();
  for (const c of mergedCases) {
    for (const t of c.tags_array || []) {
      tagCount.set(t, (tagCount.get(t) || 0) + 1);
    }
    if (c.prompt_style) styleCount.set(c.prompt_style, (styleCount.get(c.prompt_style) || 0) + 1);
  }

  const meta = {
    tags: MAIN_TAGS
      .map((name) => ({ name, count: tagCount.get(name) || 0 }))
      .filter((x) => x.count > 0),
    funSubTags: [],
    categories: [...tagCount.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count),
    // 不暴露 data source 过滤项
    sources: [],
    promptStyles: [...styleCount.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count),
    languages: [{ name: "mixed", count: mergedCases.length }],
    stats: {
      cases: mergedCases.length,
      images: mergedCases.filter((c) => c.image_filename).length,
      builtin: mergedCases.length,
      user: 0,
      tags: tagCount.size,
    },
  };

  fs.writeFileSync(INDEX_OUT, JSON.stringify(meta));
  console.log(`Wrote ${INDEX_OUT}`);

  // 统计 v2 匹配数
  const matched = mergedCases.filter((c) => c.prompt_template_cn).length;
  console.log(`\nv2 enriched match: ${matched} / ${mergedCases.length} cases have a fill-in template`);
}

function safeParseJSON(s) {
  if (!s) return null;
  if (Array.isArray(s)) return s;
  try {
    const p = JSON.parse(s);
    return Array.isArray(p) ? p : null;
  } catch {
    return null;
  }
}

// 检测 prompt_raw 是不是废的（含未被处理的 {argument ...} 模板语法）
function isBrokenRawPrompt(raw) {
  if (!raw) return false;
  return /\{argument\s+(name|type)\s*=/.test(raw);
}

// 渲染 {argument name="X" default="Y"} → Y（如果没有 default 则保留为 X）
function renderTemplateDefaults(raw) {
  if (!raw) return raw;
  return raw
    .replace(/\{argument\s+name\s*=\s*"([^"]+)"\s+default\s*=\s*"([^"]*)"\s*\}/g, (_, _name, def) => def)
    .replace(/\{argument\s+name\s*=\s*"([^"]+)"\s*\}/g, "$1")
    .replace(/\{argument\s+name\s*=\s*'([^']+)'\s+default\s*=\s*'([^']*)'\s*\}/g, (_, _name, def) => def)
    .replace(/\{argument\s+name\s*=\s*'([^']+)'\s*\}/g, "$1");
}

// 从 prompt_template_cn 里拍【】占位符，生成 variables_json
function extractVariablesFromTemplate(template) {
  if (!template) return [];
  // 匹配 【任意内容】
  const matches = template.match(/【([^】\n]+?)】/g) || [];
  const seen = new Map();
  for (const m of matches) {
    const key = m.slice(1, -1).trim();
    if (!key || key.length > 40) continue;
    // 跳过明显不是占位符的（包含逗号、分号、双引号、括号）
    if (/[，;:"(){}\[\]<>]/.test(key)) continue;
    if (!seen.has(key)) {
      seen.set(key, {
        key,
        label: key,
        default_value: "",
        type: "text",
        required: true,
      });
    }
  }
  return Array.from(seen.values());
}

// 合成一个可用的 prompt_raw：
// 1. 优先用 v2 的（如果是好的）
// 2. 否则用原仓库的（渲染默认参数后）
// 3. 都不行就用 display_cn + template 拼
function synthesizePromptRaw(oc, v2) {
  if (v2?.prompt_raw && !isBrokenRawPrompt(v2.prompt_raw)) {
    return v2.prompt_raw;
  }
  if (oc?.prompt && !isBrokenRawPrompt(oc.prompt)) {
    return oc.prompt;
  }
  // 渲染默认参数
  if (v2?.prompt_raw) {
    const rendered = renderTemplateDefaults(v2.prompt_raw);
    if (rendered && !isBrokenRawPrompt(rendered)) return rendered;
  }
  if (oc?.prompt) {
    const rendered = renderTemplateDefaults(oc.prompt);
    if (rendered && !isBrokenRawPrompt(rendered)) return rendered;
  }
  // 拼接：描述 + 填入模板
  const desc = v2?.prompt_display_cn || oc?.promptPreview || "";
  const tpl = v2?.prompt_template_cn || "";
  if (desc && tpl) return `${desc}\n\n${tpl}`;
  if (desc) return desc;
  if (tpl) return tpl;
  return "";
}

function detectPromptStyle(prompt) {
  if (!prompt) return "unknown";
  if (prompt.startsWith("{") || prompt.startsWith("[")) return "json_protocol";
  if (/^Generate\s|^Create\s/i.test(prompt)) return "natural_en";
  if (/^生成|^创建/.test(prompt)) return "natural_zh";
  if (prompt.length < 100) return "short_command";
  return "natural";
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});