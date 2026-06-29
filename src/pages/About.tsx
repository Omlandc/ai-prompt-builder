import { useOutletContext } from "react-router";
import type { SiteOutletContext } from "@/components/layout/SiteLayout";

export default function About() {
  const { locale } = useOutletContext<SiteOutletContext>();
  return (
    <div className="container mx-auto px-4 py-12 md:py-16 max-w-3xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-4">{locale === "zh" ? "关于我们" : "About us"}</h1>
      <p className="text-muted-foreground mb-8 leading-relaxed">
        {locale === "zh"
          ? "复杂 AI 提示词构造 是一个面向 AI 创作者的工具集。我们相信好的提示词比好的模型更重要——一个 100 行的清晰指令，比 100 次模糊的对话要高效得多。"
          : "Complex AI Prompt Builder is a toolset for AI creators. We believe good prompts beat good models — a 100-line precise instruction outperforms 100 vague conversations."}
      </p>

      <Section
        title={locale === "zh" ? "我们提供什么" : "What we offer"}
        locale={locale}
        items={locale === "zh" ? [
          "13 个针对常见场景的高质量提示词生成器，全部在浏览器内运行",
          "346 条经过策展的图像提示词配方（来源于 awesome-gpt-image-2 开源项目，MIT 协议）",
          "中英双语界面，照顾国内外创作者",
          "无登录、无后端、无追踪，所有数据保存在你的浏览器中",
        ] : [
          "13 browser-side prompt generators for common scenarios",
          "346 curated image prompt recipes (sourced from the awesome-gpt-image-2 MIT-licensed open-source project)",
          "Bilingual CN/EN interface for creators worldwide",
          "No login, no backend, no tracking. All data stays in your browser.",
        ]}
      />

      <Section
        title={locale === "zh" ? "技术栈" : "Tech stack"}
        locale={locale}
        items={[
          "React 19 + TypeScript + Vite 7",
          "Tailwind CSS 3.4 + shadcn/ui (new-york)",
          "React Router 7",
          "lucide-react 图标",
        ]}
      />

      <Section
        title={locale === "zh" ? "数据来源" : "Data sources"}
        locale={locale}
        items={locale === "zh" ? [
          "本项目案例数据整合自开源项目 freestylefly/awesome-gpt-image-2 (MIT License)",
          "提示词工程知识体系来自公开演讲与社区共识",
          "工具配置提炼自数月真实项目使用经验",
        ] : [
          "Recipes curated from freestylefly/awesome-gpt-image-2 (MIT License)",
          "Prompting knowledge drawn from public talks & community consensus",
          "Tool configs distilled from months of real-world project usage",
        ]}
      />

      <Section
        title={locale === "zh" ? "隐私承诺" : "Privacy commitment"}
        locale={locale}
        items={locale === "zh" ? [
          "我们不收集任何用户输入数据",
          "无 cookie 追踪、无第三方分析",
          "如使用浏览器本地存储（如自定义案例），完全保存在你的设备上",
        ] : [
          "We never collect any user input data",
          "No cookies, no third-party analytics",
          "Local-storage data (such as custom cases) lives entirely on your device",
        ]}
      />
    </div>
  );
}

function Section({ title, items }: { title: string; items: string[]; locale: "zh" | "en" }) {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-3">{title}</h2>
      <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed">
        {items.map((line, i) => (
          <li key={i} className="flex gap-2">
            <span className="text-primary mt-1.5 inline-block h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
            <span>{line}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
