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
      <DialogContent className="max-w-5xl min-w-3xl p-10 border border-border/50">
        <DialogHeader className="space-y-4 text-center">
          <DialogTitle className="text-4xl font-bold tracking-tight relative inline-block">
            Brandex Studio
            <span className="absolute -top-2 -right-12 px-2 py-0.5 text-[10px] font-bold bg-[#00EB02] text-white rounded-full uppercase">New</span>
          </DialogTitle>
          
          <DialogDescription className="text-base text-muted-foreground">
            Professional AI-powered image editing tools. No software to install.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
          {features.map((feature, index) => {
            const FeatureIcon = feature.icon
            return (
              <div 
                key={index}
                className="flex flex-col space-y-2 p-4 rounded-lg border border-border/50 hover:border-[#00EB02]/30 hover:bg-muted/20 transition-all"
              >
                <FeatureIcon className="h-5 w-5 text-[#00EB02] mb-2" />
                <div>
                  <p className="font-semibold text-sm mb-1">{feature.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
                  <p className="text-xs text-[#00EB02] mt-2 font-medium">{feature.credits}</p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-8 space-y-3">
          <Button
            onClick={handleGoToStudio}
            className="w-full bg-[#00EB02] hover:bg-[#00EB02]/90 text-white font-semibold h-11 rounded-lg"
          >
            Launch Studio
          </Button>
          <Button
            onClick={() => onOpenChange(false)}
            variant="ghost"
            className="w-full text-muted-foreground hover:text-foreground text-sm"
          >
            Not now
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  )
}
