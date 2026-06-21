import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import MotionProvider from "@/components/providers/MotionProvider";

export const metadata: Metadata = {
  title: {
    default: "BlueOrbit - Fast, Secure Public & Private Cloud Services",
    template: "%s | BlueOrbit",
  },
  description:
    "BlueOrbit Cloud offers secure public and private cloud storage, scalable infrastructure, and fast file access for individuals and businesses worldwide.",
  keywords: [
    // Primary
    "cloud storage",
    "secure cloud storage",
    "public cloud storage",
    "private cloud storage",
    "cloud storage service",
    "online file storage",
    "cloud data center",
    "cloud infrastructure",
    "cloud platform",
    "file hosting service",
    // Business / Enterprise
    "enterprise cloud storage",
    "scalable cloud solutions",
    "business cloud storage",
    "cloud computing services",
    "secure data center solutions",
    "cloud hosting provider",
    "virtual cloud servers",
    "cloud backup solutions",
    "IT infrastructure services",
    "managed cloud services",
    // User Intent
    "upload files to cloud",
    "store files online",
    "access files anywhere",
    "share files securely",
    "sync files across devices",
    "backup files to cloud",
    "free cloud storage",
    "cheap cloud storage plan",
    "secure file sharing platform",
    // Technical
    "object storage cloud",
    "cloud server hosting",
    "VPS cloud hosting",
    "hybrid cloud solution",
    "multi cloud platform",
    "data storage architecture",
    "cloud security services",
    "encrypted cloud storage",
    "distributed storage system",
    "high availability cloud",
    // Brand
    "BlueOrbit Cloud",
    "BlueOrbit Technologies",
    "BlueOrbit storage",
    "BlueOrbit data center",
    "modern cloud platform",
    "next gen cloud storage",
    "affordable cloud hosting",
    "fast cloud storage service",
    "reliable cloud platform",
    "cloud startup solutions",
    // Long-tail
    "secure cloud storage for personal and business use",
    "affordable public and private cloud storage solution",
    "best cloud storage for file backup and sharing",
    "how to store files securely in the cloud",
    "enterprise grade private cloud hosting service",
    "fast and secure file hosting platform online",
    "scalable cloud infrastructure for businesses",
    "online storage solution for photos and documents",
    "best alternative to Google Drive cloud storage",
  ],
  authors: [{ name: "BlueOrbit Technologies" }],
  creator: "BlueOrbit Technologies",
  publisher: "BlueOrbit Technologies",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "BlueOrbit - Fast, Secure Public & Private Cloud Services",
    description:
      "BlueOrbit Cloud offers secure public and private cloud storage, scalable infrastructure, and fast file access for individuals and businesses worldwide.",
    type: "website",
    siteName: "BlueOrbit",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "BlueOrbit - Fast, Secure Public & Private Cloud Services",
    description:
      "Secure public and private cloud storage, scalable infrastructure, and fast file access for individuals and businesses worldwide.",
    creator: "@BlueOrbitCloud",
  },
  alternates: {
    canonical: "https://unicorn-lite.vercel.app",
  },
  category: "technology",
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
    ],
    apple: [
      { url: "/favicon.png", type: "image/png" },
    ],
    shortcut: "/favicon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-text-primary antialiased">
        <MotionProvider>{children}</MotionProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#12122a",
              color: "#f1f5f9",
              border: "1px solid rgba(124,58,237,0.3)",
              borderRadius: "12px",
              fontSize: "14px",
            },
            success: {
              iconTheme: { primary: "#10b981", secondary: "#fff" },
            },
            error: {
              iconTheme: { primary: "#ef4444", secondary: "#fff" },
            },
          }}
        />
      </body>
    </html>
  );
}
