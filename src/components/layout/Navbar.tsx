import { useState, useCallback, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useExperience } from '@/components/experience/ExperienceProvider';
import { useCursorHover } from '@/hooks/use-cursor-hover';

const NAV_LINKS = [
  { num: '01', label: 'Cases', echo: 'Selected Work', href: '#cases' },
  { num: '02', label: 'Work', echo: 'Technical', href: '#technical-work' },
  { num: '03', label: 'Strengths', echo: 'Core Skills', href: '#strengths' },
  { num: '04', label: 'Contact', echo: 'Get in Touch', href: '#contact' },
];

const FOCUS_RING = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';

function NavLink({
  num,
  label,
  echo,
  href,
  onClick,
}: {
  num: string;
  label: string;
  echo: string;
  href: string;
  onClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
}) {
  const cursorHover = useCursorHover();

  return (
    <a
      href={href}
      onClick={(e) => onClick(e, href)}
      className={`group relative flex items-center gap-2 py-2 rounded-sm ${FOCUS_RING}`}
      {...cursorHover}
    >
      <span className="text-[10px] font-sans text-muted-foreground/50 tabular-nums transition-colors duration-material group-hover:text-accent">
        {num}
      </span>
      <span className="text-xs tracking-nav uppercase font-sans text-muted-foreground transition-colors duration-material group-hover:text-foreground">
        {label}
      </span>
      {/* Serif italic echo — fades in on hover */}
      <span className="absolute left-full ml-2 text-[11px] font-serif italic text-accent/0 transition-all duration-spatial ease-expo group-hover:text-accent/70 group-hover:translate-x-0 translate-x-[-4px] whitespace-nowrap pointer-events-none">
        {echo}
      </span>
    </a>
  );
}

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { entered, scrollTo } = useExperience();
  const cursorHover = useCursorHover();
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // Focus trap + Escape for mobile menu
  useEffect(() => {
    if (!menuOpen) return;

    // Focus first link on open
    const menu = menuRef.current;
    if (menu) {
      const firstLink = menu.querySelector<HTMLElement>('a[tabindex="0"]');
      firstLink?.focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        hamburgerRef.current?.focus();
        return;
      }
      if (e.key !== 'Tab' || !menu) return;

      const focusable = menu.querySelectorAll<HTMLElement>('a[tabindex="0"]');
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  const handleAnchorClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      if (href.startsWith('#')) {
        e.preventDefault();
        scrollTo(href, { offset: -48 });
        setMenuOpen(false);
      }
    },
    [scrollTo],
  );

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-background/80 transition-all duration-spatial ease-expo"
        style={{
          opacity: entered ? 1 : 0,
          transform: entered ? 'translateY(0)' : 'translateY(-12px)',
        }}
      >
        {/* Subtle bottom fade instead of hard border */}
        <div
          className="absolute inset-x-0 bottom-0 h-px"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, hsl(var(--border) / 0.3) 20%, hsl(var(--border) / 0.3) 80%, transparent 100%)',
          }}
        />

        <div className="mx-auto max-w-5xl px-6 md:px-8 flex items-center justify-between h-12">
          {/* Brand mark */}
          <a
            href="/"
            className={`text-lg font-serif text-foreground hover:text-accent transition-colors duration-material rounded-sm ${FOCUS_RING}`}
            {...cursorHover}
          >
            G
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.label} {...link} onClick={handleAnchorClick} />
            ))}

            {/* Theme toggle inline */}
            <ThemeToggle />
          </div>

          {/* Mobile: theme toggle + hamburger */}
          <div className="flex md:hidden items-center gap-1">
            <ThemeToggle />
            <button
              ref={hamburgerRef}
              onClick={() => setMenuOpen((v) => !v)}
              className={`inline-flex items-center justify-center w-10 h-10 text-muted-foreground hover:text-foreground transition-colors duration-material rounded-sm ${FOCUS_RING}`}
              aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              {...cursorHover}
            >
              <div className="relative w-5 h-5">
                <Menu
                  size={20}
                  className="absolute inset-0 transition-all duration-material"
                  style={{
                    opacity: menuOpen ? 0 : 1,
                    transform: menuOpen ? 'rotate(90deg) scale(0.8)' : 'rotate(0) scale(1)',
                  }}
                />
                <X
                  size={20}
                  className="absolute inset-0 transition-all duration-material"
                  style={{
                    opacity: menuOpen ? 1 : 0,
                    transform: menuOpen ? 'rotate(0) scale(1)' : 'rotate(-90deg) scale(0.8)',
                  }}
                />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* ── Fullscreen mobile menu overlay ── */}
      <div
        ref={menuRef}
        className="fixed inset-0 z-40 bg-background/95 backdrop-blur-md flex flex-col items-center justify-center transition-all duration-spatial ease-expo md:hidden"
        style={{
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'auto' : 'none',
        }}
        aria-hidden={!menuOpen}
      >
        <nav className="flex flex-col items-center gap-2">
          {NAV_LINKS.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              tabIndex={menuOpen ? 0 : -1}
              onClick={(e) => handleAnchorClick(e, link.href)}
              className={`group flex flex-col items-center py-3 menu-stagger-item rounded-sm ${FOCUS_RING}`}
              style={{
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
                transition: `opacity 400ms ease ${80 * i}ms, transform 500ms cubic-bezier(.16,1,.3,1) ${80 * i}ms`,
              }}
            >
              <span className="text-[10px] font-sans text-muted-foreground/50 tabular-nums mb-1 group-hover:text-accent transition-colors duration-material">
                {link.num}
              </span>
              <span className="text-3xl font-serif text-foreground group-hover:text-accent transition-colors duration-material">
                {link.label}
              </span>
              {/* Echo below */}
              <span className="text-xs font-serif italic text-accent/0 group-hover:text-accent/60 transition-all duration-spatial mt-1">
                {link.echo}
              </span>
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}
