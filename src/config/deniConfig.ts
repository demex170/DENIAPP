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

export const DENI_CONFIG = {
  BRAND: {
    name: 'DENI',
    subtitle: 'ონლაინ მოსაწვევები',
    philosophy: '„უბრალოდ ბმული არ არის.“',
    coreIdea: '„შენი განსაკუთრებული დღე. შენი განსაკუთრებული მოსაწვევი.“',
    heroTagline: 'თანამედროვე და პრემიუმ ონლაინ მოსაწვევები შენი განსაკუთრებული დღეებისთვის.',
    taglineSubtitle: 'შექმენი თანამედროვე და გამორჩეული ონლაინ მოსაწვევი ქორწილისთვის, ნათლობისთვის, დაბადების დღისთვის, გამოშვებისთვის და ნებისმიერი მნიშვნელოვანი დღისთვის.',
    copyright: '© 2026 DENI. ყველა უფლება დაცულია.',
  },

  CONTACTS: {
    email: 'demex170@gmail.com',
    telegram: '@demetre105',
    telegramUrl: 'https://t.me/demetre105',
    whatsapp: '579089719',
    whatsappUrl: 'https://wa.me/995579089719',
    tiktok: '@onlineweb_deni',
    tiktokUrl: 'https://www.tiktok.com/@onlineweb_deni',
    phone: '+995 579 08 97 19',
    address: 'თბილისი, საქართველო',
  },

  PRICING: {
    wedding: { standard: 80, premium: 120 },
    baptism: { standard: 35, premium: 80 },
    birthday: { standard: 50, premium: 100 },
    graduation: { standard: 70, premium: 100 },
    party: { standard: 30, premium: 50 },
    custom: { standard: 90, premium: 120 },
  } as PricingConfig,

  ASSETS: {
    heroWedding: '/src/assets/images/hero_wedding_invitation_1790950174890.jpg',
    categoryBaptism: '/src/assets/images/category_baptism_ceremony_1790950186319.jpg',
    categoryBirthday: '/src/assets/images/category_birthday_party_1790950197854.jpg',
    categoryGraduation: '/src/assets/images/category_graduation_ball_1790950208277.jpg',
    categoryParty: '/src/assets/images/category_party_celebration_1790950219994.jpg',
  },

  CATEGORIES: [
    {
      id: 'wedding',
      number: '01',
      title: 'ქორწილი',
      enTitle: 'Wedding',
      subtitle: 'ელეგანტური, რომანტიკული და დაუვიწყარი',
      description: 'შენი ცხოვრების უმნიშვნელოვანესი დღის ელეგანტური ციფრული მოსაწვევი ლოკაციით, countdown-ით და RSVP-ით.',
      cover: '/src/assets/images/hero_wedding_invitation_1790950174890.jpg',
      templates: ['classic', 'luxury', 'romantic', 'minimal', 'modern'],
      accentColor: '#92400e', // amber-800
      badge: 'ყველაზე პოპულარული',
    },
    {
      id: 'baptism',
      number: '02',
      title: 'ნათლობა',
      enTitle: 'Baptism',
      subtitle: 'ნათელი, სუფთა და მშვიდი ატმოსფერო',
      description: 'პატარას ნათლობის სათუთი მოსაწვევი ტაძრისა და სუფრის განრიგით, ნათლიების სახელებითა და რუკით.',
      cover: '/src/assets/images/category_baptism_ceremony_1790950186319.jpg',
      templates: ['soft', 'elegant', 'minimal'],
      accentColor: '#0284c7', // sky-600
    },
    {
      id: 'birthday',
      number: '03',
      title: 'დაბადების დღე',
      enTitle: 'Birthday',
      subtitle: 'მხიარული, ელეგანტური ან გრანდიოზული',
      description: 'იუბილესა თუ დაბადების დღის წვეულების გამორჩეული მოსაწვევი ფოტოგალერეითა და განრიგით.',
      cover: '/src/assets/images/category_birthday_party_1790950197854.jpg',
      templates: ['elegant', 'colorful', 'minimal', 'party'],
      accentColor: '#d97706', // amber-600
    },
    {
      id: 'graduation',
      number: '04',
      title: 'გამოშვება',
      enTitle: 'Graduation',
      subtitle: 'საზეიმო, ახალგაზრდული და პრესტიჟული',
      description: 'სკოლისა თუ უნივერსიტეტის გამოსაშვები საღამოს თანამედროვე მოსაწვევი კურსელებისთვის.',
      cover: '/src/assets/images/category_graduation_ball_1790950208277.jpg',
      templates: ['modern', 'luxury', 'youth'],
      accentColor: '#4f46e5', // indigo-600
    },
    {
      id: 'party',
      number: '05',
      title: 'წვეულება',
      enTitle: 'Party',
      subtitle: 'ენერგიული, ღამის და სადღესასწაულო',
      description: 'კორპორატიული წვეულების, თემატური საღამოს ან მეგობრული შეკრების დინამიკური მოსაწვევი.',
      cover: '/src/assets/images/category_party_celebration_1790950219994.jpg',
      templates: ['dark', 'neon', 'elegant'],
      accentColor: '#ec4899', // pink-500
    },
    {
      id: 'custom',
      number: '06',
      title: 'პერსონალური',
      enTitle: 'Custom',
      subtitle: 'სრულიად ინდივიდუალური გადაწყვეტა',
      description: 'ნებისმიერი უნიკალური ღონისძიება: პრეზენტაცია, გამოფენა, იუბილე ან განსაკუთრებული შეხვედრა.',
      cover: '/src/assets/images/hero_wedding_invitation_1790950174890.jpg',
      templates: ['fully_custom'],
      accentColor: '#1e293b', // slate-800
    },
  ],

  PACKAGES: {
    standard: {
      id: 'standard',
      name: 'STANDARD',
      title: 'სტანდარტული პაკეტი',
      subtitle: 'იდეალური საბაზისო პაკეტი სრულყოფილი ონლაინ მოსაწვევისთვის',
      features: [
        'ინდივიდუალური დიზაინი შერჩეული თემის მიხედვით',
        'თარიღისა და დროის განსაკუთრებული ჩვენება',
        'რეალურ დროში Countdown (დღეები, საათები, წუთები)',
        'დღის განრიგი (Timeline) დეტალური ეტაპებით',
        'ღონისძიების ლოკაციები და მისამართები',
        'ინტერაქტიული რუკა და „როგორ მივიდე?“ ნავიგაცია',
        'სიყვარულის ისტორია / ღონისძიების ისტორია',
        'ფოტოალბომი (გალერეა)',
        'Dress Code სექცია ფერთა პალიტრით',
        'ხშირად დასმული კითხვები (FAQ Accordion)',
        'სტუმრების RSVP დადასტურების სისტემა',
        'Share სისტემა (WhatsApp, Telegram, QR კოდი)',
      ],
    },
    premium: {
      id: 'premium',
      name: 'PREMIUM',
      title: 'პრემიუმ პაკეტი',
      subtitle: 'სრული ექსკლუზივი პერსონალიზებული მოწვევითა და ეფექტებით',
      badge: 'რეკომენდებული',
      features: [
        'Standard პაკეტის ყველა ფუნქცია',
        'ანიმაციური კინემატოგრაფიული შესავალი',
        'პერსონალური სახელობითი მოწვევა („ძვირფასო ნინო“)',
        'უნიკალური პერსონალური ბმულები თითოეული სტუმრისთვის',
        'სტუმრისთვის პერსონალური შეტყობინების ჩვენება',
        'სურვილებისა და მილოცვების წიგნი (Guestbook)',
        'დამატებითი ინტერაქტიული სექციები',
        'დახვეწილი მიკრო-ანიმაციები და ეფექტები',
        'მუსიკალური აკომპანიმენტის მხარდაჭერა',
        'პრიორიტეტული VIP მხარდაჭერა DENI-სგან',
      ],
    },
  },

  TEMPLATES: [
    // Wedding
    {
      id: 'wedding-classic',
      categoryId: 'wedding',
      name: 'Classic Luxury',
      georgianName: 'კლასიკური ლუქსი',
      description: 'დახვეწილი ოქროსფერი აქცენტები, სუფთა შრიფტები და ელეგანტური იერსახე.',
      style: {
        fontFamily: 'font-display',
        theme: 'luxury',
        primaryColor: '#92400e',
        secondaryColor: '#fef3c7',
        bgTone: 'bg-stone-50',
      },
    },
    {
      id: 'wedding-romantic',
      categoryId: 'wedding',
      name: 'Romantic Blush',
      georgianName: 'რომანტიკული ვარდისფერი',
      description: 'სათუთი პასტელური ტონები, ნაზი ყვავილოვანი მოტივები და თბილი აურა.',
      style: {
        fontFamily: 'font-serif-ka',
        theme: 'romantic',
        primaryColor: '#be185d',
        secondaryColor: '#fce7f3',
        bgTone: 'bg-rose-50/40',
      },
    },
    {
      id: 'wedding-minimal',
      categoryId: 'wedding',
      name: 'Minimal Chic',
      georgianName: 'მინიმალისტური შიკი',
      description: 'თანამედროვე ევროპული სტილი, ბევრი სივრცე და უნაკლო ტიპოგრაფია.',
      style: {
        fontFamily: 'font-sans-ka',
        theme: 'minimal',
        primaryColor: '#1c1917',
        secondaryColor: '#e7e5e4',
        bgTone: 'bg-white',
      },
    },
    {
      id: 'wedding-modern',
      categoryId: 'wedding',
      name: 'Modern Noir',
      georgianName: 'მოდერნ ნუარი',
      description: 'კონტრასტული მუქი ელემენტები, მაღალი მოდა და თანამედროვე ესთეტიკა.',
      style: {
        fontFamily: 'font-display',
        theme: 'modern',
        primaryColor: '#0f172a',
        secondaryColor: '#cbd5e1',
        bgTone: 'bg-neutral-900 text-stone-100',
      },
    },

    // Baptism
    {
      id: 'baptism-soft',
      categoryId: 'baptism',
      name: 'Ethereal Angel',
      georgianName: 'ნათელი და სათუთი',
      description: 'სუფთა თეთრი და ცისფერი დეტალები, ზეთისხილის ტოტი და სინაზე.',
      style: {
        fontFamily: 'font-serif-ka',
        theme: 'soft',
        primaryColor: '#0369a1',
        secondaryColor: '#e0f2fe',
        bgTone: 'bg-sky-50/30',
      },
    },
    {
      id: 'baptism-elegant',
      categoryId: 'baptism',
      name: 'Golden Grace',
      georgianName: 'ოქროსფერი მადლი',
      description: 'საზეიმო ოქროსფერი ორნამენტები და სულიერი სიწყნარე.',
      style: {
        fontFamily: 'font-display',
        theme: 'elegant',
        primaryColor: '#b45309',
        secondaryColor: '#fef3c7',
        bgTone: 'bg-stone-50',
      },
    },

    // Birthday
    {
      id: 'birthday-elegant',
      categoryId: 'birthday',
      name: 'Midnight Glamour',
      georgianName: 'მიდნაით გლამური',
      description: 'მრგვალი თარიღებისა და გრანდიოზული იუბილეებისთვის.',
      style: {
        fontFamily: 'font-display',
        theme: 'elegant',
        primaryColor: '#d97706',
        secondaryColor: '#1e293b',
        bgTone: 'bg-stone-950 text-stone-100',
      },
    },
    {
      id: 'birthday-colorful',
      categoryId: 'birthday',
      name: 'Vibrant Joy',
      georgianName: 'ცოცხალი ფერები',
      description: 'ენერგიული, მხიარული და ფერადი დიზაინი დაუვიწყარი წვეულებისთვის.',
      style: {
        fontFamily: 'font-sans-ka',
        theme: 'colorful',
        primaryColor: '#e11d48',
        secondaryColor: '#fed7aa',
        bgTone: 'bg-amber-50/50',
      },
    },

    // Graduation
    {
      id: 'graduation-modern',
      categoryId: 'graduation',
      name: 'Alumni Gala',
      georgianName: 'ალუმნი გაალა',
      description: 'აკადემიური პრესტიჟი, ლურჯი და ოქროსფერი ჰარმონია.',
      style: {
        fontFamily: 'font-display',
        theme: 'modern',
        primaryColor: '#1e3a8a',
        secondaryColor: '#fef08a',
        bgTone: 'bg-slate-50',
      },
    },

    // Party
    {
      id: 'party-dark',
      categoryId: 'party',
      name: 'Neon Twilight',
      georgianName: 'ტვაილაით ფართი',
      description: 'ღამის კლუბური ესთეტიკა, თანამედროვე ვიბრაცია და რიტმი.',
      style: {
        fontFamily: 'font-sans-ka',
        theme: 'dark',
        primaryColor: '#db2777',
        secondaryColor: '#38bdf8',
        bgTone: 'bg-black text-white',
      },
    },

    // Custom
    {
      id: 'custom-bespoke',
      categoryId: 'custom',
      name: 'Bespoke Atelier',
      georgianName: 'სრულიად ინდივიდუალური',
      description: 'დიზაინი, რომელიც იქმნება ზუსტად შენი მოთხოვნებისა და გემოვნების მიხედვით.',
      style: {
        fontFamily: 'font-serif-ka',
        theme: 'custom',
        primaryColor: '#0f172a',
        secondaryColor: '#cbd5e1',
        bgTone: 'bg-stone-50',
      },
    },
  ],
};
