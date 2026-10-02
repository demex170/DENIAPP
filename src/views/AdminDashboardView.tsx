import React, { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  Mail,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Save,
  Check,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';
import { UserProfile, Order, PricingConfig } from '../types/index.ts';
import { Button } from '../components/ui/Button.tsx';
import { Input } from '../components/ui/Input.tsx';
import { DENI_CONFIG } from '../config/deniConfig.ts';

export const AdminDashboardView: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'orders' | 'pricing'>('overview');
  const [stats, setStats] = useState<any>(null);
  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [ordersList, setOrdersList] = useState<Order[]>([]);
  const [pricing, setPricing] = useState<PricingConfig>(DENI_CONFIG.PRICING);
  const [isLoading, setIsLoading] = useState(true);
  const [pricingSaved, setPricingSaved] = useState(false);

  useEffect(() => {
    if (!isAdmin) return;

    const loadAdminData = async () => {
      setIsLoading(true);
      try {
        const [statsData, usersData, ordersData, pricingData] = await Promise.all([
          api.getAdminStats(),
          api.getAdminUsers(),
          api.getOrders(),
          api.getPricing(),
        ]);
        setStats(statsData);
        setUsersList(usersData);
        setOrdersList(ordersData);
        setPricing(pricingData);
      } catch (err) {
        console.error('Failed to load admin data', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadAdminData();
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-3">
        <Shield className="w-12 h-12 text-rose-500" />
        <h2 className="text-xl font-bold text-stone-900">წვდომა შეზღუდულია</h2>
        <p className="text-xs text-stone-500">
          ეს გვერდი განკუთვნილია მხოლოდ DENI-ს სისტემის ადმინისტრატორებისთვის.
        </p>
      </div>
    );
  }

  const handleRoleToggle = async (targetUserId: string, currentRole: 'customer' | 'admin') => {
    const newRole = currentRole === 'admin' ? 'customer' : 'admin';
    try {
      await api.setAdminUserRole(targetUserId, newRole);
      setUsersList((prev) =>
        prev.map((u) => (u.id === targetUserId ? { ...u, role: newRole } : u))
      );
    } catch (err: any) {
      alert(err.message || 'როლის შეცვლა ვერ მოხერხდა');
    }
  };

  const handleOrderStatusChange = async (orderId: string, status: Order['status']) => {
    try {
      await api.updateOrderStatus(orderId, status);
      setOrdersList((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status } : o))
      );
    } catch (err: any) {
      alert(err.message || 'სტატუსის შეცვლა ვერ მოხერხდა');
    }
  };

  const handleSavePricing = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.updatePricing(pricing);
      setPricingSaved(true);
      setTimeout(() => setPricingSaved(false), 3000);
    } catch (err: any) {
      alert(err.message || 'ფასების შენახვა ვერ მოხერხდა');
    }
  };

  const updatePriceItem = (category: keyof PricingConfig, type: 'standard' | 'premium', value: number) => {
    setPricing((prev: PricingConfig) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [type]: value,
      },
    }));
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 py-6 text-left">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full mb-1">
            <Shield className="w-3.5 h-3.5" />
            <span>ადმინისტრაციული მართვის პანელი</span>
          </div>
          <h1 className="text-2xl font-display font-bold text-stone-900">
            DENI — სისტემური მართვა
          </h1>
          <p className="text-xs text-stone-500">
            მომხმარებლების, შეკვეთების, ფასებისა და სტატისტიკის ცენტრალური მართვა
          </p>
        </div>

        {/* Tabs */}
        <div className="flex bg-stone-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'overview' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
            }`}
          >
            სტატისტიკა
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'users' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
            }`}
          >
            მომხმარებლები ({usersList.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'orders' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
            }`}
          >
            შეკვეთები ({ordersList.length})
          </button>
          <button
            onClick={() => setActiveTab('pricing')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'pricing' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
            }`}
          >
            ფასები (Pricing)
          </button>
        </div>
      </div>

      {/* TAB 1: OVERVIEW STATS */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs">
              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                სულ მომხმარებელი
              </span>
              <p className="text-3xl font-display font-bold text-stone-900 mt-2 tabular-nums">
                {stats?.totalUsers || usersList.length}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs">
              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                სულ მოსაწვევი
              </span>
              <p className="text-3xl font-display font-bold text-stone-900 mt-2 tabular-nums">
                {stats?.totalInvitations || 0}
              </p>
              <p className="text-[11px] text-emerald-600 font-medium">
                {stats?.publishedInvitations || 0} გამოქვეყნებული
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs">
              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                სულ შეკვეთა
              </span>
              <p className="text-3xl font-display font-bold text-stone-900 mt-2 tabular-nums">
                {stats?.totalOrders || ordersList.length}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs">
              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                მთლიანი შემოსავალი
              </span>
              <p className="text-3xl font-display font-bold text-amber-900 mt-2 tabular-nums">
                {stats?.totalRevenue || 0} ₾
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: USERS MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-stone-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-stone-900">
              რეგისტრირებული მომხმარებლები
            </h3>
            <span className="text-xs text-stone-500">სულ: {usersList.length}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">მომხმარებელი</th>
                  <th className="py-3 px-4">ელფოსტა</th>
                  <th className="py-3 px-4">ტელეფონი</th>
                  <th className="py-3 px-4">მოსაწვევები</th>
                  <th className="py-3 px-4">როლი</th>
                  <th className="py-3 px-4 text-right">მოქმედება</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3 px-4 font-semibold text-stone-900 flex items-center gap-2">
                      <img
                        src={
                          u.avatarUrl ||
                          `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                            u.firstName
                          )}`
                        }
                        alt={u.firstName}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      <span>
                        {u.firstName} {u.lastName}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-stone-600">{u.email}</td>
                    <td className="py-3 px-4 text-stone-600">{u.phone || '-'}</td>
                    <td className="py-3 px-4 font-semibold tabular-nums text-stone-800">
                      {u.createdInvitationsCount || 0}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          u.role === 'admin'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-stone-100 text-stone-700'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {u.id !== user?.id && (
                        <button
                          type="button"
                          onClick={() => handleRoleToggle(u.id, u.role)}
                          className="text-[11px] text-amber-800 hover:text-amber-900 font-semibold"
                        >
                          {u.role === 'admin' ? 'Customer-ზე გადაყვანა' : 'Admin-ად გახდომა'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-stone-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-stone-900">
              შეკვეთების სია
            </h3>
            <span className="text-xs text-stone-500">სულ: {ordersList.length}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">შეკვეთა #</th>
                  <th className="py-3 px-4">მომხმარებელი</th>
                  <th className="py-3 px-4">მოსაწვევი</th>
                  <th className="py-3 px-4">პაკეტი</th>
                  <th className="py-3 px-4">ფასი</th>
                  <th className="py-3 px-4">სტატუსი</th>
                  <th className="py-3 px-4">მოქმედება</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {ordersList.map((o) => (
                  <tr key={o.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-stone-900">
                      {o.orderNumber}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-stone-800 block">{o.userName}</span>
                      <span className="text-[10px] text-stone-400">{o.userEmail}</span>
                    </td>
                    <td className="py-3 px-4 font-medium text-stone-800">
                      {o.invitationTitle}
                    </td>
                    <td className="py-3 px-4 uppercase text-stone-600 font-semibold">
                      {o.packageType}
                    </td>
                    <td className="py-3 px-4 font-bold text-stone-900 tabular-nums">
                      {o.price} {o.currency}
                    </td>
                    <td className="py-3 px-4 font-semibold text-stone-800 uppercase">
                      {o.status}
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={o.status}
                        onChange={(e) => handleOrderStatusChange(o.id, e.target.value as any)}
                        className="px-2 py-1 text-[11px] bg-stone-50 border border-stone-200 rounded-lg focus:outline-none"
                      >
                        <option value="pending">pending</option>
                        <option value="in_progress">in_progress</option>
                        <option value="completed">completed</option>
                        <option value="cancelled">cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: PRICING CONFIGURATION MANAGER */}
      {activeTab === 'pricing' && (
        <form onSubmit={handleSavePricing} className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div>
              <h3 className="text-base font-semibold text-stone-900">
                ფასების ცენტრალური მართვა (CONFIG)
              </h3>
              <p className="text-xs text-stone-500">
                შეცვალე Standard და Premium პაკეტების ფასები (₾) კატეგორიების მიხედვით
              </p>
            </div>
            {pricingSaved && (
              <span className="text-xs text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full font-medium flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>ფასები განახლდა!</span>
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(Object.keys(pricing) as Array<keyof PricingConfig>).map((catKey) => {
              const item = pricing[catKey];
              const categoryMeta = DENI_CONFIG.CATEGORIES.find((c) => c.id === catKey);
              return (
                <div key={String(catKey)} className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                    {categoryMeta?.number} — {categoryMeta?.title || String(catKey)}
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      label="Standard (₾)"
                      type="number"
                      value={item.standard}
                      onChange={(e) => updatePriceItem(catKey, 'standard', Number(e.target.value))}
                      required
                    />
                    <Input
                      label="Premium (₾)"
                      type="number"
                      value={item.premium}
                      onChange={(e) => updatePriceItem(catKey, 'premium', Number(e.target.value))}
                      required
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-4 border-t border-stone-100">
            <Button
              type="submit"
              variant="amber"
              size="md"
              icon={<Save className="w-4 h-4" />}
            >
              ფასების შენახვა
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
