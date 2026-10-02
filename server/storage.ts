import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { User, Invitation, Guest, Order, NotificationItem, WishMessage, PricingConfig } from '../src/types/index.ts';
import { DENI_CONFIG } from '../src/config/deniConfig.ts';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.resolve(DATA_DIR, 'deni_database.json');

export interface DatabaseSchema {
  users: Array<User & { passwordHash: string; salt: string }>;
  invitations: Invitation[];
  guests: Guest[];
  orders: Order[];
  notifications: NotificationItem[];
  wishes: WishMessage[];
  pricing: PricingConfig;
}

function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

export function generateToken(length = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

function getInitialData(): DatabaseSchema {
  const adminSalt = crypto.randomBytes(16).toString('hex');
  const userSalt = crypto.randomBytes(16).toString('hex');

  const adminUser = {
    id: 'user-admin-1',
    email: 'demetree105@gmail.com',
    firstName: 'დემეტრე',
    lastName: 'დევდარიანი',
    phone: '579089719',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    role: 'admin' as const,
    createdAt: new Date('2026-01-10T10:00:00.000Z').toISOString(),
    passwordHash: hashPassword('deni2026', adminSalt),
    salt: adminSalt,
  };

  const sampleUser = {
    id: 'user-customer-1',
    email: 'nino@example.ge',
    firstName: 'ნინო',
    lastName: 'აბაშიძე',
    phone: '599112233',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    role: 'customer' as const,
    createdAt: new Date('2026-02-15T12:00:00.000Z').toISOString(),
    passwordHash: hashPassword('deni2026', userSalt),
    salt: userSalt,
  };

  const sampleInvitationWedding: Invitation = {
    id: 'inv-wedding-1',
    userId: 'user-customer-1',
    slug: 'giorgi-nino-2026',
    eventType: 'wedding',
    templateId: 'wedding-classic',
    packageType: 'premium',
    status: 'published',
    title: 'გიორგი & ნინო — ქორწილი',
    coupleOrHostNames: 'გიორგი & ნინო',
    secondaryNames: 'გიორგი მახარაძე და ნინო აბაშიძე',
    eventDate: '2026-10-24',
    eventTime: '15:00',
    eventTimeEnd: '23:30',
    venueName: 'შატო მუხრანი',
    venueAddress: 'მუხრანი, მცხეთა-მთიანეთი',
    venueCity: 'მცხეთა',
    googleMapsUrl: 'https://maps.google.com/?q=Chateau+Mukhrani',
    locationNotes: 'ცერემონიალი დაიწყება ისტორიულ ბაღში, რის შემდეგაც გადავინაცვლებთ მთავარ დარბაზში.',
    heroMessage: 'სიყვარულით გეპატიჟებით ჩვენი ცხოვრების უმნიშვნელოვანეს დღეს',
    description: 'ჩვენთვის დიდი პატივი და სიხარული იქნება, თუ ამ განსაკუთრებულ დღეს გაიზიარებთ ჩვენთან ერთად. გელოდებით სიყვარულით!',
    coverImage: '/src/assets/images/hero_wedding_invitation_1790950174890.jpg',
    heroImage: '/src/assets/images/hero_wedding_invitation_1790950174890.jpg',
    storyTitle: 'ჩვენი ისტორია',
    storyContent: 'ყველაფერი 4 წლის წინ, თბილისის ძველ უბანში შემთხვევითი შეხვედრით დაიწყო. მას შემდეგ ყოველი დღე სავსეა ერთგულებით, სიცილითა და ურთიერთპატივისცემით.',
    countdownEnabled: true,
    countdownMessage: 'ქორწილის დაწყებამდე დარჩა:',
    timeline: [
      { id: 't1', time: '15:00', title: 'სტუმრების მიღება & Welcome Drink', description: 'მსუბუქი ჯაზი, ცქრიალა ღვინო და სასიამოვნო ატმოსფერო ბაღში.' },
      { id: 't2', time: '16:00', title: 'ჯვრისწერის საზეიმო ცერემონია', description: 'ფიცის დადება და ბეჭდების გაცვლა ღია ცის ქვეშ.' },
      { id: 't3', time: '17:30', title: 'სადღესასწაულო ფოტოსესია', description: 'სტუმრებთან ერთად სამახსოვრო ფოტოების გადაღება.' },
      { id: 't4', time: '19:00', title: 'გრანდიოზული გალა ვახშამი', description: 'ქართული და ევროპული კერძები, ტრადიციული სადღეგრძელოები.' },
      { id: 't5', time: '21:30', title: 'საქორწილო ტორტის გაჭრა & ფოიერვერკი', description: 'საზეიმო კულმინაცია.' },
      { id: 't6', time: '22:00', title: 'After-Party & DJ Set', description: 'ცეკვები და გართობა გვიან ღამემდე.' },
    ],
    gallery: [
      { id: 'g1', url: '/src/assets/images/hero_wedding_invitation_1790950174890.jpg', caption: 'ჩვენი პირველი ერთობლივი მოგზაურობა', isCover: true },
      { id: 'g2', url: '/src/assets/images/category_birthday_party_1790950197854.jpg', caption: 'ნიშნობის საღამო' },
      { id: 'g3', url: '/src/assets/images/category_party_celebration_1790950219994.jpg', caption: 'მეგობრებთან ერთად' },
    ],
    dressCode: {
      type: 'Black Tie',
      description: 'ქალბატონებისთვის: საღამოს გრძელი კაბები პასტელურ ან კლასიკურ ტონებში. მამაკაცებისთვის: სმოკინგი ან კლასიკური მუქი კოსტიუმი.',
      palette: ['#0f172a', '#1e293b', '#e2e8f0', '#b45309', '#fef3c7'],
    },
    faqs: [
      { id: 'f1', question: 'როდემდე შეგვიძლია RSVP დადასტურება?', answer: 'გთხოვთ დაადასტუროთ თქვენი მობრძანება 15 ოქტომბრამდე, რათა ზუსტად განვსაზღვროთ სტუმრების რაოდენობა.' },
      { id: 'f2', question: 'არის თუ არა ადგილზე ავტოსადგომი?', answer: 'დიახ, შატო მუხრანის ტერიტორიაზე მოწყობილია უფასო და დაცული ავტოსადგომი 150 ავტომობილზე.' },
      { id: 'f3', question: 'შესაძლებელია თუ არა ბავშვებთან ერთად მობრძანება?', answer: 'დიახ, ღონისძიებაზე იმუშავებს ბავშვთა ანიმატორთა კუთხე.' },
    ],
    rsvpSettings: {
      enabled: true,
      deadlineDate: '2026-10-15',
      maxPlusGuests: 2,
      allowChildren: true,
      customQuestion: 'გაქვთ თუ არა განსაკუთრებული კვებითი ალერგია / პრეფერენცია?',
    },
    premiumFeatures: {
      animatedIntro: true,
      introTitle: 'გიორგი & ნინო',
      introSubtitle: '24 ოქტომბერი, 2026',
      musicEnabled: true,
      musicUrl: '',
      guestbookEnabled: true,
      confettiEffect: true,
    },
    viewsCount: 342,
    createdAt: '2026-03-01T10:00:00.000Z',
    updatedAt: '2026-03-15T15:30:00.000Z',
  };

  const sampleInvitationBaptism: Invitation = {
    id: 'inv-baptism-1',
    userId: 'user-customer-1',
    slug: 'andria-baptism-2026',
    eventType: 'baptism',
    templateId: 'baptism-soft',
    packageType: 'standard',
    status: 'published',
    title: 'პატარა ანდრიას ნათლობა',
    coupleOrHostNames: 'ანდრია',
    secondaryNames: 'მშობლები: დავითი და მარიამი',
    eventDate: '2026-11-08',
    eventTime: '13:00',
    venueName: 'სვეტიცხოვლის საკათედრო ტაძარი',
    venueAddress: 'მცხეთა, არსუკიძის ქუჩა',
    venueCity: 'მცხეთა',
    googleMapsUrl: 'https://maps.google.com/?q=Svetitskhoveli+Cathedral',
    locationNotes: 'ნათლობის შემდეგ გადავინაცვლებთ რესტორან „მარანში“ სადღესასწაულო სუფრაზე.',
    heroMessage: 'სიხარულით გიწვევთ ჩვენი ანგელოზის გაქრისტიანების დღეს',
    description: 'გვსურს ეს მადლიანი და წმინდა დღე გავატაროთ ჩვენს უსაყვარლეს ადამიანებთან ერთად.',
    coverImage: '/src/assets/images/category_baptism_ceremony_1790950186319.jpg',
    heroImage: '/src/assets/images/category_baptism_ceremony_1790950186319.jpg',
    countdownEnabled: true,
    countdownMessage: 'ნათლობამდე დარჩა:',
    timeline: [
      { id: 'tb1', time: '13:00', title: 'საზეიმო ნათლობის საიდუმლო', description: 'სვეტიცხოვლის ტაძარი' },
      { id: 'tb2', time: '15:00', title: 'სადღესასწაულო ტრაპეზი', description: 'რესტორანი მარანი, მცხეთა' },
    ],
    gallery: [
      { id: 'gb1', url: '/src/assets/images/category_baptism_ceremony_1790950186319.jpg', caption: 'ჩვენი პატარა ანდრია', isCover: true },
    ],
    dressCode: {
      type: 'White / Pastel',
      description: 'სასურველია ღია, მშვიდი და პასტელური ფერების სამოსი.',
      palette: ['#ffffff', '#f0fdf4', '#e0f2fe', '#fef3c7'],
    },
    faqs: [
      { id: 'fb1', question: 'ტაძარში შესვლის წესი', answer: 'ქალბატონებისთვის რეკომენდებულია თავშალი და მოკრძალებული სამოსი.' },
    ],
    rsvpSettings: {
      enabled: true,
      deadlineDate: '2026-11-01',
      maxPlusGuests: 3,
      allowChildren: true,
    },
    premiumFeatures: {
      animatedIntro: false,
      musicEnabled: false,
      guestbookEnabled: true,
      confettiEffect: true,
    },
    viewsCount: 120,
    createdAt: '2026-03-10T12:00:00.000Z',
    updatedAt: '2026-03-10T12:00:00.000Z',
  };

  const sampleInvitationBirthday: Invitation = {
    id: 'inv-birthday-1',
    userId: 'user-admin-1',
    slug: 'salome-30th-birthday',
    eventType: 'birthday',
    templateId: 'birthday-elegant',
    packageType: 'premium',
    status: 'draft',
    title: 'სალომეს 30 წლის იუბილე',
    coupleOrHostNames: 'სალომე',
    eventDate: '2026-12-05',
    eventTime: '20:00',
    venueName: 'Lounge 360',
    venueAddress: 'თბილისი, რუსთაველის გამზ. 42',
    venueCity: 'თბილისი',
    googleMapsUrl: 'https://maps.google.com/?q=Rustaveli+Avenue+42+Tbilisi',
    heroMessage: '30 წელი — ახალი თავგადასავლების დასაწყისი!',
    description: 'მოდით ერთად აღვნიშნოთ ჩემი მრგვალი თარიღი გემრიელი კოქტეილებითა და საუკეთესო მუსიკით!',
    coverImage: '/src/assets/images/category_birthday_party_1790950197854.jpg',
    heroImage: '/src/assets/images/category_birthday_party_1790950197854.jpg',
    countdownEnabled: true,
    timeline: [
      { id: 'tbday1', time: '20:00', title: 'Cocktails & Lounge', description: 'მისალმება და საყვარელი მელოდიები' },
      { id: 'tbday2', time: '22:00', title: 'Party & Cake', description: 'სადღესასწაულო ტორტი და ცეკვა' },
    ],
    gallery: [
      { id: 'gbday1', url: '/src/assets/images/category_birthday_party_1790950197854.jpg', isCover: true },
    ],
    dressCode: {
      type: 'Smart Casual',
      description: 'ბრჭყვიალა, ელეგანტური და კომფორტული საღამოს სამოსი.',
      palette: ['#0f172a', '#d97706', '#ec4899', '#f8fafc'],
    },
    faqs: [],
    rsvpSettings: {
      enabled: true,
      deadlineDate: '2026-11-28',
      maxPlusGuests: 1,
      allowChildren: false,
    },
    premiumFeatures: {
      animatedIntro: true,
      musicEnabled: true,
      guestbookEnabled: true,
      confettiEffect: true,
    },
    viewsCount: 45,
    createdAt: '2026-03-20T08:00:00.000Z',
    updatedAt: '2026-03-20T08:00:00.000Z',
  };

  const sampleGuests: Guest[] = [
    {
      id: 'guest-1',
      invitationId: 'inv-wedding-1',
      firstName: 'ნინო',
      lastName: 'ჩხეიძე',
      token: 'tok-nino-chkheidze-1',
      personalNote: 'ძვირფასო ნინო, შენი დასწრება ჩვენთვის უდიდესი ბედნიერება იქნება!',
      rsvpStatus: 'attending',
      guestCount: 2,
      comments: 'მოუთმენლად ველით ამ ულამაზეს საღამოს! ❤️',
      customAnswer: 'არავითარი ალერგია არ გვაქვს.',
      submittedAt: '2026-03-12T14:22:00.000Z',
    },
    {
      id: 'guest-2',
      invitationId: 'inv-wedding-1',
      firstName: 'ლევან',
      lastName: 'ბერიძე',
      token: 'tok-levan-beridze-2',
      personalNote: 'ლევან, ძმაო, შენს გარეშე ეს დღე წარმოუდგენელია!',
      rsvpStatus: 'attending',
      guestCount: 2,
      comments: 'აუცილებლად მოვალთ მე და ანი!',
      submittedAt: '2026-03-13T10:15:00.000Z',
    },
    {
      id: 'guest-3',
      invitationId: 'inv-wedding-1',
      firstName: 'ირაკლი',
      lastName: 'კალანდაძე',
      token: 'tok-irakli-3',
      personalNote: 'ძვირფასო ირაკლი, გელოდებით ქორწილში!',
      rsvpStatus: 'declined',
      guestCount: 0,
      comments: 'სამწუხაროდ საქართველოში არ ვიქნები იმ დროს. გილოცავთ მთელი გულით!',
      submittedAt: '2026-03-14T09:40:00.000Z',
    },
    {
      id: 'guest-4',
      invitationId: 'inv-wedding-1',
      firstName: 'თამარ',
      lastName: 'მელიქიშვილი',
      token: 'tok-tamar-4',
      personalNote: 'თამარ, გაგვიხარდება შენი ხილვა!',
      rsvpStatus: 'pending',
      guestCount: 1,
    },
  ];

  const sampleOrders: Order[] = [
    {
      id: 'ord-1001',
      orderNumber: 'DENI-2026-1001',
      userId: 'user-customer-1',
      userEmail: 'nino@example.ge',
      userName: 'ნინო აბაშიძე',
      invitationId: 'inv-wedding-1',
      invitationTitle: 'გიორგი & ნინო — ქორწილი',
      eventType: 'wedding',
      packageType: 'premium',
      price: 120,
      currency: '₾',
      status: 'completed',
      createdAt: '2026-03-01T10:05:00.000Z',
      notes: 'გადახდილია ბარათით. პრემიუმ პაკეტი გააქტიურებულია.',
    },
    {
      id: 'ord-1002',
      orderNumber: 'DENI-2026-1002',
      userId: 'user-customer-1',
      userEmail: 'nino@example.ge',
      userName: 'ნინო აბაშიძე',
      invitationId: 'inv-baptism-1',
      invitationTitle: 'პატარა ანდრიას ნათლობა',
      eventType: 'baptism',
      packageType: 'standard',
      price: 35,
      currency: '₾',
      status: 'completed',
      createdAt: '2026-03-10T12:05:00.000Z',
    },
  ];

  const sampleNotifications: NotificationItem[] = [
    {
      id: 'notif-1',
      userId: 'user-customer-1',
      title: 'ახალი RSVP პასუხი',
      message: 'ნინო ჩხეიძემ დაადასტურა დასწრება (2 სტუმარი).',
      type: 'rsvp',
      read: false,
      createdAt: '2026-03-12T14:22:00.000Z',
      link: '/rsvps',
    },
    {
      id: 'notif-2',
      userId: 'user-customer-1',
      title: 'ახალი მილოცვა',
      message: 'სტუმარმა დაგიტოვათ თბილი სურვილი საქორწილო წიგნში.',
      type: 'wish',
      read: false,
      createdAt: '2026-03-12T15:00:00.000Z',
      link: '/i/giorgi-nino-2026',
    },
    {
      id: 'notif-3',
      userId: 'user-customer-1',
      title: 'მოსაწვევი გამოქვეყნდა',
      message: 'თქვენი მოსაწვევი „გიორგი & ნინო — ქორწილი“ წარმატებით გამოქვეყნდა.',
      type: 'publish',
      read: true,
      createdAt: '2026-03-01T10:05:00.000Z',
    },
  ];

  const sampleWishes: WishMessage[] = [
    {
      id: 'w-1',
      invitationId: 'inv-wedding-1',
      guestName: 'ნინო ჩხეიძე',
      message: 'გილოცავთ საყვარლებო! უსაზღვრო სიყვარულს, ბედნიერებას და მუდამ ასეთ ლამაზ ერთობას გისურვებთ მთელი გულით! ✨',
      createdAt: '2026-03-12T15:00:00.000Z',
    },
    {
      id: 'w-2',
      invitationId: 'inv-wedding-1',
      guestName: 'ლევან ბერიძე',
      message: 'გიო და ნინო, ულამაზესი წყვილი ხართ! საუკეთესო ქორწილი გექნებათ, გილოცავთ! 🥂',
      createdAt: '2026-03-13T11:00:00.000Z',
    },
  ];

  return {
    users: [adminUser, sampleUser],
    invitations: [sampleInvitationWedding, sampleInvitationBaptism, sampleInvitationBirthday],
    guests: sampleGuests,
    orders: sampleOrders,
    notifications: sampleNotifications,
    wishes: sampleWishes,
    pricing: DENI_CONFIG.PRICING,
  };
}

class StorageManager {
  private data: DatabaseSchema;

  constructor() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      try {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(fileContent);
      } catch (err) {
        console.error('Error reading database file, reinitializing with defaults', err);
        this.data = getInitialData();
        this.persist();
      }
    } else {
      this.data = getInitialData();
      this.persist();
    }
  }

  private persist() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write database file', err);
    }
  }

  // Auth & Users
  getUserByEmail(email: string) {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  getUserById(id: string) {
    return this.data.users.find(u => u.id === id);
  }

  createUser(userData: { email: string; password: string; firstName: string; lastName: string; phone: string; role?: 'customer' | 'admin' }) {
    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = hashPassword(userData.password, salt);
    const newUser = {
      id: 'user-' + Date.now() + '-' + crypto.randomBytes(4).toString('hex'),
      email: userData.email.toLowerCase(),
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone,
      role: userData.role || 'customer',
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userData.firstName + ' ' + userData.lastName)}`,
      createdAt: new Date().toISOString(),
      passwordHash,
      salt,
    };
    this.data.users.push(newUser);
    this.persist();
    const { passwordHash: _, salt: __, ...safeUser } = newUser;
    return safeUser;
  }

  verifyPassword(user: DatabaseSchema['users'][0], passwordAttempt: string): boolean {
    const calculated = hashPassword(passwordAttempt, user.salt);
    return calculated === user.passwordHash;
  }

  updateUserProfile(userId: string, updates: Partial<User>) {
    const user = this.getUserById(userId);
    if (!user) return null;
    if (updates.firstName) user.firstName = updates.firstName;
    if (updates.lastName) user.lastName = updates.lastName;
    if (updates.phone) user.phone = updates.phone;
    if (updates.avatarUrl) user.avatarUrl = updates.avatarUrl;
    this.persist();
    const { passwordHash: _, salt: __, ...safeUser } = user;
    return safeUser;
  }

  getAllUsers() {
    return this.data.users.map(({ passwordHash: _, salt: __, ...safeUser }) => ({
      ...safeUser,
      createdInvitationsCount: this.data.invitations.filter(i => i.userId === safeUser.id).length,
    }));
  }

  setUserRole(userId: string, role: 'customer' | 'admin') {
    const user = this.getUserById(userId);
    if (!user) return null;
    user.role = role;
    this.persist();
    const { passwordHash: _, salt: __, ...safeUser } = user;
    return safeUser;
  }

  // Invitations
  getInvitations(userId?: string, isAdmin = false) {
    if (isAdmin && !userId) {
      return this.data.invitations;
    }
    return this.data.invitations.filter(inv => inv.userId === userId);
  }

  getInvitationById(id: string) {
    return this.data.invitations.find(inv => inv.id === id);
  }

  getInvitationBySlug(slug: string) {
    const inv = this.data.invitations.find(i => i.slug.toLowerCase() === slug.toLowerCase());
    if (inv) {
      inv.viewsCount = (inv.viewsCount || 0) + 1;
      this.persist();
    }
    return inv;
  }

  createInvitation(userId: string, invitationData: Omit<Invitation, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) {
    const newInvitation: Invitation = {
      ...invitationData,
      id: 'inv-' + Date.now() + '-' + crypto.randomBytes(3).toString('hex'),
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      viewsCount: 0,
    };
    this.data.invitations.unshift(newInvitation);
    this.persist();
    return newInvitation;
  }

  updateInvitation(id: string, userId: string, updates: Partial<Invitation>, isAdmin = false) {
    const index = this.data.invitations.findIndex(inv => inv.id === id);
    if (index === -1) return null;
    const existing = this.data.invitations[index];
    if (!isAdmin && existing.userId !== userId) {
      return null;
    }
    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.data.invitations[index] = updated;
    this.persist();
    return updated;
  }

  deleteInvitation(id: string, userId: string, isAdmin = false) {
    const index = this.data.invitations.findIndex(inv => inv.id === id);
    if (index === -1) return false;
    if (!isAdmin && this.data.invitations[index].userId !== userId) {
      return false;
    }
    this.data.invitations.splice(index, 1);
    // Also cleanup associated guests and rsvps
    this.data.guests = this.data.guests.filter(g => g.invitationId !== id);
    this.data.wishes = this.data.wishes.filter(w => w.invitationId !== id);
    this.persist();
    return true;
  }

  // Guests & RSVPs
  getGuestsByInvitation(invitationId: string) {
    return this.data.guests.filter(g => g.invitationId === invitationId);
  }

  getGuestByToken(token: string) {
    const guest = this.data.guests.find(g => g.token === token);
    if (!guest) return null;
    const invitation = this.getInvitationById(guest.invitationId);
    return { guest, invitation };
  }

  addGuest(invitationId: string, guestData: { firstName: string; lastName: string; personalNote?: string }) {
    const token = 'guest-' + Date.now().toString(36) + '-' + crypto.randomBytes(4).toString('hex');
    const guest: Guest = {
      id: 'g-' + Date.now() + '-' + crypto.randomBytes(2).toString('hex'),
      invitationId,
      firstName: guestData.firstName,
      lastName: guestData.lastName,
      personalNote: guestData.personalNote,
      token,
      rsvpStatus: 'pending',
      guestCount: 1,
    };
    this.data.guests.push(guest);
    this.persist();
    return guest;
  }

  deleteGuest(guestId: string) {
    const index = this.data.guests.findIndex(g => g.id === guestId);
    if (index === -1) return false;
    this.data.guests.splice(index, 1);
    this.persist();
    return true;
  }

  submitRSVP(rsvpData: {
    invitationId: string;
    guestToken?: string;
    firstName: string;
    lastName: string;
    rsvpStatus: 'attending' | 'declined';
    guestCount: number;
    comments?: string;
    customAnswer?: string;
  }) {
    let guest: Guest | undefined;

    if (rsvpData.guestToken) {
      guest = this.data.guests.find(g => g.token === rsvpData.guestToken);
    }

    if (guest) {
      guest.firstName = rsvpData.firstName;
      guest.lastName = rsvpData.lastName;
      guest.rsvpStatus = rsvpData.rsvpStatus;
      guest.guestCount = rsvpData.rsvpStatus === 'attending' ? (rsvpData.guestCount || 1) : 0;
      guest.comments = rsvpData.comments;
      guest.customAnswer = rsvpData.customAnswer;
      guest.submittedAt = new Date().toISOString();
    } else {
      guest = {
        id: 'g-' + Date.now() + '-' + crypto.randomBytes(3).toString('hex'),
        invitationId: rsvpData.invitationId,
        firstName: rsvpData.firstName,
        lastName: rsvpData.lastName,
        token: 'public-' + Date.now().toString(36),
        rsvpStatus: rsvpData.rsvpStatus,
        guestCount: rsvpData.rsvpStatus === 'attending' ? (rsvpData.guestCount || 1) : 0,
        comments: rsvpData.comments,
        customAnswer: rsvpData.customAnswer,
        submittedAt: new Date().toISOString(),
      };
      this.data.guests.push(guest);
    }

    // Trigger notification for the invitation owner
    const inv = this.getInvitationById(rsvpData.invitationId);
    if (inv) {
      this.createNotification({
        userId: inv.userId,
        title: 'ახალი RSVP პასუხი',
        message: `${rsvpData.firstName} ${rsvpData.lastName} - ${rsvpData.rsvpStatus === 'attending' ? `დაესწრება (${guest.guestCount} სტუმარი)` : 'ვერ ესწრება'}.`,
        type: 'rsvp',
        link: `/rsvps`,
      });
    }

    this.persist();
    return guest;
  }

  // Wishes
  getWishesByInvitation(invitationId: string) {
    return this.data.wishes.filter(w => w.invitationId === invitationId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  addWish(invitationId: string, guestName: string, message: string) {
    const wish: WishMessage = {
      id: 'wish-' + Date.now() + '-' + crypto.randomBytes(2).toString('hex'),
      invitationId,
      guestName,
      message,
      createdAt: new Date().toISOString(),
    };
    this.data.wishes.unshift(wish);

    const inv = this.getInvitationById(invitationId);
    if (inv) {
      this.createNotification({
        userId: inv.userId,
        title: 'ახალი სურვილი სტუმრისგან',
        message: `${guestName}: „${message.substring(0, 60)}${message.length > 60 ? '...' : ''}“`,
        type: 'wish',
        link: `/i/${inv.slug}`,
      });
    }

    this.persist();
    return wish;
  }

  // Orders
  getOrders(userId?: string, isAdmin = false) {
    if (isAdmin && !userId) {
      return this.data.orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return this.data.orders.filter(o => o.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>) {
    const count = this.data.orders.length + 1001;
    const newOrder: Order = {
      ...orderData,
      id: 'ord-' + Date.now(),
      orderNumber: `DENI-2026-${count}`,
      createdAt: new Date().toISOString(),
    };
    this.data.orders.unshift(newOrder);

    this.createNotification({
      userId: orderData.userId,
      title: 'შეკვეთა მიღებულია',
      message: `თქვენი შეკვეთა #${newOrder.orderNumber} მიღებულია. პაკეტი: ${orderData.packageType.toUpperCase()}`,
      type: 'order',
      link: '/orders',
    });

    this.persist();
    return newOrder;
  }

  updateOrderStatus(orderId: string, status: Order['status']) {
    const order = this.data.orders.find(o => o.id === orderId);
    if (!order) return null;
    order.status = status;
    this.persist();
    return order;
  }

  // Notifications
  getNotifications(userId: string) {
    return this.data.notifications
      .filter(n => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  createNotification(notif: Omit<NotificationItem, 'id' | 'createdAt' | 'read'>) {
    const item: NotificationItem = {
      ...notif,
      id: 'notif-' + Date.now() + '-' + crypto.randomBytes(2).toString('hex'),
      read: false,
      createdAt: new Date().toISOString(),
    };
    this.data.notifications.unshift(item);
    this.persist();
    return item;
  }

  markNotificationRead(id: string, userId: string) {
    const notif = this.data.notifications.find(n => n.id === id && n.userId === userId);
    if (notif) {
      notif.read = true;
      this.persist();
    }
    return notif;
  }

  markAllNotificationsRead(userId: string) {
    this.data.notifications.forEach(n => {
      if (n.userId === userId) n.read = true;
    });
    this.persist();
    return true;
  }

  // Pricing
  getPricing(): PricingConfig {
    return this.data.pricing || DENI_CONFIG.PRICING;
  }

  updatePricing(newPricing: PricingConfig): PricingConfig {
    this.data.pricing = newPricing;
    this.persist();
    return this.data.pricing;
  }

  // Overall Stats for Admin
  getAdminStats() {
    const totalUsers = this.data.users.length;
    const totalInvitations = this.data.invitations.length;
    const publishedInvitations = this.data.invitations.filter(i => i.status === 'published').length;
    const totalOrders = this.data.orders.length;
    const totalRevenue = this.data.orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.price, 0);
    const totalGuests = this.data.guests.length;
    const attendingGuests = this.data.guests.filter(g => g.rsvpStatus === 'attending').reduce((sum, g) => sum + (g.guestCount || 1), 0);

    return {
      totalUsers,
      totalInvitations,
      publishedInvitations,
      totalOrders,
      totalRevenue,
      totalGuests,
      attendingGuests,
    };
  }
}

export const storage = new StorageManager();
