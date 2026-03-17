import { cn } from '@/lib/utils';
import { useInView } from '@/hooks/use-in-view';
import { useCursorHover } from '@/hooks/use-cursor-hover';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'dark';
  delay?: number;
}

export function EditorialCard({ children, className, variant = 'default', delay = 0 }: Props) {
  const [ref, isInView] = useInView({ threshold: 0.1 });
  const hoverProps = useCursorHover();

  return (
    <div
      ref={ref}
      {...hoverProps}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        'rounded-lg border p-6 md:p-8',
        'transition-[opacity,transform,border-color,box-shadow] duration-spatial ease-expo will-change-[opacity,transform]',
        'hover:translate-y-[-2px] hover:shadow-elevated',
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
        variant === 'default'
          ? 'bg-card/60 border-border/50 hover:border-border'
          : 'bg-foreground/[0.03] border-border/40 hover:border-border/70',
        className,
      )}
    >
      {children}
    </div>
  );
}
