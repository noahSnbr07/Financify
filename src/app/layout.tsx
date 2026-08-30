import "./globals.css";

import { Geist, Geist_Mono } from "next/font/google";
import { ToastContainer } from "react-toastify";
import { toastConfiguration } from "../configuration";
import { PrivacyDigitToggler, SidebarToggler } from "../context";
import Sidebar from "../global/components/client/sidebar";

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
          <SidebarToggler>
            <PrivacyDigitToggler>
              <Sidebar />
              {children}
            </PrivacyDigitToggler>
          </SidebarToggler>
        </body>
      </html>
    </>
  );
}
