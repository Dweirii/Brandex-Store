/**
 * lib/category-slugs.ts
 *
 * Single source of truth for category UUID ↔ slug mappings.
 *
 * Why here and not in heroConfig?  heroConfig is presentation-only and
 * already imports this; routing/SEO utils shouldn't depend on hero images.
 */

/** UUID → readable URL slug */
export const CATEGORY_SLUG_MAP: Record<string, string> = {
    "fd995552-baa8-4b86-bf7e-0acbefd43fd6": "packaging",
    "960cb6f5-8dc1-48cf-900f-aa60dd8ac66a": "mockup-studio",
    "6214c586-a7c7-4f71-98ab-e1bc147a07f4": "images",
    "b0469986-6cb9-4a35-8cd6-6cc9ec51a561": "vectors",
    "1364f5f9-6f45-48fd-8cd1-09815e1606c0": "psd-lab",
    "c302954a-6cd2-43a7-9916-16d9252f754c": "motion-library",
};

/** Category Groups for Merged Navigation */
export const CATEGORY_GROUPS: Record<string, { name: string; ids: string[]; subtabs: { label: string; id: string; slug: string }[] }> = {
    "mockups": {
        name: "Mockups",
        ids: ["960cb6f5-8dc1-48cf-900f-aa60dd8ac66a"],
        subtabs: [
            { label: "Studio", id: "960cb6f5-8dc1-48cf-900f-aa60dd8ac66a", slug: "mockup-studio" }
        ]
    },
    "graphics": {
        name: "Graphics",
        ids: [
            "6214c586-a7c7-4f71-98ab-e1bc147a07f4",
            "b0469986-6cb9-4a35-8cd6-6cc9ec51a561",
            "1364f5f9-6f45-48fd-8cd1-09815e1606c0"
        ],
        subtabs: [
            { label: "Images", id: "6214c586-a7c7-4f71-98ab-e1bc147a07f4", slug: "images" },
            { label: "Vectors", id: "b0469986-6cb9-4a35-8cd6-6cc9ec51a561", slug: "vectors" },
            { label: "PSD", id: "1364f5f9-6f45-48fd-8cd1-09815e1606c0", slug: "psd-lab" }
        ]
    }
};

/** Map individual slugs to their group slugs */
export const SLUG_TO_GROUP_MAP: Record<string, string> = {
    "mockup-studio": "mockups",
    "images": "graphics",
    "vectors": "graphics",
    "psd-lab": "graphics",
};

/** Slug → UUID (reverse of CATEGORY_SLUG_MAP) */
export const CATEGORY_UUID_MAP: Record<string, string> = Object.fromEntries(
    Object.entries(CATEGORY_SLUG_MAP).map(([id, slug]) => [slug, id])
);

const UUID_RE =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Returns true if the string looks like a UUID. */
export function isUUID(value: string): boolean {
    return UUID_RE.test(value);
}

/**
 * Given a category route param (either a UUID or a slug), returns the
 * canonical slug to use in URLs.  Falls back to the original value when no
 * mapping is found.
 * 
 * Now also maps individual member slugs to their parent group slug.
 */
export function categoryParamToSlug(param: string): string {
    let slug = param;
    if (isUUID(param)) {
        slug = CATEGORY_SLUG_MAP[param] ?? param;
    }
    // Map member slug to group slug (e.g., 'images' -> 'graphics')
    return SLUG_TO_GROUP_MAP[slug] ?? slug;
}

/**
 * Given a category route param (either a UUID or a slug), returns the
 * UUID needed to query the API. 
 * 
 * If it's a group slug, it returns the first ID of that group by default.
 */
export function categoryParamToId(param: string): string {
    if (isUUID(param)) return param;

    // Is it a group slug? (e.g., 'graphics')
    if (CATEGORY_GROUPS[param]) {
        return CATEGORY_GROUPS[param].ids[0];
    }

    // Is it a member slug? (e.g., 'images')
    const groupSlug = SLUG_TO_GROUP_MAP[param];
    if (groupSlug && CATEGORY_GROUPS[groupSlug]) {
        // Find the specific ID for this member slug if possible
        const subtab = CATEGORY_GROUPS[groupSlug].subtabs.find(s => s.slug === param);
        if (subtab) return subtab.id;
        return CATEGORY_GROUPS[groupSlug].ids[0];
    }

    return CATEGORY_UUID_MAP[param] ?? param;
}

/**
 * Build a canonical /category/<slug> href for a category.
 * Now points members to their group URL.
 */
export function categoryHref(idOrCategory: string | { id: string }): string {
    const id =
        typeof idOrCategory === "string" ? idOrCategory : idOrCategory.id;
    const directSlug = CATEGORY_SLUG_MAP[id] ?? id;
    const groupSlug = SLUG_TO_GROUP_MAP[directSlug] ?? directSlug;
    return `/category/${groupSlug}`;
}
