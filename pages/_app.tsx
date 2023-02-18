import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '../components/common/Layout'
import Header from '../components/common/Header'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Header />
      <Component  {...pageProps} />
    </Layout>
  )
}
