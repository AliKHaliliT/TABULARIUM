import { LazyMotion, MotionConfig, domAnimation } from "framer-motion";
import { ContentProvider } from "@/context/ContentContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Admin } from "@/pages/Admin";

/**
 * TABULARIUM is one page: the admin panel. The shell provides the motion
 * runtime (domAnimation behind LazyMotion strict; `m.` only, never
 * `motion.`), the content provider, the theme switch, and the reading rail.
 */
export default function App() {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <ContentProvider>
          <div className="min-h-screen bg-[var(--color-background)] font-sans text-[var(--color-text-primary)]">
            <div className="fixed right-4 top-4 z-50">
              <ThemeToggle />
            </div>
            <main className="mx-auto min-h-screen max-w-[1180px] border-[var(--color-border)] px-5 pb-10 pt-8 md:border-x md:border-dashed">
              <Admin />
            </main>
          </div>
        </ContentProvider>
      </MotionConfig>
    </LazyMotion>
  );
}
