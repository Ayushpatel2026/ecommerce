// used for our sanity client
import sanityClient from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';


// all the information we need to connect to our sanity project is found in our sanity manager
/*
    useCdn - true means that we are using sanity's content delivery network
    which is a cache of our data, allowing for quicker data retrieval
    but not necessarily the most up to date data
*/
export const client = sanityClient({
    projectId: 'xm1vbhow',
    dataset: 'production',
    apiVersion: '2022-03-10',
    useCdn: true,
    token: process.env.NEXT_PUBLIC_SANITY_TOKEN
})

const builder = imageUrlBuilder(client);


/*The source parameter is an image stored in Sanity
 it returns a url that can be used to display the image in the browser
*/
export const urlFor = (source) => {
    return builder.image(source);
}