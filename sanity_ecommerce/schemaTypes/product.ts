export default{
    name: 'product',
    title: 'Product',
    type: 'document',
    fields: [
        {
            name: 'name',
            title: 'Name',
            type: 'string',
        },
        {
            name: 'image',
            title: 'Image',
            type: 'array',
            of: [{type: 'image'}],
            options:{
                // allows you to select which areas of the image should be cropped for better image positioning
                hotspot: true,
            }
        },
        // a slug is used to create a unique URL for each product, unique string that is used as part of the URL
        // slug is generated from the name of the product and is more descriptive than the a randomly generated id
        {
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options:{
                source: 'name',
                maxLength: 96,
            }
        },
        {
            name: 'price',
            title: 'Price',
            type: 'number',
        },
        {
            name: 'details',
            title: 'Details',
            type: 'string',
        },
    ],
}