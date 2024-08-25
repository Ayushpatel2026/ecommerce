import Stripe from "stripe";

// this code is from the stripe documentation for next.js
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  // the two shipping rates (top one is free, second one is fast) are from the Stripe backend and are hardcoded here
  /*
    * The code below creates a new Checkout Session object 
    * passing in the appropriate parameters and based on the cart items that the front end sent to us and part of the req body
      it returns the session ID to the client.
   */
  if (req.method === 'POST') {
    try {
      const params = {
            submit_type: 'pay',
            mode: 'payment',
            payment_method_types: ['card'],
            billing_address_collection: 'auto',
            shipping_options:[
                {
                    shipping_rate: 'shr_1PrjzV04O6loq1rnI0HhrGSZ',
                },
                {
                    shipping_rate: 'shr_1Prk0j04O6loq1rnixxP4cjG',
                }
            ],
            line_items: req.body.map((item) => {
                // reference the image of the product on Sanity
                const img = item.image[0].asset._ref;
                const newImage = img.replace('image-', 'https://cdn.sanity.io/images/xm1vbhow/production/').replace('-webp', '.webp');
                return {
                    price_data: {
                        currency: 'CAD',
                        product_data: {
                            name: item.name,
                            images: [newImage],
                        },
                        // convert the price to cents
                        unit_amount: item.price * 100,
                    },
                    adjustable_quantity: {
                        enabled: true,
                        minimum: 1,
                    },
                    quantity: item.quantity,
                };
            }),
            success_url: `${req.headers.origin}/success`,
            cancel_url: `${req.headers.origin}/cancelled`,
      }
      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create(params);
      res.status(200).json(session);
    } catch (err) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}