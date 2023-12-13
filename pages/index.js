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
        path : "/",
        sort: "ASC_NAME"
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
            {images.map((image, i) =>
                <div className={styles.photoContainer} key={i}>
                    <Link href={`/${image.name.substring(0, image.name.lastIndexOf('.'))}`} style={{position: 'relative', display: 'contents'}} title={image.customMetadata.description}>
                        <Image
                            loader={imageKitLoader}
                            src={image.name}
                            alt="image"
                            fill={true}
                            quality={80}
                            style={{objectFit: 'contain'}}
                            sizes="30vw, 50vw, 60vw, 70vw, 80vw, 90vw, 100vw"
                        />
                    </Link>
                </div>
            )}

        </section>
      </Layout>
    );
  }