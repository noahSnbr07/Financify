import "./globals.css";

import { Geist, Geist_Mono } from "next/font/google";
import { PrivacyDigitToggler } from "../context";
import { ToastContainer } from "react-toastify";
import { toastConfiguration } from "../configuration";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <ToastContainer {...toastConfiguration} />
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <PrivacyDigitToggler>
            {children}
          </PrivacyDigitToggler>
        </body>
      </html>
    </>
  );
}
