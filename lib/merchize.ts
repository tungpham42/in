import { Product } from "@/types";

interface MerchizeProduct {
  id: string | number;
  title: string;
  handle: string;
  variants?: Array<{
    price: string | number;
    sku?: string;
  }>;
  images?: Array<{
    src: string;
  }>;
  product_type?: string;
}

const MERCHIZE_DOMAIN = process.env.MERCHIZE_DOMAIN;
const MERCHIZE_SECRET = process.env.MERCHIZE_SECRET;

// Hàm helper để gọi API
async function fetchMerchize(endpoint: string) {
  if (!MERCHIZE_DOMAIN || !MERCHIZE_SECRET) {
    throw new Error("Missing API Config");
  }

  const res = await fetch(`${MERCHIZE_DOMAIN}${endpoint}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-Merchize-AccessToken": MERCHIZE_SECRET,
    },
    // Quan trọng: Cache dữ liệu trong 1 giờ (3600s) để web tải nhanh.
    // Nếu muốn mới nhất mỗi lần f5 thì để 0.
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch Merchize: ${res.statusText}`);
  }

  return res.json();
}

// Hàm map dữ liệu từ Merchize -> Format của App
function mapMerchizeProduct(item: MerchizeProduct): Product {
  // Lấy giá từ biến thể đầu tiên
  const firstVariant = item.variants?.[0];
  const price = firstVariant ? parseFloat(String(firstVariant.price)) : 0;

  return {
    id: item.id.toString(),
    title: item.title,
    slug: item.handle, // Merchize dùng 'handle' cho URL friendly
    price: price,
    // Lấy ảnh đầu tiên, nếu không có thì dùng placeholder
    thumbnail:
      item.images?.[0]?.src || "https://placehold.co/400x400.png?text=No+Image",
    sku: firstVariant?.sku || "UNKNOWN",
    category: item.product_type || "General",
  };
}

// 1. Lấy toàn bộ sản phẩm
export async function getProducts(): Promise<Product[]> {
  try {
    const data = await fetchMerchize("/api/products.json?limit=50");
    return data.products.map(mapMerchizeProduct);
  } catch (error) {
    console.error("Get Products Error:", error);
    return [];
  }
}

// 2. Lấy chi tiết 1 sản phẩm theo slug (handle)
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    // Merchize API chuẩn thường cho filter theo handle
    // Nếu API của bạn không hỗ trợ filter handle trực tiếp,
    // ta phải fetch list rồi find (như bên dưới).
    const data = await fetchMerchize(`/api/products.json?handle=${slug}`);

    // API trả về array, ta lấy phần tử đầu tiên
    if (data.products && data.products.length > 0) {
      return mapMerchizeProduct(data.products[0]);
    }
    return null;
  } catch (error) {
    console.error("Get Product Error:", error);
    return null;
  }
}
