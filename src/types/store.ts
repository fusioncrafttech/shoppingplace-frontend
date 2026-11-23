export type SellerType = "platform" | "agent";

export type Seller = {
  type: SellerType;
  name: string;
};

export type Review = {
  id: string;
  author: string;
  rating: number;
  title: string;
  text: string;
  date: string;
  hidden?: boolean;
};

export type Product = {
  slug: string;
  name: string;
  price: number;
  stock: number;
  brand: string;
  category: string;
  seller: Seller;
  rating: number;
  reviewCount: number;
  images: { src: string; alt: string }[];
  tone: string;
  description: string;
  specs: { label: string; value: string }[];
  reviews: Review[];
  createdAt: string;
  topSeller?: boolean;
};

export type Banner = {
  id: string;
  eyebrow: string;
  title: string;
  text: string;
  cta: string;
  href: string;
  image: string;
  imageAlt: string;
};

export type Collection = {
  id: string;
  eyebrow: string;
  title: string;
  slugs: string[];
};

export type StoreSettings = {
  brandName: string;
  commissionPercent: number;
  holdDays: 5 | 6 | 7;
  priceThresholdPercent: number;
  coolingPeriodDays: number;
  showOutOfStock: boolean;
  banners: Banner[];
  featuredSlugs: string[];
  collections: Collection[];
};

export type ApplicationStatus =
  | "Submitted"
  | "Information requested"
  | "Accepted — pending activation"
  | "Rejected";

export type AccountStatus = "Pending activation" | "Active" | "Suspended";

export type ProductStatus =
  | "Draft"
  | "Pending approval"
  | "Live"
  | "Rejected"
  | "Revision pending"
  | "Unpublished";

export type ParentStatus = "Unpaid" | "Paid" | "Partially refunded" | "Refunded" | "Expired";

export type ChildStatus =
  | "Confirmed"
  | "Packed"
  | "Shipped"
  | "Delivered"
  | "Cancelled"
  | "Return in progress"
  | "Returned";

export type PayoutStatus = "On hold" | "Blocked" | "Eligible" | "Settled" | "Void";

export type RecoveryStatus = "Open" | "Cleared";

export type AgentApplication = {
  id: string;
  businessName: string;
  contact: string;
  mobile: string;
  email: string;
  city: string;
  state: string;
  categories: string[];
  description: string;
  gstin?: string;
  status: ApplicationStatus;
  submittedAt: string;
  reason?: string;
};

export type AgentAccount = {
  id: string;
  businessName: string;
  contact: string;
  mobile: string;
  email: string;
  city: string;
  state: string;
  status: AccountStatus;
  gstin?: string;
  rateOverride?: number;
  payout: { mode: "Bank" | "UPI"; detail: string; bankName?: string; ifsc?: string };
  categories: string[];
};

export type ManagedProduct = {
  id: string;
  owner: SellerType;
  agent?: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  brand: string;
  status: ProductStatus;
  submittedAt?: string;
  reason?: string;
  revision?: {
    name: string;
    summary: string;
    price: number;
  };
};

export type OrderLine = {
  name: string;
  qty: number;
  gross: number;
  discount: number;
  base: number;
  refundedBase: number;
  commission?: number;
  lineNet?: number;
};

export type PayoutLine = {
  id: string;
  agent: string;
  orderId: string;
  childId: string;
  captureDate: string;
  holdUntil: string;
  status: PayoutStatus;
  gross: number;
  discount: number;
  base: number;
  rate: number;
  commission: number;
  shippingShare: number;
  net: number;
  payoutDate?: string;
  mode?: "NEFT" | "IMPS" | "RTGS" | "UPI";
  utr?: string;
  note?: string;
};

export type ChildOrder = {
  id: string;
  seller: string;
  sellerType: SellerType;
  status: ChildStatus;
  lines: OrderLine[];
  shippingShare: number;
  shipTo: { name: string; phone: string; address: string };
  courier?: string;
  tracking?: string;
  dispatchDate?: string;
  payoutId?: string;
};

export type ParentOrder = {
  id: string;
  placedAt: string;
  customer: { name: string; email: string; phone: string };
  status: ParentStatus;
  paymentId?: string;
  captureState: "Captured" | "Failed" | "Unpaid";
  promo?: string;
  merchandise: number;
  discount: number;
  shipping: number;
  total: number;
  refunded: number;
  razorpayFee?: number;
  razorpaySettlement?: { date: string; reference: string };
  children: ChildOrder[];
};

export type Recovery = {
  id: string;
  agent: string;
  orderId: string;
  amount: number;
  status: RecoveryStatus;
  reason: string;
};

export type Address = {
  id: string;
  label: string;
  name: string;
  phone: string;
  lines: string;
};

export type PlacedGroup = {
  seller: string;
  status: "Confirmed";
  lines: { name: string; qty: number; amount: number }[];
};

export type PlacedOrder = {
  id: string;
  placedAt: string;
  total: number;
  address: string;
  groups: PlacedGroup[];
};
