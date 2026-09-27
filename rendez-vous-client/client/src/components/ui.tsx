import type { ButtonHTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={twMerge("rounded-2xl border border-black/5 bg-white p-4 shadow-sm", className)}
    >
      {children}
    </div>
  );
}

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-emerald-700 text-white active:bg-emerald-800 disabled:bg-emerald-700/40",
  secondary:
    "bg-emerald-50 text-emerald-800 border border-emerald-200 active:bg-emerald-100",
  ghost: "text-emerald-800 active:bg-emerald-50",
  danger: "bg-red-50 text-red-700 border border-red-200 active:bg-red-100",
};

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return (
    <button
      className={twMerge(
        "rounded-xl px-4 py-3 text-[15px] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60",
        VARIANT_CLASSES[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function Badge({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={twMerge(
        "inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10 text-emerald-800">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-200 border-t-emerald-700" />
      {label && <p className="text-sm text-emerald-700">{label}</p>}
    </div>
  );
}

export function ErrorBanner({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
      <p>{message}</p>
      {onRetry && (
        <Button variant="danger" className="self-start" onClick={onRetry}>
          Réessayer
        </Button>
      )}
    </div>
  );
}
