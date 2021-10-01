import Document, { Html, Head, Main, NextScript } from "next/document";
import theme from "../theme";

class MyDocument extends Document {
    // static async getInitialProps(ctx) {
    //     const initialProps = await Document.getInitialProps(ctx);
    //     return { ...initialProps };
    // }

    render() {
        return (
            <Html>
                <Head>
                    <link
                        href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap"
                        rel="stylesheet"
                    />
                    <style>
                        {`
                            body {
                                font-family: Open Sans, sans-serif;
                                color: ${theme.text.light};
                            }

                            body, head, html {
                                margin: 0;
                                padding: 0;
                            }

                            h1, h2, h3, h4, h5, h6 {
                                font-weight: 600;
                            }
                        `}
                    </style>
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
