import React, { useState } from "react";
import Layout from "@/components/Layout";
import axios from "axios";
import { redirect } from "next/navigation";
import { useRouter } from "next/router";
import ProductForm from "@/components/ProductForm";

const NewProduct = () => {
  return (
    <Layout>
      <h1>New Product</h1>
      <ProductForm />
    </Layout>
  );
};

export default NewProduct;
