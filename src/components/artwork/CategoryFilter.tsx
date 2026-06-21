"use client";

import { m as motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useSettingsStore, parseCategories } from "@/lib/settings-store";

interface Props {
  active: string;
  onChange: (slug: string) => void;
}

export default function CategoryFilter({ active, onChange }: Props) {
  const { settings } = useSettingsStore();
  const categories = parseCategories(settings.categoriesRaw);

  return (
    <motion.section
      id="categories"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="px-4 sm:px-6 mb-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-1 px-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => onChange(cat.slug)}
              className={cn("category-pill whitespace-nowrap flex-shrink-0", active === cat.slug && "active")}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
