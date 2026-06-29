import type { ToolDefinition } from "@/types/tool";

// 13 tools migrated from the original ai-prompt-builder static site.
// 每个工具的字段定义 + 模板与原 HTML 中的 window.toolConfig 等价。

const pickList = (v: Record<string, string | string[]> | undefined, key: string): string => {
  const arr = v?.[key];
  if (Array.isArray(arr)) return arr.join("、");
  return String(arr || "暂无");
};

const txtOrFill = (v: Record<string, string | string[]> | undefined, key: string, filler: string) => {
  const x = v?.[key];
  if (Array.isArray(x)) return x.filter(Boolean).join("\n");
  const s = String(x || "").trim();
  if (!s) return filler;
  return s;
};

const tableLines = (v: Record<string, string | string[]> | undefined, key: string) => {
  const raw = String(v?.[key] || "").trim();
  if (!raw) return "暂无";
  return raw
    .split("\n")
    .filter((l) => l.trim())
    .map((l) => `- ${l}`)
    .join("\n");
};

export const tools: ToolDefinition[] = [
  // ─── 1) image ─────────────────────────────────────────
  {
    slug: "image",
    icon: "🎨",
    filename: "AI绘画提示词",
    title: { zh: "AI 绘画提示词生成器", en: "AI Image Prompt Generator" },
    description: {
      zh: "为 Midjourney、Stable Diffusion、DALL·E 等图像模型生成专业描述提示词。",
      en: "Generate professional prompts for Midjourney, Stable Diffusion, DALL·E and other image models.",
    },
    fields: [
      {
        name: "subject",
        label: { zh: "画面主题 / 主体", en: "Subject / focus" },
        type: "textarea",
        placeholder: {
          zh: "例如：一位穿着未来风格装甲的宇航员站在火星地表",
          en: "e.g. An astronaut in futuristic armor standing on the Mars surface",
        },
        hint: { zh: "描述图像的核心主体与场景。", en: "Describe the main subject and scene." },
      },
      {
        name: "style",
        label: { zh: "艺术风格", en: "Art style" },
        type: "select",
        options: [
          { value: "写实摄影", label: { zh: "写实摄影", en: "Photo-realistic" } },
          { value: "动漫插画", label: { zh: "动漫插画", en: "Anime illustration" } },
          { value: "油画", label: { zh: "油画", en: "Oil painting" } },
          { value: "水彩", label: { zh: "水彩", en: "Watercolor" } },
          { value: "赛博朋克", label: { zh: "赛博朋克", en: "Cyberpunk" } },
          { value: "像素艺术", label: { zh: "像素艺术", en: "Pixel art" } },
          { value: "3D渲染", label: { zh: "3D渲染", en: "3D render" } },
          { value: "水墨画", label: { zh: "水墨画", en: "Ink wash" } },
          { value: "波普艺术", label: { zh: "波普艺术", en: "Pop art" } },
        ],
        hint: { zh: "选择期望的整体视觉风格。", en: "Choose the overall visual style." },
      },
      {
        name: "composition",
        label: { zh: "构图方式", en: "Composition" },
        type: "radio",
        options: [
          { value: "特写", label: { zh: "特写", en: "Close-up" } },
          { value: "中景", label: { zh: "中景", en: "Mid-shot" } },
          { value: "广角/全景", label: { zh: "广角/全景", en: "Wide / panorama" } },
          { value: "对称构图", label: { zh: "对称构图", en: "Symmetry" } },
          { value: "三分法", label: { zh: "三分法", en: "Rule of thirds" } },
          { value: "引导线", label: { zh: "引导线", en: "Leading line" } },
          { value: "框架构图", label: { zh: "框架构图", en: "Frame within frame" } },
        ],
        hint: { zh: "构图决定了画面的视觉重心与空间感。", en: "Composition defines the visual anchor and depth." },
      },
      {
        name: "lighting",
        label: { zh: "光线类型", en: "Lighting" },
        type: "select",
        options: [
          { value: "自然日光", label: { zh: "自然日光", en: "Natural daylight" } },
          { value: "黄金时刻", label: { zh: "黄金时刻", en: "Golden hour" } },
          { value: "伦勃朗光", label: { zh: "伦勃朗光", en: "Rembrandt" } },
          { value: "霓虹/赛博光", label: { zh: "霓虹/赛博光", en: "Neon / cyber" } },
          { value: "逆光/剪影", label: { zh: "逆光/剪影", en: "Backlit / silhouette" } },
          { value: "柔光箱/棚拍", label: { zh: "柔光箱/棚拍", en: "Softbox / studio" } },
          { value: "烛光/火光", label: { zh: "烛光/火光", en: "Candle / fire" } },
          { value: "阴天漫射光", label: { zh: "阴天漫射光", en: "Overcast diffuse" } },
        ],
        hint: { zh: "光线是营造氛围与质感的关键。", en: "Lighting sets the mood and texture." },
      },
      {
        name: "color",
        label: { zh: "色彩氛围", en: "Color mood" },
        type: "text",
        placeholder: { zh: "暖橙色调，高饱和度，电影感配色", en: "warm amber tones, high saturation, cinematic palette" },
        hint: { zh: "可描述色调、饱和度、对比度等。", en: "Note hue, saturation, contrast." },
      },
      {
        name: "details",
        label: { zh: "细节与质感要求", en: "Detail & texture" },
        type: "textarea",
        placeholder: {
          zh: "装甲表面有磨损划痕，背景有远处废墟城市，天空有两颗卫星",
          en: "worn armor scratches, distant ruined city in background, two satellites overhead",
        },
        hint: { zh: "补充主体材质、背景元素、环境细节等。", en: "Add texture, environment, micro details." },
        rows: 5,
      },
      {
        name: "exclude",
        label: { zh: "需要排除的元素", en: "Exclusions" },
        type: "text",
        placeholder: { zh: "文字、水印、畸形手指、低质量", en: "text, watermark, mangled fingers, low-quality" },
        hint: { zh: "列出你不希望出现在画面中的内容。", en: "Things you don't want in the output." },
      },
      {
        name: "ratio",
        label: { zh: "画面比例 / 用途", en: "Aspect ratio / use" },
        type: "select",
        options: [
          { value: "1:1 (头像/社交媒体)", label: { zh: "1:1 (头像/社交媒体)", en: "1:1 (avatar / social)" } },
          { value: "16:9 (壁纸/横屏)", label: { zh: "16:9 (壁纸/横屏)", en: "16:9 (desktop / landscape)" } },
          { value: "9:16 (手机壁纸/竖屏)", label: { zh: "9:16 (手机壁纸/竖屏)", en: "9:16 (mobile / portrait)" } },
          { value: "4:3 (演示/印刷)", label: { zh: "4:3 (演示/印刷)", en: "4:3 (presentation / print)" } },
          { value: "21:9 (超宽屏)", label: { zh: "21:9 (超宽屏)", en: "21:9 (ultrawide)" } },
        ],
      },
      {
        name: "params",
        label: { zh: "附加参数（如适用）", en: "Extra parameters" },
        type: "text",
        placeholder: { zh: "--ar 16:9 --v 6 --s 750 --q 2", en: "--ar 16:9 --v 6 --s 750 --q 2" },
        hint: { zh: "针对 Midjourney 等模型的技术参数。", en: "Tuning flags for Midjourney etc." },
      },
    ],
    template: (v) => `# AI 绘画提示词

> 请根据以下描述生成图像，或将其直接作为提示词用于图像生成模型。

## 主体描述
${txtOrFill(v, "subject", "暂无，请根据其他信息自动判断并补充。")}

## 视觉设定
- **艺术风格**：${pickList(v, "style") || "暂无，请根据主题自动判断并补充。"}
- **构图方式**：${pickList(v, "composition") || "暂无"}
- **光线类型**：${pickList(v, "lighting") || "暂无，请根据氛围自动判断并补充。"}
- **色彩氛围**：${txtOrFill(v, "color", "暂无，请根据风格自动判断并补充。")}
- **画面比例 / 用途**：${pickList(v, "ratio") || "暂无"}

## 细节与质感
${txtOrFill(v, "details", "暂无，请根据主体自动补充合理细节。")}

## 排除元素
${txtOrFill(v, "exclude", "暂无特定排除要求。") ? `画面中不得出现：${v.exclude}` : "暂无特定排除要求。"}

## 模型参数
${txtOrFill(v, "params", "请根据上述描述和常用最佳实践推荐合适的参数设置。")}

## 额外要求
1. 画面清晰，细节丰富，无低质量或畸形元素。
2. 风格统一，光影逻辑自洽。
3. 如生成多幅变体，请保持主题一致，探索不同构图或光影变化。`,
  },

  // ─── 2) video ─────────────────────────────────────────
  {
    slug: "video",
    icon: "🎬",
    filename: "视频脚本提示词",
    title: { zh: "视频脚本提示词生成器", en: "Video Script Prompt Generator" },
    description: {
      zh: "为短视频、广告、纪录片、直播等场景生成结构化视频脚本提示词。",
      en: "Generate structured video scripts for short videos, ads, docs, live, etc.",
    },
    fields: [
      { name: "type", label: { zh: "视频类型", en: "Video type" }, type: "select", options: [
        { value: "短视频（1-3分钟）", label: { zh: "短视频（1-3分钟）", en: "Short (1-3 min)" } },
        { value: "品牌广告", label: { zh: "品牌广告", en: "Brand ad" } },
        { value: "产品教程", label: { zh: "产品教程", en: "Product tutorial" } },
        { value: "Vlog", label: { zh: "Vlog", en: "Vlog" } },
        { value: "纪录片风格", label: { zh: "纪录片风格", en: "Documentary" } },
        { value: "直播脚本", label: { zh: "直播脚本", en: "Live" } },
        { value: "宣传片", label: { zh: "宣传片", en: "Promo / trailer" } },
      ] },
      { name: "duration", label: { zh: "视频时长", en: "Duration" }, type: "text", placeholder: { zh: "例如：90秒 / 5分钟", en: "e.g. 90s / 5min" }, hint: { zh: "精确时长有助于控制内容密度。", en: "Precise duration controls density." } },
      { name: "platform", label: { zh: "主要发布平台", en: "Platform" }, type: "checkbox", options: [
        { value: "抖音/TikTok", label: { zh: "抖音/TikTok", en: "TikTok / Douyin" } },
        { value: "YouTube", label: { zh: "YouTube", en: "YouTube" } },
        { value: "B站", label: { zh: "B站", en: "Bilibili" } },
        { value: "小红书", label: { zh: "小红书", en: "Xiaohongshu" } },
        { value: "视频号", label: { zh: "视频号", en: "WeChat Channels" } },
        { value: "Instagram Reels", label: { zh: "Instagram Reels", en: "Instagram Reels" } },
      ] },
      { name: "audience", label: { zh: "目标观众", en: "Audience" }, type: "text", placeholder: { zh: "例如：18-30岁科技爱好者", en: "e.g. 18-30 tech enthusiasts" } },
      { name: "message", label: { zh: "核心信息 / 传播目标", en: "Core message" }, type: "textarea", placeholder: { zh: "让观众了解新品的核心卖点，并引导点击购买链接", en: "Drive awareness of feature X and a click-through to purchase." }, rows: 3 },
      { name: "tone", label: { zh: "风格基调", en: "Tone" }, type: "radio", options: [
        { value: "搞笑娱乐", label: { zh: "搞笑娱乐", en: "Comedy" } },
        { value: "温情走心", label: { zh: "温情走心", en: "Warm / heartfelt" } },
        { value: "专业硬核", label: { zh: "专业硬核", en: "Pro / hard-hitting" } },
        { value: "快节奏卡点", label: { zh: "快节奏卡点", en: "Fast-cut beats" } },
        { value: "悬念反转", label: { zh: "悬念反转", en: "Suspense / twist" } },
        { value: "励志正能量", label: { zh: "励志正能量", en: "Inspirational" } },
      ] },
      { name: "scenes", label: { zh: "期望场景数量", en: "Scene count" }, type: "number", default: 5, min: 1, max: 50 },
      { name: "storyboard", label: { zh: "是否需要分镜描述", en: "Storyboard?" }, type: "radio", options: [{ value: "是", label: { zh: "是", en: "Yes" } }, { value: "否", label: { zh: "否", en: "No" } }] },
      { name: "cta", label: { zh: "结尾 CTA", en: "Closing CTA" }, type: "text", placeholder: { zh: "关注账号 / 点击链接 / 购买产品", en: "Follow / click / buy" } },
    ],
    template: (v) => `# 视频脚本提示词

## 基本信息
- **视频类型**：${pickList(v, "type") || "未指定"}
- **目标时长**：${txtOrFill(v, "duration", "未指定")}
- **发布平台**：${pickList(v, "platform") || "未指定"}
- **目标观众**：${txtOrFill(v, "audience", "未指定")}

## 核心信息
${txtOrFill(v, "message", "未指定")}

## 风格基调
${pickList(v, "tone") || "未指定"}

## 场景规划（共 ${pickList(v, "scenes") || 5} 个场景）

1. **开场（Hook）** — 前 3 秒抓住注意力，提出问题或悬念
2. **背景铺设** — 建立上下文与观众共鸣
3. **核心呈现** — 展示关键内容/功能/故事
4. **强化高潮** — 用最强冲击点带动情绪
5. **行动号召 (CTA)** — ${txtOrFill(v, "cta", "引导关注/评论/购买")}

${v.storyboard === "是" ? `## 分镜表（按要求展开）
请按下表输出场景分镜：

| 镜号 | 景别 | 运镜 | 画面内容 | 台词/旁白 | 时长 | 备注 |
|---|---|---|---|---|---|---|
| 1 | 特写 | 推 | … | … | 3s | … |
| … | … | … | … | … | … | … |` : ""}

## 拍摄与制作建议
1. 注重开头 3 秒的视觉冲击力
2. 节奏与配乐应匹配 ${pickList(v, "tone") || "风格基调"}
3. 字幕关键信息点需高亮显示
4. 结尾 CTA 应清晰直接`,
  },

  // ─── 3) article ───────────────────────────────────────
  {
    slug: "article",
    icon: "📝",
    filename: "写文章提示词",
    title: { zh: "文章写作提示词生成器", en: "Article Prompt Generator" },
    description: {
      zh: "生成博客、论文、新闻、技术文档、产品评测等结构化写作提示词。",
      en: "Generate structured writing prompts for blog, academic, news, technical, review, etc.",
    },
    fields: [
      { name: "type", label: { zh: "文章类型", en: "Article type" }, type: "select", options: [
        { value: "博客文章", label: { zh: "博客文章", en: "Blog post" } },
        { value: "学术论文", label: { zh: "学术论文", en: "Academic paper" } },
        { value: "新闻报道", label: { zh: "新闻报道", en: "News" } },
        { value: "小说故事", label: { zh: "小说故事", en: "Fiction" } },
        { value: "技术文档", label: { zh: "技术文档", en: "Technical doc" } },
        { value: "产品评测", label: { zh: "产品评测", en: "Product review" } },
        { value: "社交媒体长文", label: { zh: "社交媒体长文", en: "Long-form social" } },
      ] },
      { name: "topic", label: { zh: "文章主题", en: "Topic" }, type: "text", placeholder: { zh: "人工智能在医疗诊断中的突破与挑战", en: "AI breakthroughs in medical diagnostics" }, hint: { zh: "主题越具体，输出越精准。", en: "Specific topics get specific output." } },
      { name: "audience", label: { zh: "目标读者", en: "Audience" }, type: "text", placeholder: { zh: "普通大众、行业从业者、学术研究者", en: "general public / industry / academic" } },
      { name: "tone", label: { zh: "语气风格", en: "Tone" }, type: "radio", options: [
        { value: "专业严谨", label: { zh: "专业严谨", en: "Formal" } },
        { value: "轻松活泼", label: { zh: "轻松活泼", en: "Casual" } },
        { value: "客观中立", label: { zh: "客观中立", en: "Neutral" } },
        { value: "深度思辨", label: { zh: "深度思辨", en: "Reflective" } },
        { value: "故事叙事", label: { zh: "故事叙事", en: "Narrative" } },
      ] },
      { name: "length", label: { zh: "目标字数", en: "Length" }, type: "text", placeholder: { zh: "2000字 / 3000-5000字", en: "2000 words / 3000-5000 words" } },
      { name: "keywords", label: { zh: "核心关键词 / SEO 关键词", en: "Keywords" }, type: "text", placeholder: { zh: "AI医疗, 深度学习, 诊断准确率", en: "AI medical, deep learning, accuracy" } },
      { name: "outline", label: { zh: "期望大纲 / 结构要求", en: "Outline" }, type: "textarea", placeholder: { zh: "1. 引言\n2. 核心突破\n3. 实际案例\n4. 面临挑战\n5. 未来展望", en: "1. Intro\n2. Breakthrough\n3. Case studies\n4. Challenges\n5. Outlook" }, rows: 6 },
      { name: "refs", label: { zh: "参考来源 / 背景信息", en: "References" }, type: "textarea", placeholder: { zh: "可粘贴相关研究链接、数据、背景资料...", en: "Paste relevant links or background info..." }, rows: 4 },
      { name: "lang", label: { zh: "输出语言", en: "Output language" }, type: "radio", options: [
        { value: "中文", label: { zh: "中文", en: "Chinese" } },
        { value: "English", label: { zh: "English", en: "English" } },
        { value: "中英双语", label: { zh: "中英双语", en: "Bilingual" } },
      ] },
    ],
    template: (v) => `# 写作提示词

## 内容定位
- **文章类型**：${pickList(v, "type") || "未指定"}
- **文章主题**：${txtOrFill(v, "topic", "未指定")}
- **目标读者**：${txtOrFill(v, "audience", "未指定")}
- **语气风格**：${pickList(v, "tone") || "未指定"}
- **目标字数**：${txtOrFill(v, "length", "未指定")}
- **输出语言**：${pickList(v, "lang") || "中文"}

## 核心关键词
${txtOrFill(v, "keywords", "未指定")}

## 结构大纲
${txtOrFill(v, "outline", "无明确大纲，请根据主题设计清晰的层次结构。")}

## 参考资料
${txtOrFill(v, "refs", "无外部参考资料。")}

## 写作要求
1. 围绕主题展开，结构清晰，逻辑连贯
2. ${pickList(v, "tone") || "专业"} 的语气贯穿全文
3. 自然融入关键词 ${txtOrFill(v, "keywords", "")}
4. 适当使用事实、数据、案例增强说服力
5. 字数控制在 ${txtOrFill(v, "length", "约定范围")} 之内`,
  },

  // ─── 4) app / article / bid / business / ppt / prd / research / resume / skill / ui / web ...
  // 以下为简化工具 - 字段精简，模板共用通用结构生成器
  {
    slug: "app",
    icon: "📱",
    filename: "APP提示词",
    title: { zh: "APP 产品提示词生成器", en: "App Product Prompt Generator" },
    description: { zh: "为移动应用规划生成结构化 PRD / 设计 / 上架描述提示词。", en: "Plan mobile apps: PRD / design / store listing in one prompt." },
    fields: [
      { name: "name", label: { zh: "App 名称", en: "App name" }, type: "text", placeholder: { zh: "例如：薄荷记账", en: "e.g. MintLedger" } },
      { name: "atype", label: { zh: "App 类型", en: "App type" }, type: "select", options: [
        { value: "工具效率", label: { zh: "工具效率", en: "Productivity" } },
        { value: "社交电商", label: { zh: "社交电商", en: "Social commerce" } },
        { value: "内容资讯", label: { zh: "内容资讯", en: "Content / news" } },
        { value: "在线教育", label: { zh: "在线教育", en: "Education" } },
        { value: "健康医疗", label: { zh: "健康医疗", en: "Health" } },
        { value: "游戏娱乐", label: { zh: "游戏娱乐", en: "Games" } },
        { value: "金融理财", label: { zh: "金融理财", en: "Finance" } },
      ] },
      { name: "platform", label: { zh: "目标平台", en: "Platforms" }, type: "checkbox", options: [
        { value: "iOS", label: { zh: "iOS", en: "iOS" } },
        { value: "Android", label: { zh: "Android", en: "Android" } },
        { value: "微信小程序", label: { zh: "微信小程序", en: "WeChat mini-app" } },
        { value: "鸿蒙", label: { zh: "鸿蒙", en: "HarmonyOS" } },
        { value: "跨平台(Flutter/React Native)", label: { zh: "跨平台 (Flutter/RN)", en: "Cross-platform (Flutter/RN)" } },
      ] },
      { name: "users", label: { zh: "目标用户", en: "Target users" }, type: "text", placeholder: { zh: "例如：22-35岁职场新人", en: "e.g. 22-35 young professionals" } },
      { name: "features", label: { zh: "核心功能", en: "Core features" }, type: "table", columns: [{ label: { zh: "功能模块", en: "Feature" } }, { label: { zh: "功能描述", en: "Description" } }, { label: { zh: "优先级", en: "Priority" } }] },
      { name: "design", label: { zh: "设计规范偏好", en: "Design guideline" }, type: "select", options: [
        { value: "iOS Human Interface", label: { zh: "iOS Human Interface", en: "iOS HIG" } },
        { value: "Material Design", label: { zh: "Material Design", en: "Material Design" } },
        { value: "自定义品牌风格", label: { zh: "自定义品牌风格", en: "Custom brand" } },
        { value: "无特殊偏好", label: { zh: "无特殊偏好", en: "No preference" } },
      ] },
      { name: "competitors", label: { zh: "竞品参考", en: "Competitors" }, type: "text", placeholder: { zh: "例如：随手记、挖财、MoneyWiz", en: "e.g. Mint, YNAB, MoneyWiz" } },
      { name: "store", label: { zh: "是否需要生成应用商店描述", en: "Store listing?" }, type: "radio", options: [{ value: "是", label: { zh: "是", en: "Yes" } }, { value: "否", label: { zh: "否", en: "No" } }] },
    ],
    template: (v) => `# APP 产品提示词

## 产品定位
- **App 名称**：${txtOrFill(v, "name", "未指定")}
- **App 类型**：${pickList(v, "atype") || "未指定"}
- **目标平台**：${pickList(v, "platform") || "未指定"}
- **目标用户**：${txtOrFill(v, "users", "未指定")}
- **设计规范**：${pickList(v, "design") || "未指定"}
- **竞品参考**：${txtOrFill(v, "competitors", "无")}

## 核心功能
${tableLines(v, "features")}

## 交付要求
${v.store === "是" ? "- 生成 App Store / Google Play 上架文案（中英双语）\n- 截图建议 5-7 张（首屏、核心流程、社交证明）\n- 关键词覆盖与 ASO 优化建议\n" : ""}
1. 信息架构清晰，新手 30 秒内可上手
2. 关键操作 ≤ 2 步完成
3. 支持深色模式、动态字体
4. 首次启动需要权限最小化`,
  },

  {
    slug: "ppt",
    icon: "📊",
    filename: "PPT提示词",
    title: { zh: "PPT 大纲提示词生成器", en: "PPT Outline Generator" },
    description: { zh: "为汇报、提案、培训、产品发布生成结构化 PPT 大纲。", en: "Outline decks for reports, pitches, training, launches." },
    fields: [
      { name: "title", label: { zh: "PPT 主题 / 标题", en: "Title" }, type: "text", placeholder: { zh: "2026年Q3产品战略汇报", en: "Q3 2026 product strategy" } },
      { name: "pages", label: { zh: "期望页数", en: "Page count" }, type: "number", default: 15, min: 3, max: 100 },
      { name: "style", label: { zh: "视觉风格", en: "Visual style" }, type: "radio", options: [
        { value: "商务专业", label: { zh: "商务专业", en: "Corporate" } },
        { value: "学术严谨", label: { zh: "学术严谨", en: "Academic" } },
        { value: "创意活力", label: { zh: "创意活力", en: "Creative" } },
        { value: "极简现代", label: { zh: "极简现代", en: "Minimalist" } },
        { value: "数据驱动", label: { zh: "数据驱动", en: "Data-driven" } },
      ] },
      { name: "audience", label: { zh: "目标受众", en: "Audience" }, type: "text", placeholder: { zh: "公司高管、投资人、客户、学生", en: "execs / investors / clients / students" } },
      { name: "purpose", label: { zh: "演示目的", en: "Purpose" }, type: "select", options: [
        { value: "汇报总结", label: { zh: "汇报总结", en: "Status update" } },
        { value: "提案说服", label: { zh: "提案说服", en: "Pitch / persuade" } },
        { value: "教学培训", label: { zh: "教学培训", en: "Teach / train" } },
        { value: "产品发布", label: { zh: "产品发布", en: "Launch" } },
        { value: "数据洞察", label: { zh: "数据洞察", en: "Data insight" } },
      ] },
      { name: "keypoints", label: { zh: "关键内容点", en: "Key points" }, type: "textarea", rows: 6, placeholder: { zh: "1. 市场现状\n2. 竞品对比\n3. 核心优势\n4. 路线图", en: "1. market\n2. competitive landscape\n3. strengths\n4. roadmap" } },
      { name: "color", label: { zh: "配色偏好", en: "Colors" }, type: "text", placeholder: { zh: "企业品牌蓝+白", en: "brand blue + white" } },
      { name: "speaker", label: { zh: "演讲备注", en: "Speaker notes" }, type: "radio", options: [{ value: "是", label: { zh: "是", en: "Yes" } }, { value: "否", label: { zh: "否", en: "No" } }] },
    ],
    template: (v) => `# PPT 大纲

## 演示信息
- **主题**：${txtOrFill(v, "title", "未指定")}
- **页数**：${pickList(v, "pages") || 15}
- **视觉风格**：${pickList(v, "style") || "未指定"}
- **目标受众**：${txtOrFill(v, "audience", "未指定")}
- **演示目的**：${pickList(v, "purpose") || "未指定"}
- **配色**：${txtOrFill(v, "color", "未指定")}
- **演讲备注**：${v.speaker === "是" ? "需要" : "不需要"}

## 关键内容点
${txtOrFill(v, "keypoints", "未指定")}

## 结构建议
1. 封面（标题/主讲人/日期）
2. 议程概览（3-5 个章节）
3. 第一章：背景 / 现状
4. 第二章：核心内容
5. 第三章：方案 / 数据
6. 第四章：路线图
7. 总结与 Q&A

${v.speaker === "是" ? "> 每页提供 30-60 秒演讲备注，便于讲述。" : ""}`,
  },

  {
    slug: "prd",
    icon: "📋",
    filename: "PRD提示词",
    title: { zh: "PRD 产品需求文档生成器", en: "PRD Generator" },
    description: { zh: "为产品经理生成结构化 PRD 提示词，覆盖功能/场景/指标。", en: "Structured PRD prompts for PMs: features, scenarios, metrics." },
    fields: [
      { name: "product", label: { zh: "产品名称", en: "Product" }, type: "text" },
      { name: "ptype", label: { zh: "产品类型", en: "Type" }, type: "select", options: [
        { value: "移动App", label: { zh: "移动 App", en: "Mobile app" } },
        { value: "Web应用", label: { zh: "Web 应用", en: "Web app" } },
        { value: "小程序", label: { zh: "小程序", en: "Mini-app" } },
        { value: "SaaS平台", label: { zh: "SaaS 平台", en: "SaaS" } },
        { value: "后台管理系统", label: { zh: "后台管理系统", en: "Admin panel" } },
        { value: "AI功能模块", label: { zh: "AI 功能模块", en: "AI feature" } },
      ] },
      { name: "users", label: { zh: "目标用户", en: "Target users" }, type: "text" },
      { name: "problem", label: { zh: "解决的核心问题", en: "Problem" }, type: "textarea", rows: 4 },
      { name: "features", label: { zh: "核心功能列表", en: "Features" }, type: "table", columns: [{ label: { zh: "功能名称", en: "Name" } }, { label: { zh: "功能描述", en: "Description" } }, { label: { zh: "优先级", en: "Priority" } }] },
      { name: "scenarios", label: { zh: "关键用户场景", en: "Scenarios" }, type: "textarea", rows: 5 },
      { name: "metrics", label: { zh: "成功指标", en: "Metrics" }, type: "text" },
      { name: "competitors", label: { zh: "竞品参考", en: "Competitors" }, type: "text" },
      { name: "constraints", label: { zh: "约束与假设", en: "Constraints" }, type: "textarea", rows: 4 },
    ],
    template: (v) => `# PRD 文档

## 1. 产品概览
- **产品名称**：${txtOrFill(v, "product", "未指定")}
- **产品类型**：${pickList(v, "ptype") || "未指定"}
- **目标用户**：${txtOrFill(v, "users", "未指定")}

## 2. 问题与机会
${txtOrFill(v, "problem", "未指定")}

## 3. 核心功能
${tableLines(v, "features")}

## 4. 关键场景
${txtOrFill(v, "scenarios", "未指定")}

## 5. 成功指标
${txtOrFill(v, "metrics", "未指定")}

## 6. 竞品参考
${txtOrFill(v, "competitors", "未指定")}

## 7. 约束与假设
${txtOrFill(v, "constraints", "未指定")}`,
  },

  {
    slug: "research",
    icon: "🔍",
    filename: "调研提示词",
    title: { zh: "调研提示词生成器", en: "Research Prompt Generator" },
    description: { zh: "为市场/用户/竞品/学术调研生成结构化方案提示词。", en: "Plan market/user/competitor/academic research prompts." },
    fields: [
      { name: "type", label: { zh: "调研类型", en: "Type" }, type: "select", options: [
        { value: "市场调研", label: { zh: "市场调研", en: "Market" } },
        { value: "用户调研", label: { zh: "用户调研", en: "User" } },
        { value: "竞品调研", label: { zh: "竞品调研", en: "Competitor" } },
        { value: "学术调研", label: { zh: "学术调研", en: "Academic" } },
        { value: "行业趋势调研", label: { zh: "行业趋势调研", en: "Industry trend" } },
      ] },
      { name: "topic", label: { zh: "调研主题", en: "Topic" }, type: "text" },
      { name: "audience", label: { zh: "目标受众 / 受访者画像", en: "Audience" }, type: "text" },
      { name: "purpose", label: { zh: "调研目的", en: "Goal" }, type: "textarea", rows: 3 },
      { name: "methods", label: { zh: "调研方法", en: "Methods" }, type: "checkbox", options: [
        { value: "问卷调查", label: { zh: "问卷调查", en: "Survey" } },
        { value: "深度访谈", label: { zh: "深度访谈", en: "Interviews" } },
        { value: "焦点小组", label: { zh: "焦点小组", en: "Focus group" } },
        { value: "桌面研究", label: { zh: "桌面研究", en: "Desk research" } },
        { value: "实地观察", label: { zh: "实地观察", en: "Field observation" } },
        { value: "数据挖掘", label: { zh: "数据挖掘", en: "Data mining" } },
      ] },
      { name: "questions", label: { zh: "核心问题 / 假设", en: "Hypotheses" }, type: "textarea", rows: 5 },
      { name: "scope", label: { zh: "样本量 / 范围", en: "Sample size" }, type: "text" },
      { name: "output", label: { zh: "输出格式", en: "Output format" }, type: "radio", options: [
        { value: "完整调研报告", label: { zh: "完整调研报告", en: "Full report" } },
        { value: "PPT汇报版", label: { zh: "PPT 汇报版", en: "PPT" } },
        { value: "数据可视化", label: { zh: "数据可视化", en: "Data viz" } },
        { value: "执行方案+问卷大纲", label: { zh: "执行方案+问卷大纲", en: "Plan + survey draft" } },
      ] },
    ],
    template: (v) => `# 调研方案

- **调研类型**：${pickList(v, "type") || "未指定"}
- **调研主题**：${txtOrFill(v, "topic", "未指定")}
- **目标受众**：${txtOrFill(v, "audience", "未指定")}
- **调研目的**：${txtOrFill(v, "purpose", "未指定")}
- **调研方法**：${pickList(v, "methods") || "未指定"}
- **样本规模**：${txtOrFill(v, "scope", "未指定")}
- **输出格式**：${pickList(v, "output") || "未指定"}

## 核心问题 / 假设
${txtOrFill(v, "questions", "未指定")}

## 推荐执行步骤
1. 明确问题与指标
2. 设计样本与抽样方案
3. 准备问卷/访谈大纲/数据源
4. 实地执行与数据收集
5. 数据清洗与统计分析
6. 洞察提炼与行动建议
7. 报告撰写 + 内部评审`,
  },

  {
    slug: "resume",
    icon: "💼",
    filename: "简历提示词",
    title: { zh: "简历提示词生成器", en: "Resume Prompt Generator" },
    description: { zh: "为目标岗位生成亮点突出、数据驱动的简历提示词。", en: "Generate resume prompts tailored to your target role." },
    fields: [
      { name: "job", label: { zh: "目标岗位", en: "Target role" }, type: "text" },
      { name: "industry", label: { zh: "目标行业", en: "Industry" }, type: "text" },
      { name: "years", label: { zh: "工作经验年限", en: "Years" }, type: "text" },
      { name: "skills", label: { zh: "核心技能", en: "Skills" }, type: "textarea", rows: 4 },
      { name: "edu", label: { zh: "教育背景", en: "Education" }, type: "text" },
      { name: "highlights", label: { zh: "成就亮点 / 项目经历", en: "Highlights" }, type: "textarea", rows: 5 },
      { name: "company", label: { zh: "目标公司类型", en: "Company type" }, type: "select", options: [
        { value: "大厂/上市公司", label: { zh: "大厂/上市公司", en: "Big tech / public" } },
        { value: "创业公司", label: { zh: "创业公司", en: "Startup" } },
        { value: "外企", label: { zh: "外企", en: "Foreign" } },
        { value: "国企/事业单位", label: { zh: "国企/事业单位", en: "State-owned" } },
        { value: "自由职业/远程", label: { zh: "自由职业/远程", en: "Freelance / remote" } },
      ] },
      { name: "style", label: { zh: "简历风格", en: "Style" }, type: "radio", options: [
        { value: "简洁专业", label: { zh: "简洁专业", en: "Clean pro" } },
        { value: "数据驱动", label: { zh: "数据驱动", en: "Data-driven" } },
        { value: "创意突出", label: { zh: "创意突出", en: "Creative" } },
        { value: "学术严谨", label: { zh: "学术严谨", en: "Academic" } },
      ] },
      { name: "lang", label: { zh: "简历语言", en: "Language" }, type: "radio", options: [
        { value: "中文", label: { zh: "中文", en: "Chinese" } },
        { value: "English", label: { zh: "English", en: "English" } },
        { value: "中英双语", label: { zh: "中英双语", en: "Bilingual" } },
      ] },
    ],
    template: (v) => `# 简历提示词

## 候选人
- **目标岗位**：${txtOrFill(v, "job", "未指定")}
- **目标行业**：${txtOrFill(v, "industry", "未指定")}
- **工作年限**：${txtOrFill(v, "years", "未指定")}
- **教育背景**：${txtOrFill(v, "edu", "未指定")}
- **目标公司类型**：${pickList(v, "company") || "未指定"}
- **简历风格**：${pickList(v, "style") || "未指定"}
- **语言**：${pickList(v, "lang") || "中文"}

## 核心技能
${txtOrFill(v, "skills", "未指定")}

## 成就亮点
${txtOrFill(v, "highlights", "未指定")}

## 输出要求
1. 1 页（A4），专业排版
2. 突出最近 3 段经历的核心成果（数据驱动）
3. 技能分类清晰，避免堆砌关键词
4. 中英双语版本针对 JD 关键词 ATS 友好`,
  },

  {
    slug: "skill",
    icon: "🎭",
    filename: "AI角色Skill提示词",
    title: { zh: "AI 角色 Skill 生成器", en: "AI Role / Skill Generator" },
    description: { zh: "为特定 AI 角色生成边界清晰、可复用的系统提示词。", en: "Generate crisp, reusable system prompts for AI roles." },
    fields: [
      { name: "name", label: { zh: "角色名称 / 身份", en: "Name / role" }, type: "text", placeholder: { zh: "资深 Python 架构师", en: "Senior Python architect" } },
      { name: "domain", label: { zh: "专业领域", en: "Domain" }, type: "text" },
      { name: "experience", label: { zh: "经验背景设定", en: "Background" }, type: "text" },
      { name: "style", label: { zh: "沟通风格", en: "Style" }, type: "radio", options: [
        { value: "严谨专业", label: { zh: "严谨专业", en: "Formal" } },
        { value: "亲和易懂", label: { zh: "亲和易懂", en: "Friendly" } },
        { value: "犀利直接", label: { zh: "犀利直接", en: "Direct" } },
        { value: "引导启发", label: { zh: "引导启发", en: "Coaching" } },
        { value: "幽默风趣", label: { zh: "幽默风趣", en: "Witty" } },
      ] },
      { name: "scope", label: { zh: "知识范围", en: "Scope" }, type: "textarea", rows: 4 },
      { name: "restrictions", label: { zh: "限制规则 / 禁止事项", en: "Restrictions" }, type: "textarea", rows: 4 },
      { name: "format", label: { zh: "输出格式要求", en: "Output format" }, type: "textarea", rows: 4 },
      { name: "examples", label: { zh: "示例对话（可选）", en: "Examples" }, type: "textarea", rows: 5 },
    ],
    template: (v) => `# 角色: ${txtOrFill(v, "name", "[未命名角色]")}

## 身份与领域
- **领域**：${txtOrFill(v, "domain", "未指定")}
- **背景**：${txtOrFill(v, "experience", "未指定")}
- **风格**：${pickList(v, "style") || "未指定"}

## 知识范围
${txtOrFill(v, "scope", "未指定")}

## 限制规则
${txtOrFill(v, "restrictions", "无")}

## 输出格式
${txtOrFill(v, "format", "清晰回答，必要时分段。")}

## 示例对话
${txtOrFill(v, "examples", "无")}

## 系统提示词（可直接使用）
\`\`\`
你是一位${pickList(v, "style") || "严谨"}的「${txtOrFill(v, "name", "AI 助手")}」。
你的专业领域是：${txtOrFill(v, "domain", "[领域]")}。
你的经验背景：${txtOrFill(v, "experience", "[背景]")}。

知识范围：
${txtOrFill(v, "scope", "[请补充]")}

输出格式要求：
${txtOrFill(v, "format", "[请补充]")}

限制规则：
${txtOrFill(v, "restrictions", "[请补充]")}
\`\`\``,
  },

  {
    slug: "ui",
    icon: "🎨",
    filename: "UI设计提示词",
    title: { zh: "UI 设计提示词生成器", en: "UI Design Prompt Generator" },
    description: { zh: "为 UI 设计项目生成风格、组件、交付物提示词。", en: "Generate UI design prompts for style, components, deliverables." },
    fields: [
      { name: "ptype", label: { zh: "项目类型", en: "Project type" }, type: "select", options: [
        { value: "App界面设计", label: { zh: "App 界面设计", en: "App UI" } },
        { value: "Web界面设计", label: { zh: "Web 界面设计", en: "Web UI" } },
        { value: "设计系统", label: { zh: "设计系统", en: "Design system" } },
        { value: "图标集", label: { zh: "图标集", en: "Icon set" } },
        { value: "插画/运营图", label: { zh: "插画/运营图", en: "Illustration" } },
        { value: "数据可视化", label: { zh: "数据可视化", en: "Data viz" } },
      ] },
      { name: "style", label: { zh: "设计风格", en: "Style" }, type: "radio", options: [
        { value: "扁平化", label: { zh: "扁平化", en: "Flat" } },
        { value: "拟物风", label: { zh: "拟物风", en: "Skeuomorphic" } },
        { value: "玻璃拟态", label: { zh: "玻璃拟态", en: "Glassmorphism" } },
        { value: "新拟态", label: { zh: "新拟态", en: "Neumorphism" } },
        { value: "3D立体", label: { zh: "3D 立体", en: "3D" } },
        { value: "手绘插画风", label: { zh: "手绘插画风", en: "Hand-drawn" } },
      ] },
      { name: "color", label: { zh: "配色方案", en: "Palette" }, type: "text" },
      { name: "font", label: { zh: "字体偏好", en: "Font" }, type: "text" },
      { name: "components", label: { zh: "所需组件范围", en: "Components" }, type: "checkbox", options: [
        { value: "按钮", label: { zh: "按钮", en: "Buttons" } },
        { value: "表单输入", label: { zh: "表单输入", en: "Inputs" } },
        { value: "卡片/列表", label: { zh: "卡片/列表", en: "Cards / lists" } },
        { value: "导航/标签", label: { zh: "导航/标签", en: "Nav / tabs" } },
        { value: "弹窗/模态框", label: { zh: "弹窗/模态框", en: "Modals" } },
        { value: "图表/数据", label: { zh: "图表/数据", en: "Charts" } },
        { value: "空状态/加载", label: { zh: "空状态/加载", en: "Empty / loading" } },
        { value: "状态反馈(Toast/Alert)", label: { zh: "状态反馈", en: "Toasts / alerts" } },
      ] },
      { name: "tool", label: { zh: "设计工具", en: "Tool" }, type: "select", options: [
        { value: "Figma", label: { zh: "Figma", en: "Figma" } },
        { value: "Sketch", label: { zh: "Sketch", en: "Sketch" } },
        { value: "Adobe XD", label: { zh: "Adobe XD", en: "Adobe XD" } },
        { value: "MasterGo/即时设计", label: { zh: "MasterGo/即时设计", en: "MasterGo / 即时" } },
        { value: "无特殊要求", label: { zh: "无特殊要求", en: "No preference" } },
      ] },
      { name: "deliver", label: { zh: "交付物", en: "Deliverables" }, type: "checkbox", options: [
        { value: "设计稿源文件", label: { zh: "设计稿源文件", en: "Source file" } },
        { value: "切图/导出资源", label: { zh: "切图/导出资源", en: "Exported assets" } },
        { value: "标注/ redline", label: { zh: "标注 / redline", en: "Specs / redline" } },
        { value: "交互原型", label: { zh: "交互原型", en: "Prototype" } },
        { value: "设计规范文档", label: { zh: "设计规范文档", en: "Design spec doc" } },
      ] },
      { name: "a11y", label: { zh: "无障碍要求", en: "A11y" }, type: "radio", options: [
        { value: "需满足WCAG 2.1 AA", label: { zh: "需满足 WCAG 2.1 AA", en: "WCAG 2.1 AA" } },
        { value: "无强制要求", label: { zh: "无强制要求", en: "Not required" } },
      ] },
    ],
    template: (v) => `# UI 设计提示词

## 项目
- **类型**：${pickList(v, "ptype") || "未指定"}
- **风格**：${pickList(v, "style") || "未指定"}
- **配色**：${txtOrFill(v, "color", "未指定")}
- **字体**：${txtOrFill(v, "font", "未指定")}
- **工具**：${pickList(v, "tool") || "未指定"}
- **无障碍**：${pickList(v, "a11y") || "无强制要求"}

## 组件范围
${pickList(v, "components") || "未指定"}

## 交付物
${pickList(v, "deliver") || "未指定"}

## 设计要求
1. 8pt 栅格、4 倍数间距
2. 主色 + 辅色 + 中性色 + 语义色
3. 圆角 / 阴影体系一致
4. 响应式断点：mobile / tablet / desktop
5. 暗色模式与浅色模式双套
6. 动效克制，120-240ms 缓动`,
  },

  {
    slug: "web",
    icon: "🌐",
    filename: "网页提示词",
    title: { zh: "网页生成提示词", en: "Web Page Prompt Generator" },
    description: { zh: "为品牌官网、落地页、电商站、作品集等生成网页提示词。", en: "Generate prompts for landing, e-commerce, portfolio, docs sites." },
    fields: [
      { name: "wtype", label: { zh: "网站类型", en: "Site type" }, type: "select", options: [
        { value: "品牌官网", label: { zh: "品牌官网", en: "Brand site" } },
        { value: "产品落地页", label: { zh: "产品落地页", en: "Landing page" } },
        { value: "电商站", label: { zh: "电商站", en: "E-commerce" } },
        { value: "个人博客", label: { zh: "个人博客", en: "Blog" } },
        { value: "作品集", label: { zh: "作品集", en: "Portfolio" } },
        { value: "SaaS后台", label: { zh: "SaaS 后台", en: "SaaS admin" } },
        { value: "文档/知识库", label: { zh: "文档/知识库", en: "Docs / KB" } },
      ] },
      { name: "brand", label: { zh: "品牌 / 产品名称", en: "Brand / product" }, type: "text" },
      { name: "audience", label: { zh: "目标访客", en: "Audience" }, type: "text" },
      { name: "requirements", label: { zh: "具体需求 / 设计要求", en: "Requirements" }, type: "textarea", rows: 6 },
      { name: "pages", label: { zh: "核心页面", en: "Core pages" }, type: "checkbox", options: [
        { value: "首页", label: { zh: "首页", en: "Home" } },
        { value: "关于我们", label: { zh: "关于我们", en: "About" } },
        { value: "产品/服务", label: { zh: "产品/服务", en: "Products / services" } },
        { value: "案例/作品集", label: { zh: "案例/作品集", en: "Cases / portfolio" } },
        { value: "价格方案", label: { zh: "价格方案", en: "Pricing" } },
        { value: "博客/资讯", label: { zh: "博客/资讯", en: "Blog" } },
        { value: "联系我们", label: { zh: "联系我们", en: "Contact" } },
        { value: "FAQ", label: { zh: "FAQ", en: "FAQ" } },
      ] },
      { name: "style", label: { zh: "风格偏好", en: "Style" }, type: "radio", options: [
        { value: "极简现代", label: { zh: "极简现代", en: "Minimalist" } },
        { value: "商务专业", label: { zh: "商务专业", en: "Corporate" } },
        { value: "活泼创意", label: { zh: "活泼创意", en: "Playful" } },
        { value: "科技感", label: { zh: "科技感", en: "Tech-feel" } },
        { value: "复古经典", label: { zh: "复古经典", en: "Classic" } },
      ] },
      { name: "tech", label: { zh: "技术栈偏好", en: "Tech stack" }, type: "select", options: [
        { value: "React / Next.js", label: { zh: "React / Next.js", en: "React / Next.js" } },
        { value: "Vue / Nuxt", label: { zh: "Vue / Nuxt", en: "Vue / Nuxt" } },
        { value: "纯HTML+CSS+JS", label: { zh: "纯 HTML+CSS+JS", en: "Plain HTML+CSS+JS" } },
        { value: "无代码(WordPress/Webflow)", label: { zh: "无代码", en: "No-code" } },
        { value: "无特殊偏好", label: { zh: "无特殊偏好", en: "No preference" } },
      ] },
      { name: "features", label: { zh: "必须功能", en: "Must-have features" }, type: "checkbox", options: [
        { value: "SEO优化", label: { zh: "SEO 优化", en: "SEO" } },
        { value: "多语言", label: { zh: "多语言", en: "i18n" } },
        { value: "联系表单", label: { zh: "联系表单", en: "Contact form" } },
        { value: "在线支付", label: { zh: "在线支付", en: "Online payment" } },
        { value: "内容管理(CMS)", label: { zh: "内容管理 (CMS)", en: "CMS" } },
        { value: "用户登录/会员", label: { zh: "用户登录/会员", en: "Auth / members" } },
      ] },
    ],
    template: (v) => `# 网页生成提示词

## 概要
- **网站类型**：${pickList(v, "wtype") || "未指定"}
- **品牌 / 产品**：${txtOrFill(v, "brand", "未指定")}
- **目标访客**：${txtOrFill(v, "audience", "未指定")}
- **风格**：${pickList(v, "style") || "未指定"}
- **技术栈**：${pickList(v, "tech") || "未指定"}

## 核心页面
${pickList(v, "pages") || "未指定"}

## 必须功能
${pickList(v, "features") || "未指定"}

## 具体需求
${txtOrFill(v, "requirements", "无")}

## 验收要求
1. Lighthouse Performance ≥ 90
2. 移动端响应式（≤ 768px）
3. WCAG AA 级对比度
4. SEO 元数据完整（title / description / og）`,
  },

  {
    slug: "business",
    icon: "📈",
    filename: "商业计划书提示词",
    title: { zh: "商业计划书生成器", en: "Business Plan Generator" },
    description: { zh: "为融资 BP / 内部 BP / 合作方案 / 调研报告生成提示词。", en: "Generate prompts for pitch decks / internal plans / collabs / research." },
    fields: [
      { name: "doctype", label: { zh: "文档类型", en: "Type" }, type: "select", options: [
        { value: "融资BP（投资人版）", label: { zh: "融资 BP", en: "Investor pitch" } },
        { value: "商业计划书（内部版）", label: { zh: "商业计划书（内部）", en: "Internal plan" } },
        { value: "合作方案", label: { zh: "合作方案", en: "Partner deck" } },
        { value: "市场调研报告", label: { zh: "市场调研报告", en: "Market report" } },
      ] },
      { name: "industry", label: { zh: "所在行业", en: "Industry" }, type: "text" },
      { name: "audience", label: { zh: "目标读者", en: "Audience" }, type: "select", options: [
        { value: "VC/天使投资人", label: { zh: "VC/天使", en: "VC / angel" } },
        { value: "企业合作伙伴", label: { zh: "企业合作伙伴", en: "Partner" } },
        { value: "银行/金融机构", label: { zh: "银行/金融机构", en: "Bank / FI" } },
        { value: "内部管理层", label: { zh: "内部管理层", en: "Internal mgmt" } },
      ] },
      { name: "product", label: { zh: "核心产品 / 服务", en: "Product / service" }, type: "textarea", rows: 3 },
      { name: "model", label: { zh: "商业模式", en: "Business model" }, type: "select", options: [
        { value: "订阅制SaaS", label: { zh: "订阅 SaaS", en: "SaaS subscription" } },
        { value: "平台撮合", label: { zh: "平台撮合", en: "Marketplace" } },
        { value: "自营电商", label: { zh: "自营电商", en: "D2C commerce" } },
        { value: "广告变现", label: { zh: "广告变现", en: "Ads" } },
        { value: "按需服务", label: { zh: "按需服务", en: "On-demand service" } },
        { value: "硬件+服务", label: { zh: "硬件 + 服务", en: "Hardware + service" } },
        { value: "授权/加盟", label: { zh: "授权/加盟", en: "License / franchise" } },
      ] },
      { name: "market", label: { zh: "市场规模与趋势", en: "Market size" }, type: "textarea", rows: 4 },
      { name: "advantage", label: { zh: "核心竞争优势", en: "Edge" }, type: "textarea", rows: 4 },
      { name: "finance", label: { zh: "财务预测 / 融资需求", en: "Financials" }, type: "textarea", rows: 4 },
      { name: "team", label: { zh: "核心团队", en: "Team" }, type: "textarea", rows: 3 },
    ],
    template: (v) => `# 商业文档提示词

- **文档类型**：${pickList(v, "doctype") || "未指定"}
- **行业**：${txtOrFill(v, "industry", "未指定")}
- **目标读者**：${pickList(v, "audience") || "未指定"}
- **商业模式**：${pickList(v, "model") || "未指定"}

## 产品 / 服务
${txtOrFill(v, "product", "未指定")}

## 市场
${txtOrFill(v, "market", "未指定")}

## 竞争优势
${txtOrFill(v, "advantage", "未指定")}

## 财务 / 融资
${txtOrFill(v, "finance", "未指定")}

## 团队
${txtOrFill(v, "team", "未指定")}

## 写作要点
1. 投资人最关心：市场 + 团队 + 商业模式 + 数据支撑
2. 用数字说话，避免形容词堆砌
3. 风险与挑战要诚实呈现，并附应对方案`,
  },

  {
    slug: "bid",
    icon: "📑",
    filename: "标书提示词",
    title: { zh: "标书生成器", en: "Bid / RFP Generator" },
    description: { zh: "为软件、系统集成、咨询、工程、设备采购类标书生成提示词。", en: "Generate bid prompts for software / integration / consulting / civil / procurement." },
    fields: [
      { name: "project", label: { zh: "项目名称", en: "Project" }, type: "text" },
      { name: "bidder", label: { zh: "招标方 / 采购单位", en: "Procurer" }, type: "text" },
      { name: "type", label: { zh: "项目类型", en: "Type" }, type: "select", options: [
        { value: "软件开发", label: { zh: "软件开发", en: "Software" } },
        { value: "系统集成", label: { zh: "系统集成", en: "Integration" } },
        { value: "咨询服务", label: { zh: "咨询服务", en: "Consulting" } },
        { value: "工程施工", label: { zh: "工程施工", en: "Construction" } },
        { value: "设备采购", label: { zh: "设备采购", en: "Procurement" } },
        { value: "运维服务", label: { zh: "运维服务", en: "O&M" } },
      ] },
      { name: "advantage", label: { zh: "我方核心优势", en: "Our edge" }, type: "textarea", rows: 5 },
      { name: "tech", label: { zh: "技术方案要点", en: "Technical plan" }, type: "textarea", rows: 5 },
      { name: "budget", label: { zh: "预算范围 / 报价策略", en: "Budget / pricing" }, type: "text" },
      { name: "timeline", label: { zh: "交付周期要求", en: "Timeline" }, type: "text" },
      { name: "team", label: { zh: "团队配置", en: "Team setup" }, type: "textarea", rows: 4 },
    ],
    template: (v) => `# 标书提示词

## 项目
- **项目名称**：${txtOrFill(v, "project", "未指定")}
- **招标方**：${txtOrFill(v, "bidder", "未指定")}
- **项目类型**：${pickList(v, "type") || "未指定"}
- **预算 / 报价**：${txtOrFill(v, "budget", "未指定")}
- **交付周期**：${txtOrFill(v, "timeline", "未指定")}

## 我方核心优势
${txtOrFill(v, "advantage", "未指定")}

## 技术方案要点
${txtOrFill(v, "tech", "未指定")}

## 团队配置
${txtOrFill(v, "team", "未指定")}

## 标书结构建议
1. 投标函 / 报价一览表
2. 项目理解与需求分析
3. 技术方案（架构 + 关键模块 + 安全 + 性能）
4. 项目管理（计划 / 质量 / 风险 / 沟通）
5. 实施团队（CV + 投入比例）
6. 售后与运维承诺
7. 资质与案例附件`,
  },
];

// 工具查找：按 slug
export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return tools.find((t) => t.slug === slug);
}

export const toolsByPath: Record<string, ToolDefinition> = tools.reduce(
  (acc, t) => {
    acc[`/tools/${t.slug}`] = t;
    return acc;
  },
  {} as Record<string, ToolDefinition>,
);
