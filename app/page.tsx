import AppHeader from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/merchize"; // Import hàm mới
import { Col, Row, Typography, Empty } from "antd";

// Server Component (Async)
export default async function Home() {
  // Gọi API lấy dữ liệu thật
  const products = await getProducts();

  return (
    <>
      <AppHeader />
      <main style={{ padding: "40px 20px", maxWidth: 1200, margin: "0 auto" }}>
        <Typography.Title
          level={2}
          style={{ textAlign: "center", marginBottom: 40 }}
        >
          Sản phẩm mới nhất
        </Typography.Title>

        {products.length > 0 ? (
          <Row gutter={[24, 24]}>
            {products.map((product) => (
              <Col xs={24} sm={12} md={8} key={product.id}>
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
        ) : (
          <Empty description="Chưa có sản phẩm nào trên Merchize" />
        )}
      </main>
    </>
  );
}
