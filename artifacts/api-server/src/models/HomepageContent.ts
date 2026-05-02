import mongoose, { Document, Schema } from "mongoose";

export interface IFeaturedCollection {
  collectionId: string;
  label: string;
  image: string;
}

export interface IBanner {
  title: string;
  subtitle: string;
  image: string;
  ctaText: string;
  ctaLink: string;
}

export interface IHomepageContent extends Document {
  heroImages: string[];
  featuredCollections: IFeaturedCollection[];
  banners: IBanner[];
  updatedAt: Date;
}

const HomepageContentSchema = new Schema<IHomepageContent>(
  {
    heroImages: { type: [String], default: [] },
    featuredCollections: {
      type: [
        {
          collectionId: { type: String, required: true },
          label:        { type: String, required: true },
          image:        { type: String, required: true },
        },
      ],
      default: [],
    },
    banners: {
      type: [
        {
          title:    { type: String, required: true },
          subtitle: { type: String, default: "" },
          image:    { type: String, required: true },
          ctaText:  { type: String, default: "Shop Now" },
          ctaLink:  { type: String, default: "/collections" },
        },
      ],
      default: [],
    },
  },
  { timestamps: true },
);

export const HomepageContent = mongoose.model<IHomepageContent>(
  "HomepageContent",
  HomepageContentSchema,
);
