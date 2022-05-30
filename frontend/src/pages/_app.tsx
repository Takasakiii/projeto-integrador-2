import "bulma/css/bulma.min.css";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import Navbar from "../components/Navbar";
import { css } from "@emotion/react";

const contentMargin = css({
  marginTop: "4rem",
});


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <main>
      <Navbar />
      <section id="main" css={contentMargin}>
        <Component {...pageProps} />
      </section>
    </main>
  );
}

export default MyApp;
