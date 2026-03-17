import { useInView } from '@/hooks/use-in-view';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface Props {
  id?: string;
  children: ReactNode;
  className?: string;
}

export function SectionShell({ id, children, className }: Props) {
  const [ref, isInView] = useInView({ threshold: 0.08 });

  return (
    <section
      id={id}
      ref={ref}
      style={{ '--section-visible': isInView ? 1 : 0 } as React.CSSProperties}
      className={cn(
        'py-16 md:py-24 lg:py-32 transition-[opacity,transform] duration-page ease-expo',
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
        className,
      )}
    >
      <div className="mx-auto max-w-5xl px-6 md:px-8">{children}</div>
    </section>
  );
}
