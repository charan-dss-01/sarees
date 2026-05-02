import mongoose, { Document, Schema } from "mongoose";

export interface ICollection extends Document {
  name: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

const CollectionSchema = new Schema<ICollection>(
  {
    name: {
      type: String,
      required: [true, "Collection name is required"],
      trim: true,
      unique: true,
      maxlength: [80, "Collection name must be at most 80 characters"],
    },
    image: {
      type: String,
      required: [true, "Collection image is required"],
    },
  },
  { timestamps: true },
);

CollectionSchema.index({ name: 1 }, { unique: true });  /* enforce uniqueness + fast lookup */

export const Collection = mongoose.model<ICollection>("Collection", CollectionSchema);
