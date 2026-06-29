import { useMemo, useState } from "react";
import type { Locale, ToolDefinition, ToolField } from "@/types/tool";
import { loc, locColumnLabel, locFieldHint, locFieldLabel, locFieldPlaceholder, locOptionLabel, type Localized } from "@/lib/loc";
import { Input } from "@/components/ui/input";
import { ClipboardList, Wand2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CopyButton } from "@/components/common/CopyButton";
import { cn } from "@/lib/utils";

type Props = {
  tool: ToolDefinition;
  locale: Locale;
};

type Values = Record<string, string | string[]>;

function defaultValueFor(field: ToolField): string | string[] {
  switch (field.type) {
    case "checkbox":
      return [];
    case "select":
    case "radio":
      return field.default ?? (field.options[0]?.value ?? "");
    case "number":
      return String(field.default ?? 0);
    default:
      return (field as { default?: string }).default ?? "";
  }
}

export function PromptForm({ tool, locale }: Props) {
  const initialValues = useMemo<Values>(() => {
    const out: Values = {};
    for (const f of tool.fields) {
      out[f.name] = defaultValueFor(f);
    }
    return out;
  }, [tool]);

  const [values, setValues] = useState<Values>(initialValues);

  const prompt = useMemo(() => tool.template(values), [values, tool]);

  function setField(name: string, v: string | string[]) {
    setValues((prev) => ({ ...prev, [name]: v }));
  }

  function fillExample() {
    const ex: Values = {};
    for (const f of tool.fields) {
      switch (f.type) {
        case "select":
        case "radio":
          ex[f.name] = f.options[0]?.value ?? "";
          break;
        case "checkbox":
          ex[f.name] = f.options.slice(0, 2).map((o) => o.value);
          break;
        case "number":
          ex[f.name] = String(f.default ?? 1);
          break;
        default:
          {
            const tf = f as { placeholder?: Localized };
            ex[f.name] = tf.placeholder
              ? `[${loc(locFieldLabel(f as ToolField, locale), locale)}]`
              : "";
          }
      }
    }
    setValues(ex);
  }

  return (
    <div className="grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] gap-6">
      {/* Form */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <tool.icon className="h-7 w-7" />
            {loc(tool.title, locale)}
          </h2>
          <Button variant="ghost" size="sm" onClick={fillExample} type="button" className="text-muted-foreground gap-1.5">
            <Wand2 className="h-4 w-4" />
            填入示例
          </Button>
        </div>

        <div className="rounded-lg border border-border bg-card p-5 space-y-5">
          {tool.fields.map((field) => (
            <FieldRow
              key={field.name}
              field={field}
              value={values[field.name] ?? defaultValueFor(field)}
              onChange={(v) => setField(field.name, v)}
              locale={locale}
            />
          ))}
        </div>
      </section>

      {/* Preview */}
      <section className="space-y-3 lg:sticky lg:top-20 lg:self-start">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              <span>{locale === "zh" ? "提示词预览" : "Preview"}</span>
              <Badge variant="secondary" className="text-xs">
                {locale === "zh" ? "实时更新" : "live"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {locale === "zh" ? "可直接复制粘贴到任意 AI 模型使用" : "Copy & paste to any AI model"}
            </p>
          </div>
          <CopyButton text={prompt} label={locale === "zh" ? "一键复制" : "Copy"} />
        </div>
        <pre className="rounded-lg border border-border bg-secondary/40 p-4 text-sm leading-relaxed whitespace-pre-wrap break-words max-h-[68vh] overflow-auto">
{prompt}
        </pre>
      </section>
    </div>
  );
}

type FieldRowProps = {
  field: ToolField;
  value: string | string[];
  onChange: (v: string | string[]) => void;
  locale: Locale;
};

function FieldRow({ field, value, onChange, locale }: FieldRowProps) {
  const label = locFieldLabel(field, locale);
  const placeholder = locFieldPlaceholder(field as any, locale);
  const hint = locFieldHint(field as any, locale);

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium flex items-center gap-2">
        <span>{label}</span>
        {(field.type === "select" || field.type === "radio") && (
          <Badge variant="outline" className="text-[10px] uppercase">
            {field.type}
          </Badge>
        )}
      </Label>

      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}

      {field.type === "text" && (
        <Input
          value={String(value)}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {field.type === "number" && (
        <Input
          type="number"
          min={field.min}
          max={field.max}
          value={String(value)}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {field.type === "textarea" && (
        <Textarea
          rows={field.rows || 4}
          value={String(value)}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="resize-y min-h-[80px]"
        />
      )}

      {field.type === "select" && (
        <Select value={String(value)} onValueChange={(v) => onChange(v)}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {field.options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {locOptionLabel(opt, locale)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {field.type === "radio" && (
        <RadioGroup value={String(value)} onValueChange={(v) => onChange(v)} className="flex flex-wrap gap-2 pt-1">
          {field.options.map((opt) => (
            <label
              key={opt.value}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-md border cursor-pointer hover:bg-secondary/60 text-sm",
                String(value) === opt.value
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border text-muted-foreground",
              )}
            >
              <RadioGroupItem value={opt.value} />
              {locOptionLabel(opt, locale)}
            </label>
          ))}
        </RadioGroup>
      )}

      {field.type === "checkbox" && (
        <div className="flex flex-wrap gap-2">
          {field.options.map((opt) => {
            const arr = Array.isArray(value) ? value : [];
            const checked = arr.includes(opt.value);
            return (
              <label
                key={opt.value}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md border cursor-pointer hover:bg-secondary/60 text-sm",
                  checked ? "border-primary bg-primary/10 text-foreground" : "border-border text-muted-foreground",
                )}
              >
                <Checkbox
                  checked={checked}
                  onCheckedChange={(c) => {
                    const next = c ? Array.from(new Set([...arr, opt.value])) : arr.filter((x) => x !== opt.value);
                    onChange(next);
                  }}
                />
                {locOptionLabel(opt, locale)}
              </label>
            );
          })}
        </div>
      )}

      {field.type === "table" && (
        <Textarea
          rows={field.columns.length + 2}
          value={String(value)}
          placeholder={`${locale === "zh" ? "每行一条，格式" : "One per line, format"}：${field.columns.map((c) => locColumnLabel(c, locale)).join(" | ")}\n${field.columns.map((c) => locColumnLabel(c, locale)).map((_, i) => `示例 ${i + 1}`).join(" | ")}`}
          onChange={(e) => onChange(e.target.value)}
          className="resize-y min-h-[100px] font-mono text-xs"
        />
      )}
    </div>
  );
}
