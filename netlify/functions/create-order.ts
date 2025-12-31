import { Handler } from "@netlify/functions";
import axios, { AxiosError } from "axios";

const handler: Handler = async (event) => {
  // Chỉ chấp nhận method POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const data = JSON.parse(event.body || "{}");

    // Lấy Key từ Environment Variables (Cài đặt trên Netlify Dashboard)
    const MERCHIZE_SECRET = process.env.MERCHIZE_SECRET;
    const MERCHIZE_DOMAIN = process.env.MERCHIZE_DOMAIN; // vd: https://shop-cua-ban.merchize.com

    if (!MERCHIZE_SECRET || !MERCHIZE_DOMAIN) {
      throw new Error("Missing Environment Variables");
    }

    // Cấu trúc payload gửi sang Merchize
    // Lưu ý: Logic này map dữ liệu từ Form Vietnam sang chuẩn Merchize
    const merchizePayload = {
      shipping_address: {
        first_name: data.fullname,
        address1: data.address,
        phone: data.phone,
        city: data.city || "Other", // Merchize bắt buộc field này
        country: "VN",
        zip: "700000", // Zipcode giả định cho VN
      },
      line_items: [
        {
          sku: data.sku, // SKU sản phẩm
          quantity: data.quantity || 1,
        },
      ],
      financial_status: "pending", // Đơn hàng COD (Chưa thanh toán)
      note: "Đơn hàng từ Website NextJS",
    };

    // Gọi Merchize API
    const response = await axios.post(
      `${MERCHIZE_DOMAIN}/api/orders.json`,
      { order: merchizePayload },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Merchize-AccessToken": MERCHIZE_SECRET,
        },
      }
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Order created successfully",
        orderId: response.data.order?.id,
      }),
    };
  } catch (error: unknown) {
    console.error(
      "Merchize Error:",
      (error as AxiosError).response?.data || (error as Error).message
    );
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to create order",
        details: (error as AxiosError).response?.data,
      }),
    };
  }
};

export { handler };
