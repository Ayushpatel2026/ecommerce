import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
 if (req.method === 'POST'){
    const {sessionId} = req.body;
    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ['line_items.data.price.product'],
        });
        res.status(200).json(session);
    } catch (error) {
        res.status(500).json({ error: 'Unable to retrieve order summary' });
    }
 }else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}