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
                        href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;800&display=swap"
                        rel="stylesheet"
                    />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
                <style global>
                    {`
                        body {
                            font-family: Open Sans, sans-serif;
                            color: ${theme.lowContrastLight};
                        }

                        body, head, html {
                            margin: 0;
                            padding: 0;
                            background-color: ${theme.highContrastDark};
                        }

                        h1, h2, h3, h4, h5, h6 {
                            font-weight: 600;
                            margin: 0;
                        }
                        
                        .uppercase {
                            font-weight: 100;
                            text-transform: uppercase;
                        }
                        
                        * {
                            box-sizing: border-box;
                        }
                        
                        .error {
                            color: ${theme.red};
                        }
                    `}
                </style>
            </Html>
        );
    }
}

export default MyDocument;
