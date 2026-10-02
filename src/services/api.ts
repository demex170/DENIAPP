import { Invitation, Guest, Order, NotificationItem, WishMessage, UserProfile, PricingConfig } from '../types/index.ts';

const TOKEN_KEY = 'deni_auth_token';

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }

  getToken(): string | null {
    return this.token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const res = await fetch(endpoint, {
      ...options,
      headers,
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.error || 'მოხდა შეცდომა მონაცემების დამუშავებისას');
    }

    return data as T;
  }

  // Auth
  async register(data: { email: string; password: string; firstName: string; lastName: string; phone: string }) {
    const res = await this.request<{ user: UserProfile; token: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    this.setToken(res.token);
    return res;
  }

  async login(data: { email: string; password: string }) {
    const res = await this.request<{ user: UserProfile; token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    this.setToken(res.token);
    return res;
  }

  async getMe() {
    if (!this.token) return null;
    try {
      const res = await this.request<{ user: UserProfile }>('/api/auth/me');
      return res.user;
    } catch {
      this.setToken(null);
      return null;
    }
  }

  async updateProfile(data: Partial<UserProfile>) {
    return this.request<{ user: UserProfile }>('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async forgotPassword(email: string) {
    return this.request<{ success: boolean; message: string }>('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  logout() {
    if (this.token) {
      this.request('/api/auth/logout', { method: 'POST' }).catch(() => {});
    }
    this.setToken(null);
  }

  // Invitations
  async getInvitations(): Promise<Invitation[]> {
    const res = await this.request<{ invitations: Invitation[] }>('/api/invitations');
    return res.invitations;
  }

  async getInvitation(id: string): Promise<Invitation> {
    const res = await this.request<{ invitation: Invitation }>(`/api/invitations/${id}`);
    return res.invitation;
  }

  async createInvitation(data: Partial<Invitation>): Promise<Invitation> {
    const res = await this.request<{ invitation: Invitation }>('/api/invitations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.invitation;
  }

  async updateInvitation(id: string, data: Partial<Invitation>): Promise<Invitation> {
    const res = await this.request<{ invitation: Invitation }>(`/api/invitations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return res.invitation;
  }

  async deleteInvitation(id: string): Promise<boolean> {
    await this.request<{ success: boolean }>(`/api/invitations/${id}`, {
      method: 'DELETE',
    });
    return true;
  }

  async publishInvitation(id: string): Promise<{ invitation: Invitation; order: Order }> {
    return this.request<{ invitation: Invitation; order: Order }>(`/api/invitations/${id}/publish`, {
      method: 'POST',
    });
  }

  // Guests & RSVPs
  async getGuests(invitationId: string): Promise<Guest[]> {
    const res = await this.request<{ guests: Guest[] }>(`/api/invitations/${invitationId}/guests`);
    return res.guests;
  }

  async addGuest(invitationId: string, data: { firstName: string; lastName: string; personalNote?: string }): Promise<Guest> {
    const res = await this.request<{ guest: Guest }>(`/api/invitations/${invitationId}/guests`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.guest;
  }

  async deleteGuest(invitationId: string, guestId: string): Promise<boolean> {
    await this.request<{ success: boolean }>(`/api/invitations/${invitationId}/guests/${guestId}`, {
      method: 'DELETE',
    });
    return true;
  }

  // Public
  async getPublicInvitation(slug: string): Promise<Invitation> {
    const res = await this.request<{ invitation: Invitation }>(`/api/public/invitation/${slug}`);
    return res.invitation;
  }

  async getPersonalGuestInvite(token: string): Promise<{ guest: Guest; invitation: Invitation }> {
    return this.request<{ guest: Guest; invitation: Invitation }>(`/api/public/guest/${token}`);
  }

  async submitRSVP(data: {
    invitationId: string;
    guestToken?: string;
    firstName: string;
    lastName: string;
    rsvpStatus: 'attending' | 'declined';
    guestCount: number;
    comments?: string;
    customAnswer?: string;
  }): Promise<{ success: boolean; guest: Guest }> {
    return this.request<{ success: boolean; guest: Guest }>('/api/public/rsvp', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getWishes(invitationId: string): Promise<WishMessage[]> {
    const res = await this.request<{ wishes: WishMessage[] }>(`/api/public/wishes/${invitationId}`);
    return res.wishes;
  }

  async submitWish(invitationId: string, guestName: string, message: string): Promise<WishMessage> {
    const res = await this.request<{ wish: WishMessage }>('/api/public/wishes', {
      method: 'POST',
      body: JSON.stringify({ invitationId, guestName, message }),
    });
    return res.wish;
  }

  // Orders
  async getOrders(): Promise<Order[]> {
    const res = await this.request<{ orders: Order[] }>('/api/orders');
    return res.orders;
  }

  async updateOrderStatus(orderId: string, status: Order['status']): Promise<Order> {
    const res = await this.request<{ order: Order }>(`/api/admin/orders/${orderId}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
    return res.order;
  }

  // Notifications
  async getNotifications(): Promise<NotificationItem[]> {
    const res = await this.request<{ notifications: NotificationItem[] }>('/api/notifications');
    return res.notifications;
  }

  async markNotificationRead(id: string): Promise<void> {
    await this.request(`/api/notifications/${id}/read`, { method: 'PUT' });
  }

  async markAllNotificationsRead(): Promise<void> {
    await this.request('/api/notifications/read-all', { method: 'PUT' });
  }

  // Admin
  async getAdminStats() {
    const res = await this.request<{ stats: any }>('/api/admin/stats');
    return res.stats;
  }

  async getAdminUsers(): Promise<UserProfile[]> {
    const res = await this.request<{ users: UserProfile[] }>('/api/admin/users');
    return res.users;
  }

  async setAdminUserRole(userId: string, role: 'customer' | 'admin'): Promise<UserProfile> {
    const res = await this.request<{ user: UserProfile }>(`/api/admin/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
    return res.user;
  }

  async getPricing(): Promise<PricingConfig> {
    const res = await this.request<{ pricing: PricingConfig }>('/api/admin/pricing');
    return res.pricing;
  }

  async updatePricing(pricing: PricingConfig): Promise<PricingConfig> {
    const res = await this.request<{ pricing: PricingConfig }>('/api/admin/pricing', {
      method: 'PUT',
      body: JSON.stringify(pricing),
    });
    return res.pricing;
  }

  // Image Upload
  async uploadImage(imageBase64: string, filename?: string): Promise<string> {
    const res = await this.request<{ url: string; success: boolean }>('/api/upload', {
      method: 'POST',
      body: JSON.stringify({ imageBase64, filename }),
    });
    return res.url;
  }
}

export const api = new ApiService();
