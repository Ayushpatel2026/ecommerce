// TODO: need to add customer information, shipping information, payment information, and other details
export default {
    name: 'order',
    title: 'Order',
    type: 'document',
    fields: [
        {
            name: 'orderNumber',
            title: 'Order Number',
            type: 'string',
            description: 'Unique order number',
          },
          {
            name: 'items',
            title: 'Items',
            type: 'array',
            of: [
              {
                type: 'object',
                fields: [
                  {
                    name: 'product',
                    title: 'Product',
                    type: 'reference',
                    to: [{ type: 'product' }],
                  },
                  {
                    name: 'quantity',
                    title: 'Quantity',
                    type: 'number',
                  },
                  {
                    name: 'price',
                    title: 'Price',
                    type: 'number',
                  },
                ],
              },
            ],
          },
          {
            name: 'total',
            title: 'Total Amount',
            type: 'number',
          },
          {
            name: 'status',
            title: 'Order Status',
            type: 'string',
            options: {
              list: [
                { title: 'Pending', value: 'pending' },
                { title: 'Processing', value: 'processing' },
                { title: 'Completed', value: 'completed' },
                { title: 'Cancelled', value: 'cancelled' },
              ],
              layout: 'radio',
            },
          },
          {
            name: 'orderDate',
            title: 'Order Date',
            type: 'datetime',
          },
          {
            name: 'shippingType',
            title: 'Shipping Type',
            type: 'string',
          },
  ]};