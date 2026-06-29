import { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router";
import { Plus, Search, X, Menu } from "lucide-react";
import type { SiteOutletContext } from "@/components/layout/SiteLayout";
import { getToolBySlug } from "@/config/tools";
import { PromptForm } from "@/components/prompt/PromptForm";
import { CaseCard } from "@/components/gallery/CaseCard";
import { CaseFilter } from "@/components/gallery/CaseFilter";
import { CaseDetail } from "@/components/gallery/CaseDetail";
import { fetchCases, fetchMeta } from "@/lib/api";
import type { CaseListItem, MetaData } from "@/types/case";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function ImageLibrary() {
  const { locale } = useOutletContext<SiteOutletContext>();
  const tool = getToolBySlug("image");
  const [tab, setTab] = useState<"generate" | "library" | "detail">("library");
  const [detailId, setDetailId] = useState<number | string | null>(null);
  const [meta, setMeta] = useState<MetaData | undefined>();
  const [items, setItems] = useState<CaseListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [tag, setTag] = useState("全部");
  const [funSubTag, setFunSubTag] = useState("全部");
  const [source, setSource] = useState("全部");
  const [promptStyle, setPromptStyle] = useState("全部");
  const [language, setLanguage] = useState("全部");
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    fetchMeta().then(setMeta).catch(() => undefined);
  }, []);

  useEffect(() => {
    if (tab !== "library") return;
    setLoading(true);
    fetchCases({
      q,
      tag: tag === "趣味配方" && funSubTag !== "全部" ? funSubTag : tag,
      tag_group: tag === "趣味配方" && funSubTag === "全部" ? "fun" : undefined,
      source,
      prompt_style: promptStyle,
      language_mode: language,
      limit: 1000,
    })
      .then((res) => setItems(res.items))
      .finally(() => setLoading(false));
  }, [tab, q, tag, funSubTag, source, promptStyle, language]);

  const openCase = (id: number | string) => {
    setDetailId(id);
    setTab("detail");
  };

  const headerStats = useMemo(() => {
    if (!meta) return null;
    return (
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <Badge variant="secondary">{meta.stats.cases} {locale === "zh" ? "案例" : "cases"}</Badge>
        <Badge variant="secondary">{meta.stats.images} {locale === "zh" ? "张图" : "images"}</Badge>
        <Badge variant="secondary">{meta.stats.tags} {locale === "zh" ? "标签" : "tags"}</Badge>
      </div>
    );
  }, [meta, locale]);

  if (!tool) return null;

  return (
    <div className="container mx-auto px-4 py-6 md:py-10">
      {/* Title */}
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
          <span className="text-4xl">{tool.icon}</span>
          {locale === "zh" ? "图像配方库" : "Image Prompt Library"}
        </h1>
        <p className="mt-2 text-muted-foreground max-w-3xl leading-relaxed">
          {locale === "zh"
            ? "346 条经过策展的 AI 图像提示词配方。浏览、搜索、用填空模板生成你自己的版本。"
            : "346 curated AI image prompt recipes. Browse, search, and generate your own with fill-in templates."}
        </p>
        {headerStats}
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
          <TabsTrigger value="library">{locale === "zh" ? "浏览配方" : "Browse"}</TabsTrigger>
          <TabsTrigger value="generate">{locale === "zh" ? "构造提示词" : "Generate"}</TabsTrigger>
        </TabsList>

        {/* === Library tab === */}
        <TabsContent value="library" className="space-y-4">
          <div className="grid lg:grid-cols-[260px_1fr] gap-6">
            {/* Filter sidebar */}
            <div className="hidden lg:block">
              <CaseFilter
                meta={meta}
                tag={tag}
                funSubTag={funSubTag}
                source={source}
                promptStyle={promptStyle}
                language={language}
                onChange={(patch) => {
                  if (patch.tag !== undefined) setTag(patch.tag);
                  if (patch.funSubTag !== undefined) setFunSubTag(patch.funSubTag);
                  if (patch.source !== undefined) setSource(patch.source);
                  if (patch.promptStyle !== undefined) setPromptStyle(patch.promptStyle);
                  if (patch.language !== undefined) setLanguage(patch.language);
                }}
              />
            </div>

            <div>
              {/* Search bar */}
              <div className="flex items-center gap-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder={locale === "zh" ? "搜索编号、标题、分类、标签..." : "Search id / title / category / tag..."}
                    className="pl-9 pr-9"
                  />
                  {q && (
                    <button onClick={() => setQ("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      <X size={16} />
                    </button>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="lg:hidden"
                  onClick={() => setDrawerOpen(true)}
                  aria-label="filter"
                >
                  <Menu size={18} />
                </Button>
              </div>

              {/* Active filters */}
              <ActiveFilters
                items={[tag, funSubTag, source, promptStyle, language].filter((x) => x && x !== "全部")}
                onClearAll={() => {
                  setTag("全部");
                  setFunSubTag("全部");
                  setSource("全部");
                  setPromptStyle("全部");
                  setLanguage("全部");
                }}
              />

              {/* Mobile filter drawer */}
              <div className="lg:hidden">
                <CaseFilter
                  meta={meta}
                  tag={tag}
                  funSubTag={funSubTag}
                  source={source}
                  promptStyle={promptStyle}
                  language={language}
                  open={drawerOpen}
                  onClose={() => setDrawerOpen(false)}
                  onChange={(patch) => {
                    if (patch.tag !== undefined) setTag(patch.tag);
                    if (patch.funSubTag !== undefined) setFunSubTag(patch.funSubTag);
                    if (patch.source !== undefined) setSource(patch.source);
                    if (patch.promptStyle !== undefined) setPromptStyle(patch.promptStyle);
                    if (patch.language !== undefined) setLanguage(patch.language);
                    setDrawerOpen(false);
                  }}
                />
              </div>

              {/* Grid */}
              {loading && items.length === 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="aspect-[4/5] bg-secondary rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : items.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground text-sm">
                  {locale === "zh" ? "没找到案例，换个关键词试试。" : "No cases found."}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                  {items.map((item) => (
                    <CaseCard key={String(item.id)} item={item} onOpen={openCase} />
                  ))}
                </div>
              )}

              <div className="mt-4 text-xs text-muted-foreground text-center">
                {loading ? (locale === "zh" ? "加载中..." : "Loading...") : locale === "zh" ? `共 ${items.length} 条结果` : `${items.length} results`}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* === Generator tab === */}
        <TabsContent value="generate">
          <PromptForm tool={tool} locale={locale} />
          <div className="mt-10 p-5 rounded-lg border border-border bg-secondary/40 text-sm text-muted-foreground">
            <Plus className="inline h-4 w-4 mr-1" />
            {locale === "zh"
              ? "想直接参考现有案例？切回「浏览配方」标签，挑一个改造。"
              : "Want to remix an existing case? Switch back to the Browse tab."}
          </div>
        </TabsContent>
      </Tabs>

      {/* Detail dialog-less full page */}
      {tab === "detail" && detailId != null && (
        <div className="fixed inset-0 z-40 bg-background overflow-y-auto" style={{ top: "64px" }}>
          <div className="container mx-auto px-4 py-6">
            <CaseDetail id={detailId} onBack={() => setTab("library")} />
          </div>
        </div>
      )}
    </div>
  );
}

function ActiveFilters({ items, onClearAll }: { items: string[]; onClearAll: () => void }) {
  if (items.length === 0) return null;
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="text-xs text-muted-foreground">当前筛选：</span>
      <div className="flex flex-wrap gap-1">
        {items.map((x) => (
          <Badge key={x} variant="secondary" className="text-xs">{x}</Badge>
        ))}
      </div>
      <button
        onClick={onClearAll}
        className={cn("text-xs text-primary hover:underline ml-2")}
      >
        清除全部
      </button>
    </div>
  );
}
