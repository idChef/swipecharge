import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { SWRConfig } from "swr";
import Layout from "components/Layout";

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
            <SessionProvider session={session}>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </SessionProvider>
        </SWRConfig>
    );
}
