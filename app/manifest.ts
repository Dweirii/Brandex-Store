import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Brandex — Premium Mockups & Design Resources",
    short_name: "Brandex",
    description:
      "Premium mockups, ready-made packaging designs, and layered PSD files crafted for designers, marketers, and brands who demand quality and speed.",
    start_url: "/",
    display: "standalone",
    background_color: "#FCFCFD",
    theme_color: "#00B81A",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  }
}
