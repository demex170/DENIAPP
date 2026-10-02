import React, { useState } from 'react';
import { User, Phone, Mail, Shield, Check, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { Button } from '../components/ui/Button.tsx';
import { Input } from '../components/ui/Input.tsx';
import { ImageUploader } from '../components/ui/ImageUploader.tsx';

export const ProfileView: React.FC = () => {
  const { user, updateProfile } = useAuth();

  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(false);
    try {
      await updateProfile({ firstName, lastName, phone, avatarUrl });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'შენახვა ვერ მოხერხდა');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto px-4 sm:px-6 py-6 text-left">
      <div>
        <h1 className="text-2xl font-display font-bold text-stone-900">
          მომხმარებლის პროფილი
        </h1>
        <p className="text-xs text-stone-500">
          პირადი მონაცემები და ანგარიშის პარამეტრები
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-xs space-y-6">
        {success && (
          <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200 flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>მონაცემები წარმატებით შეინახა!</span>
          </div>
        )}

        {error && (
          <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200">
            {error}
          </div>
        )}

        {/* Profile Picture */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-stone-100">
          <img
            src={
              avatarUrl ||
              `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                firstName + ' ' + lastName
              )}`
            }
            alt={firstName}
            className="w-20 h-20 rounded-full border-2 border-stone-200 object-cover"
          />
          <div className="flex-1 w-full">
            <ImageUploader
              label="პროფილის ფოტოს შეცვლა"
              value={avatarUrl}
              onChange={(url) => setAvatarUrl(url)}
              aspectRatio="1:1"
              helperText="რეკომენდებულია კვადრატული ავატარი (1:1)"
            />
          </div>
        </div>

        {/* Personal Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="სახელი"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <Input
            label="გვარი"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="ელფოსტა (არ იცვლება)"
            value={user?.email || ''}
            disabled
            leftIcon={<Mail className="w-4 h-4" />}
          />
          <Input
            label="ტელეფონის ნომერი"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            leftIcon={<Phone className="w-4 h-4" />}
            required
          />
        </div>

        {/* Account Info Stats */}
        <div className="pt-4 border-t border-stone-100 grid grid-cols-2 gap-4">
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/60">
            <span className="text-[11px] text-stone-500">შექმნილი მოსაწვევები:</span>
            <p className="text-lg font-bold text-stone-900 mt-0.5">
              {user?.createdInvitationsCount || 0}
            </p>
          </div>
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/60">
            <span className="text-[11px] text-stone-500">ანგარიშის როლი:</span>
            <p className="text-xs font-semibold text-stone-900 mt-1 uppercase flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-amber-800" />
              <span>{user?.role === 'admin' ? 'ადმინისტრატორი' : 'მომხმარებელი'}</span>
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            variant="amber"
            size="md"
            isLoading={isSaving}
            icon={<Save className="w-4 h-4" />}
          >
            ცვლილებების შენახვა
          </Button>
        </div>
      </form>
    </div>
  );
};
