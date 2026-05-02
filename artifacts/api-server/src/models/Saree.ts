import mongoose, { Document, Schema, Types } from "mongoose";

export interface ISaree extends Omit<Document, "collection"> {
  title: string;
  price: number;
  fabric: string;
  images: string[];
  collection: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const SareeSchema = new Schema<ISaree>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title must be at most 200 characters"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [1, "Price must be greater than 0"],
    },
    fabric: {
      type: String,
      required: [true, "Fabric is required"],
      trim: true,
      maxlength: [100, "Fabric name must be at most 100 characters"],
    },
    images: {
      type: [String],
      required: true,
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: "At least one image is required",
      },
    },
    collection: {
      type: Schema.Types.ObjectId,
      ref: "Collection",
      required: [true, "Collection is required"],
    },
  },
  { timestamps: true },
);

/* ── indexes ─────────────────────────────────────────────── */
SareeSchema.index({ collection: 1, createdAt: -1 });  /* list by collection, newest first */
SareeSchema.index({ fabric: 1 });                      /* filter by fabric */
SareeSchema.index({ title: "text" });                  /* full-text search on title */

export const Saree = mongoose.model<ISaree>("Saree", SareeSchema);
