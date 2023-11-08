import styles from '@/styles/photos.module.css';
import Layout from '@/components/layout';
import Head from 'next/head';
import Image from 'next/image';
import { imageKitLoader } from '@/lib/imageLoader';
import ImageKit from 'imagekit';
import Link from 'next/link';

const imagekit = new ImageKit({
    publicKey : process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey : process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint : process.env.IMAGEKIT_URL_ENDPOINT
});

export async function getStaticProps() {
    const images = await imagekit.listFiles({
        path : "/"
        }).then(response => {
        return response;
    }).catch(error => {
        console.log(error);
    });

    return {
        props: {
            images
        },
    };

}

export default function Photos({ images }) {

    return (
      <Layout>
        <Head>
          <title>Photos</title>
        </Head>
        <section className={styles.galleryContainer}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            {images.map((image, i) =>
                <div className={styles.photoContainer} key={i}>
                    <>
                    <Link href={`/${image.name}`}>
                        <Image
                            loader={imageKitLoader}
                            src={image.name}
                            alt="image"
                            fill={true}
                            quality={84}
                            style={{objectFit: 'contain'}}
                            sizes="10vw"
                        />
                    </Link>
                    </>
                </div>
            )}

        </section>
      </Layout>
    );
  }