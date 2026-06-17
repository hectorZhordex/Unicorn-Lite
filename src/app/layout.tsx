import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: {
    default: "ArtFlow – Premium Design Resources",
    template: "%s | ArtFlow",
  },
  description: "Download premium design resources, templates, PSD files, mockups, logos and more. Free with verification.",
  keywords: ["design resources", "PSD templates", "mockups", "logos", "free download", "artwork"],
  openGraph: {
    title: "ArtFlow – Premium Design Resources",
    description: "Download premium design resources for free.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-text-primary antialiased">
        {children}
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
