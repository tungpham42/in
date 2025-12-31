"use client";
import { Layout, Menu } from "antd";
import Link from "next/link";

const { Header } = Layout;

export default function AppHeader() {
  return (
    <Header
      style={{
        display: "flex",
        alignItems: "center",
        background: "#fff",
        padding: "0 20px",
        boxShadow: "0 2px 8px #f0f1f2",
      }}
    >
      <div
        style={{
          fontWeight: "bold",
          fontSize: 20,
          marginRight: 40,
          color: "#ff4d4f",
        }}
      >
        <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>
          POD VIET
        </Link>
      </div>
      <Menu
        mode="horizontal"
        defaultSelectedKeys={["1"]}
        style={{ flex: 1, borderBottom: "none" }}
        items={[
          { key: "1", label: <Link href="/">Trang chủ</Link> },
          { key: "2", label: "Áo Thun" },
          { key: "3", label: "Cốc Sứ" },
        ]}
      />
    </Header>
  );
}
