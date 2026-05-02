/**
 * WhatsApp utility — backend
 *
 * Reads WHATSAPP_NUMBER from the environment (set in .env or injected by the
 * platform).  Never hardcodes the number in source code.
 */

interface SareeInfo {
  title: string;
  price?: number | string;
}

/**
 * Build a wa.me deep-link for a customer enquiry about a specific saree.
 *
 * @example
 *   const link = generateWhatsAppLink({ title: "Heritage Silk Weave", price: 38000 });
 *   // "https://wa.me/919849490777?text=Hi%2C%20I'm%20interested..."
 */
export function generateWhatsAppLink(saree: SareeInfo): string {
  const number = process.env["WHATSAPP_NUMBER"];
  if (!number) {
    throw new Error("WHATSAPP_NUMBER environment variable is not set.");
  }

  const message = `Hi, I'm interested in ${saree.title}. Please share more details.`;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/**
 * Log a WhatsApp notification when a new saree is added.
 *
 * This is a structured stub — replace the console output with a real WhatsApp
 * Business API call (e.g. Twilio, Meta Cloud API) when ready.
 */
export function sendWhatsAppNotification(saree: SareeInfo): void {
  const link = (() => {
    try { return generateWhatsAppLink(saree); } catch { return null; }
  })();

  const number = process.env["WHATSAPP_NUMBER"] ?? "(unset)";

  console.info("[WhatsApp] New saree notification →", {
    to:      number,
    saree:   saree.title,
    price:   saree.price,
    link,
    note:    "Mock — wire up WhatsApp Business API here when ready.",
  });
}
