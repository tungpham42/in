import React from "react"; // Bỏ useState ở đây vì phần fetch là server
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/merchize";
import ProductDetailClient from "./ProductDetailClient"; // Tách client logic ra

// Server Component: Chịu trách nhiệm Fetch dữ liệu
export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    return notFound();
  }

  // Truyền dữ liệu xuống Client Component để xử lý Form & Antd interactivity
  return <ProductDetailClient product={product} />;
}
