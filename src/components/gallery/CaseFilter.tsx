import type { MetaData } from "@/types/case";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

type Props = {
  meta?: MetaData;
  tag: string;
  funSubTag: string;
  promptStyle: string;
  language: string;
  open?: boolean;
  onClose?: () => void;
  onChange: (patch: Partial<{ tag: string; funSubTag: string; promptStyle: string; language: string }>) => void;
};

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</div>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function OptionButton({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-2.5 py-1.5 text-xs rounded-md border transition-colors",
        active
          ? "border-primary bg-primary/10 text-foreground"
          : "border-border text-muted-foreground hover:text-foreground hover:bg-secondary/60",
      )}
    >
      {children}
    </button>
  );
}

export function CaseFilter({ meta, tag, funSubTag, promptStyle, language, open, onClose, onChange }: Props) {
  const tags = [{ name: "全部", count: meta?.stats.cases || 0 }, ...((meta?.tags || []).filter((x) => /[\u3400-\u9fff]/.test(x.name)))];
  const funSubTags = meta?.funSubTags || [];
  const styles = [{ name: "全部", count: meta?.stats.cases || 0 }, ...(meta?.promptStyles || [])];
  const languages = [{ name: "全部", count: meta?.stats.cases || 0 }, ...(meta?.languages || [])];

  return (
    <>
      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/60 lg:hidden transition-opacity",
          open ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={onClose}
      />
      <aside
        className={cn(
          "fixed lg:sticky lg:top-20 top-0 right-0 lg:right-auto z-50 lg:z-0",
          "h-screen lg:h-auto w-72 lg:w-64",
          "bg-background lg:bg-card border-l lg:border lg:rounded-lg lg:border-border",
          "p-5 lg:p-4 overflow-y-auto transition-transform",
          "lg:translate-x-0",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between mb-4 lg:mb-3">
          <div className="text-sm font-semibold">筛选条件</div>
          {onClose && (
            <button onClick={onClose} className="lg:hidden p-1.5 rounded hover:bg-secondary" aria-label="close">
              <X size={16} />
            </button>
          )}
        </div>

        <div className="space-y-5">
          <FilterGroup title="主分类">
            {tags.map((t) => (
              <OptionButton key={t.name} active={tag === t.name} onClick={() => onChange({ tag: t.name, funSubTag: "全部" })}>
                {t.name} <span className="opacity-60">({t.count})</span>
              </OptionButton>
            ))}
          </FilterGroup>

          {tag === "趣味配方" && funSubTags.length > 0 && (
            <FilterGroup title="趣味子标签">
              <OptionButton active={funSubTag === "全部"} onClick={() => onChange({ funSubTag: "全部" })}>
                全部
              </OptionButton>
              {funSubTags.slice(0, 30).map((t) => (
                <OptionButton key={t.name} active={funSubTag === t.name} onClick={() => onChange({ funSubTag: t.name })}>
                  {t.name}
                </OptionButton>
              ))}
            </FilterGroup>
          )}

          <FilterGroup title="提示词风格">
            {styles.map((s) => (
              <OptionButton key={s.name} active={promptStyle === s.name} onClick={() => onChange({ promptStyle: s.name })}>
                {s.name}
              </OptionButton>
            ))}
          </FilterGroup>

          <FilterGroup title="语言">
            {languages.map((l) => (
              <OptionButton key={l.name} active={language === l.name} onClick={() => onChange({ language: l.name })}>
                {l.name}
              </OptionButton>
            ))}
          </FilterGroup>
        </div>
      </aside>
    </>
  );
}
