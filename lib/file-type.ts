/**
 * lib/file-type.ts (store) — UI-facing mirror of the admin file-type definitions.
 * Keep the chip set + bucket boundaries in sync with Brandex-Admin/lib/file-type.ts.
 */

export type FileType = "PSD" | "JPG" | "PNG" | "SVG" | "Vector" | "Video" | "Bundle";

/** Filter chips in display order, with the label shown to users. */
export const FILE_TYPE_CHIPS: { value: FileType; label: string }[] = [
  { value: "PSD", label: "PSD" },
  // Hidden for now — JPG/PNG filter chips temporarily removed from the storefront.
  // Re-enable by uncommenting these two lines.
  // { value: "JPG", label: "JPG" },
  // { value: "PNG", label: "PNG" },
  { value: "SVG", label: "SVG" },
  { value: "Vector", label: "Vector" },
  { value: "Video", label: "Video" },
  { value: "Bundle", label: "Bundle" },
];

export type SizeBucket = "small" | "medium" | "large";

export const SIZE_CHIPS: { value: SizeBucket; label: string }[] = [
  { value: "small", label: "Under 10 MB" },
  { value: "medium", label: "10 – 50 MB" },
  { value: "large", label: "Over 50 MB" },
];
