import mongoose, { Document, Schema } from "mongoose";

export interface ICollection extends Document {
  name: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

const CollectionSchema = new Schema<ICollection>(
  {
    name:  { type: String, required: [true, "Collection name is required"], trim: true },
    image: { type: String, required: [true, "Collection image is required"] },
  },
  { timestamps: true },
);

export const Collection = mongoose.model<ICollection>("Collection", CollectionSchema);
