"use client";

import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/utils";

export function WhatsAppButton({ phone }: { phone: string }) {
  if (!phone) return null;
  return (
    <a
      href={whatsappLink(phone)}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-medium text-white shadow-lg md:bottom-8 md:right-8"
    >
      <MessageCircle size={18} />
      <span className="hidden sm:inline">Chat with us on WhatsApp</span>
    </a>
  );
}
