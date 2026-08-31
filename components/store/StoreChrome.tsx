"use client";

import { useCallback, useState } from "react";
import { Header } from "./Header";
import { MobileNav } from "./MobileNav";
import type { BrandContent, Category } from "@/types";

export function StoreChrome({
  brand,
  categories,
  transparent = false,
}: {
  brand: BrandContent;
  categories: Category[];
  transparent?: boolean;
}) {
  const [menu, setMenu] = useState(false);
  const closeMenu = useCallback(() => setMenu(false), []);

  return (
    <>
      <Header
        brand={brand}
        transparent={transparent}
        menuOpen={menu}
        onToggleMenu={() => setMenu((open) => !open)}
        onCloseMenu={closeMenu}
      />
      <MobileNav open={menu} onClose={closeMenu} brand={brand} categories={categories} />
    </>
  );
}
