import type { Locale } from "@/types/tool";

export const SITE_NAME = "复杂 AI 提示词构造";
export const SITE_NAME_EN = "Complex AI Prompt Builder";
export const SITE_TAGLINE = {
  zh: "13 款 AI 提示词工具 + 346 条图像配方，一站搞定",
  en: "13 prompt tools + 346 image recipes, all in one place",
};
export const SITE_DESCRIPTION = {
  zh: "为 AI 模型生成高质量提示词。覆盖图像、视频、文章、PPT、PRD、简历等场景，并集成图像配方库。",
  en: "Generate high-quality prompts for AI models: image, video, article, PPT, PRD, resume, and an integrated image recipe library.",
};

export const LOCALE_STORAGE_KEY = "ai_prompt_builder_locale";

export function detectLocale(): Locale {
  if (typeof window === "undefined") return "zh";
  const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
  if (stored === "zh" || stored === "en") return stored;
  const lang = (navigator.language || "").toLowerCase();
  return lang.startsWith("en") ? "en" : "zh";
}

export const NAV_ITEMS = [
  { href: "/", label: { zh: "首页", en: "Home" } },
  { href: "/tools/image", label: { zh: "画图片", en: "Image" } },
  { href: "/tools/video", label: { zh: "视频脚本", en: "Video" } },
  { href: "/tools/article", label: { zh: "写文章", en: "Article" } },
  { href: "/tools/ppt", label: { zh: "PPT", en: "PPT" } },
  { href: "/tools/skill", label: { zh: "技能", en: "Skill" } },
  { href: "/tools/research", label: { zh: "调研", en: "Research" } },
  { href: "/tools/app", label: { zh: "APP", en: "App" } },
  { href: "/tools/web", label: { zh: "网页", en: "Web" } },
  { href: "/tools/ui", label: { zh: "UI", en: "UI" } },
  { href: "/tools/prd", label: { zh: "PRD", en: "PRD" } },
  { href: "/tools/resume", label: { zh: "简历", en: "Resume" } },
  { href: "/tools/business", label: { zh: "商业书", en: "Business" } },
  { href: "/tools/bid", label: { zh: "标书", en: "Bid" } },
  { href: "/about", label: { zh: "关于", en: "About" } },
  { href: "/contact", label: { zh: "联系", en: "Contact" } },
] as const;
