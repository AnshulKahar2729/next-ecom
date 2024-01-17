import mongoose, { Schema, model, models } from "mongoose";

const CategorySchema = Schema({
  name: { type: String, required: true, unique: true },
  parentCategory: {
    type: mongoose.Types.ObjectId,
    ref: "Category",
    required: false,
  },
  properties: [
    {
      type: Object,
    },
  ],
});

export const Category = models?.Category || model("Category", CategorySchema);
