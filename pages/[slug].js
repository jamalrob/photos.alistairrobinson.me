import styles from '@/styles/photos.module.css';
import Layout from '@/components/layout';
import Head from 'next/head';
import ImageKit from 'imagekit';
import Link from 'next/link';
import { imageKitLoader } from '@/lib/imageLoader';


const imagekit = new ImageKit({
    publicKey : process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey : process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint : process.env.IMAGEKIT_URL_ENDPOINT
});


export default function PhotoPage({ post, nextImage, previousImage }) {
    let width = 1200;

    if (Math.abs(post.width - post.height) < 100){
        // Square or almost square
        width = 760;
    }

    const imageContainerStyle = {
        maxWidth: `${width}px`,
        height: 'auto',
        position: 'relative',
        margin: '20px auto',
        textAlign: 'center'
    }

    const imageStyle = {
        maxHeight: '84vh',
        margin: '0 auto'
    }

    const photoNav = {
        position: 'absolute',
        top: '-5px',
        right: '10px',
        fontSize: '2.2rem'
    }

    const url = imageKitLoader({
        src: post.name,
        width: width,
        quality: 86
    })

    return (
        <Layout>
            <Head>
            <title>{post.slug}</title>
            </Head>
            <div id="photonav" style={photoNav}>
            {previousImage && (
                <Link href={previousImage.name} title="previous">&larr;</Link>
            )}
            {nextImage && (
                <Link href={nextImage.name} title="next">&rarr;</Link>
            )}
            </div>
            <div style={imageContainerStyle}>
                <img src={url} style={imageStyle} />
                <p>
                    {post.customMetadata.description || ''}{post.customMetadata.description && '\u00A0 \u00B7 \u00A0'}
                    {post.customMetadata.camera_type || ''}{post.customMetadata.camera_type && '\u00A0 \u00B7 \u00A0'}
                    {post.customMetadata.camera || ''}{post.customMetadata.camera && '\u00A0 \u00B7 \u00A0'}
                    {post.customMetadata.friendly_date || ''}
                </p>
            </div>
        </Layout>
    );
}


export async function getStaticPaths() {
    const images = await imagekit.listFiles({
        path : "/"
        }).then(response => {
        return response;
    }).catch(error => {
        console.log(error);
    });

    const paths = images.map((im, i) => {

        return {
            params: {
                slug: im.name
            },
        };
    });

    return {
      paths,
      fallback: false,
    };
  }


  export async function getStaticProps({ params }) {

    let ims = [];

    const allImages = await imagekit.listFiles({
        path : "/",
        sort: "ASC_NAME"
        }).then(response => {
            return response;
        }).catch(error => {
        console.log(error);
    });

    ims = allImages.filter((im) => {
        if (im.name === params.slug) {
            return im.name;
        }
    })

    //const thisImage = allImages[allImages.indexOf(ims[0])]
    const thisImage = ims[0]
    let nextImage = allImages[allImages.indexOf(ims[0]) + 1]
    let previousImage = allImages[allImages.indexOf(ims[0]) - 1]

    //if (previousImage === undefined) {
    //    previousImage = null;
    //}

    return {
      props: {
        post: thisImage,
        nextImage: nextImage || null,
        previousImage: previousImage || null
      },
    };
  }
