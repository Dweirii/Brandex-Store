import Container from "@/components/ui/container"
import getCategories from "@/actions/get-categories"
import NavbarActions from "@/components/navbar-actions"
import Logo from "./logo"
import { UserDropdown } from "./ui/user-drop-list"
import SearchBarWrapper from "./search-bar-wrapper"
import CategoryNav from "./category-nav"

export const revalidate = 0

const Navbar = async () => {
  const categories = await getCategories()

  return (
    <>
      {/* Main Navbar - Unsplash Style */}
      <div className="bg-background/80 backdrop-blur-md border-b border-border/40 transition-colors duration-300 sticky top-0 z-50">
        <Container>
          <div className="relative px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
            {/* Logo - Left aligned */}
            <div className="flex-shrink-0 -ml-4">
              <Logo />
            </div>

            {/* Categories Navigation - Centered */}
            <div className="flex-1 min-w-0 flex justify-center absolute left-0 right-0 pointer-events-none">
              <div className="pointer-events-auto">
                <CategoryNav categories={categories} />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 z-10">
              <UserDropdown />
              <NavbarActions />
            </div>
          </div>
        </Container>
      </div>

      {/* Search Bar - Conditionally rendered */}
      <SearchBarWrapper />
    </>
  )
}

export { Navbar }
