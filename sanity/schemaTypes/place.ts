import { defineField, defineType } from "sanity";

export const place = defineType({
  name: "place",
  title: "Place",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
    }),
    defineField({
      name: "location",
      title: "Location (lat / lng)",
      type: "geopoint",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "kind",
      title: "Kind",
      type: "string",
      options: {
        list: [
          { title: "Place to visit", value: "visit" },
          { title: "Project location", value: "project" },
          { title: "Both", value: "both" },
        ],
        layout: "radio",
      },
      initialValue: "visit",
    }),
    defineField({
      name: "blurb",
      title: "Short blurb",
      type: "text",
      rows: 3,
      description: "One or two lines shown in the popup and panel header.",
    }),
    defineField({
      name: "photos",
      title: "Photos from here",
      type: "array",
      of: [{ type: "reference", to: [{ type: "photo" }] }],
    }),
    defineField({
      name: "posts",
      title: "Posts",
      type: "array",
      of: [
        {
          type: "object",
          name: "post",
          title: "Post",
          fields: [
            { name: "title", title: "Title", type: "string" },
            { name: "date", title: "Date", type: "date" },
            { name: "body", title: "Body", type: "text", rows: 5 },
            { name: "link", title: "External link (optional)", type: "url" },
          ],
          preview: {
            select: { title: "title", subtitle: "date" },
          },
        },
      ],
    }),
    defineField({
      name: "projectInfo",
      title: "Project info",
      type: "text",
      rows: 4,
      description: "Only shown for project / both kinds.",
      hidden: ({ document }) => document?.kind === "visit",
    }),
    defineField({
      name: "order",
      title: "Display order",
      type: "number",
      description: "Lower numbers appear first in the place list.",
    }),
  ],
  orderings: [
    {
      title: "Display order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
    {
      title: "Name",
      name: "nameAsc",
      by: [{ field: "name", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "name", kind: "kind" },
    prepare({ title, kind }) {
      return {
        title: title ?? "Untitled place",
        subtitle: kind ? `· ${kind}` : "",
      };
    },
  },
});
