export type EventCategoryType = 'wedding' | 'baptism' | 'birthday' | 'graduation' | 'party' | 'custom';
export type PackageType = 'standard' | 'premium';
export type InvitationStatus = 'draft' | 'published' | 'archived';
export type RSVPStatus = 'attending' | 'declined' | 'pending';
export type OrderStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type UserRole = 'customer' | 'admin';

export interface PriceItem {
  standard: number;
  premium: number;
}

export interface PricingConfig {
  wedding: PriceItem;
  baptism: PriceItem;
  birthday: PriceItem;
  graduation: PriceItem;
  party: PriceItem;
  custom: PriceItem;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  avatarUrl?: string;
  role: UserRole;
  createdAt: string;
}

export interface UserProfile extends User {
  createdInvitationsCount: number;
}

export interface TimelineItem {
  id: string;
  time: string;
  title: string;
  description?: string;
  iconName?: string;
}

export interface GalleryItem {
  id: string;
  url: string;
  caption?: string;
  isCover?: boolean;
}

export interface DressCode {
  type: 'Formal' | 'Black Tie' | 'Smart Casual' | 'White / Pastel' | 'Custom';
  description: string;
  palette: string[]; // hex codes for swatches
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface RSVPSettings {
  enabled: boolean;
  deadlineDate: string;
  maxPlusGuests: number;
  allowChildren: boolean;
  customQuestion?: string;
}

export interface PremiumFeatures {
  animatedIntro: boolean;
  introTitle?: string;
  introSubtitle?: string;
  musicEnabled: boolean;
  musicUrl?: string;
  guestbookEnabled: boolean;
  confettiEffect: boolean;
}

export interface Invitation {
  id: string;
  userId: string;
  slug: string;
  eventType: EventCategoryType;
  templateId: string;
  packageType: PackageType;
  status: InvitationStatus;

  // Header & Identity
  title: string;
  coupleOrHostNames: string;
  secondaryNames?: string; // e.g. godparents or parents
  eventDate: string; // YYYY-MM-DD
  eventTime: string; // HH:mm
  eventTimeEnd?: string;

  // Venue & Location
  venueName: string;
  venueAddress: string;
  venueCity: string;
  googleMapsUrl: string;
  locationNotes?: string;

  // Content
  heroMessage?: string;
  description: string;
  coverImage: string;
  heroImage?: string;
  storyTitle?: string;
  storyContent?: string;

  // Components
  countdownEnabled: boolean;
  countdownMessage?: string;
  timeline: TimelineItem[];
  gallery: GalleryItem[];
  dressCode: DressCode;
  faqs: FAQItem[];
  rsvpSettings: RSVPSettings;
  premiumFeatures: PremiumFeatures;

  // Meta
  viewsCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Guest {
  id: string;
  invitationId: string;
  firstName: string;
  lastName: string;
  token: string; // For /invite/guest/:token
  personalNote?: string; // "ძვირფასო ნინო, გაგვიხარდება შენი ხილვა..."
  rsvpStatus: RSVPStatus;
  guestCount: number; // 1 + plus ones
  comments?: string;
  customAnswer?: string;
  submittedAt?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  userEmail: string;
  userName: string;
  invitationId: string;
  invitationTitle: string;
  eventType: EventCategoryType;
  packageType: PackageType;
  price: number;
  currency: string;
  status: OrderStatus;
  createdAt: string;
  notes?: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'rsvp' | 'publish' | 'order' | 'wish' | 'system';
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface WishMessage {
  id: string;
  invitationId: string;
  guestName: string;
  message: string;
  createdAt: string;
}
