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

export default function PhotoPage({ post }) {
    let width = 1000;

    console.log("-------------------")
    console.log(post)
    console.log("-------------------")

    if (post.width === post.height){
        width = 760;
    }

    const imageStyle = {
        width: 'auto',
        height: 'auto',
    }

    const imageContainerStyle = {
        width: `${width}px`,
        height: 'auto',
        position: 'absolute'
    }


    const url = imageKitLoader({
        src: post.name,
        width: width,
        quality: 90
    })
    return (
        <Layout>
            <Head>
            <title>{post.slug}</title>
            </Head>
            <div style={imageContainerStyle}>
                <h1>{post.slug}</h1>
                <img src={url} />
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

    //const img = images[0]
    //console.log(img)
    console.log(images[0].height)
    console.log("==========================")

    //const img2 = imagekit.getFileDetails(params.slug, function(error, result) {
    //    if(error) console.log(error);
    //    else console.log(result);
    //    return result;
    //});

    return {
      props: {
        post: images[0],
      },
    };
  }