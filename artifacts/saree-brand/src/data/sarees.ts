export type Category = "Bridal" | "Festive" | "Handloom" | "Contemporary";
export type CardSize = "tall" | "square" | "wide";

export interface Saree {
  id: number;
  name: string;
  category: Category;
  fabric: string;
  price: string;
  priceNum: number;
  img: string;
  size: CardSize;
  description: string;
  occasion: string;
  origin: string;
  weaveTime: string;
  care: string[];
  tags: string[];
}

export const SAREES: Saree[] = [
  {
    id: 1,
    name: "Crimson Zari Bridal",
    category: "Bridal",
    fabric: "Benarasi Silk",
    price: "₹68,000",
    priceNum: 68000,
    img: "/images/bridal.png",
    size: "tall",
    description:
      "A masterwork of the Benarasi loom — this deep crimson silk is threaded with pure zari in traditional butis and a paisleys border. Every inch is a declaration of devotion. Woven across six weeks by a single master weaver in Varanasi's old city, it carries the weight of celebration and the lightness of silk in equal measure.",
    occasion: "Wedding ceremonies, Bridal trousseau",
    origin: "Varanasi, Uttar Pradesh",
    weaveTime: "6–8 weeks",
    care: [
      "Dry clean only",
      "Store folded in muslin cloth",
      "Avoid direct sunlight",
      "Do not wring or twist",
    ],
    tags: ["Zari", "Traditional", "Wedding"],
  },
  {
    id: 2,
    name: "Ivory & Gold Banarasi",
    category: "Bridal",
    fabric: "Pure Silk",
    price: "₹24,500",
    priceNum: 24500,
    img: "/images/arrival-1.png",
    size: "square",
    description:
      "Serene ivory woven with whispers of gold — this Banarasi pure silk speaks of quiet elegance. The subtle gold zari motifs catch candlelight beautifully, making it an ideal choice for intimate ceremonies and receptions. A saree that grows more luminous as the evening deepens.",
    occasion: "Engagement, Reception, Intimate ceremonies",
    origin: "Varanasi, Uttar Pradesh",
    weaveTime: "3–4 weeks",
    care: [
      "Dry clean only",
      "Air after each wear",
      "Store in acid-free tissue",
    ],
    tags: ["Gold Zari", "Ivory", "Subtle"],
  },
  {
    id: 3,
    name: "Emerald Kanjivaram",
    category: "Festive",
    fabric: "Kanjivaram Silk",
    price: "₹38,000",
    priceNum: 38000,
    img: "/images/festive.png",
    size: "tall",
    description:
      "Woven in the temple-town of Kanchipuram, this emerald silk carries the legendary weight and sheen that has made Kanjivaram the queen of South Indian silks. The gold border features classical temple motifs — elephants, lotus, rudraksha beads — in a continuous procession of quiet devotion.",
    occasion: "Festivals, Weddings, Religious ceremonies",
    origin: "Kanchipuram, Tamil Nadu",
    weaveTime: "4–5 weeks",
    care: [
      "Dry clean only",
      "Keep away from moisture",
      "Store separately to avoid color bleed",
    ],
    tags: ["Temple Motifs", "South Indian", "Festival"],
  },
  {
    id: 4,
    name: "Midnight Chanderi",
    category: "Contemporary",
    fabric: "Chanderi Silk",
    price: "₹18,000",
    priceNum: 18000,
    img: "/images/arrival-2.png",
    size: "square",
    description:
      "Chanderi silk has a translucence unlike any other — light passes through it like dusk through a blue window. This midnight navy is woven with the signature Chanderi sheen and a delicate silver butti scattered across the field. Light, airy, and hauntingly beautiful.",
    occasion: "Evening events, Cocktail receptions, Modern ceremonies",
    origin: "Chanderi, Madhya Pradesh",
    weaveTime: "2–3 weeks",
    care: [
      "Gentle hand wash in cold water",
      "Lay flat to dry",
      "Iron on low heat with pressing cloth",
    ],
    tags: ["Sheer", "Modern", "Silver Butti"],
  },
  {
    id: 5,
    name: "Heritage Silk Weave",
    category: "Handloom",
    fabric: "Hand-woven Silk",
    price: "₹52,000",
    priceNum: 52000,
    img: "/images/handloom.png",
    size: "wide",
    description:
      "Each thread of this handloom silk was spun, dyed, and woven by hand in a small family workshop in Varanasi's Kabir Nagar. The pattern — a recurring geometric of interlocking diamonds — is an old family design, unchanged for four generations. You are not buying a saree; you are inheriting a story.",
    occasion: "Cultural events, Collector's piece, Formal occasions",
    origin: "Varanasi, Uttar Pradesh",
    weaveTime: "8–10 weeks",
    care: [
      "Dry clean only",
      "Store flat, never folded at the same crease",
      "Air once a year",
    ],
    tags: ["Heritage", "Geometric", "Hand-spun"],
  },
  {
    id: 6,
    name: "Regal Maroon Paithani",
    category: "Festive",
    fabric: "Paithani Silk",
    price: "₹32,000",
    priceNum: 32000,
    img: "/images/arrival-3.png",
    size: "tall",
    description:
      "The Paithani is Maharashtra's most treasured textile — distinguished by its peacock-motif pallav woven in a tapestry technique with pure gold and silver zari. This deep maroon exemplifies the Paithani at its most regal: rich colour, intricate detailing, and a border that narrates ancient stories of the Deccan court.",
    occasion: "Maharashtrian weddings, Festivals, Family celebrations",
    origin: "Paithan, Maharashtra",
    weaveTime: "5–7 weeks",
    care: [
      "Dry clean only",
      "Avoid contact with perfume directly",
      "Store in soft cotton bag",
    ],
    tags: ["Peacock Motif", "Gold Zari", "Maharashtra"],
  },
  {
    id: 7,
    name: "Rose Pink Organza",
    category: "Contemporary",
    fabric: "Pure Organza",
    price: "₹16,500",
    priceNum: 16500,
    img: "/images/arrival-4.png",
    size: "square",
    description:
      "Organza exists at the edge of visible — barely there, yet entirely present. This pale rose is embroidered with scattered floral motifs in silk thread, each bloom placed with the care of a botanist. It drapes with the ease of morning light and suits a woman who carries elegance without effort.",
    occasion: "Day events, Garden parties, Contemporary ceremonies",
    origin: "Surat, Gujarat",
    weaveTime: "2 weeks",
    care: [
      "Hand wash cold, do not rub",
      "Roll in a towel to remove excess water",
      "Steam rather than iron",
    ],
    tags: ["Floral", "Sheer", "Lightweight"],
  },
  {
    id: 8,
    name: "Varanasi Artisan Loom",
    category: "Handloom",
    fabric: "Handspun Cotton-Silk",
    price: "₹44,000",
    priceNum: 44000,
    img: "/images/story.png",
    size: "tall",
    description:
      "Photographed in the weaver's own workshop, this cotton-silk blend is the result of a five-month process: cotton spun by hand on a charkha, silk reeled from cocoons sourced from Karnataka, and the two woven together on a pit loom. The resulting textile is warm, breathable, and unlike anything made by machine.",
    occasion: "Everyday luxury, Cultural programs, Art events",
    origin: "Varanasi, Uttar Pradesh",
    weaveTime: "10–12 weeks",
    care: [
      "Hand wash in lukewarm water",
      "Dry in shade",
      "Light steam press",
    ],
    tags: ["Cotton-Silk", "Artisanal", "Sustainable"],
  },
  {
    id: 9,
    name: "Golden Bridal Drape",
    category: "Bridal",
    fabric: "Benarasi Brocade",
    price: "₹85,000",
    priceNum: 85000,
    img: "/images/arrival-1.png",
    size: "square",
    description:
      "The most precious piece in the Ananya bridal collection. Woven in Benarasi brocade with a continuous all-over zari pattern, the golden field shimmers with every movement. The pallav is a dense composition of marigolds and peacocks — a textile so intricate that it requires a magnifying glass to fully appreciate its detail.",
    occasion: "Bridal, Sangeet, Wedding reception",
    origin: "Varanasi, Uttar Pradesh",
    weaveTime: "10–12 weeks",
    care: [
      "Professional dry clean only",
      "Never machine wash",
      "Store in padded box away from humidity",
    ],
    tags: ["All-over Zari", "Brocade", "Premium"],
  },
  {
    id: 10,
    name: "Deep Festive Silk",
    category: "Festive",
    fabric: "Mysore Silk",
    price: "₹28,500",
    priceNum: 28500,
    img: "/images/arrival-3.png",
    size: "square",
    description:
      "Mysore silk is among India's most regulated textiles — produced exclusively by the Karnataka Silk Industries Corporation with government-certified pure silk. The sheen is unparalleled: cool, deep, and luxurious. This festive piece carries a small gold border and a plain field that allows the silk itself to be the statement.",
    occasion: "Diwali, Navratri, Temple visits, Festive gatherings",
    origin: "Mysore, Karnataka",
    weaveTime: "2–3 weeks",
    care: [
      "Dry clean only",
      "Avoid dampness",
      "Refold along different lines each time",
    ],
    tags: ["GI Tag", "Pure Silk", "Karnataka"],
  },
  {
    id: 11,
    name: "Natural Loom Tussar",
    category: "Handloom",
    fabric: "Tussar Silk",
    price: "₹35,000",
    priceNum: 35000,
    img: "/images/handloom.png",
    size: "tall",
    description:
      "Tussar silk is called the 'wild silk' — spun from the cocoons of silkworms that feed on oak and jamun trees in the forests of Jharkhand. Its natural golden-honey tone is a colour no dye can replicate. This piece is woven in the traditional Bhagalpuri style with block-printed borders in earthy rust.",
    occasion: "Casual luxury, Arts events, Informal celebrations",
    origin: "Bhagalpur, Bihar",
    weaveTime: "4–6 weeks",
    care: [
      "Hand wash in cold water with mild soap",
      "Dry flat in shade",
      "Iron on silk setting from inside",
    ],
    tags: ["Wild Silk", "Natural Dye", "Forest"],
  },
  {
    id: 12,
    name: "Blush Contemporary",
    category: "Contemporary",
    fabric: "Organza Georgette",
    price: "₹21,000",
    priceNum: 21000,
    img: "/images/arrival-4.png",
    size: "square",
    description:
      "Where organza meets georgette — two ethereal fabrics fused into one that moves like a slow exhale. The blush tone suits every skin, and the minimal scattered embellishment gives it just enough reason to be looked at twice. Perfect for the woman who wants to wear a saree without feeling constrained by tradition.",
    occasion: "Contemporary occasions, Parties, Fusion events",
    origin: "Surat, Gujarat",
    weaveTime: "1–2 weeks",
    care: [
      "Dry clean recommended",
      "Handle embellishments with care",
      "Store flat to preserve drape",
    ],
    tags: ["Fusion", "Minimal", "Modern"],
  },
];

export const CATEGORIES = ["All", "Bridal", "Festive", "Handloom", "Contemporary"] as const;
export type FilterCategory = typeof CATEGORIES[number];
