import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Base Wordle - Web3 Word Puzzle",
  description: "Wordle game on Base blockchain",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {process.env.NODE_ENV === "development" ? (
          <Script id="suppress-wallet-extension-inject-error" strategy="beforeInteractive">
            {`
              (function () {
                var needle = "Cannot redefine property: ethereum";
                function isChromeExtension(src) {
                  return typeof src === "string" && src.indexOf("chrome-extension://") === 0;
                }
                function shouldSuppress(message, source) {
                  return typeof message === "string" && message.indexOf(needle) !== -1 && isChromeExtension(source);
                }

                // Suppress ErrorEvent-based reporting
                window.addEventListener(
                  "error",
                  function (event) {
                    try {
                      var message = event && event.message;
                      var source = event && event.filename;
                      if (shouldSuppress(message, source)) {
                        event.preventDefault();
                        event.stopImmediatePropagation();
                      }
                    } catch (_) {}
                  },
                  true
                );

                // Suppress promise-based reporting
                window.addEventListener(
                  "unhandledrejection",
                  function (event) {
                    try {
                      var reason = event && event.reason;
                      var msg = reason && (reason.message || String(reason));
                      if (typeof msg === "string" && msg.indexOf(needle) !== -1) {
                        event.preventDefault();
                      }
                    } catch (_) {}
                  },
                  true
                );

                // Some overlays rely on window.onerror
                var prevOnError = window.onerror;
                window.onerror = function (message, source) {
                  if (shouldSuppress(String(message), String(source))) return true;
                  return typeof prevOnError === "function" ? prevOnError.apply(this, arguments) : false;
                };
              })();
            `}
          </Script>
        ) : null}
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
