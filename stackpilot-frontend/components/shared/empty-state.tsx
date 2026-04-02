import { Button } from "@/components/ui/button";
import { LordiconWrapper } from "@/components/shared/lordicon-wrapper";
import { animations } from "@/public/icons/lordicon";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon = animations.empty,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div 
      className={cn(
        "flex flex-col items-center justify-center py-16 px-4 text-center rounded-xl border border-dashed border-[#2a2a2a] bg-[#1a1a1a]/50 backdrop-blur-sm",
        className
      )}
    >
      <div className="mb-6 p-4 rounded-full bg-[#0d0d0d] shadow-[0_0_20px_rgba(245,200,66,0.1)]">
        <LordiconWrapper
          icon={icon}
          size={80}
          color="#f5c842"
          state="loop"
        />
      </div>
      <h3 className="text-2xl font-bold mb-2" style={{ color: "#f5f0e8", fontFamily: "'Playfair Display', serif" }}>
        {title}
      </h3>
      <p className="text-[#a0a0a0] max-w-md mb-8">
        {description}
      </p>
      
      {(actionLabel && (actionHref || onAction)) && (
        actionHref ? (
          <Link href={actionHref}>
            <Button className="bg-[#f5c842] text-[#0d0d0d] hover:bg-[#d4a832] font-semibold h-11 px-8 rounded-full transition-all duration-300 shadow-[0_4px_15px_rgba(245,200,66,0.2)]">
              {actionLabel}
            </Button>
          </Link>
        ) : (
          <Button 
            onClick={onAction}
            className="bg-[#f5c842] text-[#0d0d0d] hover:bg-[#d4a832] font-semibold h-11 px-8 rounded-full transition-all duration-300 shadow-[0_4px_15px_rgba(245,200,66,0.2)]"
          >
            {actionLabel}
          </Button>
        )
      )}
    </div>
  );
}
