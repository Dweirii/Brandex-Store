import Container from "@/components/ui/container"
import getCategories from "@/actions/get-categories";
import NavbarActions from "@/components/navbar-actions";
import MainNav from "@/components/main-nav";
import Link from "next/link";
import Image from "next/image";

export const revaidate = 0;

const Navbar = async() => {
    const categories = await getCategories();

    return (
        <div className="border-b">
            <Container>
                <div className="relative px-1 sm:px-6 lg:px-8 flex items-center h-16">
                    <Link href="/" className="flex lg:ml-0 gap-x-2">
                        <Image
                            src="/Logo.png"
                            width={240}
                            height={120}
                            alt="Logo"
                        />
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