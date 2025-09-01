// components/ui/use-toast.ts
import { toast as sonner, type ExternalToast } from "sonner"

type ToastVariant = "default" | "destructive"

type Action =
  | {
      label: string
      onClick: () => void
    }
  | undefined

export interface ToastOptions {
  title?: string
  description?: string
  action?: Action
  variant?: ToastVariant
  // passthrough to Sonner if you need: position, duration, etc.
  // duration?: number
  // position?: ExternalToast["position"]
}

export function useToast() {
  const toast = (opts: ToastOptions) => {
    const {
      title,
      description,
      action,
      variant = "default",
      // duration,
      // position,
    } = opts

    const render = () => {
      // Prefer title, fall back to description if title is absent
      const msg = title ?? description ?? ""
      const common: ExternalToast = {
        description: title ? description : undefined,
        // duration,
        // position,
        action:
          action && action.label
            ? { label: action.label, onClick: action.onClick }
            : undefined,
      }

      if (variant === "destructive") {
        return sonner.error(msg, common)
      }

      return sonner(msg, common)
    }

    return render()
  }

  // Optional helpers to mirror shadcn’s API shape
  const dismiss = sonner.dismiss
  const promise = sonner.promise

  return { toast, dismiss, promise }
}
