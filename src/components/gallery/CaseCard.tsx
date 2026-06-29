import { ImageOff } from "lucide-react";
import type { CaseListItem } from "@/types/case";

type Props = {
  item: CaseListItem;
  onOpen: (id: number | string) => void;
};

export function CaseCard({ item, onOpen }: Props) {
  return (
    <button
      onClick={() => onOpen(item.id)}
      title={item.title}
      className="group text-left bg-card rounded-lg overflow-hidden border border-border hover:border-primary/50 hover:shadow-lg transition-all"
    >
      <div className="aspect-[4/5] bg-secondary relative overflow-hidden">
        {(item.thumb_path || item.image_path) ? (
          <img
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            src={item.thumb_path || item.image_path || ""}
            alt={item.title}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full grid place-items-center text-muted-foreground">
            <ImageOff size={28} />
          </div>
        )}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between gap-2">
          <span className="px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-mono">
            #{item.case_no}
          </span>
          {item.image_count > 1 && (
            <span className="px-2 py-0.5 rounded bg-black/60 text-white text-[10px]">
              {item.image_count} 图
            </span>
          )}
        </div>
      </div>
      <div className="p-3 space-y-1.5">
        <div className="text-sm font-medium line-clamp-2 min-h-[2.6em]">{item.title}</div>
        <div className="text-xs text-muted-foreground line-clamp-1">{item.category}</div>
        <div className="flex flex-wrap gap-1 pt-1">
          {(item.tags || item.category || "").split("，").slice(0, 2).filter(Boolean).map((tag) => (
            <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
}
