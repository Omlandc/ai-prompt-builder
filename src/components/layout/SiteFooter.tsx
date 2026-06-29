import { Link } from "react-router";
import type { Locale } from "@/types/tool";
import { SITE_NAME, SITE_NAME_EN } from "@/config/site";

export function SiteFooter({ locale }: { locale: Locale }) {
  return (
    <footer className="border-t border-border bg-background/60 mt-16">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-10">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 font-bold text-base mb-3">
              <span className="grid h-7 w-7 place-items-center rounded-md bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xs">
                AI
              </span>
              <span>{locale === "zh" ? SITE_NAME : SITE_NAME_EN}</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {locale === "zh"
                ? "13 款 AI 提示词工具 + 346 条图像配方，一站搞定。"
                : "13 AI prompt tools + 346 image recipes, all in one place."}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3">{locale === "zh" ? "工具" : "Tools"}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/tools/image" className="hover:text-foreground">{locale === "zh" ? "画图片" : "Image"}</Link></li>
              <li><Link to="/tools/video" className="hover:text-foreground">{locale === "zh" ? "视频脚本" : "Video"}</Link></li>
              <li><Link to="/tools/article" className="hover:text-foreground">{locale === "zh" ? "写文章" : "Article"}</Link></li>
              <li><Link to="/tools/ppt" className="hover:text-foreground">{locale === "zh" ? "PPT" : "PPT"}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3">{locale === "zh" ? "更多" : "More"}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/tools/skill" className="hover:text-foreground">{locale === "zh" ? "技能" : "Skill"}</Link></li>
              <li><Link to="/tools/prd" className="hover:text-foreground">PRD</Link></li>
              <li><Link to="/tools/resume" className="hover:text-foreground">{locale === "zh" ? "简历" : "Resume"}</Link></li>
              <li><Link to="/tools/business" className="hover:text-foreground">{locale === "zh" ? "商业书" : "Business"}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3">{locale === "zh" ? "关于" : "About"}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-foreground">{locale === "zh" ? "关于我们" : "About us"}</Link></li>
              <li><Link to="/contact" className="hover:text-foreground">{locale === "zh" ? "联系我们" : "Contact"}</Link></li>
              <li><Link to="/privacy" className="hover:text-foreground">{locale === "zh" ? "隐私政策" : "Privacy"}</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {locale === "zh" ? SITE_NAME : SITE_NAME_EN}. {locale === "zh" ? "保留所有权利。" : "All rights reserved."}
          </p>
          <p className="text-xs text-muted-foreground">
            {locale === "zh" ? "由 React + Vite + shadcn/ui 驱动" : "Powered by React + Vite + shadcn/ui"}
          </p>
        </div>
      </div>
    </footer>
  );
}
