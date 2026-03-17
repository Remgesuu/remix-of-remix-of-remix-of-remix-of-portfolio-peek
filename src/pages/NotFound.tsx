import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const CASE_SLUGS = ['darkest-afk', 'dig-dig-die', 'vacation-cafe'];

const NotFound = () => {
  const location = useLocation();
  const isCaseRoute = location.pathname.startsWith('/cases/');
  const slug = isCaseRoute ? location.pathname.split('/').pop() : null;
  const isKnownCase = slug && CASE_SLUGS.includes(slug);

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      {isKnownCase ? (
        <>
          <p className="text-xs tracking-[0.25em] uppercase text-muted-foreground font-sans mb-3">
            ( Case Study )
          </p>
          <h1 className="text-4xl md:text-6xl font-serif text-foreground mb-4">
            Being prepared
          </h1>
          <p className="text-base text-muted-foreground font-sans mb-8 text-center max-w-md">
            Still writing this one up. Check back later.
          </p>
        </>
      ) : (
        <>
          <p className="text-xs tracking-[0.25em] uppercase text-muted-foreground font-sans mb-3">
            ( 404 )
          </p>
          <h1 className="text-4xl md:text-6xl font-serif text-foreground mb-4">
            Page not found
          </h1>
          <p className="text-base text-muted-foreground font-sans mb-8 text-center max-w-md">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </>
      )}
      <a
        href="/"
        className="px-5 py-2.5 text-sm font-sans font-medium border border-foreground/20 rounded-md text-foreground hover:bg-foreground hover:text-background transition-colors"
      >
        ← Back home
      </a>
    </div>
  );
};

export default NotFound;
