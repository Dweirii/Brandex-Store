import Container from "@/components/ui/container"
import getCategories from "@/actions/get-categories";
import NavbarActions from "@/components/navbar-actions";
import MainNav from "@/components/main-nav";
import Link from "next/link";

export const revaidate = 0;

const Navbar = async() => {
    const categories = await getCategories();

    return (
        <div className="border-b">
            <Container>
                <div className="relative px-4 sm:px-6 lg:px-8 flex items-center h-16">
                    <Link href="/" className="ml-4 flex lg:ml-0 gap-x-2">
                        <p className="font-bold text-xl pr-2">Brandex</p>
                    </Link>
                    <MainNav
                        data={categories}
                    />
                    <NavbarActions/>
                </div>
            </Container>
        </div>
    )
}

export { Navbar };