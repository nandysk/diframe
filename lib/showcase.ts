import type { Dictionary } from "@/content";

export type ShowcaseItem = Dictionary["showcase"]["items"][number];

export type ShowcaseGroup = {
  project: string;
  /** The first desktop page, shown large on the stage. */
  cover?: ShowcaseItem;
  /** The first phone view, standing in front of the cover. */
  phone?: ShowcaseItem;
  /** Every other piece, shown in smaller frames below the stage. */
  rest: ShowcaseItem[];
};

/** Groups pieces by the website they come from, in the order each site first appears. */
export function groupShowcase(items: ShowcaseItem[]): ShowcaseGroup[] {
  const groups = new Map<string, ShowcaseGroup>();
  for (const item of items) {
    const group = groups.get(item.project) ?? { project: item.project, rest: [] };
    if (!group.cover && item.device !== "phone") group.cover = item;
    else if (!group.phone && item.device === "phone") group.phone = item;
    else group.rest.push(item);
    groups.set(item.project, group);
  }
  return [...groups.values()];
}

/** The pieces in the order they appear on the page, which is the order the viewer steps through. */
export const pageOrder = (groups: ShowcaseGroup[]) =>
  groups.flatMap(({ cover, phone, rest }) => [cover, phone, ...rest].filter((item) => item !== undefined));
