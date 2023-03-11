import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { SWRConfig } from "swr";
import Layout from "components/Layout";
import { SnackbarProvider } from "notistack";

export default function App({
    Component,
    pageProps: { session, ...pageProps },
}: AppProps) {
    return (
        <SWRConfig
            value={{
                // refreshInterval: 3000,
                fetcher: (url, options) =>
                    fetch(url, options).then((res) => res.json()),
            }}
        >
            <SnackbarProvider
                dense
                anchorOrigin={{ horizontal: "right", vertical: "top" }}
            />
            <SessionProvider session={session}>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </SessionProvider>
        </SWRConfig>
    );
}
