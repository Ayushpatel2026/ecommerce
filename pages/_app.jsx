import React from 'react';
import { Toaster } from 'react-hot-toast';
import Layout from '../components/Layout';

import '../styles/globals.css';
import { StateContext } from '../context/StateContext';

function MyApp({ Component, pageProps }) {
  /* Wrapping the entire app in the StateContext component
  allows us to access the state and functions in the context
  */
  return (
    <StateContext>
      <Layout>
        <Toaster />
        <Component {...pageProps} />
      </Layout>
    </StateContext>
  )
}

export default MyApp