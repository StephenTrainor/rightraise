import Head from 'next/head';
import Footer from './Footer';

const DEFAULT_TITLE = "Right Raise";

export default function Layout({ children, title }) {
    return (
        <>
            <Head>
                <title>{(title) ? `${title} | ${DEFAULT_TITLE}` : DEFAULT_TITLE}</title>
                <meta name="description" content="Helping programs get the money they deserve"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="icon" href="/images/Icon.png"/>
            </Head>
            {/* <main> */}
            <div className="w-screen">
                {/* <div className="h-screen flex flex-col"> */}
                <div className="">
                    {children}
                </div>
                <Footer className=""/>
            </div>
            {/* </main> */}
        </>
    )
}
