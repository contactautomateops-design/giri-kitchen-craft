import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { order_id, type } = await req.json();

    if (!order_id || !type) {
      return new Response(JSON.stringify({ error: "order_id and type are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Fetch order with items
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("id", order_id)
      .single();

    if (orderError || !order) {
      return new Response(JSON.stringify({ error: "Order not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get user email
    const { data: userData } = await supabase.auth.admin.getUserById(order.user_id);
    const userEmail = userData?.user?.email;

    if (!userEmail) {
      return new Response(JSON.stringify({ error: "User email not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Build email content based on type
    let subject = "";
    let body = "";
    const orderDate = new Date(order.created_at).toLocaleDateString("en-IN", {
      day: "numeric", month: "long", year: "numeric",
    });

    const itemsList = (order.order_items || [])
      .map((item: any) => `• ${item.product_name} × ${item.quantity} — ₹${item.price * item.quantity}`)
      .join("\n");

    switch (type) {
      case "confirmation":
        subject = `Order Confirmed! #${order.id.slice(0, 8).toUpperCase()} — Giri Kitchen Craft`;
        body = `Hi ${order.customer_name},\n\nThank you for your order! 🎉\n\nOrder #${order.id.slice(0, 8).toUpperCase()}\nDate: ${orderDate}\n\nItems:\n${itemsList}\n\nSubtotal: ₹${order.subtotal}${order.discount > 0 ? `\nDiscount: -₹${order.discount}` : ""}\nTotal: ₹${order.total}\n\nDelivery Address: ${order.delivery_address}\n\nWe'll notify you when your order is shipped.\n\nBest regards,\nGiri Kitchen Craft 🌿`;
        break;
      case "shipped":
        subject = `Your Order is Shipped! #${order.id.slice(0, 8).toUpperCase()}`;
        body = `Hi ${order.customer_name},\n\nGreat news! Your order #${order.id.slice(0, 8).toUpperCase()} has been shipped. 🚚\n\nDelivery Address: ${order.delivery_address}\nTotal: ₹${order.total}\n\nYou'll receive your order soon!\n\nBest regards,\nGiri Kitchen Craft 🌿`;
        break;
      case "delivered":
        subject = `Order Delivered! #${order.id.slice(0, 8).toUpperCase()}`;
        body = `Hi ${order.customer_name},\n\nYour order #${order.id.slice(0, 8).toUpperCase()} has been delivered! ✅\n\nWe hope you enjoy our products. If you have any feedback, feel free to reach out.\n\nThank you for choosing Giri Kitchen Craft! 🙏\n\nBest regards,\nGiri Kitchen Craft 🌿`;
        break;
      case "cancelled":
        subject = `Order Cancelled — #${order.id.slice(0, 8).toUpperCase()}`;
        body = `Hi ${order.customer_name},\n\nYour order #${order.id.slice(0, 8).toUpperCase()} has been cancelled.\n\nIf you have any questions, please contact us.\n\nBest regards,\nGiri Kitchen Craft 🌿`;
        break;
      default:
        return new Response(JSON.stringify({ error: "Invalid notification type" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    // Store notification record (we log it since actual email sending requires email domain setup)
    console.log(`📧 Email notification: ${type} for order ${order.id} to ${userEmail}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${body}`);

    // Try to send via Lovable AI (if LOVABLE_API_KEY is available)
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    if (lovableApiKey) {
      // For now, log the notification. Full email sending requires email domain setup.
      // The notification is tracked and can be extended to use any email provider.
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: `Notification (${type}) prepared for ${userEmail}`,
      email: userEmail,
      subject,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
