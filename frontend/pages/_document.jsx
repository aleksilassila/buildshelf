import Document, { Head, Html, Main, NextScript } from "next/document";
import theme from "../constants/theme";

class MyDocument extends Document {
  // static async getInitialProps(ctx) {
  //     const initialProps = await Document.getInitialProps(ctx);
  //     return { ...initialProps };
  // }

  render() {
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&display=swap"
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
                            font-family: Avenir, Montserrat, Arial, sans-serif;
                            color: ${theme.highContrastDark};
                        }                        

                        body, head, html {
                            margin: 0;
                            padding: 0;
                            background-color: ${theme.highContrastLight};
                        }

                        h1, h2, h3, h4, h5, h6 {
                            font-weight: 600;
                            margin: 0;
                            padding: 0;
                        }

                        input {
                            font-family: Avenir, Montserrat, Arial, sans-serif;
                        }
                        
                        .uppercase {
                            font-weight: 100;
                            text-transform: uppercase;
                        }
                        
                        a {
                            color: ${theme.highContrastDark}
                        }
                        
                        a:visited {
                            color: inherit;
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
