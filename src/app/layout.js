import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "OCEANS MARINE",
  description: "STS Management System",
  icons: {
    icon: [
      {
        url: "https://res.cloudinary.com/dpu6rveug/image/upload/v1765355146/Screenshot_2025-12-10_135506_rlmi4c.png",
        sizes: "any",
        type: "image/png",
      },
      {
        url: "https://res.cloudinary.com/dpu6rveug/image/upload/v1765355146/Screenshot_2025-12-10_135506_rlmi4c.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "https://res.cloudinary.com/dpu6rveug/image/upload/v1765355146/Screenshot_2025-12-10_135506_rlmi4c.png",
        sizes: "16x16",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "https://res.cloudinary.com/dpu6rveug/image/upload/v1765355146/Screenshot_2025-12-10_135506_rlmi4c.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
