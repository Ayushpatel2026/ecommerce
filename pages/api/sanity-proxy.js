
import {client} from '../../lib/client';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const {orderNumber, ...orderData} = req.body;
            const existingOrder = await client.fetch('*[_type == "order" && orderNumber == $orderNumber]', {
                orderNumber: orderNumber
            });
            if (existingOrder.length > 0) {
                return res.status(400).json({ error: 'Order already exists' });
            }
            const result = await client.create(req.body);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: 'Error creating order' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}