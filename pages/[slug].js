import styles from '@/styles/photos.module.css';
import Layout from '@/components/layout';
import Head from 'next/head';
import { imageKitLoader } from '@/lib/imageLoader';
import ImageKit from 'imagekit';

const imagekit = new ImageKit({
    publicKey : process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey : process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint : process.env.IMAGEKIT_URL_ENDPOINT
});


export default function PhotoPage({ post }) {
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

    const url = imageKitLoader({
        src: post.name,
        width: width,
        quality: 84
    })
    return (
        <Layout>
            <Head>
            <title>{post.slug}</title>
            </Head>
            <div style={imageContainerStyle}>
                <img src={url} style={imageStyle} />
                <p>
                    {post.customMetadata.description || ''}{post.customMetadata.description && '\u00A0 ꞏ \u00A0'}
                    {post.customMetadata.camera_type || ''}{post.customMetadata.camera_type && '\u00A0 ꞏ \u00A0'}
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

    const paths = images.map((im) => {
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

    const images = await imagekit.listFiles({
        searchQuery : 'name="' + params.slug + '"'
        }).then(response => {
        return response;
    }).catch(error => {
        console.log(error);
    });

    return {
      props: {
        post: images[0],
      },
    };
  }