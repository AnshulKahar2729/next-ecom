import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Categories";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();

  if (method === "GET") {
    res.json(await Category.find().populate("parentCategory"));
  }
  if (method === "POST") {
    const { name, parentCategory, properties } = req.body;

    const categoryDoc = await Category.create({
      name,
      parentCategory: parentCategory || undefined,
      properties,
    });
    res.json(categoryDoc);
  }
  if (method === "PUT") {
    const { name, parentCategory, _id, properties } = req.body;

    const categoryDoc = await Category.findByIdAndUpdate(_id, {
      name,
      parentCategory : parentCategory || undefined,
      properties
    });
    res.json(categoryDoc);
  }

  if (method === "DELETE") {
    const { id } = req.query;
    console.log(id);
    const categoryDoc = await Category.findByIdAndDelete(id);
    res.json("ok");
  }
}
