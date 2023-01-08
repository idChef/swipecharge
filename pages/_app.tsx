import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { SWRConfig } from "swr";

export default function App({
    Component,
    pageProps: { session, ...pageProps },
}: AppProps) {
    return (
        <SWRConfig
            value={{
                refreshInterval: 3000,
                fetcher: (resource, init) =>
                    fetch(resource, init).then((res) => res.json()),
            }}
        >
            <SessionProvider session={session}>
                <Component {...pageProps} />
            </SessionProvider>
        </SWRConfig>
    );
}
