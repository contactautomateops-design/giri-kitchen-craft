// N8N Webhook Configuration
// Replace these placeholder URLs with your actual n8n webhook URLs

export const N8N_WEBHOOKS = {
  // SMS/OTP webhooks
  SEND_OTP: "https://your-n8n-instance.com/webhook/send-otp", // TODO: Replace with your n8n webhook URL
  VERIFY_OTP: "https://your-n8n-instance.com/webhook/verify-otp", // TODO: Replace with your n8n webhook URL

  // Email notification webhooks
  ORDER_CONFIRMATION_CUSTOMER: "https://your-n8n-instance.com/webhook/order-confirmation-customer", // TODO: Replace
  ORDER_NOTIFICATION_SELLER: "https://your-n8n-instance.com/webhook/order-notification-seller", // TODO: Replace
  WELCOME_EMAIL: "https://your-n8n-instance.com/webhook/welcome-email", // TODO: Replace
};

// Send OTP via n8n webhook
export const sendOtp = async (phone: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await fetch(N8N_WEBHOOKS.SEND_OTP, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to send OTP");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Verify OTP via n8n webhook
export const verifyOtp = async (phone: string, otp: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await fetch(N8N_WEBHOOKS.VERIFY_OTP, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, otp }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Invalid OTP");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Send order confirmation email to customer via n8n
export const sendOrderConfirmationEmail = async (orderData: {
  customerEmail: string;
  customerName: string;
  orderId: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  discount: number;
  deliveryAddress: string;
}) => {
  try {
    await fetch(N8N_WEBHOOKS.ORDER_CONFIRMATION_CUSTOMER, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });
  } catch (error) {
    console.error("Failed to send customer email:", error);
  }
};

// Send order notification to seller via n8n
export const sendOrderNotificationToSeller = async (orderData: {
  customerName: string;
  customerPhone: string;
  orderId: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  deliveryAddress: string;
}) => {
  try {
    await fetch(N8N_WEBHOOKS.ORDER_NOTIFICATION_SELLER, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });
  } catch (error) {
    console.error("Failed to send seller notification:", error);
  }
};

// Send welcome email via n8n
export const sendWelcomeEmail = async (data: { email: string; name: string }) => {
  try {
    await fetch(N8N_WEBHOOKS.WELCOME_EMAIL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error("Failed to send welcome email:", error);
  }
};
