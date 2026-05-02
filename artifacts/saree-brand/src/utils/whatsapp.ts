/**
 * WhatsApp utility — frontend
 *
 * Reads VITE_WHATSAPP_NUMBER from the Vite environment (set in .env as
 * VITE_WHATSAPP_NUMBER).  Never hardcodes the number in source code.
 */

interface SareeInfo {
  name: string;
  price?: string;
  fabric?: string;
}

/**
 * Build a wa.me deep-link for a customer enquiry about a specific saree.
 * Works on both mobile (opens WhatsApp app) and desktop (opens WhatsApp Web).
 *
 * @example
 *   const link = generateWhatsAppLink({ name: "Heritage Silk Weave" });
 *   window.open(link, "_blank", "noopener,noreferrer");
 */
export function generateWhatsAppLink(saree: SareeInfo): string {
  const number = import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined;
  if (!number) {
    console.warn(
      "[WhatsApp] VITE_WHATSAPP_NUMBER is not set. " +
      "Add it to artifacts/saree-brand/.env as VITE_WHATSAPP_NUMBER=<number>."
    );
  }

  const message = `Hi, I'm interested in ${saree.name}. Please share more details.`;
  const target  = number ?? "";
  return `https://wa.me/${target}?text=${encodeURIComponent(message)}`;
}
