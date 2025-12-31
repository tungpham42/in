import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import StyledComponentsRegistry from "@/lib/AntdRegistry";
import { ConfigProvider } from "antd";
import viVN from "antd/locale/vi_VN";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "POD Việt Nam Store",
  description: "Cửa hàng quà tặng in ấn chất lượng cao",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body
        className={inter.className}
        style={{ margin: 0, background: "#f0f2f5" }}
      >
        <StyledComponentsRegistry>
          <ConfigProvider
            locale={viVN}
            theme={{ token: { colorPrimary: "#ff4d4f" } }}
          >
            {children}
          </ConfigProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
