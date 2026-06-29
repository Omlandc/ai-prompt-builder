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
  if (/info|chart|graph|diagram|visual/.test(c)) return "信息图表";
  if (/ui|interface|dashboard|screen|app/i.test(c)) return "UI界面";
  if (/poster|poster|layout|campaign|cover|广告|宣传/.test(c)) return "海报排版";
  if (/illustration|art|painting/i.test(c)) return "插画艺术";
  if (/photo|realism|portrait|人物|写真|摄影/.test(c)) return "写实摄影";
  if (/architecture|building|space|interior|建筑/.test(c)) return "建筑空间";
  if (/brand|logo|标志|identity|vi/.test(c)) return "品牌标志";
  if (/character|person|人物|角色|profile/.test(c)) return "人物角色";
  if (/commerce|product|包装|详情|商品/.test(c)) return "商品电商";
  if (/document|publish|magazine|book|出版/.test(c)) return "文档出版";
  if (/historical|ancient|古风|历史|chinese/.test(c)) return "历史古风";
  if (/scene|narrative|cinema|story|场景|电影/.test(c)) return "场景叙事";
  if (/comic|manga|webtoon|条漫|漫画/.test(c)) return "漫画条漫";
  return "趣味配方";
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
    const mainTag = mapCategoryToTag(oc.category);
    const tags = Array.from(new Set([mainTag, ...(oc.styles || []).slice(0, 2)]));

    const imagePath = oc.image || `/images/case${id}.jpg`;
    // 规范化 image_filename：去掉前导 / 和 /images/ 前缀
    const imageFilename = imagePath.replace(/^.*\//, "");

    return {
      id,
      case_no: `case${id}`,
      title: oc.title || `案例 ${id}`,
      category: oc.category || "未分类",
      source: oc.sourceLabel ? `source:${oc.sourceLabel}` : "builtin",
      description: oc.promptPreview || (oc.prompt ? oc.prompt.slice(0, 200) : ""),
      status: "ready",
      image_filename: imageFilename,
      // 我们的 public/data/images 部署路径 = 原仓库的 /images/ 路径加上 /data/ 前缀
      image_path: `/data/images/${imageFilename}`,
      thumb_path: `/data/images/${imageFilename}`,
      image_count: 1,
      // 来自原始
      prompt_raw: oc.prompt || "",
      prompt_preview: oc.promptPreview || "",
      // 来自 v2（如有），否则从 prompt 派生
      prompt_display_cn: v2?.prompt_display_cn || oc.promptPreview || "",
      prompt_template_cn: v2?.prompt_template_cn || "",
      prompt_engine_cn: v2?.prompt_engine_cn || "",
      variables_json: v2?.variables_json || "[]",
      language_mode: v2?.language_mode || "mixed",
      prompt_style: v2?.prompt_style || detectPromptStyle(oc.prompt || ""),
      rewrite_status: v2?.rewrite_status || "original",
      source_text: oc.sourceLabel || "",
      source_url: oc.sourceUrl || "",
      github_url: oc.githubUrl || "",
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
  const sourceCount = new Map();
  const styleCount = new Map();
  for (const c of mergedCases) {
    for (const t of c.tags_array || []) {
      tagCount.set(t, (tagCount.get(t) || 0) + 1);
    }
    if (c.source) sourceCount.set(c.source, (sourceCount.get(c.source) || 0) + 1);
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
    sources: [...sourceCount.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count),
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