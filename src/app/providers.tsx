/**
 * The provider stack the panel renders inside.
 *
 * Cross-cutting wiring is tied here and nowhere else: the motion runtime, the
 * reduced-motion contract, and the record every tab reads and writes.
 */

import { LazyMotion, MotionConfig, domAnimation } from "framer-motion";
import type { ReactNode } from "react";
import { ContentProvider } from "@/entities/record";

/**
 * Wraps a subtree in the providers it needs.
 *
 * `LazyMotion` with the `m` components keeps framer-motion's full runtime out
 * of the bundle; `strict` throws if a plain `motion.` component slips back in.
 *
 * @param props - Standard children; the subtree to wrap.
 *
 * @returns The children wrapped in the panel's providers.
 */
export const AppProviders = ({ children }: { children: ReactNode }) => (
  <LazyMotion features={domAnimation} strict>
    <MotionConfig reducedMotion="user">
      <ContentProvider>{children}</ContentProvider>
    </MotionConfig>
  </LazyMotion>
);
