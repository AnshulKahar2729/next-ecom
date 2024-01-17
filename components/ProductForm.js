import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { set } from "mongoose";
import Spinner from "./Spinner";

export default function ProductForm({
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  _id,
  images: existingImages,
  category: existingCategory,
  productProperties : existingProductProperties
}) {
  const [title, setTitle] = useState(existingTitle || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [price, setPrice] = useState(existingPrice || "");
  const [images, setImages] = useState(existingImages || []);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(existingCategory || "");
  const [productProperties, setProductProperties] = useState(existingProductProperties || {});
  const [goToProducts, setGoToProducts] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const saveProduct = async (event) => {
    event.preventDefault();
    const data = { title, description, price, images, category, productProperties };
    if (_id) {
      await axios.put("/api/products", { ...data, _id });
    } else {
      await axios.post("/api/products", data);
    }
    setGoToProducts(true);
  };

  if (goToProducts) {
    router.push("/products");
  }

  async function uploadImages(event) {
    const files = event.target?.files;

    setLoading(false);
    setLoading(true);

    if (files.length > 0) {
      const formData = new FormData();
      for (const file of files) {
        formData.append("file", file);
      }
      const { data } = await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (data.success) {
        console.log(data.link);
        const newImages = [...images, data.link];
        setImages(newImages);
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await axios.get("/api/categories");
      setCategories(data);
      console.log(data);
    };

    fetchCategories();
  }, []);

  const propertiesToFill = [];
  // categories --> all categories by GET API and category --> selected category ID
  if (categories.length > 0 && category) {
    let selectedCategory = categories.find((c) => c._id === category);
    if (selectedCategory) {
      propertiesToFill.push(...selectedCategory.properties);
    }

    // for parent categories
    while (selectedCategory?.parentCategory?._id) {
      const parentCategory = categories.find(
        (c) => c._id === selectedCategory.parentCategory._id
      );
      if (parentCategory) {
        propertiesToFill.push(...parentCategory.properties);

        // to further get more grandparent categories
        selectedCategory = parentCategory;
      }
    }
  }

  const setProductProp = (name, value) => {
    setProductProperties((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={saveProduct}>
      <label htmlFor="productName">Product Name</label>
      <input
        type="text"
        placeholder="product name"
        id="productName"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />
      <label>Category</label>
      <select
        value={category}
        onChange={(event) => setCategory(event.target.value)}
      >
        <option value="">Uncategorized</option>
        {categories?.length > 0 &&
          categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
      </select>

      {propertiesToFill.length > 0 && (
        <h2 className=" text-blue-800">Properties</h2>
      )}
      {propertiesToFill.length > 0 &&
        propertiesToFill.map((p) => (
          <div key={p.name} className="">
            <label>{p.name[0].toUpperCase() + p.name.substring(1)}</label>
            <div>
              <select
                value={productProperties[p.name]}
                onChange={(ev) => setProductProp(p.name, ev.target.value)}
              >
                {p.values.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      <label htmlFor="">Photos</label>
      <div
        className={`mb-2 ${images.length > 0 || loading ? "flex gap-3" : ""} `}
      >
        <label className="cursor-pointer w-24 h-24 text-center flex items-center justify-center text-sm gap-1 text-gray-500 rounded-lg bg-gray-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
          Upload
          <input type="file" className="hidden" onChange={uploadImages} />
        </label>
        {!images?.length && !loading && <div>No photos in this product</div>}
        {images?.length > 0 &&
          images.map((image, index) => (
            <div key={index}>
              <img src={image} className=" w-24 h-24 rounded-lg" />
            </div>
          ))}
        {loading && (
          <div className="w-24 h-24 rounded-lg flex flex-col items-center ">
            Uploading...
            <Spinner loading={loading} />
          </div>
        )}
      </div>
      <label htmlFor="description">Description</label>
      <textarea
        placeholder="description"
        id="description"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      ></textarea>
      <label htmlFor="price">Price (in USD)</label>
      <input
        type="text"
        placeholder="price"
        id="price"
        value={price}
        onChange={(event) => setPrice(event.target.value)}
      />
      <button type="submit" className="btn-primary">
        Save
      </button>
    </form>
  );
}
