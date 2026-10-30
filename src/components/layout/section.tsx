import { cn } from "@/lib/utils";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  dark?: boolean;
}

export function Section({ children, className, id, dark }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "py-16 sm:py-24 bg-white",
        dark && "bg-[#f9f9f9] border-y border-[#e2e2e2]",
        className
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
}

export function SectionHeader({
  title,
  subtitle,
  badge,
  className,
  center = true,
}: {
  title: string;
  subtitle?: string;
  badge?: string;
  className?: string;
  center?: boolean;
}) {
  return (
    <div className={cn("mb-12", center && "text-center", className)}>
      {badge && (
        <span className="inline-block mb-3.5 rounded-full bg-[#3e6ae1]/10 border border-[#3e6ae1]/20 px-3.5 py-1 text-[11px] font-semibold text-[#3e6ae1] uppercase tracking-widest">
          {badge}
        </span>
      )}
      <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#171a20]">{title}</h2>
      {subtitle && (
        <p className="mt-4 text-base sm:text-lg text-[#5c5e62] max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
