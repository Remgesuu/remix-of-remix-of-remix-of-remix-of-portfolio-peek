import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ExperienceProvider } from "./components/experience/ExperienceProvider";

// Route-level code splitting — each page loads on demand
const Index = lazy(() => import("./pages/Index"));
const ResumePlaceholder = lazy(() => import("./pages/ResumePlaceholder"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

/** Minimal inline fallback — avoids importing a heavy component */
function PageFallback() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background">
      <div className="w-6 h-6 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ExperienceProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/resume" element={<ResumePlaceholder />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ExperienceProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
