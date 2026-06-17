import Link from "next/link";
import { Layers } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #7c3aed, #3b82f6)" }}>
                <Layers size={16} className="text-white" />
              </div>
              <span className="text-lg font-bold gradient-text">ArtFlow</span>
            </Link>
            <p className="text-text-muted text-sm leading-relaxed">
              Premium design resources, templates and assets. Free with verification.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-4">Browse</h4>
            <ul className="space-y-2">
              {["Logos", "Posters", "Flyers", "Mockups"].map((item) => (
                <li key={item}>
                  <Link href={`/?category=${item.toLowerCase()}`}
                    className="text-text-muted text-sm hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-4">Resources</h4>
            <ul className="space-y-2">
              {["Wallpapers", "Social Media", "PSD Templates", "Illustrations"].map((item) => (
                <li key={item}>
                  <Link href={`/?category=${item.toLowerCase().replace(" ", "-")}`}
                    className="text-text-muted text-sm hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-4">Platform</h4>
            <ul className="space-y-2">
              {[["Home", "/"], ["Admin", "/admin"], ["Upload", "/admin/upload"]].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-text-muted text-sm hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-text-muted text-xs">
            © {new Date().getFullYear()} ArtFlow. All rights reserved.
          </p>
          <p className="text-text-muted text-xs">
            Built with Next.js, Supabase & Framer Motion
          </p>
        </div>
      </div>
    </footer>
  );
}
