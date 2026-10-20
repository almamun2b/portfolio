import { siWhatsapp } from "simple-icons";

const GREETING =
  "Hi Mamun, I found your portfolio and would like to talk about ";

/** Floating WhatsApp shortcut. WhatsApp's own green is used only here. */
export function WhatsAppButton({ number }: { number: string }) {
  const href = `https://wa.me/${number}?text=${encodeURIComponent(GREETING)}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp (opens in a new tab)"
      className="group relative grid size-14 place-items-center rounded-full bg-[#25d366] text-white shadow-[0_10px_30px_rgb(37_211_102_/_0.35)] transition-[scale,box-shadow] duration-300 ease-spring hover:scale-110 hover:shadow-[0_14px_36px_rgb(37_211_102_/_0.45)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ring active:scale-100"
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="size-7"
        fill="currentColor"
      >
        <path d={siWhatsapp.path} />
      </svg>
      <WidgetTip>WhatsApp me</WidgetTip>
    </a>
  );
}

/** Hover/focus label to the left of a floating button (decorative; the button is named). */
export function WidgetTip({ children }: { children: string }) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute right-full mr-3 rounded-lg border border-border-strong bg-popover px-2.5 py-1 text-xs font-medium whitespace-nowrap text-popover-foreground opacity-0 shadow-card transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
    >
      {children}
    </span>
  );
}
