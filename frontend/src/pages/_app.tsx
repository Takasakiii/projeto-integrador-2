import "bulma/css/bulma.min.css";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import Navbar from "../components/Navbar";
import { css } from "@emotion/react";
import { Provider } from "react-redux";
import store from "../storage";

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

function Index(props: AppProps) {
  return (
    <Provider store={store}>
      <MyApp {...props} />
    </Provider>
  );
}

export default Index;
