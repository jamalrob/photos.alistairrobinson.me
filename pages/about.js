import styles from '@/styles/photos.module.css';
import Layout from '@/components/layout';
import Head from 'next/head';

export default function About() {

    const imageContainerStyle = {
        maxWidth: `800px`,
        height: 'auto',
        position: 'relative',
        margin: '20px auto',
        textAlign: 'left',
        fontSize: '1.2rem'
    }

    return (
        <Layout>
            <Head>
            <title>Alistair Robinson : photos : about me</title>
            </Head>
            <div style={imageContainerStyle}>
                <p>I am Alistair Robinson and this is a public place to put my photographs.</p>

                <p>
                    Feel free to contact me at alistair.robinson@gmail.com. My blog is at <a href="https://blog.alistairrobinson.me">blog.alistairrobinson.me</a>.
                </p>
            </div>
        </Layout>
    );
}
