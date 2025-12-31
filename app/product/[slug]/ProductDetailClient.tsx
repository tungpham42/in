"use client";

import React, { useState } from "react";
import {
  Row,
  Col,
  Typography,
  Form,
  Input,
  Button,
  Radio,
  message,
  Breadcrumb,
} from "antd";
import AppHeader from "@/components/Header";
import { Product } from "@/types";
import axios from "axios";
import Image from "next/image";

const { Title } = Typography;

interface OrderFormValues {
  size: string;
  fullname: string;
  phone: string;
  address: string;
}

export default function ProductDetailClient({ product }: { product: Product }) {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values: OrderFormValues) => {
    setLoading(true);
    try {
      // Gọi Netlify Function đã tạo trước đó
      const res = await axios.post("/.netlify/functions/create-order", {
        ...values,
        sku: product.sku, // Dùng SKU thật từ Merchize
      });

      if (res.data.success) {
        message.success(`Đặt hàng thành công! Mã đơn: ${res.data.orderId}`);
        form.resetFields();
      } else {
        message.error("Lỗi hệ thống: " + (res.data.error || "Unknown"));
      }
    } catch (error) {
      console.error("Order Error:", error);
      message.error("Không thể kết nối đến server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AppHeader />
      <div
        style={{
          padding: "40px 20px",
          maxWidth: 1000,
          margin: "0 auto",
          background: "#fff",
          marginTop: 20,
          borderRadius: 8,
        }}
      >
        <Breadcrumb
          items={[
            { title: "Trang chủ" },
            { title: product.category },
            { title: product.title },
          ]}
          style={{ marginBottom: 20 }}
        />

        <Row gutter={[40, 40]}>
          <Col xs={24} md={12}>
            <div
              style={{
                position: "relative",
                width: "100%",
                height: 400,
                border: "1px solid #eee",
              }}
            >
              <Image
                src={product.thumbnail}
                alt={product.title}
                fill
                style={{ objectFit: "contain" }}
                // Cần config domain ảnh trong next.config.js nếu ảnh từ server lạ
              />
            </div>
          </Col>

          <Col xs={24} md={12}>
            <Title level={3}>{product.title}</Title>
            <Title level={4} type="danger">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(product.price)}
            </Title>

            <Form
              layout="vertical"
              form={form}
              onFinish={onFinish}
              style={{
                marginTop: 30,
                background: "#fafafa",
                padding: 20,
                borderRadius: 8,
              }}
            >
              <Title level={5}>Đặt hàng nhanh (COD)</Title>

              <Form.Item
                label="Size"
                name="size"
                initialValue="L"
                rules={[{ required: true }]}
              >
                <Radio.Group buttonStyle="solid">
                  <Radio.Button value="M">M</Radio.Button>
                  <Radio.Button value="L">L</Radio.Button>
                  <Radio.Button value="XL">XL</Radio.Button>
                  <Radio.Button value="2XL">2XL</Radio.Button>
                </Radio.Group>
              </Form.Item>

              <Form.Item
                name="fullname"
                rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
              >
                <Input placeholder="Họ và tên người nhận" size="large" />
              </Form.Item>

              <Form.Item
                name="phone"
                rules={[{ required: true, message: "Vui lòng nhập SĐT" }]}
              >
                <Input placeholder="Số điện thoại" size="large" type="tel" />
              </Form.Item>

              <Form.Item
                name="address"
                rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
              >
                <Input.TextArea placeholder="Địa chỉ chi tiết" rows={2} />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={loading}
                style={{ height: 50, fontSize: 18, fontWeight: "bold" }}
              >
                MUA NGAY
              </Button>
            </Form>
          </Col>
        </Row>
      </div>
    </>
  );
}
