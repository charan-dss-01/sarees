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
    title:  { type: String, required: [true, "Title is required"], trim: true },
    price:  { type: Number, required: [true, "Price is required"], min: 0 },
    fabric: { type: String, required: [true, "Fabric is required"], trim: true },
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

SareeSchema.index({ collection: 1 });
SareeSchema.index({ fabric: 1 });

export const Saree = mongoose.model<ISaree>("Saree", SareeSchema);
