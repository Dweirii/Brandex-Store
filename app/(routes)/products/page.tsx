import { redirect } from "next/navigation";

/**
 * /products has no catalogue of its own — the homepage IS the product listing.
 * Redirect so any link to /products lands on the correct page.
 */
export default function ProductsIndexPage() {
    redirect("/");
}
