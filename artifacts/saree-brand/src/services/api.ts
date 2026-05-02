/* ─────────────────────────────────────────────────────────
   API service layer — all calls go through /api (proxy-routed
   to the API Server artifact).
   ───────────────────────────────────────────────────────── */

const API = "/api";

// ─── token helpers ────────────────────────────────────────
export const TOKEN_KEY = "ananya_admin_token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}
export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

// ─── low-level fetch ──────────────────────────────────────
async function req<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };
  // Don't set Content-Type for FormData — browser sets multipart boundary
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error((data as { message?: string }).message ?? `HTTP ${res.status}`);
  }
  return data as T;
}

// ─── shared response envelope ─────────────────────────────
interface Envelope<T> {
  status: string;
  data: T;
  total?: number;
  pages?: number;
  count?: number;
}

// ─── API-level types ──────────────────────────────────────
export interface ApiCollection {
  _id: string;
  name: string;
  image: string;
  createdAt: string;
}

export interface ApiSaree {
  _id: string;
  title: string;
  price: number;
  fabric: string;
  images: string[];
  collection: ApiCollection | string;
  createdAt: string;
}

export interface ApiHomepage {
  _id?: string;
  heroImages: string[];
  featuredCollections: Array<{ collectionId: string; label: string; image: string }>;
  banners: Array<{ title: string; subtitle: string; image: string; ctaText: string; ctaLink: string }>;
}

export interface AdminInfo {
  id: string;
  email: string;
}

// ─── UI-level saree (matches what pages expect) ───────────
export interface UISaree {
  id: string;
  name: string;
  price: string;
  priceNum: number;
  fabric: string;
  img: string;
  images: string[];
  category: string;
  size: "tall" | "square" | "wide";
  description: string;
  occasion: string;
  origin: string;
  weaveTime: string;
  care: string[];
  tags: string[];
}

// ─── normalizer ───────────────────────────────────────────
const INR = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const FALLBACK_IMG = "/images/bridal.png";

export function normalizeSaree(raw: ApiSaree): UISaree {
  const col =
    typeof raw.collection === "object" && raw.collection !== null
      ? raw.collection
      : null;
  const category = col?.name ?? "Collection";

  return {
    id: raw._id,
    name: raw.title,
    price: INR(raw.price),
    priceNum: raw.price,
    fabric: raw.fabric,
    img: raw.images[0] ?? FALLBACK_IMG,
    images: raw.images.length ? raw.images : [FALLBACK_IMG],
    category,
    size: "tall",
    description: `A beautiful ${raw.fabric} saree from our ${category} collection. Each piece is crafted with care by our master weavers in Varanasi, representing centuries of textile tradition.`,
    occasion:
      category === "Bridal"
        ? "Wedding ceremonies, bridal trousseau"
        : category === "Festive"
        ? "Festivals, celebrations, family gatherings"
        : "Everyday elegance, cultural events",
    origin: "Varanasi, Uttar Pradesh",
    weaveTime: "4–6 weeks",
    care: [
      "Dry clean only",
      "Store folded in muslin cloth",
      "Avoid direct sunlight",
      "Do not wring or twist",
    ],
    tags: [raw.fabric, category].filter(Boolean),
  };
}

// ─── AUTH ─────────────────────────────────────────────────
export async function loginAdmin(
  email: string,
  password: string,
): Promise<{ token: string; admin: AdminInfo }> {
  const res = await req<{ status: string; token: string; admin: AdminInfo }>(
    "/auth/login",
    { method: "POST", body: JSON.stringify({ email, password }) },
  );
  return { token: res.token, admin: res.admin };
}

export async function getAdminMe(): Promise<AdminInfo> {
  const res = await req<{ status: string; admin: AdminInfo }>("/auth/me");
  return res.admin;
}

// ─── COLLECTIONS ──────────────────────────────────────────
export async function getCollections(): Promise<ApiCollection[]> {
  const res = await req<Envelope<ApiCollection[]>>("/collections");
  return res.data;
}

export async function createCollection(name: string, image: File): Promise<ApiCollection> {
  const form = new FormData();
  form.append("name", name);
  form.append("image", image);
  const res = await req<Envelope<ApiCollection>>("/collections", { method: "POST", body: form });
  return res.data;
}

export async function updateCollection(
  id: string,
  patch: { name?: string; image?: File },
): Promise<ApiCollection> {
  const form = new FormData();
  if (patch.name) form.append("name", patch.name);
  if (patch.image) form.append("image", patch.image);
  const res = await req<Envelope<ApiCollection>>(`/collections/${id}`, { method: "PUT", body: form });
  return res.data;
}

export async function deleteCollection(id: string): Promise<void> {
  await req(`/collections/${id}`, { method: "DELETE" });
}

// ─── SAREES ───────────────────────────────────────────────
export interface SareeFilters {
  collection?: string;
  fabric?: string;
  page?: number;
  limit?: number;
}

export async function getAllSarees(
  filters: SareeFilters = {},
): Promise<{ sarees: UISaree[]; total: number; pages: number }> {
  const p = new URLSearchParams();
  if (filters.collection) p.set("collection", filters.collection);
  if (filters.fabric)     p.set("fabric", filters.fabric);
  if (filters.page)       p.set("page", String(filters.page));
  if (filters.limit)      p.set("limit", String(filters.limit));
  const qs = p.toString();

  const res = await req<{
    status: string;
    data: ApiSaree[];
    total: number;
    pages: number;
  }>(`/sarees${qs ? `?${qs}` : ""}`);

  return { sarees: res.data.map(normalizeSaree), total: res.total, pages: res.pages };
}

export async function getSareeById(id: string): Promise<UISaree> {
  const res = await req<Envelope<ApiSaree>>(`/sarees/${id}`);
  return normalizeSaree(res.data);
}

export async function createSaree(data: {
  title: string;
  price: number;
  fabric: string;
  collection: string;
  images: File[];
}): Promise<UISaree> {
  const form = new FormData();
  form.append("title", data.title);
  form.append("price", String(data.price));
  form.append("fabric", data.fabric);
  form.append("collection", data.collection);
  data.images.forEach((f) => form.append("images", f));
  const res = await req<Envelope<ApiSaree>>("/sarees", { method: "POST", body: form });
  return normalizeSaree(res.data);
}

export async function updateSaree(
  id: string,
  data: { title?: string; price?: number; fabric?: string; collection?: string; images?: File[] },
): Promise<UISaree> {
  const form = new FormData();
  if (data.title)               form.append("title", data.title);
  if (data.price !== undefined) form.append("price", String(data.price));
  if (data.fabric)              form.append("fabric", data.fabric);
  if (data.collection)         form.append("collection", data.collection);
  data.images?.forEach((f) => form.append("images", f));
  const res = await req<Envelope<ApiSaree>>(`/sarees/${id}`, { method: "PUT", body: form });
  return normalizeSaree(res.data);
}

export async function deleteSaree(id: string): Promise<void> {
  await req(`/sarees/${id}`, { method: "DELETE" });
}

// ─── ANALYTICS ────────────────────────────────────────────
export interface MonthlyUpload { month: string; count: number; }

export interface AnalyticsData {
  totalSarees: number;
  totalCollections: number;
  totalCustomers: number;
  enquiriesCount: number;
  recentSarees: ApiSaree[];
  monthlySareeUploads: MonthlyUpload[];
}

export async function getAnalytics(): Promise<AnalyticsData> {
  const res = await req<Envelope<AnalyticsData>>("/analytics");
  return res.data;
}

export async function postEnquiry(data: { sareeId?: string; sareeTitle?: string }): Promise<void> {
  await req("/enquiry", { method: "POST", body: JSON.stringify(data) });
}

// ─── HOMEPAGE ─────────────────────────────────────────────
export async function getHomepage(): Promise<ApiHomepage> {
  const res = await req<Envelope<ApiHomepage>>("/homepage");
  return res.data;
}

export async function updateHomepage(data: {
  heroImages?: string[];
  featuredCollections?: ApiHomepage["featuredCollections"];
  banners?: ApiHomepage["banners"];
}): Promise<ApiHomepage> {
  const res = await req<Envelope<ApiHomepage>>("/homepage", {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return res.data;
}
