import Head from 'next/head';
import Link from 'next/link';
//import { Courier_Prime } from 'next/font/google'
import { Source_Serif_4 } from 'next/font/google'

const gfont = Source_Serif_4({
    weight: ['400', '700'],
    style: ['normal', 'italic'],
    subsets: ['latin'],
    display: 'swap'
  })
const name = 'Alistair Robinson';
export const siteTitle = "Alistair Robinson's blog";

export default function Layout({ children, home }) {
  return (
    <div>
      <Head>
        <link rel="icon" href="/mynah.png" />
        <meta
          name="description"
          content="Articles about literature, science fiction, and philosophy"
        />
        <meta
          property="og:image"
          content="https://blog.alistairrobinson.me/images/profile.jpg"
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <main>{children}</main>
    </div>
  );
}