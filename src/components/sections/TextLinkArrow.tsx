import { useCursorHover } from '@/hooks/use-cursor-hover';

interface Props {
  label: string;
  href: string;
  muted?: boolean;
}

export function TextLinkArrow({ label, href, muted }: Props) {
  const hoverProps = useCursorHover();

  return (
    <a
      href={href}
      {...hoverProps}
      className={`group inline-flex items-center gap-1.5 text-sm font-sans font-medium transition-[color,transform] duration-material ${
        muted
          ? 'text-muted-foreground hover:text-foreground'
          : 'text-foreground hover:text-accent'
      }`}
    >
      {label}
      <span aria-hidden className="transition-transform duration-material group-hover:translate-x-1 group-hover:scale-110">→</span>
    </a>
  );
}
