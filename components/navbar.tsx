import Container from "@/components/ui/container"
import { MobileNavbarSection } from "./mobile-navbar-section"
import { DesktopNavbarSection } from "./desktop-navbar-section"
import getCategories from "@/actions/get-categories"

export const revalidate = 0

const Navbar = async () => {
  const categories = await getCategories()
  
  return (
    <>
      {/* Main Navbar - Mobile Friendly */}
      <div className="bg-background/80 backdrop-blur-md border-b border-border/40 transition-colors duration-300 sticky top-0 z-50">
        <Container>
          {/* Mobile Layout */}
          <MobileNavbarSection categories={categories} />

          {/* Desktop Layout */}
          <DesktopNavbarSection />
        </Container>
      </div>
    </>
  )
}

export { Navbar }
