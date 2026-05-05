import { groq } from "next-sanity";

// ─── Hero / homepage ──────────────────────────────────────────────────────────

export const heroQuery = groq`
  *[_type == "photo" && heroImage == true][0] {
    _id,
    image,
    alt,
    location
  }
`;

export const kingdomPhotoQuery = groq`
  *[_type == "photo" && kingdomImage == true][0] {
    _id,
    image,
    alt,
    location
  }
`;

export const galleryStripQuery = groq`
  *[_type == "photo" && featured == true] | order(order asc, _createdAt desc)[0...8] {
    _id,
    title,
    image,
    alt,
    location
  }
`;

export const galleryQuery = galleryStripQuery;

export const settingsQuery = groq`
  *[_type == "settings"][0] {
    name,
    tagline,
    bio,
    aboutPhoto,
    instagram,
    tiktok,
    facebook,
    collaborationEmail
  }
`;

export const productsQuery = groq`
  *[_type == "product" && available == true] | order(_createdAt desc) {
    _id,
    name,
    slug,
    images,
    description,
    price,
    category
  }
`;

// ─── Cross-direction helpers ──────────────────────────────────────────────────
//
// A photo's place / shoot can be tagged in two ways:
//   FORWARD:  photo.place / photo.shoot (recommended — new uploads)
//   LEGACY:   place.photos[] / shoot.photos[] (curated array on the place/shoot)
//
// All photo queries below use coalesce(forward, reverse) so either works.
// The map page and shoot detail page additionally union forward-tagged photos
// with legacy-array photos in JS.

// ─── Map / places ─────────────────────────────────────────────────────────────

export const placesQuery = groq`
  *[_type == "place" && defined(location)] | order(coalesce(order, 9999) asc, name asc) {
    _id,
    name,
    "slug": slug.current,
    location,
    kind,
    blurb,
    projectInfo,
    "photoIds": photos[]._ref,
    "legacyPhotos": photos[]->{ _id, image, alt, location, dateTaken },
    "forwardPhotos": *[_type == "photo" && place._ref == ^._id]{
      _id, image, alt, location, dateTaken
    },
    posts[]{ title, date, body, link }
  }
`;

export const shootsForMapQuery = groq`
  *[_type == "shoot"] | order(coalesce(date, _createdAt) desc) {
    _id,
    title,
    "slug": slug.current,
    date,
    "coverImage": coalesce(
      coverImage->{ _id, image, alt },
      photos[0]->{ _id, image, alt },
      *[_type == "photo" && shoot._ref == ^._id][0]{ _id, image, alt }
    ),
    "legacyPhotoIds": photos[]._ref,
    "forwardPhotoIds": *[_type == "photo" && shoot._ref == ^._id]._id
  }
`;

// ─── /gallery — filterable grid ───────────────────────────────────────────────

export const galleryFeedQuery = groq`
  {
    "photos": *[_type == "photo"] | order(coalesce(dateTaken, _createdAt) desc) {
      _id,
      image,
      alt,
      location,
      dateTaken,
      tags,
      "place": coalesce(
        place->{ _id, name, "slug": slug.current },
        *[_type == "place" && ^._id in photos[]._ref][0]{
          _id, name, "slug": slug.current
        }
      ),
      "shoot": coalesce(
        shoot->{ _id, title, "slug": slug.current, date, tags, wardrobe },
        *[_type == "shoot" && references(^._id)][0]{
          _id, title, "slug": slug.current, date, tags, wardrobe
        }
      )
    },
    "places": *[_type == "place"] | order(name asc) {
      _id,
      name,
      "slug": slug.current
    },
    "tagsFromShoots": array::unique(*[_type == "shoot"].tags[]),
    "tagsFromPhotos": array::unique(*[_type == "photo"].tags[]),
    "colors": array::unique(*[_type == "shoot" && defined(wardrobe.colors)].wardrobe.colors[])
  }
`;

// ─── /shoots ──────────────────────────────────────────────────────────────────

export const shootsListQuery = groq`
  *[_type == "shoot"] | order(coalesce(date, _createdAt) desc) {
    _id,
    title,
    "slug": slug.current,
    date,
    description,
    tags,
    featured,
    "coverImage": coalesce(
      coverImage->{ _id, image, alt },
      photos[0]->{ _id, image, alt },
      *[_type == "photo" && shoot._ref == ^._id][0]{ _id, image, alt }
    ),
    "legacyPhotoIds": photos[]._ref,
    "forwardPhotoIds": *[_type == "photo" && shoot._ref == ^._id]._id
  }
`;

export const shootBySlugQuery = groq`
  *[_type == "shoot" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    date,
    description,
    tags,
    wardrobe,
    "coverImage": coalesce(
      coverImage->{ _id, image, alt },
      photos[0]->{ _id, image, alt },
      *[_type == "photo" && shoot._ref == ^._id][0]{ _id, image, alt }
    ),
    "legacyPhotos": photos[]->{
      _id,
      image,
      alt,
      location,
      dateTaken,
      tags,
      "place": coalesce(
        place->{ _id, name, "slug": slug.current },
        *[_type == "place" && ^._id in photos[]._ref][0]{
          _id, name, "slug": slug.current
        }
      )
    },
    "forwardPhotos": *[_type == "photo" && shoot._ref == ^._id] | order(coalesce(dateTaken, _createdAt) asc) {
      _id,
      image,
      alt,
      location,
      dateTaken,
      tags,
      "place": coalesce(
        place->{ _id, name, "slug": slug.current },
        *[_type == "place" && ^._id in photos[]._ref][0]{
          _id, name, "slug": slug.current
        }
      )
    }
  }
`;

// ─── /photos/[id] ─────────────────────────────────────────────────────────────

export const photoByIdQuery = groq`
  *[_type == "photo" && _id == $id][0] {
    _id,
    image,
    alt,
    location,
    dateTaken,
    tags,
    "place": coalesce(
      place->{ _id, name, "slug": slug.current },
      *[_type == "place" && ^._id in photos[]._ref][0]{
        _id, name, "slug": slug.current
      }
    ),
    "shoot": coalesce(
      shoot->{
        _id,
        title,
        "slug": slug.current,
        date,
        tags,
        wardrobe,
        "siblings": *[_type == "photo" && shoot._ref == ^._id && _id != ^.^._id]{
          _id, image, alt
        }
      },
      *[_type == "shoot" && references(^._id)][0]{
        _id,
        title,
        "slug": slug.current,
        date,
        tags,
        wardrobe,
        "siblings": photos[]->{ _id, image, alt }
      }
    )
  }
`;

// More photos at the same place — covers both forward refs and legacy array,
// excluding the current photo.
export const morePhotosAtPlaceQuery = groq`
  *[
    _type == "photo" &&
    _id != $excludePhotoId &&
    (place._ref == $placeId ||
     _id in *[_type == "place" && _id == $placeId][0].photos[]._ref)
  ] | order(coalesce(dateTaken, _createdAt) desc) [0...12] {
    _id, image, alt
  }
`;
