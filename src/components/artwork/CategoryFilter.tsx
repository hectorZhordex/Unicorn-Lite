"use client";

import { motion } from "framer-motion";
import { CATEGORIES } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface Props {
  active: string;
  onChange: (slug: string) => void;
}

export default function CategoryFilter({ active, onChange }: Props) {
  return (
    <motion.section
      id="categories"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="px-4 sm:px-6 mb-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2 -mx-1 px-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => onChange(cat.slug)}
              className={cn("category-pill whitespace-nowrap flex-shrink-0", active === cat.slug && "active")}
            >
              <span className="text-base">{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
