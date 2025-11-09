import Container from "@/components/ui/container"
import NavbarActions from "@/components/navbar-actions"
import Logo from "./logo"
import { UserDropdown } from "./ui/user-drop-list"
import { SearchBarWrapper } from "./search-bar-wrapper"

export const revalidate = 0

const Navbar = async () => {

  return (
    <>
      {/* Main Navbar - Unsplash Style */}
      <div className="bg-background/80 backdrop-blur-md border-b border-border/40 transition-colors duration-300 sticky top-0 z-50">
        <Container>
          <div className="relative px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20 gap-4">
            {/* Logo and Search Bar - Left aligned */}
            <div className="flex items-center gap-4 flex-1 min-w-0 relative z-20">
              <div className="flex-shrink-0 relative z-20">
                <Logo />
              </div>
              <div className="flex-1 min-w-0 relative z-20">
                <SearchBarWrapper />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 relative z-20">
              <UserDropdown />
              <NavbarActions />
            </div>
          </div>
        </Container>
      </div>
    </>
  )
}

export { Navbar }
