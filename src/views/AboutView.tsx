import React from 'react';
import { Sparkles, Heart, Award, Shield, ArrowRight } from 'lucide-react';
import { DENI_CONFIG } from '../config/deniConfig.ts';
import { Button } from '../components/ui/Button.tsx';

interface AboutViewProps {
  onStartCreate: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onStartCreate }) => {
  return (
    <div className="space-y-16 max-w-5xl mx-auto px-4 sm:px-6 py-12 text-left">
      {/* Hero statement */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="text-xs font-semibold uppercase tracking-widest text-amber-800">
          ჩვენ შესახებ
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-stone-900 leading-tight">
          „განსაკუთრებული დღე განსაკუთრებულ მოსაწვევს იმსახურებს.“
        </h1>
        <p className="text-base sm:text-lg font-serif-ka italic text-stone-600">
          {DENI_CONFIG.BRAND.philosophy}
        </p>
      </div>

      {/* Main Narrative Card */}
      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-stone-200/90 shadow-xs space-y-6 text-stone-700 leading-relaxed text-sm sm:text-base">
        <h3 className="text-xl sm:text-2xl font-serif-ka font-bold text-stone-900">
          რატომ შევქმენით DENI?
        </h3>
        <p>
          ჩვენ გვჯერა, რომ ქორწილი, ნათლობა, იუბილე თუ ნებისმიერი საზეიმო შეკრება არ იწყება მხოლოდ დარბაზის კართან. ის იწყება იმ წამიდან, როდესაც სტუმარი იღებს პირველ მოწვევას.
        </p>
        <p className="font-serif-ka italic text-stone-900 text-lg sm:text-xl border-l-2 border-amber-800 pl-4 py-1">
          „მოსაწვევი უბრალოდ ინფორმაციის გასაზიარებელი ბმული არ არის. ის უნდა ქმნიდეს პირველ შთაბეჭდილებას და გადმოსცემდეს ღონისძიების განწყობას.“
        </p>
        <p>
          ქაღალდის ტრადიციული მოსაწვევები ხშირად იკარგება, რთულია ლოკაციების გაზიარება და შეუძლებელია იმის წინასწარ ცოდნა, რამდენი ადამიანი მოვა. DENI აერთიანებს ქაღალდის მოსაწვევის პრემიუმ ესთეტიკასა და თანამედროვე ციფრულ კომფორტს: რეალურ დროში RSVP, ინტერაქტიული რუკები, ფოტოალბომი, განრიგი და პერსონალური სახელობითი ბმულები.
        </p>
      </div>

      {/* Values Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <h4 className="text-base font-semibold text-stone-900">
            უნაკლო ტიპოგრაფია
          </h4>
          <p className="text-xs text-stone-600 leading-relaxed">
            ქართული ანბანის სათუთი დახვეწილობა, ჰარმონიული შრიფტები და ევროპული მინიმალისტური დიზაინი.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
            <Heart className="w-5 h-5" />
          </div>
          <h4 className="text-base font-semibold text-stone-900">
            პირადი ყურადღება
          </h4>
          <p className="text-xs text-stone-600 leading-relaxed">
            პერსონალიზებული ბმულები თითოეული სტუმრისთვის, სადაც ისინი ხედავენ მათთვის მიძღვნილ თბილ სიტყვებს.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <h4 className="text-base font-semibold text-stone-900">
            სიმარტივე & კომფორტი
          </h4>
          <p className="text-xs text-stone-600 leading-relaxed">
            მოსაწვევის შექმნა 10 წუთში და სტუმრების პასუხების რეალურ დროში კონტროლი პირად კაბინეტში.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="p-8 rounded-3xl bg-stone-900 text-white text-center space-y-4">
        <h3 className="text-2xl font-display font-bold">
          შექმენი შენი განსაკუთრებული მოსაწვევი დღესვე
        </h3>
        <p className="text-xs text-stone-400 max-w-md mx-auto">
          აირჩიე დიზაინი, შეავსე დეტალები და გაუგზავნე სტუმრებს დახვეწილი ციფრული მოსაწვევი.
        </p>
        <div className="pt-2">
          <Button
            size="lg"
            variant="amber"
            onClick={onStartCreate}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            დაიწყე შექმნა
          </Button>
        </div>
      </div>
    </div>
  );
};
