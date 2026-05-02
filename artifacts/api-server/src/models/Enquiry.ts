import mongoose, { Document, Schema, Types } from "mongoose";

export interface IEnquiry extends Document {
  sareeId: Types.ObjectId | null;
  sareeTitle: string;
  createdAt: Date;
}

const EnquirySchema = new Schema<IEnquiry>(
  {
    sareeId: { type: Schema.Types.ObjectId, ref: "Saree", default: null },
    sareeTitle: { type: String, default: "", trim: true, maxlength: 200 },
  },
  { timestamps: true },
);

EnquirySchema.index({ createdAt: -1 });
EnquirySchema.index({ sareeId: 1 });

export const Enquiry = mongoose.model<IEnquiry>("Enquiry", EnquirySchema);
