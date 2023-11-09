import Head from 'next/head';
import Link from 'next/link';
import { Karla } from 'next/font/google'
import styles from '@/styles/photos.module.css'

const gfont = Karla({
    weight: ['400', '700'],
    style: ['normal', 'italic'],
    subsets: ['latin'],
    display: 'swap'
  })
const name = 'Alistair Robinson';
export const siteTitle = "Photographs by Alistair Robinson";

export default function Layout({ children, home }) {
  return (
    <div className={gfont.className}>
      <Head>
        <link rel="icon" href="/mynah.png" />
        <meta
          name="description"
          content="Photographs by Alistair Robinson"
        />
        <meta
          property="og:image"
          content="https://photos.alistairrobinson.me/images/profile.jpg"
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <header className={styles.header}>
        <Link href="/">Home</Link>
        <Link href="/about" title="About">About</Link>
        {/*<Link href="/tags" title="About">Tags</Link>*/}
      </header>
      <main style={{padding: '20px'}}>{children}</main>
    </div>
  );
}