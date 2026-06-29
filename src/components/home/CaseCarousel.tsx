import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type { CaseListItem } from "@/types/case";
import { fetchCases, fetchMeta } from "@/lib/api";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  locale: "zh" | "en";
};

// 跑马灯式无限轮播。
// 拉一批精选 case，复制一遍成双倍长度，CSS 动画 translateX(0 → -50%)，到末尾瞬间跳回起点。
// hover 时暂停动画，让用户能看清某张图。
export function CaseCarousel({ locale }: Props) {
  const navigate = useNavigate();
  const [cases, setCases] = useState<CaseListItem[]>([]);
  const [stats, setStats] = useState<{ cases: number; images: number; tags: number } | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [meta, list] = await Promise.all([fetchMeta(), fetchCases({ limit: 60 })]);
        if (!mounted) return;
        setStats({
          cases: meta?.stats?.cases || list.total,
          images: meta?.stats?.images || 0,
          tags: meta?.stats?.tags || 0,
        });
        // 优先挑选有图片的，凑 40 张；不足则用全部
        const withImg = list.items.filter((c) => c.image_path || c.thumb_path);
        const picked = (withImg.length >= 40 ? withImg : list.items).slice(0, 40);
        setCases(picked);
      } catch {
        // 静默失败：轮播只是装饰，主页不该因它挂掉
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (cases.length === 0) {
    // 还没拉到数据 — 显示一个占位
    return (
      <div className="relative mt-12">
        <CarouselHeader locale={locale} stats={null} />
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-44 aspect-[4/5] rounded-lg bg-secondary animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative mt-12 group">
      <CarouselHeader locale={locale} stats={stats} />

      <div
        className={cn(
          "relative overflow-hidden",
          // 边缘渐隐，告诉用户可以横向滚动
          "before:absolute before:inset-y-0 before:left-0 before:w-12 before:z-10 before:bg-gradient-to-r before:from-background before:to-transparent before:pointer-events-none",
          "after:absolute after:inset-y-0 after:right-0 after:w-12 after:z-10 after:bg-gradient-to-l after:from-background after:to-transparent after:pointer-events-none",
        )}
      >
        <div
          className="flex gap-3 w-max py-2 animate-marquee group-hover:[animation-play-state:paused]"
          // 关键：宽度为内容的两倍，动画从 0 平移 -50%，到末尾时整体回 0，
          // 由于两半内容相同，所以视觉上无限连续。
        >
          {[...cases, ...cases].map((item, i) => (
            <CarouselCard
              key={`${item.id}-${i}`}
              item={item}
              onClick={() => navigate(`/case/${item.id}`)}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 60s linear infinite;
        }
        @media (max-width: 768px) {
          .animate-marquee {
            animation-duration: 40s;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-marquee { animation: none; }
        }
      `}</style>
    </div>
  );
}

function CarouselHeader({
  locale,
  stats,
}: {
  locale: "zh" | "en";
  stats: { cases: number; images: number; tags: number } | null;
}) {
  return (
    <div className="flex items-end justify-between mb-5">
      <div>
        <h2 className="text-2xl font-bold">
          {locale === "zh" ? "案例精选" : "Featured cases"}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {stats
            ? locale === "zh"
              ? `已策展 ${stats.cases} 条图像提示词配方 · 涵盖 ${stats.tags} 个标签`
              : `${stats.cases} curated image prompt recipes · ${stats.tags} tags`
            : locale === "zh"
              ? "正在加载案例…"
              : "Loading cases…"}
        </p>
      </div>
    </div>
  );
}

function CarouselCard({ item, onClick }: { item: CaseListItem; onClick: () => void }) {
  const src = item.thumb_path || item.image_path;
  return (
    <button
      onClick={onClick}
      title={item.title}
      className="group/card flex-shrink-0 w-44 sm:w-48 bg-card rounded-lg overflow-hidden border border-border hover:border-primary/60 hover:shadow-lg transition-all text-left"
    >
      <div className="relative aspect-[4/5] bg-secondary overflow-hidden">
        {src ? (
          <img
            src={src}
            alt={item.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full grid place-items-center text-muted-foreground">
            <ImageOff size={24} />
          </div>
        )}
        <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/65 text-white text-[10px] font-mono">
          #{item.case_no}
        </span>
      </div>
      <div className="p-2.5">
        <div className="text-xs font-medium line-clamp-2 leading-snug min-h-[2.4em]">
          {item.title}
        </div>
        {item.category && (
          <div className="text-[10px] text-muted-foreground mt-1 line-clamp-1">
            {item.category}
          </div>
        )}
      </div>
    </button>
  );
}