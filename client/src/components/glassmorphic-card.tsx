import { cn } from "@/lib/utils";

interface GlassmorphicCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "blue";
}

export function GlassmorphicCard({ 
  children, 
  className, 
  variant = "default" 
}: GlassmorphicCardProps) {
  return (
    <div
      className={cn(
        "rounded-3xl p-8",
        variant === "default" ? "glass-effect" : "glass-effect-blue",
        className
      )}
    >
      {children}
    </div>
  );
}
