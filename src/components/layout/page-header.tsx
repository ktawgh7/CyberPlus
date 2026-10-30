import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: string;
  className?: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, description, badge, className, children }: PageHeaderProps) {
  return (
    <div className={cn("pt-28 pb-14 sm:pt-36 sm:pb-18 relative overflow-hidden bg-white border-b border-[#e2e2e2]", className)}>
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid opacity-40 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#3e6ae1]/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        {badge && (
          <span className="inline-block mb-3.5 rounded-full bg-[#3e6ae1]/10 border border-[#3e6ae1]/20 px-3.5 py-1 text-[11px] font-semibold text-[#3e6ae1] uppercase tracking-widest">
            {badge}
          </span>
        )}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#171a20]">
          {title}
        </h1>
        {description && (
          <p className="mt-4 text-base sm:text-lg text-[#5c5e62] max-w-3xl mx-auto leading-relaxed">
            {description}
          </p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </div>
  );
}
