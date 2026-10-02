import React, { useState, useEffect } from 'react';
import { ShoppingBag, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Order } from '../types/index.ts';
import { api } from '../services/api.ts';

export const OrdersView: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await api.getOrders();
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>დასრულებული</span>
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
            <Clock className="w-3.5 h-3.5" />
            <span>მუშავდება</span>
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700">
            <Clock className="w-3.5 h-3.5" />
            <span>მოლოდინში</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>გაუქმებული</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto px-4 sm:px-6 py-6 text-left">
      <div>
        <h1 className="text-2xl font-display font-bold text-stone-900">
          ჩემი შეკვეთები
        </h1>
        <p className="text-xs text-stone-500">
          გამოქვეყნებული და გააქტიურებული მოსაწვევების ისტორია
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-stone-400">
            შეკვეთები იტვირთება...
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <ShoppingBag className="w-8 h-8 text-stone-300 mx-auto" />
            <p className="text-sm font-semibold text-stone-800">შეკვეთები ჯერ არ არის</p>
            <p className="text-xs text-stone-500">
              როდესაც მოსაწვევს გამოაქვეყნებთ, შეკვეთა გამოჩნდება აქ.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-4">შეკვეთის #</th>
                  <th className="py-3.5 px-4">მოსაწვევი</th>
                  <th className="py-3.5 px-4">პაკეტი</th>
                  <th className="py-3.5 px-4">ფასი</th>
                  <th className="py-3.5 px-4">სტატუსი</th>
                  <th className="py-3.5 px-4">თარიღი</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-semibold text-stone-900">
                      {o.orderNumber}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-stone-800">
                      {o.invitationTitle}
                    </td>
                    <td className="py-3.5 px-4 uppercase text-stone-600 font-semibold">
                      {o.packageType}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-stone-900 tabular-nums">
                      {o.price} {o.currency}
                    </td>
                    <td className="py-3.5 px-4">{getStatusBadge(o.status)}</td>
                    <td className="py-3.5 px-4 text-stone-500">
                      {new Date(o.createdAt).toLocaleDateString('ka-GE', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
