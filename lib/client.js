// used for our sanity client
import sanityClient from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';


// all the information we need to connect to our sanity project is found in our sanity manager
export const client = sanityClient({
    projectId: 'xm1vbhow',
    dataset: 'production',
    apiVersion: '2022-03-10',
    useCdn: true,
    token: process.env.NEXT_PUBLIC_SANITY_TOKEN
})

const builder = imageUrlBuilder(client);

export const urlFor = (source) => {
    return builder.image(source);
}