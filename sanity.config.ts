import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemaTypes";

export default defineConfig({
  name: "emily-cambodia",
  title: "Emily · Cambodia",

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Site Settings")
              .child(
                S.document()
                  .schemaType("settings")
                  .documentId("siteSettings")
              ),
            S.divider(),
            S.listItem()
              .title("Shoots")
              .child(S.documentTypeList("shoot").title("Shoots")),
            S.listItem()
              .title("Photos")
              .child(S.documentTypeList("photo").title("Photos")),
            S.listItem()
              .title("Places")
              .child(S.documentTypeList("place").title("Places")),
            S.listItem()
              .title("Products (Coming Soon)")
              .child(S.documentTypeList("product").title("Products")),
          ]),
    }),
    visionTool(),
  ],

  schema: { types: schemaTypes },
});
