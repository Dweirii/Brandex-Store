import Container from "@/components/ui/container"
import getCategories from "@/actions/get-categories"
import NavbarActions from "@/components/navbar-actions"
import Logo from "./logo"
import { UserDropdown } from "./ui/user-drop-list"
import GlobalSearchBar from "./global-search-bar"
import CategoryNav from "./category-nav"

export const revalidate = 0

const Navbar = async () => {
  const categories = await getCategories()

  return (
    <>
      {/* Main Navbar - Categories */}
      <div className="bg-card/95 backdrop-blur-sm transition-colors duration-300 sticky top-0 z-50">
        <Container>
          <div className="relative px-4 sm:px-6 lg:px-8 flex items-center gap-3 sm:gap-4 h-16">
            {/* Logo - Left aligned */}
            <div className="flex-shrink-0">
              <Logo />
            </div>

            {/* Categories Navigation - Centered */}
            <div className="flex-1 min-w-0 flex justify-center">
              <CategoryNav categories={categories} />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <UserDropdown />
              <NavbarActions />
            </div>
          </div>
        </Container>
      </div>

      {/* Search Bar - Below Categories */}
      <div className="bg-card/95 backdrop-blur-sm sticky top-16 z-40">
        <Container>
          <div className="px-4 sm:px-6 lg:px-8 py-3">
            <div className="max-w-2xl mx-auto">
              <GlobalSearchBar />
            </div>
          </div>
        </Container>
      </div>
    </>
  )
}

export { Navbar }
