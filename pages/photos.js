import styles from '@/styles/photos.module.css';
import Layout from '@/components/layout';
import Head from 'next/head';
import Image from 'next/image';

const ImageKit = require("imagekit");

var imagekit = new ImageKit({
    publicKey : process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey : process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint : process.env.IMAGEKIT_URL_ENDPOINT
});

const imageKitLoader = ({ src, width, quality }) => {
    if(src[0] === "/") src = src.slice(1);
    const params = [`w-${width}`];
    if (quality) {
        params.push(`q-${quality}`);
    }
    const paramsString = params.join(",");
    var urlEndpoint = "https://ik.imagekit.io/alistairrobinson/";
    if(urlEndpoint[urlEndpoint.length-1] === "/") urlEndpoint = urlEndpoint.substring(0, urlEndpoint.length - 1);
    src = src.split(' ').join('%20');
    return `${urlEndpoint}/${src}?tr=${paramsString}`
}
      
export async function getStaticProps() {
    //let images = []
    const images = await imagekit.listFiles({
        }).then(response => {
        console.log(response);
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

    const imageStyle = {
        width: 'auto',
        height: 'auto',
        maxWidth: '70%'
    }

    return (
      <Layout>
        <Head>
          <title>Photos</title>
        </Head>
        <section className={styles.galleryContainer}>
            {images.map((image, i) =>
                <div className={styles.photoContainer} key={i}>
                    <Image 
                        loader={imageKitLoader}
                        src={image.name}
                        alt="image"
                        fill={true}
                        quality={100}
                        style={{objectFit: 'contain'}}
                        sizes="10vw"                        
                    />                                            
                </div>
            )}

        </section>
      </Layout>
    );
  }