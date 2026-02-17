"use client";

import * as React from "react";

interface AlertDialogContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const AlertDialogContext = React.createContext<
  AlertDialogContextValue | undefined
>(undefined);

export function AlertDialog({
  children,
  open: controlledOpen,
  onOpenChange,
}: {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  return (
    <AlertDialogContext.Provider value={{ open, setOpen }}>
      {children}
    </AlertDialogContext.Provider>
  );
}

export function AlertDialogTrigger({
  children,
  asChild,
}: {
  children: React.ReactNode;
  asChild?: boolean;
}) {
  const context = React.useContext(AlertDialogContext);
  if (!context)
    throw new Error("AlertDialogTrigger must be used within AlertDialog");

  const handleClick = () => context.setOpen(true);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: handleClick,
    } as React.HTMLAttributes<HTMLElement>);
  }

  return <button onClick={handleClick}>{children}</button>;
}

export function AlertDialogContent({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const context = React.useContext(AlertDialogContext);
  if (!context)
    throw new Error("AlertDialogContent must be used within AlertDialog");

  if (!context.open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50"
        onClick={() => context.setOpen(false)}
      />
      <div
        className={`relative bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-md w-full mx-4 ${className}`}
      >
        {children}
      </div>
    </div>
  );
}

export function AlertDialogHeader({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`mb-4 ${className}`}>{children}</div>;
}

export function AlertDialogTitle({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <h2 className={`text-lg font-semibold ${className}`}>{children}</h2>;
}

export function AlertDialogDescription({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={`text-sm text-gray-600 dark:text-gray-400 mt-2 ${className}`}>
      {children}
    </p>
  );
}

export function AlertDialogFooter({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex justify-end gap-2 mt-6 ${className}`}>{children}</div>
  );
}

export function AlertDialogAction({
  children,
  onClick,
  className = "",
  disabled = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}) {
  const context = React.useContext(AlertDialogContext);
  if (!context)
    throw new Error("AlertDialogAction must be used within AlertDialog");

  const handleClick = () => {
    if (disabled) return;
    onClick?.();
    context.setOpen(false);
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
}

export function AlertDialogCancel({
  children,
  className = "",
  disabled = false,
}: {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}) {
  const context = React.useContext(AlertDialogContext);
  if (!context)
    throw new Error("AlertDialogCancel must be used within AlertDialog");

  return (
    <button
      onClick={() => !disabled && context.setOpen(false)}
      disabled={disabled}
      className={`px-4 py-2 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
}
