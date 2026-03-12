"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/Button"
import { Sparkles, Eraser, Wand2, Image as ImageIcon, Zap, Sliders } from "lucide-react"

interface StudioPromoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  studioUrl: string
}

export function StudioPromoModal({ open, onOpenChange, studioUrl }: StudioPromoModalProps) {
  const handleGoToStudio = () => {
    window.open(studioUrl, "_blank", "noopener,noreferrer")
    onOpenChange(false)
  }

  const features = [
    {
      icon: Eraser,
      title: "Remove Background",
      description: "Instantly remove backgrounds from any image",
      credits: "5 credits"
    },
    {
      icon: Wand2,
      title: "AI Object Removal",
      description: "Delete unwanted objects seamlessly",
      credits: "25 credits"
    },
    {
      icon: ImageIcon,
      title: "Image Generation",
      description: "Create images from text descriptions",
      credits: "From 10 credits"
    },
    {
      icon: Zap,
      title: "Image Expansion",
      description: "Expand your images with AI fill",
      credits: "20 credits"
    },
    {
      icon: Sparkles,
      title: "Skin Enhancement",
      description: "Professional portrait retouching",
      credits: "20 credits"
    },
    {
      icon: Sliders,
      title: "Free Adjustments",
      description: "Brightness, contrast & color tools",
      credits: "Free"
    }
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-[95vw] sm:w-full p-4 sm:p-6 md:p-10 border border-border/50 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3 sm:space-y-4 text-center">
          <DialogTitle className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight relative inline-block">
            Brandex Studio
            <span className="absolute -top-1 sm:-top-2 -right-8 sm:-right-12 px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-bold bg-[#00B81A] text-white rounded-full uppercase">New</span>
          </DialogTitle>
          
          <DialogDescription className="text-sm sm:text-base text-muted-foreground px-2">
            Professional AI-powered image editing tools. No software to install.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mt-4 sm:mt-6 md:mt-8">
          {features.map((feature, index) => {
            const FeatureIcon = feature.icon
            return (
              <div 
                key={index}
                className="flex flex-col space-y-2 p-3 sm:p-4 rounded-lg border border-border/50 hover:border-[#00B81A]/30 hover:bg-muted/20 transition-all"
              >
                <FeatureIcon className="h-4 w-4 sm:h-5 sm:w-5 text-[#00B81A] mb-1 sm:mb-2" />
                <div>
                  <p className="font-semibold text-xs sm:text-sm mb-1">{feature.title}</p>
                  <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
                  <p className="text-[11px] sm:text-xs text-[#00B81A] mt-1.5 sm:mt-2 font-medium">{feature.credits}</p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-4 sm:mt-6 md:mt-8 space-y-2 sm:space-y-3">
          <Button
            onClick={handleGoToStudio}
            className="w-full bg-[#00B81A] hover:bg-[#00B81A]/90 text-white font-semibold h-10 sm:h-11 rounded-lg text-sm sm:text-base"
          >
            Launch Brandex Studio
          </Button>
          <Button
            onClick={() => onOpenChange(false)}
            variant="ghost"
            className="w-full text-muted-foreground hover:text-foreground text-xs sm:text-sm"
          >
            Not now
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  )
}
