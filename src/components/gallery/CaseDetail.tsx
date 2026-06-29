import { useEffect, useState } from "react";
import { ArrowLeft, Maximize2, X, ImageOff } from "lucide-react";
import type { CaseDetail as Detail, CaseImage } from "@/types/case";
import { fetchCase } from "@/lib/api";
import { CopyButton } from "@/components/common/CopyButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Props = { id: number | string; onBack: () => void };

function ImageStage({ images }: { images: CaseImage[] }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const image = images[active];
  if (!image) {
    return (
      <div className="aspect-square rounded-lg border border-dashed border-border grid place-items-center text-muted-foreground">
        <div className="flex flex-col items-center gap-2">
          <ImageOff className="h-10 w-10" />
          <div>暂无图片</div>
        </div>
      </div>
    );
  }
  return (
    <div>
      <div className="flex items-center justify-between mb-2 text-xs text-muted-foreground">
        <span>主图{images.length > 1 ? ` · 共 ${images.length} 张` : ""}</span>
        <Button variant="ghost" size="sm" onClick={() => setLightbox(true)} className="gap-1.5">
          <Maximize2 size={14} />
          查看大图
        </Button>
      </div>
      <div className="rounded-lg overflow-hidden bg-secondary border border-border">
        <img
          src={image.file_path}
          alt={image.filename}
          className="w-full h-auto object-contain max-h-[70vh] cursor-zoom-in"
          onClick={() => setLightbox(true)}
        />
      </div>
      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((img, idx) => (
            <button
              key={img.id}
              className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 ${
                idx === active ? "border-primary" : "border-transparent"
              }`}
              onClick={() => setActive(idx)}
            >
              <img src={img.thumb_path || img.file_path} alt={img.filename} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/90 grid place-items-center p-4 cursor-zoom-out" onClick={() => setLightbox(false)}>
          <button className="absolute top-4 right-4 p-2 rounded bg-white/10 hover:bg-white/20 text-white" onClick={(e) => { e.stopPropagation(); setLightbox(false); }}>
            <X size={20} />
          </button>
          <img src={image.file_path} alt={image.filename} className="max-w-full max-h-full object-contain" />
        </div>
      )}
    </div>
  );
}

export function CaseDetail({ id, onBack }: Props) {
  const [data, setData] = useState<Detail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchCase(id).then((d) => {
      if (!mounted) return;
      setData(d);
      setLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-secondary rounded w-1/3" />
          <div className="aspect-square bg-secondary rounded-lg" />
          <div className="h-4 bg-secondary rounded w-2/3" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-muted-foreground">案例未找到</p>
        <Button variant="link" onClick={onBack} className="mt-4 gap-1.5">
          <ArrowLeft size={14} />
          返回列表
        </Button>
      </div>
    );
  }

  const { case: c, images, prompt, tags } = data;
  const tagList = (tags || []).map((t) => t.name);

  return (
    <div className="container mx-auto px-4 py-6 md:py-10">
      <Button variant="ghost" size="sm" onClick={onBack} className="gap-1.5 mb-4">
        <ArrowLeft size={14} />
        返回列表
      </Button>

      <div className="grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-6 lg:gap-10">
        {/* Left: image */}
        <div>
          <ImageStage images={images} />
        </div>

        {/* Right: info + prompts */}
        <div className="space-y-5">
          <div>
            <div className="text-xs text-muted-foreground mb-2 font-mono">#{c.case_no} · {c.category}</div>
            <h1 className="text-2xl font-bold leading-tight">{c.title}</h1>
            {c.description && (
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{c.description}</p>
            )}
            {tagList.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {tagList.map((t) => (
                  <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                ))}
              </div>
            )}
          </div>

          <Tabs defaultValue="display" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="display">展示说明</TabsTrigger>
              <TabsTrigger value="template">填空模板</TabsTrigger>
              <TabsTrigger value="raw">原始提示词</TabsTrigger>
            </TabsList>
            <TabsContent value="display" className="space-y-3">
              <Section
                title="中文展示说明"
                body={prompt.prompt_display_cn}
              />
              <Section
                title="原始提示词"
                body={prompt.prompt_raw}
              />
            </TabsContent>
            <TabsContent value="template" className="space-y-3">
              <Section
                title="填空模板"
                body={prompt.prompt_template_cn}
              />
              {prompt.variables_json && (
                <Section
                  title="变量定义"
                  body={prompt.variables_json}
                  language="json"
                />
              )}
            </TabsContent>
            <TabsContent value="raw" className="space-y-3">
              <Section title="原始提示词 (Raw)" body={prompt.prompt_raw} />
              <div className="grid grid-cols-2 gap-3 text-xs">
                <MetaItem label="语言模式" value={prompt.language_mode} />
                <MetaItem label="提示词风格" value={prompt.prompt_style} />
                <MetaItem label="改写状态" value={prompt.rewrite_status} />
                <MetaItem label="版本" value={prompt.version_name} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function Section({ title, body, language }: { title: string; body: string; language?: "json" }) {
  if (!body) return null;
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</div>
        <CopyButton text={body} variant="ghost" size="sm" />
      </div>
      <pre className={`rounded-md bg-secondary/60 p-3 text-sm whitespace-pre-wrap break-words max-h-[40vh] overflow-auto ${language === "json" ? "font-mono text-xs" : ""}`}>
{body}
      </pre>
    </div>
  );
}

function MetaItem({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="rounded-md border border-border p-2">
      <div className="text-muted-foreground text-[10px] uppercase">{label}</div>
      <div className="mt-1 font-medium">{value}</div>
    </div>
  );
}
