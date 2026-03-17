import { lazy, Suspense } from 'react';

// Lazy-load DossierHero to defer the entire Three.js bundle
const DossierHero = lazy(() => import('@/components/dossier-hero/DossierHero').then(m => ({ default: m.DossierHero })));
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CursorLayer } from '@/components/experience/CursorLayer';

// Below-fold sections — lazy-loaded to reduce initial bundle
const CaseStudies = lazy(() => import('@/components/sections/CaseStudies').then(m => ({ default: m.CaseStudies })));
const TechnicalWork = lazy(() => import('@/components/sections/TechnicalWork').then(m => ({ default: m.TechnicalWork })));
const Strengths = lazy(() => import('@/components/sections/Strengths').then(m => ({ default: m.Strengths })));
const Contact = lazy(() => import('@/components/sections/Contact').then(m => ({ default: m.Contact })));

/** Invisible placeholder that reserves no space — sections animate in via SectionShell */
const SectionFallback = () => <div className="min-h-[200px]" />;

const Index = () => {
  return (
    <main>
      {/* Skip-to-content for keyboard users */}
      <a
        href="#cases"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-background focus:text-foreground focus:rounded-md focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:text-sm focus:font-sans"
      >
        Skip to content
      </a>
      <CursorLayer />
      <Navbar />
      <Suspense fallback={<div className="h-screen w-full bg-background" />}>
        <DossierHero />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <CaseStudies />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <TechnicalWork />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <Strengths />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <Contact />
      </Suspense>
      <Footer />
    </main>
  );
};

export default Index;
