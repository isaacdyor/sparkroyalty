import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "~/components/navbar/navbar";
import Head from "next/head";
import toast, { Toaster } from "react-hot-toast";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <meta name="color-scheme" content="light dark"></meta>
      </Head>
      <ClerkProvider {...pageProps}>
        <Navbar />
        <Component {...pageProps} />
        <Toaster />
      </ClerkProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
