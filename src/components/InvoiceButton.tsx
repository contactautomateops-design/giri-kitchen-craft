import { FileText } from "lucide-react";

interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  subtotal: number;
  discount: number;
  total: number;
  coupon_code: string | null;
  status: string;
  created_at: string;
  order_items?: OrderItem[];
}

const generateInvoiceHTML = (order: Order) => {
  const date = new Date(order.created_at).toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  });
  const time = new Date(order.created_at).toLocaleTimeString("en-IN", {
    hour: "2-digit", minute: "2-digit",
  });

  const itemsRows = (order.order_items || []).map((item, i) => `
    <tr>
      <td style="padding:10px 12px;border-bottom:1px solid #f0e6d6;font-size:13px;color:#3d2e1f;">${i + 1}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #f0e6d6;font-size:13px;color:#3d2e1f;">${item.product_name}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #f0e6d6;font-size:13px;color:#3d2e1f;text-align:center;">${item.quantity}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #f0e6d6;font-size:13px;color:#3d2e1f;text-align:right;">₹${item.price}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #f0e6d6;font-size:13px;color:#3d2e1f;text-align:right;font-weight:600;">₹${item.price * item.quantity}</td>
    </tr>
  `).join("");

  return `<!DOCTYPE html>
<html>
<head>
  <title>Invoice #${order.id.slice(0, 8)} - Giri Kitchen Craft</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap');
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family:'Inter',sans-serif; background:#faf6f1; color:#3d2e1f; }
    @media print {
      body { background:white; }
      .no-print { display:none !important; }
    }
  </style>
</head>
<body>
  <div style="max-width:700px;margin:0 auto;padding:30px;">
    <!-- Print button -->
    <div class="no-print" style="text-align:right;margin-bottom:20px;">
      <button onclick="window.print()" style="padding:10px 24px;background:#e87000;color:white;border:none;border-radius:10px;font-family:'Inter',sans-serif;font-size:13px;font-weight:600;cursor:pointer;">
        🖨️ Print / Save PDF
      </button>
    </div>

    <div style="background:white;border-radius:16px;border:1px solid #f0e6d6;overflow:hidden;">
      <!-- Header -->
      <div style="background:linear-gradient(135deg,#e87000,#f5a623);padding:30px;color:white;">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div>
            <h1 style="font-family:'Playfair Display',serif;font-size:24px;margin-bottom:4px;">Giri Kitchen Craft</h1>
            <p style="font-size:12px;opacity:0.9;">Pure • Natural • Delicious</p>
          </div>
          <div style="text-align:right;">
            <p style="font-size:20px;font-weight:700;">INVOICE</p>
            <p style="font-size:11px;opacity:0.9;">#${order.id.slice(0, 8).toUpperCase()}</p>
          </div>
        </div>
      </div>

      <div style="padding:30px;">
        <!-- Order info -->
        <div style="display:flex;justify-content:space-between;margin-bottom:24px;">
          <div>
            <p style="font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#9a8a7a;margin-bottom:6px;">Bill To</p>
            <p style="font-size:14px;font-weight:600;">${order.customer_name}</p>
            <p style="font-size:12px;color:#6b5e52;">${order.customer_phone}</p>
            <p style="font-size:12px;color:#6b5e52;max-width:250px;">${order.delivery_address}</p>
          </div>
          <div style="text-align:right;">
            <p style="font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#9a8a7a;margin-bottom:6px;">Invoice Date</p>
            <p style="font-size:13px;font-weight:500;">${date}</p>
            <p style="font-size:12px;color:#6b5e52;">${time}</p>
            <div style="margin-top:8px;display:inline-block;padding:4px 12px;border-radius:20px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;${
              order.status === "delivered" ? "background:#ecfdf5;color:#059669;" :
              order.status === "cancelled" ? "background:#fef2f2;color:#dc2626;" :
              "background:#fff7ed;color:#e87000;"
            }">${order.status}</div>
          </div>
        </div>

        <!-- Items table -->
        <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
          <thead>
            <tr style="background:#faf6f1;">
              <th style="padding:10px 12px;text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#9a8a7a;font-weight:600;">#</th>
              <th style="padding:10px 12px;text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#9a8a7a;font-weight:600;">Product</th>
              <th style="padding:10px 12px;text-align:center;font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#9a8a7a;font-weight:600;">Qty</th>
              <th style="padding:10px 12px;text-align:right;font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#9a8a7a;font-weight:600;">Price</th>
              <th style="padding:10px 12px;text-align:right;font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#9a8a7a;font-weight:600;">Amount</th>
            </tr>
          </thead>
          <tbody>${itemsRows}</tbody>
        </table>

        <!-- Totals -->
        <div style="display:flex;justify-content:flex-end;">
          <div style="width:250px;">
            <div style="display:flex;justify-content:space-between;padding:6px 0;font-size:13px;color:#6b5e52;">
              <span>Subtotal</span><span>₹${order.subtotal}</span>
            </div>
            ${order.discount > 0 ? `
            <div style="display:flex;justify-content:space-between;padding:6px 0;font-size:13px;color:#059669;">
              <span>Discount ${order.coupon_code ? `(${order.coupon_code})` : ""}</span><span>-₹${order.discount}</span>
            </div>` : ""}
            <div style="display:flex;justify-content:space-between;padding:12px 0;margin-top:8px;border-top:2px solid #e87000;font-size:16px;font-weight:700;color:#e87000;">
              <span>Total</span><span>₹${order.total}</span>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div style="margin-top:30px;padding-top:20px;border-top:1px solid #f0e6d6;text-align:center;">
          <p style="font-size:11px;color:#9a8a7a;">Thank you for your order! 🙏</p>
          <p style="font-size:10px;color:#c4b5a5;margin-top:4px;">Giri Kitchen Craft — Pure & Natural Goodness</p>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;
};

export const openInvoice = (order: Order) => {
  const html = generateInvoiceHTML(order);
  const win = window.open("", "_blank");
  if (win) {
    win.document.write(html);
    win.document.close();
  }
};

const InvoiceButton = ({ order, size = "sm" }: { order: Order; size?: "sm" | "xs" }) => {
  return (
    <button
      onClick={() => openInvoice(order)}
      className={`inline-flex items-center gap-1 rounded-lg border border-border font-body font-medium transition-colors hover:bg-secondary ${
        size === "xs" ? "px-2 py-1 text-[10px]" : "px-3 py-1.5 text-xs"
      }`}
      title="View Invoice"
    >
      <FileText className={size === "xs" ? "w-3 h-3" : "w-3.5 h-3.5"} />
      Invoice
    </button>
  );
};

export default InvoiceButton;
