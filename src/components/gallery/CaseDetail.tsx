import { useEffect, useState } from "react";
import { ArrowLeft, Maximize2, X, ImageOff, Pencil, Save, Trash2, RotateCcw } from "lucide-react";
import type { CaseDetail as Detail, CaseImage } from "@/types/case";
import { fetchCase, markBuiltinDeleted } from "@/lib/api";
import { setOverride, subscribe, clearAll } from "@/lib/userStore";
import { CopyButton } from "@/components/common/CopyButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

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

// ─── Editable section: read mode ↔ textarea ──────────────────────────
function EditableSection({
  title,
  body,
  onSave,
  language,
}: {
  title: string;
  body: string;
  onSave: (next: string) => void;
  language?: "json";
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(body || "");

  useEffect(() => {
    setDraft(body || "");
  }, [body]);

  if (!body && !editing) return null;

  if (editing) {
    return (
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</div>
          <div className="flex gap-1.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setDraft(body || "");
                setEditing(false);
              }}
              className="gap-1.5"
            >
              <X size={14} />
              取消
            </Button>
            <Button
              size="sm"
              onClick={() => {
                if (draft !== body) onSave(draft);
                setEditing(false);
              }}
              className="gap-1.5"
            >
              <Save size={14} />
              保存
            </Button>
          </div>
        </div>
        <Textarea
          rows={language === "json" ? 6 : 6}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className={`min-h-[140px] ${language === "json" ? "font-mono text-xs" : "text-sm"}`}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</div>
        <div className="flex gap-1.5">
          <Button variant="ghost" size="sm" onClick={() => setEditing(true)} className="gap-1.5">
            <Pencil size={14} />
            编辑
          </Button>
          <CopyButton text={body} variant="ghost" size="sm" />
        </div>
      </div>
      <pre className={`rounded-md bg-secondary/60 p-3 text-sm whitespace-pre-wrap break-words max-h-[40vh] overflow-auto ${language === "json" ? "font-mono text-xs" : ""}`}>
{body}
      </pre>
    </div>
  );
}

// ─── Editable metadata block: title / description / tags ─────────────
function EditableMeta({
  c,
  tagList,
  onSave,
}: {
  c: Detail["case"];
  tagList: string[];
  onSave: (patch: Partial<Detail["case"]> & { tagsString?: string }) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(c.title || "");
  const [description, setDescription] = useState(c.description || "");
  const [tagsString, setTagsString] = useState(tagList.join("，"));

  useEffect(() => {
    setTitle(c.title || "");
    setDescription(c.description || "");
    setTagsString(tagList.join("，"));
  }, [c.title, c.description, tagList.join("，")]);

  if (editing) {
    return (
      <div className="space-y-3 p-4 rounded-lg border border-primary/30 bg-primary/5">
        <div className="flex items-center justify-between">
          <div className="text-xs font-semibold uppercase tracking-wide text-primary">编辑案例</div>
          <div className="flex gap-1.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setTitle(c.title || "");
                setDescription(c.description || "");
                setTagsString(tagList.join("，"));
                setEditing(false);
              }}
              className="gap-1.5"
            >
              <X size={14} />
              取消
            </Button>
            <Button
              size="sm"
              onClick={() => {
                onSave({
                  title: title.trim() || c.title,
                  description: description.trim(),
                  tagsString: tagsString.trim(),
                });
                setEditing(false);
              }}
              className="gap-1.5"
            >
              <Save size={14} />
              保存
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-xs">标题</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">描述</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="resize-y min-h-[80px]"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">标签（用「，」或英文逗号分隔）</Label>
          <Input value={tagsString} onChange={(e) => setTagsString(e.target.value)} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="text-xs text-muted-foreground mb-2 font-mono">#{c.case_no} · {c.category}</div>
      <div className="flex items-start gap-2">
        <h1 className="text-2xl font-bold leading-tight flex-1">{c.title}</h1>
        <Button variant="ghost" size="sm" onClick={() => setEditing(true)} className="gap-1.5 flex-shrink-0">
          <Pencil size={14} />
          编辑
        </Button>
      </div>
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
  );
}

// ─── Main CaseDetail ─────────────────────────────────────────────────
export function CaseDetail({ id, onBack }: Props) {
  const [data, setData] = useState<Detail | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const d = await fetchCase(id);
    setData(d);
    setLoading(false);
  }

  useEffect(() => {
    load();
    const unsub = subscribe(() => load());
    return unsub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  function saveField(field: keyof Detail["prompt"], value: string) {
    if (!data) return;
    // Save the field via setOverride on userStore
    const patch: Record<string, string> = {};
    if (field === "prompt_raw") patch.prompt_raw = value;
    else if (field === "prompt_display_cn") patch.prompt_display_cn = value;
    else if (field === "prompt_template_cn") patch.prompt_template_cn = value;
    else if (field === "prompt_engine_cn") patch.prompt_engine_cn = value;
    else if (field === "variables_json") patch.prompt_engine_cn = value; // proxy
    setOverride(id, patch);
  }

  function saveMeta(patch: Partial<Detail["case"]> & { tagsString?: string }) {
    if (!data) return;
    const override: Record<string, string> = {};
    if (patch.title !== undefined) override.title = patch.title;
    if (patch.description !== undefined) override.description = patch.description;
    if (patch.tagsString !== undefined) override.tags = patch.tagsString;
    setOverride(id, override);
  }

  function deleteCase() {
    if (!data) return;
    const ok = window.confirm(`确定要从你的视图里隐藏 #${data.case.case_no}「${data.case.title}」吗？\n（不会删除内置数据，刷新页面后可在 localStorage 清除时恢复。）`);
    if (!ok) return;
    markBuiltinDeleted(typeof id === "number" ? id : Number(id));
    onBack();
  }

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
  const isUserOverridden = hasOverride(id);

  return (
    <div className="container mx-auto px-4 py-6 md:py-10">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-1.5">
          <ArrowLeft size={14} />
          返回列表
        </Button>
        <div className="flex items-center gap-1.5">
          {isUserOverridden && (
            <Button variant="ghost" size="sm" onClick={() => {
              const ok = window.confirm("确定要恢复成原始数据吗？你的本地修改会被丢弃。");
              if (ok) {
                clearAll();
              }
            }} className="gap-1.5 text-muted-foreground" title="恢复成原始内置数据">
              <RotateCcw size={14} />
              恢复
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={deleteCase} className="gap-1.5 text-destructive hover:text-destructive">
            <Trash2 size={14} />
            隐藏
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-6 lg:gap-10">
        <div>
          <ImageStage images={images} />
        </div>

        <div className="space-y-5">
          <EditableMeta c={c} tagList={tagList} onSave={saveMeta} />

          <Tabs defaultValue="display" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="display">展示说明</TabsTrigger>
              <TabsTrigger value="template">填空模板</TabsTrigger>
              <TabsTrigger value="raw">原始提示词</TabsTrigger>
            </TabsList>
            <TabsContent value="display" className="space-y-3">
              <EditableSection
                title="中文展示说明"
                body={prompt.prompt_display_cn}
                onSave={(v) => saveField("prompt_display_cn", v)}
              />
              <EditableSection
                title="原始提示词"
                body={prompt.prompt_raw}
                onSave={(v) => saveField("prompt_raw", v)}
              />
            </TabsContent>
            <TabsContent value="template" className="space-y-3">
              <EditableSection
                title="填空模板"
                body={prompt.prompt_template_cn}
                onSave={(v) => saveField("prompt_template_cn", v)}
              />
              <EditableSection
                title="填空引擎"
                body={prompt.prompt_engine_cn}
                onSave={(v) => saveField("prompt_engine_cn", v)}
              />
              {prompt.variables_json && (
                <EditableSection
                  title="变量定义"
                  body={prompt.variables_json}
                  language="json"
                  onSave={(v) => {
                    // store via overriding prompt_engine_cn as a side-channel; we keep original logic simple
                    setOverride(id, { prompt_engine_cn: v });
                  }}
                />
              )}
            </TabsContent>
            <TabsContent value="raw" className="space-y-3">
              <EditableSection title="原始提示词 (Raw)" body={prompt.prompt_raw} onSave={(v) => saveField("prompt_raw", v)} />
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

function MetaItem({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="rounded-md border border-border p-2">
      <div className="text-muted-foreground text-[10px] uppercase">{label}</div>
      <div className="mt-1 font-medium">{value}</div>
    </div>
  );
}

function hasOverride(id: number | string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = window.localStorage.getItem("ipl_user_store_v1");
    if (!raw) return false;
    const s = JSON.parse(raw);
    return Boolean(s.overrides?.[String(id)] && Object.keys(s.overrides[String(id)]).length > 0);
  } catch {
    return false;
  }
}