import React from 'react';
import {Product, HeroBanner, FooterBanner} from '../components';
import {client} from '../lib/client';

export default function Home({products, bannerData}) {
  return (
    <>
      <HeroBanner heroBanner={bannerData.length && bannerData[0]}/>
      <div className="products-heading">
        <h2>Best Selling Products</h2>
        <div>Speakers of many variations</div>
      </div>

      <div className='products-container'>
        {products?.map((product) => {
          return (
            <Product key={product._id} product={product} />
          );
        })}
      </div>

      <FooterBanner footerBanner={bannerData && bannerData[0]}/>
    
    </>
  );
}

export const getServerSideProps = async () => {
  // this is SSR, all the data is fetched and embedded within the html before we send it to the client
  // fetch all products and bannerData from our sanity client (* indicates all)
  const query = '*[_type == "product"]';
  const products = await client.fetch(query);
  console.log(products);

  const banner_query = '*[_type == "banner"]';
  const bannerData = await client.fetch(banner_query);
  console.log(bannerData);

  // this prop will be passed to the Home component during rendering, cool beans
  return {
    props: {
      products,
      bannerData,
    },
  };
}
