import { defineField, defineType } from "sanity";

export const shoot = defineType({
  name: "shoot",
  title: "Shoot",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "date",
      description: "The day the shoot took place. A shoot can cover several locations on the same day — set each photo's location via Places.",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "coverImage",
      title: "Cover image",
      type: "reference",
      to: [{ type: "photo" }],
      description: "Optional. Falls back to the first photo in the set.",
    }),
    defineField({
      name: "photos",
      title: "Photos",
      type: "array",
      of: [{ type: "reference", to: [{ type: "photo" }] }],
      validation: (Rule) => Rule.unique(),
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      description: "e.g. fashion, temple, golden-hour, traditional",
    }),
    defineField({
      name: "wardrobe",
      title: "Wardrobe / styling",
      type: "object",
      description:
        "What Emily was wearing on this shoot. Inherited by every photo in the shoot. Filterable by colour in /gallery.",
      options: { collapsible: true, collapsed: false },
      fields: [
        {
          name: "notes",
          title: "Notes",
          type: "text",
          rows: 2,
          description: "Free-text — designer, vibe, anything.",
        },
        {
          name: "colors",
          title: "Colours",
          type: "array",
          of: [{ type: "string" }],
          options: { layout: "tags" },
          description: "e.g. burgundy, cream, gold. Powers the colour filter.",
        },
        {
          name: "items",
          title: "Items",
          type: "array",
          of: [{ type: "string" }],
          options: { layout: "tags" },
          description: "e.g. silk dress, woven bag, hat.",
        },
      ],
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
      description: "Promoted on the homepage gallery strip.",
    }),
    defineField({
      name: "order",
      title: "Display order",
      type: "number",
    }),
  ],
  orderings: [
    {
      title: "Date, newest",
      name: "dateDesc",
      by: [{ field: "date", direction: "desc" }],
    },
    {
      title: "Display order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      date: "date",
      media: "coverImage.image",
    },
    prepare({ title, date, media }) {
      return {
        title: title ?? "Untitled shoot",
        subtitle: date ?? "",
        media,
      };
    },
  },
});
