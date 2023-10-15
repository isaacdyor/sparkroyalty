import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "~/components/navbar/navbar";
import Head from "next/head";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <meta name="color-scheme" content="light dark"></meta>
      </Head>
      <ClerkProvider {...pageProps}>
        <Navbar />
        <Component {...pageProps} />
      </ClerkProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
