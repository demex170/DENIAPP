import React, { useState } from 'react';
import { Mail, Lock, User, Phone, CheckCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { Modal } from '../ui/Modal.tsx';
import { Button } from '../ui/Button.tsx';
import { Input } from '../ui/Input.tsx';
import { api } from '../../services/api.ts';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, authModalTab, openAuthModal, login, register } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forgotSent, setForgotSent] = useState(false);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFirstName('');
    setLastName('');
    setPhone('');
    setError(null);
    setForgotSent(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await login({ email, password });
      resetForm();
    } catch (err: any) {
      setError(err.message || 'ავტორიზაციის შეცდომა');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await register({ email, password, firstName, lastName, phone });
      resetForm();
    } catch (err: any) {
      setError(err.message || 'რეგისტრაციის შეცდომა');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('გთხოვთ მიუთითოთ ელფოსტა');
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      await api.forgotPassword(email);
      setForgotSent(true);
    } catch (err: any) {
      setError(err.message || 'აღდგენა ვერ მოხერხდა');
    } finally {
      setIsLoading(false);
    }
  };

  const fillQuickDemo = (demoType: 'admin' | 'customer') => {
    if (demoType === 'admin') {
      setEmail('demetree105@gmail.com');
      setPassword('deni2026');
    } else {
      setEmail('nino@example.ge');
      setPassword('deni2026');
    }
  };

  return (
    <Modal
      isOpen={isAuthModalOpen}
      onClose={() => {
        closeAuthModal();
        resetForm();
      }}
      title={
        authModalTab === 'login'
          ? 'შესვლა ანგარიშში'
          : authModalTab === 'register'
          ? 'რეგისტრაცია DENI-ზე'
          : 'პაროლის აღდგენა'
      }
      subtitle={
        authModalTab === 'login'
          ? 'მართე შენი შექმნილი მოსაწვევები და RSVP პასუხები'
          : authModalTab === 'register'
          ? 'შექმენი შენი პირადი კაბინეტი 1 წუთში'
          : 'მიიღე ინსტრუქცია მითითებულ ელფოსტაზე'
      }
      maxWidth="md"
    >
      <div className="space-y-5">
        {/* Tab switch */}
        <div className="flex p-1 bg-stone-100 rounded-xl">
          <button
            type="button"
            onClick={() => {
              openAuthModal('login');
              resetForm();
            }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              authModalTab === 'login'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            შესვლა
          </button>
          <button
            type="button"
            onClick={() => {
              openAuthModal('register');
              resetForm();
            }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              authModalTab === 'register'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            რეგისტრაცია
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
            {error}
          </div>
        )}

        {/* LOGIN FORM */}
        {authModalTab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-3.5">
            <Input
              label="ელფოსტა"
              type="email"
              placeholder="example@gmail.com"
              leftIcon={<Mail className="w-4 h-4" />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div>
              <Input
                label="პაროლი"
                type="password"
                placeholder="••••••••"
                leftIcon={<Lock className="w-4 h-4" />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="flex justify-end mt-1">
                <button
                  type="button"
                  onClick={() => openAuthModal('forgot')}
                  className="text-[11px] text-stone-500 hover:text-amber-800 transition-colors"
                >
                  დაგავიწყდა პაროლი?
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={isLoading}
            >
              შესვლა
            </Button>

            {/* Quick Demo Access Bar */}
            <div className="pt-3 border-t border-stone-200/80">
              <p className="text-[11px] text-stone-400 text-center mb-2 font-medium">
                სწრაფი ტესტირება:
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => fillQuickDemo('admin')}
                  className="px-2.5 py-1.5 text-[11px] bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-center transition-colors"
                >
                  ადმინი (Demetre)
                </button>
                <button
                  type="button"
                  onClick={() => fillQuickDemo('customer')}
                  className="px-2.5 py-1.5 text-[11px] bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-center transition-colors"
                >
                  მომხმარებელი (Nino)
                </button>
              </div>
            </div>
          </form>
        )}

        {/* REGISTER FORM */}
        {authModalTab === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3">
            <div className="grid grid-cols-2 gap-2.5">
              <Input
                label="სახელი"
                placeholder="დემეტრე"
                leftIcon={<User className="w-4 h-4" />}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <Input
                label="გვარი"
                placeholder="დევდარიანი"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <Input
              label="ელფოსტა"
              type="email"
              placeholder="name@example.ge"
              leftIcon={<Mail className="w-4 h-4" />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="ტელეფონის ნომერი"
              type="tel"
              placeholder="579 08 97 19"
              leftIcon={<Phone className="w-4 h-4" />}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <Input
              label="პაროლი (მინ. 6 სიმბოლო)"
              type="password"
              placeholder="••••••••"
              leftIcon={<Lock className="w-4 h-4" />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={isLoading}
            >
              ანგარიშის შექმნა
            </Button>
          </form>
        )}

        {/* FORGOT PASSWORD FORM */}
        {authModalTab === 'forgot' && (
          <div className="space-y-4">
            {forgotSent ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="text-xs text-emerald-800 font-medium">
                  ინსტრუქცია გაგზავნილია თქვენს ელფოსტაზე ({email})
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openAuthModal('login')}
                  className="mt-2"
                >
                  შესვლაზე დაბრუნება
                </Button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-3.5">
                <Input
                  label="თქვენი ელფოსტა"
                  type="email"
                  placeholder="name@example.ge"
                  leftIcon={<Mail className="w-4 h-4" />}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  isLoading={isLoading}
                >
                  ინსტრუქციის მიღება
                </Button>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => openAuthModal('login')}
                    className="text-xs text-stone-500 hover:text-stone-800"
                  >
                    ← შესვლაზე დაბრუნება
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};
