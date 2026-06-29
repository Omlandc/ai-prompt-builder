import { Link, useOutletContext, useParams } from "react-router";
import type { SiteOutletContext } from "@/components/layout/SiteLayout";
import { tools, getToolBySlug } from "@/config/tools";
import { loc } from "@/lib/loc";
import { PromptForm } from "@/components/prompt/PromptForm";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

export default function ToolPage() {
  const { slug } = useParams<{ slug: string }>();
  const { locale } = useOutletContext<SiteOutletContext>();
  const tool = slug ? getToolBySlug(slug) : undefined;

  if (!tool) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-2">404</h1>
        <p className="text-muted-foreground mb-6">{locale === "zh" ? "工具不存在" : "Tool not found"}</p>
        <Button asChild>
          <Link to="/">{locale === "zh" ? "返回首页" : "Back home"}</Link>
        </Button>
      </div>
    );
  }

  const currentIdx = tools.findIndex((t) => t.slug === slug);
  const others = tools.filter((t) => t.slug !== slug).slice(0, 6);

  return (
    <div className="container mx-auto px-4 py-6 md:py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-5">
        <Link to="/" className="hover:text-foreground">{locale === "zh" ? "首页" : "Home"}</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground font-medium">{loc(tool.title, locale)}</span>
      </nav>

      {/* Title */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
          <span className="text-4xl md:text-5xl">{tool.icon}</span>
          {loc(tool.title, locale)}
        </h1>
        <p className="mt-3 text-muted-foreground max-w-3xl leading-relaxed">
          {loc(tool.description, locale)}
        </p>
      </div>

      <PromptForm tool={tool} locale={locale} />

      {/* Suggestions */}
      <section className="mt-12 pt-8 border-t border-border">
        <h2 className="text-lg font-semibold mb-4">{locale === "zh" ? "其他工具" : "Other tools"}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {others.map((t) => (
            <Link
              key={t.slug}
              to={`/tools/${t.slug}`}
              className="block bg-card border border-border rounded-lg p-3 hover:border-primary/60 transition-all"
            >
              <div className="text-2xl">{t.icon}</div>
              <div className="text-sm font-medium mt-2 line-clamp-1">{loc(t.title, locale)}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer-like nav for serial */}
      <div className="mt-8 flex items-center justify-between text-sm text-muted-foreground">
        {currentIdx > 0 ? (
          <Link to={`/tools/${tools[currentIdx - 1].slug}`} className="hover:text-foreground">
            ← {loc(tools[currentIdx - 1].title, locale)}
          </Link>
        ) : <div />}
        {currentIdx < tools.length - 1 ? (
          <Link to={`/tools/${tools[currentIdx + 1].slug}`} className="hover:text-foreground">
            {loc(tools[currentIdx + 1].title, locale)} →
          </Link>
        ) : <div />}
      </div>
    </div>
  );
}
