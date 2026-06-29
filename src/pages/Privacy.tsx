import { useOutletContext } from "react-router";
import type { SiteOutletContext } from "@/components/layout/SiteLayout";

export default function Privacy() {
  const { locale } = useOutletContext<SiteOutletContext>();
  return (
    <div className="container mx-auto px-4 py-12 md:py-16 max-w-3xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-4">{locale === "zh" ? "隐私政策" : "Privacy policy"}</h1>
      <p className="text-sm text-muted-foreground mb-8">
        {locale === "zh" ? "最后更新：2026-06" : "Last updated: 2026-06"}
      </p>

      <Section
        title={locale === "zh" ? "我们收集什么" : "What we collect"}
        body={locale === "zh"
          ? "本项目是一个纯前端静态站点。我们不收集、存储或传输任何用户输入数据。"
          : "This is a frontend-only static site. We do not collect, store, or transmit any user input data."}
      />

      <Section
        title={locale === "zh" ? "Cookie 与追踪" : "Cookies & tracking"}
        body={locale === "zh"
          ? "我们不使用任何追踪 cookie，不使用任何第三方分析（如 Google Analytics）。你的浏览行为完全不可见于我们。"
          : "We don't use tracking cookies or third-party analytics (such as Google Analytics). Your browsing behavior is invisible to us."}
      />

      <Section
        title={locale === "zh" ? "浏览器本地存储" : "Local storage"}
        body={locale === "zh"
          ? "为支持「图像配方库」中的用户自定义案例、自定义提示词编辑等特性，我们使用浏览器的 localStorage 存储数据。这些数据完全保存在你的设备本地，不会同步到任何服务器。清除浏览器数据将删除这些信息。"
          : "To enable user-defined cases and prompt edits in the Image Prompt Library, we use browser localStorage. All such data stays on your device; clearing browser data will erase it."}
      />

      <Section
        title={locale === "zh" ? "第三方资源" : "Third-party resources"}
        body={locale === "zh"
          ? "本站点通过 CDN 加载字体与 JavaScript 包。这些 CDN 提供方可能基于 IP 地址记录请求，但不会获得你输入的任何内容。"
          : "We load fonts and JS bundles from CDNs. CDN providers may log requests by IP but receive none of your input content."}
      />

      <Section
        title={locale === "zh" ? "联系" : "Contact"}
        body={locale === "zh" ? "如有隐私相关的问题，请通过 Contact 页面与我们联系。" : "For privacy questions, please use the Contact page."}
      />
    </div>
  );
}

function Section({ title, body }: { title: string; body: string }) {
  return (
    <section className="mb-7">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
    </section>
  );
}
