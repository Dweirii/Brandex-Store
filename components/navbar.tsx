import Container from "@/components/ui/container"
import getCategories from "@/actions/get-categories"
import NavbarActions from "@/components/navbar-actions"
import MainNav from "@/components/main-nav"
import Link from "next/link"
import Image from "next/image"
import { UserDropdown } from "./ui/user-drop-list"

export const revalidate = 0

const Navbar = async () => {
  const categories = await getCategories()

  return (
    <div className="border-b border-border bg-card transition-colors duration-300">
      <Container>
        <div className="relative px-1 sm:px-6 lg:px-8 flex items-center justify-between h-16">

          <Link href="/" className="flex items-center gap-x-2">
            <Image
              src="/Logo.png"
              width={240}
              height={120}
              alt="Logo"
              priority
              className="dark:brightness-75 transition-all duration-300"
            />
          </Link>

          <div className="flex-1 justify-center">
            <MainNav data={categories} />
          </div>
          <div className="flex items-center gap-4">
            <UserDropdown/>
            <NavbarActions />
          </div>
        </div>
      </Container>
    </div>
  )
}

export { Navbar }
