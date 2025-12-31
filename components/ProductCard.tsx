"use client";
import { Card, Button, Typography } from "antd";
import { Product } from "@/types";
import Link from "next/link";
import Image from "next/image";

const { Meta } = Card;

export default function ProductCard({ product }: { product: Product }) {
  const priceString = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(product.price);

  return (
    <Link href={`/product/${product.slug}`} style={{ textDecoration: "none" }}>
      <Card
        hoverable
        cover={
          <div style={{ position: "relative", height: 250, width: "100%" }}>
            <Image
              src={product.thumbnail}
              alt={product.title}
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
        }
      >
        <Meta
          title={product.title}
          description={
            <Typography.Text type="danger" strong>
              {priceString}
            </Typography.Text>
          }
        />
        <Button type="primary" block style={{ marginTop: 12 }}>
          Xem ngay
        </Button>
      </Card>
    </Link>
  );
}
