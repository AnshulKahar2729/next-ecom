import Layout from "@/components/Layout";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";

const Categories = ({ swal }) => {
  const [editedCategory, setEditedCategory] = useState(null);
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [parentCategory, setParentCategory] = useState("");
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCategories = async () => {
    setIsLoading(true)
    const { data } = await axios.get("/api/categories");
    setCategories(data);
    setIsLoading(false);
  };

  const saveCategories = async (event) => {
    event.preventDefault();
    if (editedCategory) {
      await axios.put("/api/categories", {
        name,
        parentCategory,
        _id: editedCategory._id,
        properties: properties.map((property) => ({
          name: property.name,
          values: property.values.split(","),
        })),
      });
      setEditedCategory(null);
    } else {
      await axios.post("/api/categories", {
        name,
        parentCategory,
        properties: properties.map((property) => ({
          name: property.name,
          values: property.values.split(","),
        })),
      });
    }
    fetchCategories();
    setName("");
    setParentCategory("");
    setProperties([]);
  };

  const editCategory = (category) => {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category.parentCategory?._id || "");
    setProperties(category.properties)
  };

  const deleteCategory = async (category) => {
    const response = await swal.fire({
      title: "Are you sure ?",
      text: `Do you want to delete ${category.name} `,
      showCancelButton: true,
      cancelButtonTitle: "Cancel",
      showConfirmButton: true,
      confirmButtonText: "Yes, Delete!",
      confirmButtonColor: "#d55",
    });

    if (response.isConfirmed) {
      await axios.delete(`/api/categories?id=${category._id}`);
      fetchCategories();
    }
  };

  const addProperty = () => {
    setProperties((prev) => [...prev, { name: "", values: "" }]);
  };

  const handlePropertyNameChange = (index, newName) => {
    setProperties((prev) => {
      const newProperties = [...prev];
      newProperties[index].name = newName;
      return newProperties;
    });
  };

  const handlePropertyValuesChange = (index, newValues) => {
    setProperties((prev) => {
      const newProperties = [...prev];
      newProperties[index].values = newValues;
      return newProperties;
    });
  };

  const removeProperty = (indexToRemove) => {
    const newProperties = properties.filter(
      (property, index) => index !== indexToRemove
    );
    setProperties(newProperties);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <Layout>
      <h1>Categories</h1>
      <label htmlFor="">
        {editedCategory
          ? `Edit Category ${editedCategory.name}`
          : "New Category Name"}
      </label>
      <form onSubmit={saveCategories} className="">
        <div className="flex gap-1">
          <input
            type="text"
            className=""
            placeholder="Category name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <select
            className=""
            value={parentCategory}
            onChange={(event) => setParentCategory(event.target.value)}
          >
            <option value="">No parent category</option>
            {categories.length > 0 &&
              categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
          </select>
        </div>

        <div className=" mb-2">
          <label className=" block">Properties</label>
          <button
            onClick={addProperty}
            className="btn-default text-sm mb-2"
            type="button"
          >
            Add new property
          </button>
          {properties.length > 0 &&
            properties.map((property, index) => (
              <div key={index} className="mb-2 flex gap-1">
                <input
                  onChange={(event) => {
                    handlePropertyNameChange(index, event.target.value);
                  }}
                  className=" mb-0"
                  value={property.name}
                  type="text"
                  placeholder="property name (example: color)"
                />
                <input
                  onChange={(event) => {
                    handlePropertyValuesChange(index, event.target.value);
                  }}
                  className=" mb-0"
                  value={property.values}
                  type="text"
                  placeholder="values, comma seperated"
                />
                <button
                  onClick={() => {
                    removeProperty(index);
                  }}
                  type="button"
                  className="btn-default"
                >
                  Remove
                </button>
              </div>
            ))}
        </div>

        <div className="flex gap-1">
          {editedCategory && (
            <button
              type="button"
              onClick={() => {
                setEditedCategory(null);
                setName("");
                setParentCategory("");
                setProperties([]);
              }}
              className="btn-default"
            >
              Cancel
            </button>
          )}
          <button type="submit" className="btn-primary py-1">
            Save
          </button>
        </div>
      </form>
      {!editedCategory && !isLoading && (
        <table className="basic mt-2">
          <thead>
            <tr>
              <td>Category name</td>
              <td>Parent Category</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 &&
              categories.map((category) => (
                <tr key={category._id}>
                  <td>{category.name}</td>
                  <td>
                    {!category.parentCategory?.name
                      ? "No parent category"
                      : category.parentCategory?.name}
                  </td>
                  <td>
                    <button
                      className=" btn-primary mr-1"
                      onClick={() => {
                        editCategory(category);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className=" btn-primary"
                      onClick={() => {
                        deleteCategory(category);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
          <tbody>
            {categories.length === 0 && !isLoading && (
              <div className=" mt-2 text-center text-blue-800">
                No categories name
              </div>
            )}
          </tbody>
        </table>
      )}
    </Layout>
  );
};

export default withSwal(({ swal }, ref) => <Categories swal={swal} />);
