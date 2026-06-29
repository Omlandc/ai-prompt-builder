import { useOutletContext } from "react-router";
import type { SiteOutletContext } from "@/components/layout/SiteLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, MessageSquare, Github } from "lucide-react";

export default function Contact() {
  const { locale } = useOutletContext<SiteOutletContext>();

  return (
    <div className="container mx-auto px-4 py-12 md:py-16 max-w-3xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-4">{locale === "zh" ? "联系我们" : "Contact us"}</h1>
      <p className="text-muted-foreground mb-10 leading-relaxed">
        {locale === "zh"
          ? "对我们的工具有任何建议、想贡献配方、或发现 Bug？通过下面的方式联系我们。"
          : "Have a feature request, want to contribute recipes, or found a bug? Reach us through any of these channels."}
      </p>

      <div className="grid md:grid-cols-2 gap-4">
        <ContactCard
          icon={<Github className="h-5 w-5" />}
          title={locale === "zh" ? "GitHub" : "GitHub"}
          subtitle="ai-prompt-builder"
          href="https://github.com/Omlandc/ai-prompt-builder"
        />
        <ContactCard
          icon={<MessageSquare className="h-5 w-5" />}
          title={locale === "zh" ? "功能请求与反馈" : "Feature requests & feedback"}
          subtitle={locale === "zh" ? "欢迎在 GitHub Issues 中提建议" : "Open a GitHub issue"}
          href="https://github.com/Omlandc/ai-prompt-builder/issues"
        />
        <ContactCard
          icon={<Mail className="h-5 w-5" />}
          title={locale === "zh" ? "邮件" : "Email"}
          subtitle={locale === "zh" ? "详细合作请发邮件" : "For collaboration, drop a line"}
          href="#"
        />
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm font-semibold mb-1">{locale === "zh" ? "响应时间" : "Response time"}</div>
            <div className="text-xs text-muted-foreground leading-relaxed">
              {locale === "zh" ? "通常 1-3 个工作日内回复。Bug 报告优先。功能建议欢迎附上使用场景。" : "We typically reply within 1-3 business days. Bug reports get priority."}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ContactCard({
  icon,
  title,
  subtitle,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  href?: string;
}) {
  const content = (
    <Card className="h-full hover:border-primary/50 hover:shadow transition-all">
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 grid place-items-center rounded-lg bg-secondary text-foreground">{icon}</div>
          <div className="min-w-0">
            <div className="text-sm font-semibold mb-1">{title}</div>
            <div className="text-xs text-muted-foreground break-all">{subtitle}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block">
        {content}
      </a>
    );
  }
  return content;
}
