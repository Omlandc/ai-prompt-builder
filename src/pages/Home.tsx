import { Link, useOutletContext } from "react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SiteOutletContext } from "@/components/layout/SiteLayout";
import { tools } from "@/config/tools";
import { loc } from "@/lib/loc";
import { CaseCarousel } from "@/components/home/CaseCarousel";

export default function Home() {
  const { locale } = useOutletContext<SiteOutletContext>();

  const featured = ["image", "video", "article", "ppt", "prd", "skill", "research", "resume", "ui"];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-background -z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent -z-10" />
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-xs font-medium mb-4">
              <Sparkles className="h-3.5 w-3.5" />
              {locale === "zh" ? "13 款提示词工具 + 图像配方库" : "13 prompt tools + an image recipe library"}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-[1.1] tracking-tight">
              {locale === "zh" ? (
                <>让 AI 模型 <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">听懂你</span><br />写出真正能用的提示词</>
              ) : (
                <>Make AI models <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">actually do</span><br />what you want, in prompts</>
              )}
            </h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-2xl leading-relaxed">
              {locale === "zh"
                ? "面向写作者、设计师与产品人的 AI 提示词工作台：覆盖图像、视频、文章、PPT、PRD、简历等高频场景。所有工具都在浏览器内运行，你的内容不会上传。"
                : "A prompt workspace for writers, designers, and product folks. Covers image, video, article, PPT, PRD, resume, and more. Everything runs in your browser — nothing is uploaded."}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg" className="gap-2">
                <Link to="/tools/image">
                  {locale === "zh" ? "进入图像配方库" : "Open image library"}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/about">{locale === "zh" ? "了解更多" : "Learn more"}</Link>
              </Button>
            </div>
          </div>

          <div className="mt-12">
            <CaseCarousel locale={locale} />
          </div>
        </div>
      </section>

      {/* Featured tools */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">{locale === "zh" ? "精选工具" : "Featured tools"}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {locale === "zh" ? "挑一个最常用的场景试试" : "Pick your most common scenario"}
            </p>
          </div>
          <Link to="/tools/image" className="text-sm text-primary hover:underline">
            {locale === "zh" ? "查看所有 →" : "See all →"}
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {featured.map((slug) => {
            const tool = tools.find((t) => t.slug === slug);
            if (!tool) return null;
            return (
              <Link
                key={slug}
                to={`/tools/${slug}`}
                className="group bg-card border border-border rounded-xl p-5 hover:border-primary/60 hover:shadow-lg transition-all"
              >
                <div className="mb-3">
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary/15 transition-colors">
                    <tool.icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="font-semibold mb-1 group-hover:text-primary">{loc(tool.title, locale)}</div>
                <div className="text-xs text-muted-foreground line-clamp-2 min-h-[2.4em]">
                  {loc(tool.description, locale)}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Path banner */}
      <section className="container mx-auto px-4 py-10">
        <div className="rounded-2xl p-6 md:p-10 bg-gradient-to-br from-blue-500 to-purple-600 text-white">
          <h3 className="text-2xl font-bold mb-2">
            {locale === "zh" ? "还在为图像提示词发愁？" : "Still struggling with image prompts?"}
          </h3>
          <p className="text-blue-50/90 mb-5 max-w-2xl">
            {locale === "zh"
              ? "图像工具集成了策展过的提示词配方与填空模板，挑一个案例改造，或者从零开始拼装自己的版本。"
              : "The image tool ships with curated prompt recipes and fill-in templates. Start from a real case, or compose one from scratch."}
          </p>
          <Button asChild variant="secondary" size="lg" className="gap-2">
            <Link to="/tools/image">
              {locale === "zh" ? "打开图像配方库" : "Open image library"}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}


