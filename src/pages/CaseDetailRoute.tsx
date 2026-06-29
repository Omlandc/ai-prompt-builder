import { useParams, useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CaseDetail } from "@/components/gallery/CaseDetail";

export default function CaseDetailRoute() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const numericId = id ? Number(id) : NaN;
  if (!id || Number.isNaN(numericId)) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground">无效的案例 ID</p>
        <Button asChild className="mt-4">
          <a href="#/">返回首页</a>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="container mx-auto px-4 pt-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="gap-1.5"
        >
          <ArrowLeft size={14} />
          返回
        </Button>
      </div>
      <CaseDetail id={numericId} onBack={() => navigate("/#/tools/image")} />
    </div>
  );
}