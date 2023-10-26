import styles from '@/styles/photos.module.css';
import Layout from '@/components/layout';
import Head from 'next/head';
import Image from 'next/image';
//import { getStaticProps } from 'next/dist/build/templates/pages';
//import me from '@/public/images/me-in-kazakhstan.webp';

//const imagesDirectory = path.join(process.cwd(), 'public/photos/2010/07/01');

const AWS = require('aws-sdk');
const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  accessKeyId: '388C637F34544D31F08F',
  secretAccessKey: 'hNaG5wNdj9vLvF7DwVntnALkkUly2haiTMqYiD8e',
  endpoint: 'https://s3.filebase.com',
  region: 'us-east-1',
  s3ForcePathStyle: true
});

//s3.listBuckets(function (err, data) {
//    if (err) {
//      console.log("Error when listing buckets", err);
//    } else {
//      console.log("Success when listing buckets", data);
//    }
//});

    var ImageKit = require("imagekit");

    var imagekit = new ImageKit({
        publicKey : "public_HOBsFmtZZunlWrp/B8g2xmHvhNo=",
        privateKey : "private_FUdjVTje+2IRgjzRf64dWKOA0+c=",
        urlEndpoint : "https://ik.imagekit.io/alistairrobinson/"
    });

    //const images = imagekit.listFiles({
    //    path : ""
    //}, function(error, result) { 
    //    //if(error) console.log(error);
    //    //else console.log(result);
    //    return result;
    //});

    //private_FUdjVTje+2IRgjzRf64dWKOA0+c=

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
      
      const MyImage = (props) => {
        return (
          <Image
            loader={imageKitLoader}
            src="default-image.jpg"
            alt="Sample image"
            width={400}
            height={400}
          />
        );
      };

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
                {/*<div className={styles.photoContainer}>
                    <Image 
                        loader={imageKitLoader}
                        src="default-image.jpg"
                        alt="image"
                        fill={true}
                        quality={100}
                        style={{objectFit: 'contain'}}
                        sizes="10vw"                        
                    />                                            
                </div>
            */}
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