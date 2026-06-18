"use client";

import Link from "next/link";
import Image from "next/image";
import { Layers } from "lucide-react";
import { useSettingsStore, parseCategories } from "@/lib/settings-store";

export default function Footer() {
  const { settings } = useSettingsStore();
  const allCats = parseCategories(settings.categoriesRaw);
  const browseLinks = allCats.slice(1, 5);
  const resourceLinks = allCats.slice(5, 9);

  return (
    <footer className="border-t border-white/5 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={settings.logoImage || "/favicon.png"}
                  alt="Logo"
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              </div>
              <span className="text-lg font-bold text-white">{settings.logoText}</span>
            </Link>
            <p className="text-text-muted text-sm leading-relaxed">
              {settings.footerTagline}
            </p>
          </div>

          {/* Browse */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-4">Browse</h4>
            <ul className="space-y-2">
              {browseLinks.map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/?category=${cat.slug}`}
                    className="text-text-muted text-sm hover:text-white transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-4">Resources</h4>
            <ul className="space-y-2">
              {resourceLinks.map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/?category=${cat.slug}`}
                    className="text-text-muted text-sm hover:text-white transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-4">Platform</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-text-muted text-sm hover:text-white transition-colors">
                  Home
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-text-muted text-xs">
            &copy; {new Date().getFullYear()} {settings.footerCopyright}
          </p>

          {/* Hidden admin trigger — looks like normal text */}
          <Link
            href="/admin"
            className="text-text-muted text-xs hover:text-white transition-colors duration-200 select-none"
          >
            Thank you
          </Link>
        </div>
      </div>
    </footer>
  );
}
