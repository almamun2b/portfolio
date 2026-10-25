"use client";

import { cn } from "cn";
import { CircleCheck, Info, TriangleAlert, X } from "lucide-react";
import { useSyncExternalStore } from "react";

type Tone = "success" | "error" | "info";
interface ToastItem {
  id: number;
  tone: Tone;
  message: string;
}

// A tiny external store, so any client code (a form's success handler) can
// call toast.success() without a provider or prop drilling.
let items: ToastItem[] = [];
let nextId = 1;
const listeners = new Set<() => void>();
const emit = () => {
  listeners.forEach((listener) => {
    listener();
  });
};

function dismiss(id: number) {
  items = items.filter((item) => item.id !== id);
  emit();
}

function push(tone: Tone, message: string) {
  const id = nextId++;
  items = [...items.slice(-3), { id, tone, message }];
  emit();
  setTimeout(
    () => {
      dismiss(id);
    },
    tone === "error" ? 8000 : 4500,
  );
}

export const toast = {
  success: (message: string) => {
    push("success", message);
  },
  error: (message: string) => {
    push("error", message);
  },
  info: (message: string) => {
    push("info", message);
  },
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const ICONS = {
  success: CircleCheck,
  error: TriangleAlert,
  info: Info,
} as const;
const TONES: Record<Tone, string> = {
  success: "text-success",
  error: "text-error",
  info: "text-secondary-strong",
};

/** Mount once (admin layout). Messages are announced politely to screen readers. */
export function Toaster() {
  const current = useSyncExternalStore(
    subscribe,
    () => items,
    () => items,
  );
  return (
    <div
      role="region"
      aria-label="Notifications"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex flex-col items-center gap-2 p-4 sm:items-end sm:p-6"
    >
      {current.map((item) => {
        const Icon = ICONS[item.tone];
        return (
          <div
            key={item.id}
            className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border border-border-strong bg-popover p-4 text-sm text-popover-foreground shadow-card motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2"
          >
            <Icon
              aria-hidden="true"
              className={cn("mt-0.5 size-[1.1rem] shrink-0", TONES[item.tone])}
            />
            <p className="min-w-0 flex-1 leading-snug">{item.message}</p>
            <button
              type="button"
              onClick={() => {
                dismiss(item.id);
              }}
              aria-label="Dismiss notification"
              className="-m-1 grid size-7 shrink-0 cursor-pointer place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
            >
              <X aria-hidden="true" className="size-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
