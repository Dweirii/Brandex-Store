"use client"

import { Shield, Lock, CreditCard, Truck } from "lucide-react"

const TrustBadges = () => {
  const badges = [
    {
      icon: Shield,
      title: "Secure Payment",
      description: "100% secure transactions",
    },
    {
      icon: Lock,
      title: "Privacy Protected",
      description: "Your data is safe",
    },
    {
      icon: CreditCard,
      title: "Easy Refunds",
      description: "Hassle-free returns",
    },
    {
      icon: Truck,
      title: "Instant Delivery",
      description: "Digital downloads",
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6">
      {badges.map((badge) => (
        <div
          key={badge.title}
          className="flex flex-col items-center text-center p-4 rounded-lg bg-muted/30 border border-border hover:border-primary transition-colors duration-200"
        >
          <badge.icon className="h-8 w-8 text-primary mb-2" />
          <h3 className="font-semibold text-sm text-foreground mb-1">{badge.title}</h3>
          <p className="text-xs text-muted-foreground">{badge.description}</p>
        </div>
      ))}
    </div>
  )
}

export { TrustBadges }
