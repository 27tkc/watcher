import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  const { userId } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Watcher Premium Membership",
            },
            unit_amount: 1000, // $10.00
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/settings?payment=success&userId=${userId}`,
      cancel_url: `${process.env.FRONTEND_URL}/settings?payment=cancel`,
    });

    res.json({ id: session.id });
  } catch (err) {
    console.error("Stripe error:", err);
    res.status(500).json({ error: "Failed to create Stripe Checkout session" });
  }
};
