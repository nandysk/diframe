import type { Dictionary } from "@/content";

export type ShowcaseItem = Dictionary["showcase"]["items"][number];

export type ShowcaseGroup = {
  project: string;
  /** The first page, shown large on the stage. */
  cover?: ShowcaseItem;
  /** Every other page, shown in smaller windows below the stage. */
  rest: ShowcaseItem[];
};

/** Groups pieces by the website they come from, in the order each site first appears. */
export function groupShowcase(items: ShowcaseItem[]): ShowcaseGroup[] {
  const groups = new Map<string, ShowcaseGroup>();
  for (const item of items) {
    const group = groups.get(item.project) ?? { project: item.project, rest: [] };
    if (!group.cover) group.cover = item;
    else group.rest.push(item);
    groups.set(item.project, group);
  }
  return [...groups.values()];
}

/** The pieces in the order they appear on the page, which is the order the viewer steps through. */
export const pageOrder = (groups: ShowcaseGroup[]) =>
  groups.flatMap(({ cover, rest }) => [cover, ...rest].filter((item) => item !== undefined));
