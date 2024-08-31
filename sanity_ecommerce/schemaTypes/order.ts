// TODO: need to add a reference to an actual user document, write now just using a customer email
export default {
    name: 'order',
    title: 'Order',
    type: 'document',
    fields: [
        {
            name: 'orderNumber',
            title: 'Order Number',
            type: 'string',
            description: 'Unique order number taken from the id returned by the payment gateway',
        },
        {
            name: 'customerEmail',
            title: 'Customer Email',
            type: 'string',
            description: 'Email of the customer who placed the order',
        },
        {
            name: 'paymentInfo',
            title: 'Payment Information',
            type: 'object',
            fields: [
              { name: 'method', title: 'Payment Method', type: 'string' },
              { name: 'transactionId', title: 'Transaction ID', type: 'string' },
              { name: 'paymentStatus', title: 'Payment Status', type: 'string' },
            ],
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
                { title: 'Completed', value: 'complete' },
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
          {
            name: 'shippingCost',
            title: 'Shipping Cost',
            type: 'number',
          }
  ]};