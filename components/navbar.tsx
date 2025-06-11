import Container from "@/components/ui/container"
import getCategories from "@/actions/get-categories"
import NavbarActions from "@/components/navbar-actions"
import MainNav from "@/components/main-nav"
import Logo from "./logo"
import { UserDropdown } from "./ui/user-drop-list"
import SearchRedirect from "./SearchRedirect"

export const revalidate = 0

const Navbar = async () => {
  const categories = await getCategories()

  return (
    <div className="border-b border-border bg-card transition-colors duration-300">
      <Container>
        <div className="relative px-1 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          
          <Logo />

          <div className="flex-1 justify-center">
            <MainNav data={categories} />
          </div>
          
          <div className="flex gap-4">
            <div className="top-5">
              <SearchRedirect />
            </div>
            <UserDropdown />
            <NavbarActions />
          </div>
        </div>
      </Container>
    </div>
  )
}

export { Navbar }
