import { defineField, defineType } from "sanity";

export const photo = defineType({
  name: "photo",
  title: "Photo",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Internal reference title (not shown on site)",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "alt",
      title: "Alt text",
      type: "string",
      description: "Describe the image for accessibility",
    }),
    defineField({
      name: "place",
      title: "Where it was taken",
      type: "reference",
      to: [{ type: "place" }],
      description:
        "The place this photo was taken at. Pick from existing places — set this on the photo and it appears on the place automatically.",
    }),
    defineField({
      name: "shoot",
      title: "Part of which shoot",
      type: "reference",
      to: [{ type: "shoot" }],
      description:
        "The shoot (day) this photo belongs to. Pick from existing shoots.",
    }),
    defineField({
      name: "location",
      title: "Location note (free-text)",
      type: "string",
      description:
        "Optional caption-style location text — e.g. 'Gate of the Dead'. The Place reference above is the structured tag.",
    }),
    defineField({
      name: "featured",
      title: "Featured in gallery",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "heroImage",
      title: "Use as hero image",
      type: "boolean",
      initialValue: false,
      description: "Only one image should be set as hero",
    }),
    defineField({
      name: "kingdomImage",
      title: 'Use as "kingdom" section background',
      type: "boolean",
      initialValue: false,
      description:
        'Background for the "The kingdom she calls home" section on the homepage. Only one image should have this flag set.',
    }),
    defineField({
      name: "order",
      title: "Gallery order",
      type: "number",
      description: "Lower numbers appear first",
    }),
    defineField({
      name: "dateTaken",
      title: "Date taken",
      type: "date",
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      description: "Free-form tags. Shoots also have tags — both are searchable in /gallery.",
    }),
  ],
  orderings: [
    {
      title: "Gallery Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
    {
      title: "Date, Newest",
      name: "dateDesc",
      by: [{ field: "dateTaken", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      location: "location",
      media: "image",
    },
    prepare({ title, location, media }) {
      return {
        title: title || "Untitled",
        subtitle: location,
        media,
      };
    },
  },
});
