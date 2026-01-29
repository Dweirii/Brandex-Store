import toast from "react-hot-toast"
import { ShoppingCart, X } from "lucide-react"

interface ToastWithActionOptions {
  message: string
  actionLabel?: string
  onAction?: () => void
  duration?: number
}

export const toastWithAction = ({
  message,
  actionLabel = "View",
  onAction,
  duration = 4000
}: ToastWithActionOptions) => {
  return toast.custom(
    (t) => (
      <div
        className={`${
          t.visible ? 'animate-enter' : 'animate-leave'
        } max-w-md w-full bg-card shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 border border-border`}
      >
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <ShoppingCart className="h-5 w-5 text-primary" />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-foreground">
                {message}
              </p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-border">
          {onAction && (
            <button
              onClick={() => {
                onAction()
                toast.dismiss(t.id)
              }}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-primary hover:bg-muted transition-colors"
            >
              {actionLabel}
            </button>
          )}
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full border-l border-border rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    ),
    { duration }
  )
}

export const toastAddedToCart = (productName: string, onViewCart: () => void) => {
  return toastWithAction({
    message: `${productName} added to cart`,
    actionLabel: "View Cart",
    onAction: onViewCart,
    duration: 5000
  })
}

export const toastRemovedFromCart = (productName: string, onUndo?: () => void) => {
  return toast.custom(
    (t) => (
      <div
        className={`${
          t.visible ? 'animate-enter' : 'animate-leave'
        } max-w-md w-full bg-card shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 border border-border`}
      >
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-foreground">
                {productName} removed from cart
              </p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-border">
          {onUndo && (
            <button
              onClick={() => {
                onUndo()
                toast.dismiss(t.id)
              }}
              className="w-full border border-transparent rounded-none p-4 flex items-center justify-center text-sm font-medium text-primary hover:bg-muted transition-colors"
            >
              Undo
            </button>
          )}
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full border-l border-border rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    ),
    { duration: 5000 }
  )
}
