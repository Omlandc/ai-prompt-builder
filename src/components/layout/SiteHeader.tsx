import { Link, NavLink } from "react-router";
import { useState } from "react";
import { ChevronDown, Menu, Sparkles } from "lucide-react";
import type { Locale } from "@/types/tool";
import { LOCALE_STORAGE_KEY, SITE_NAME, SITE_NAME_EN } from "@/config/site";
import { loc } from "@/lib/loc";
import { tools } from "@/config/tools";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type Props = {
  locale: Locale;
  onLocaleChange: (l: Locale) => void;
};

// 主导航：只放最常用的 5 个，把剩下的折叠进下拉
const PRIMARY_SLUGS = new Set(["image", "video", "article", "ppt", "prd"]);

export function SiteHeader({ locale, onLocaleChange }: Props) {
  const [open, setOpen] = useState(false);

  const switchLocale = () => {
    const next: Locale = locale === "zh" ? "en" : "zh";
    if (typeof window !== "undefined") {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, next);
    }
    onLocaleChange(next);
  };

  const primaryTools = tools.filter((t) => PRIMARY_SLUGS.has(t.slug));
  const moreTools = tools.filter((t) => !PRIMARY_SLUGS.has(t.slug));

  return (
    <header className="sticky top-0 z-50 bg-background/85 backdrop-blur-md border-b border-border">
      <div className="mx-auto flex h-14 sm:h-16 max-w-7xl items-center justify-between px-3 sm:px-4 md:px-6 gap-2">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 font-bold flex-shrink-0">
          <span className="grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-md bg-gradient-to-br from-blue-500 to-purple-500 text-white">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="h-4 w-4 sm:h-5 sm:w-5">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </span>
          <span className="hidden sm:inline text-base md:text-lg">{locale === "zh" ? SITE_NAME : SITE_NAME_EN}</span>
          <span className="sm:hidden text-base">{locale === "zh" ? "AI 提示词" : "AI Prompt"}</span>
        </Link>

        {/* Desktop nav (xl+) */}
        <nav className="hidden xl:flex items-center gap-0.5">
          <NavItem to="/" end>{locale === "zh" ? "首页" : "Home"}</NavItem>
          {primaryTools.map((t) => (
            <NavItem key={t.slug} to={`/tools/${t.slug}`}>
              {loc(t.title, locale)}
            </NavItem>
          ))}
          <MoreDropdown locale={locale} moreTools={moreTools} />
          <NavItem to="/about">{locale === "zh" ? "关于" : "About"}</NavItem>
        </nav>

        {/* Compact nav (md-xl) — fewer items */}
        <nav className="hidden md:flex xl:hidden items-center gap-0.5">
          <NavItem to="/" end>{locale === "zh" ? "首页" : "Home"}</NavItem>
          <NavItem to="/tools/image">{locale === "zh" ? "图像" : "Image"}</NavItem>
          <NavItem to="/tools/video">{locale === "zh" ? "视频" : "Video"}</NavItem>
          <NavItem to="/tools/article">{locale === "zh" ? "文章" : "Article"}</NavItem>
          <MoreDropdown locale={locale} moreTools={moreTools} compact />
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={switchLocale}
            className="text-xs sm:text-sm font-medium h-8 px-2"
            title="Switch language"
          >
            {locale === "zh" ? "EN" : "中文"}
          </Button>

          {/* Mobile sheet trigger */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden h-8 w-8" aria-label="menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 overflow-y-auto">
              <SheetTitle className="flex items-center gap-2 mb-4">
                <Sparkles className="h-4 w-4 text-primary" />
                {locale === "zh" ? "菜单" : "Menu"}
              </SheetTitle>
              <MobileMenu locale={locale} onClose={() => setOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

function NavItem({
  to,
  end,
  children,
}: {
  to: string;
  end?: boolean;
  children: React.ReactNode;
}) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          "px-2.5 py-1.5 text-sm rounded-md transition-colors whitespace-nowrap",
          isActive
            ? "bg-secondary text-secondary-foreground"
            : "text-muted-foreground hover:text-foreground hover:bg-secondary/60",
        )
      }
    >
      {children}
    </NavLink>
  );
}

function MoreDropdown({
  locale,
  moreTools,
  compact = false,
}: {
  locale: Locale;
  moreTools: typeof tools;
  compact?: boolean;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn("gap-1 text-sm font-normal h-8", compact && "px-2.5")}
        >
          {locale === "zh" ? "更多" : "More"}
          <ChevronDown className="h-3.5 w-3.5 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 max-h-[80vh] overflow-y-auto">
        <DropdownMenuLabel>{locale === "zh" ? "工具" : "Tools"}</DropdownMenuLabel>
        {moreTools.map((t) => (
          <DropdownMenuItem key={t.slug} asChild>
            <Link to={`/tools/${t.slug}`} className="cursor-pointer">
              <span className="mr-2 text-base">{t.icon}</span>
              {loc(t.title, locale)}
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuLabel>{locale === "zh" ? "关于" : "About"}</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link to="/about">{locale === "zh" ? "关于我们" : "About us"}</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/contact">{locale === "zh" ? "联系我们" : "Contact"}</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/privacy">{locale === "zh" ? "隐私政策" : "Privacy"}</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MobileMenu({ locale, onClose }: { locale: Locale; onClose: () => void }) {
  return (
    <nav className="flex flex-col gap-0.5">
      <MobileNavItem to="/" onClose={onClose}>
        {locale === "zh" ? "首页" : "Home"}
      </MobileNavItem>
      <MobileSectionTitle>{locale === "zh" ? "工具" : "Tools"}</MobileSectionTitle>
      {tools.map((t) => (
        <MobileNavItem key={t.slug} to={`/tools/${t.slug}`} onClose={onClose}>
          <span className="mr-2 text-base">{t.icon}</span>
          {loc(t.title, locale)}
        </MobileNavItem>
      ))}
      <MobileSectionTitle>{locale === "zh" ? "关于" : "About"}</MobileSectionTitle>
      <MobileNavItem to="/about" onClose={onClose}>
        {locale === "zh" ? "关于我们" : "About us"}
      </MobileNavItem>
      <MobileNavItem to="/contact" onClose={onClose}>
        {locale === "zh" ? "联系我们" : "Contact"}
      </MobileNavItem>
      <MobileNavItem to="/privacy" onClose={onClose}>
        {locale === "zh" ? "隐私政策" : "Privacy"}
      </MobileNavItem>
    </nav>
  );
}

function MobileNavItem({
  to,
  onClose,
  children,
}: {
  to: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <SheetClose asChild>
      <NavLink
        to={to}
        onClick={onClose}
        className={({ isActive }) =>
          cn(
            "flex items-center px-3 py-2 rounded-md text-sm",
            isActive
              ? "bg-secondary text-secondary-foreground"
              : "text-muted-foreground hover:bg-secondary/60",
          )
        }
      >
        {children}
      </NavLink>
    </SheetClose>
  );
}

function MobileSectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-3 mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
      {children}
    </div>
  );
}