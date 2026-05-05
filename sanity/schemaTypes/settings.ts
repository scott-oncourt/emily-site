import { defineField, defineType } from "sanity";

export const settings = defineType({
  name: "settings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Display name",
      type: "string",
      initialValue: "Emily",
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      initialValue: "Ancient grace · Modern world · Pure Cambodia",
    }),
    defineField({
      name: "bio",
      title: "Bio",
      type: "array",
      of: [{ type: "block" }],
      description: "The about section text",
    }),
    defineField({
      name: "aboutPhoto",
      title: "About section portrait",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "instagram",
      title: "Instagram handle",
      type: "string",
      initialValue: "kasal_ellie",
    }),
    defineField({
      name: "tiktok",
      title: "TikTok handle",
      type: "string",
      initialValue: "moly.004",
    }),
    defineField({
      name: "facebook",
      title: "Facebook URL",
      type: "url",
      initialValue: "https://www.facebook.com/moon.ana.631611",
    }),
    defineField({
      name: "collaborationEmail",
      title: "Collaboration email",
      type: "string",
      description: "Optional — shown in the Connect section",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Site Settings" };
    },
  },
});
