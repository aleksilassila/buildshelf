import Document, {Head, Html, Main, NextScript} from "next/document";

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
        {/*<style jsx global>*/}
        {/*  {`*/}
        {/*    body {*/}
        {/*      font-family: Avenir, Montserrat, Arial, sans-serif;*/}
        {/*      color: ${theme.darkHighContrast};*/}
        {/*    }*/}

        {/*    body,*/}
        {/*    head,*/}
        {/*    html {*/}
        {/*      margin: 0;*/}
        {/*      padding: 0;*/}
        {/*      min-height: 100vh;*/}
        {/*      background-color: ${theme.lightMediumContrast};*/}
        {/*    }*/}

        {/*    h1,*/}
        {/*    h2,*/}
        {/*    h3,*/}
        {/*    h4,*/}
        {/*    h5,*/}
        {/*    h6 {*/}
        {/*      font-weight: 600;*/}
        {/*      color: ${theme.dark};*/}
        {/*      margin: 0;*/}
        {/*    }*/}

        {/*    p,*/}
        {/*    span {*/}
        {/*      color: ${theme.darkLowContrast};*/}
        {/*    }*/}

        {/*    p {*/}
        {/*      margin: 0.5rem 0;*/}
        {/*    }*/}

        {/*    input {*/}
        {/*      font-family: Avenir, Montserrat, Arial, sans-serif;*/}
        {/*    }*/}

        {/*    .uppercase {*/}
        {/*      font-weight: 100;*/}
        {/*      text-transform: uppercase;*/}
        {/*    }*/}

        {/*    a {*/}
        {/*      color: ${theme.darkHighContrast};*/}
        {/*    }*/}

        {/*    a:visited {*/}
        {/*      color: inherit;*/}
        {/*    }*/}

        {/*    * {*/}
        {/*      box-sizing: border-box;*/}
        {/*    }*/}

        {/*    .no-margin {*/}
        {/*      margin: 0;*/}
        {/*    }*/}

        {/*    .page-container {*/}
        {/*      padding: 1rem 5vw;*/}
        {/*    }*/}

        {/*    .medium-page-container {*/}
        {/*      padding: 2rem 5vw;*/}
        {/*    }*/}

        {/*    .large-page-container {*/}
        {/*      padding: 6rem 5vw;*/}
        {/*    }*/}

        {/*    .fullscreen {*/}
        {/*      width: 100vw;*/}
        {/*      height: 100vh;*/}
        {/*    }*/}

        {/*    .markdown * {*/}
        {/*      color: ${theme.dark};*/}
        {/*    }*/}

        {/*    .markdown a {*/}
        {/*      color: ${theme.layoutDark};*/}
        {/*    }*/}

        {/*    .markdown p {*/}
        {/*      margin: revert;*/}
        {/*    }*/}

        {/*    .margin-bottom {*/}
        {/*      margin-bottom: 0.5rem;*/}
        {/*    }*/}

        {/*    .flex {*/}
        {/*      display: flex;*/}
        {/*      flex-direction: column;*/}
        {/*      flex-grow: 1;*/}
        {/*    }*/}
        {/*  `}*/}
        {/*</style>*/}
      </Html>
    );
  }
}

export default MyDocument;
