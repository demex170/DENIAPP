import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { storage } from './server/storage.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Active session token store
const activeSessions = new Map<string, string>(); // token -> userId

function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'ავტორიზაცია აუცილებელია' });
  }
  const token = authHeader.split(' ')[1];
  const userId = activeSessions.get(token);
  if (!userId) {
    return res.status(401).json({ error: 'სესია ამოიწურა. გთხოვთ გაიაროთ ავტორიზაცია' });
  }
  const user = storage.getUserById(userId);
  if (!user) {
    return res.status(401).json({ error: 'მომხმარებელი ვერ მოიძებნა' });
  }
  (req as any).user = user;
  (req as any).token = token;
  next();
}

function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const userId = activeSessions.get(token);
    if (userId) {
      const user = storage.getUserById(userId);
      if (user) {
        (req as any).user = user;
      }
    }
  }
  next();
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user;
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'წვდომა შეზღუდულია. საჭიროა ადმინისტრატორის უფლებები' });
  }
  next();
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // JSON Body parsing with 20MB limit for image uploads
  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ extended: true, limit: '20mb' }));

  // Ensure uploads directory exists
  const UPLOADS_DIR = path.resolve(__dirname, 'public/uploads');
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
  app.use('/uploads', express.static(UPLOADS_DIR));

  // --- API ROUTES ---

  // Auth: Register
  app.post('/api/auth/register', (req, res) => {
    try {
      const { email, password, firstName, lastName, phone } = req.body;
      if (!email || !password || !firstName || !lastName || !phone) {
        return res.status(400).json({ error: 'გთხოვთ შეავსოთ ყველა აუცილებელი ველი' });
      }
      if (password.length < 6) {
        return res.status(400).json({ error: 'პაროლი უნდა შედგებოდეს მინიმუმ 6 სიმბოლოსგან' });
      }
      const existing = storage.getUserByEmail(email);
      if (existing) {
        return res.status(400).json({ error: 'ამ ელფოსტით მომხმარებელი უკვე რეგისტრირებულია' });
      }

      const user = storage.createUser({ email, password, firstName, lastName, phone });
      const token = 'token-' + Date.now() + '-' + Math.random().toString(36).substring(2);
      activeSessions.set(token, user.id);

      return res.status(201).json({ user, token });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'რეგისტრაციის შეცდომა' });
    }
  });

  // Auth: Login
  app.post('/api/auth/login', (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'გთხოვთ შეიყვანოთ ელფოსტა და პაროლი' });
      }
      const user = storage.getUserByEmail(email);
      if (!user) {
        return res.status(400).json({ error: 'ელფოსტა ან პაროლი არასწორია' });
      }
      const isValid = storage.verifyPassword(user, password);
      if (!isValid) {
        return res.status(400).json({ error: 'ელფოსტა ან პაროლი არასწორია' });
      }

      const token = 'token-' + Date.now() + '-' + Math.random().toString(36).substring(2);
      activeSessions.set(token, user.id);

      const { passwordHash: _, salt: __, ...safeUser } = user;
      return res.json({ user: safeUser, token });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'ავტორიზაციის შეცდომა' });
    }
  });

  // Auth: Me
  app.get('/api/auth/me', authenticate, (req, res) => {
    const user = (req as any).user;
    const { passwordHash: _, salt: __, ...safeUser } = user;
    const invitations = storage.getInvitations(user.id);
    return res.json({
      user: {
        ...safeUser,
        createdInvitationsCount: invitations.length,
      },
    });
  });

  // Auth: Logout
  app.post('/api/auth/logout', authenticate, (req, res) => {
    const token = (req as any).token;
    activeSessions.delete(token);
    return res.json({ success: true });
  });

  // Auth: Update Profile
  app.put('/api/auth/profile', authenticate, (req, res) => {
    try {
      const user = (req as any).user;
      const { firstName, lastName, phone, avatarUrl } = req.body;
      const updated = storage.updateUserProfile(user.id, { firstName, lastName, phone, avatarUrl });
      return res.json({ user: updated });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'პროფილის განახლება ვერ მოხერხდა' });
    }
  });

  // Auth: Forgot Password
  app.post('/api/auth/forgot-password', (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'გთხოვთ მიუთითოთ ელფოსტა' });
    }
    const user = storage.getUserByEmail(email);
    // Always return clean message for privacy
    return res.json({
      success: true,
      message: 'თუ მითითებული ელფოსტა არსებობს სისტემაში, პაროლის აღდგენის ინსტრუქცია გამოგზავნილია.',
    });
  });

  // Invitations: List
  app.get('/api/invitations', authenticate, (req, res) => {
    const user = (req as any).user;
    const invitations = storage.getInvitations(user.id, user.role === 'admin');
    return res.json({ invitations });
  });

  // Invitations: Get by ID
  app.get('/api/invitations/:id', authenticate, (req, res) => {
    const user = (req as any).user;
    const inv = storage.getInvitationById(req.params.id);
    if (!inv) {
      return res.status(404).json({ error: 'მოსაწვევი ვერ მოიძებნა' });
    }
    if (user.role !== 'admin' && inv.userId !== user.id) {
      return res.status(403).json({ error: 'წვდომა შეზღუდულია' });
    }
    return res.json({ invitation: inv });
  });

  // Invitations: Create
  app.post('/api/invitations', authenticate, (req, res) => {
    try {
      const user = (req as any).user;
      const data = req.body;
      if (!data.title || !data.eventType) {
        return res.status(400).json({ error: 'მოსაწვევის სათაური და ღონისძიების ტიპი აუცილებელია' });
      }

      // Generate a unique slug
      let slug = (data.slug || data.title)
        .toLowerCase()
        .replace(/[^a-z0-9\u10D0-\u10FA]+/gi, '-')
        .replace(/^-+|-+$/g, '');
      if (!slug || slug.length < 3) {
        slug = 'invite-' + Date.now().toString(36);
      }
      // Check collision
      let finalSlug = slug;
      let counter = 1;
      while (storage.getInvitationBySlug(finalSlug)) {
        finalSlug = `${slug}-${counter++}`;
      }
      data.slug = finalSlug;

      const invitation = storage.createInvitation(user.id, data);
      return res.status(201).json({ invitation });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'მოსაწვევის შექმნა ვერ მოხერხდა' });
    }
  });

  // Invitations: Update
  app.put('/api/invitations/:id', authenticate, (req, res) => {
    try {
      const user = (req as any).user;
      const updated = storage.updateInvitation(req.params.id, user.id, req.body, user.role === 'admin');
      if (!updated) {
        return res.status(404).json({ error: 'მოსაწვევი ვერ მოიძებნა ან არ გაქვთ შეცვლის უფლება' });
      }
      return res.json({ invitation: updated });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'შენახვის შეცდომა' });
    }
  });

  // Invitations: Delete
  app.delete('/api/invitations/:id', authenticate, (req, res) => {
    const user = (req as any).user;
    const success = storage.deleteInvitation(req.params.id, user.id, user.role === 'admin');
    if (!success) {
      return res.status(404).json({ error: 'მოსაწვევი ვერ მოიძებნა ან არ გაქვთ წაშლის უფლება' });
    }
    return res.json({ success: true });
  });

  // Invitations: Publish & Create Order
  app.post('/api/invitations/:id/publish', authenticate, (req, res) => {
    try {
      const user = (req as any).user;
      const inv = storage.getInvitationById(req.params.id);
      if (!inv || (user.role !== 'admin' && inv.userId !== user.id)) {
        return res.status(404).json({ error: 'მოსაწვევი ვერ მოიძებნა' });
      }

      // Update status to published
      const updated = storage.updateInvitation(inv.id, user.id, { status: 'published' }, user.role === 'admin');

      // Create order entry if not already ordered
      const pricing = storage.getPricing();
      const catPrices = pricing[inv.eventType] || { standard: 50, premium: 100 };
      const price = inv.packageType === 'premium' ? catPrices.premium : catPrices.standard;

      const order = storage.createOrder({
        userId: user.id,
        userEmail: user.email,
        userName: `${user.firstName} ${user.lastName}`,
        invitationId: inv.id,
        invitationTitle: inv.title,
        eventType: inv.eventType,
        packageType: inv.packageType,
        price,
        currency: '₾',
        status: 'completed',
        notes: 'ონლაინ გააქტიურება და გამოქვეყნება',
      });

      return res.json({ invitation: updated, order });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'გამოქვეყნება ვერ მოხერხდა' });
    }
  });

  // Guests & RSVP Management for Host
  app.get('/api/invitations/:id/guests', authenticate, (req, res) => {
    const user = (req as any).user;
    const inv = storage.getInvitationById(req.params.id);
    if (!inv || (user.role !== 'admin' && inv.userId !== user.id)) {
      return res.status(404).json({ error: 'მოსაწვევი ვერ მოიძებნა' });
    }
    const guests = storage.getGuestsByInvitation(inv.id);
    return res.json({ guests });
  });

  app.post('/api/invitations/:id/guests', authenticate, (req, res) => {
    const user = (req as any).user;
    const inv = storage.getInvitationById(req.params.id);
    if (!inv || (user.role !== 'admin' && inv.userId !== user.id)) {
      return res.status(404).json({ error: 'მოსაწვევი ვერ მოიძებნა' });
    }
    const { firstName, lastName, personalNote } = req.body;
    if (!firstName || !lastName) {
      return res.status(400).json({ error: 'სტუმრის სახელი და გვარი აუცილებელია' });
    }
    const guest = storage.addGuest(inv.id, { firstName, lastName, personalNote });
    return res.status(201).json({ guest });
  });

  app.delete('/api/invitations/:id/guests/:guestId', authenticate, (req, res) => {
    const user = (req as any).user;
    const inv = storage.getInvitationById(req.params.id);
    if (!inv || (user.role !== 'admin' && inv.userId !== user.id)) {
      return res.status(404).json({ error: 'მოსაწვევი ვერ მოიძებნა' });
    }
    storage.deleteGuest(req.params.guestId);
    return res.json({ success: true });
  });

  // Public: View Invitation by Slug
  app.get('/api/public/invitation/:slug', (req, res) => {
    const invitation = storage.getInvitationBySlug(req.params.slug);
    if (!invitation) {
      return res.status(404).json({ error: 'მოსაწვევი ვერ მოიძებნა' });
    }
    return res.json({ invitation });
  });

  // Public: Personalized Guest Link
  app.get('/api/public/guest/:token', (req, res) => {
    const data = storage.getGuestByToken(req.params.token);
    if (!data || !data.invitation) {
      return res.status(404).json({ error: 'პერსონალური მოწვევა ვერ მოიძებნა' });
    }
    return res.json(data);
  });

  // Public: Submit RSVP
  app.post('/api/public/rsvp', (req, res) => {
    try {
      const { invitationId, guestToken, firstName, lastName, rsvpStatus, guestCount, comments, customAnswer } = req.body;
      if (!invitationId || !firstName || !lastName || !rsvpStatus) {
        return res.status(400).json({ error: 'გთხოვთ შეავსოთ სავალდებულო ველები' });
      }
      const inv = storage.getInvitationById(invitationId);
      if (!inv) {
        return res.status(404).json({ error: 'მოსაწვევი ვერ მოიძებნა' });
      }
      const guest = storage.submitRSVP({
        invitationId,
        guestToken,
        firstName,
        lastName,
        rsvpStatus,
        guestCount: Number(guestCount) || 1,
        comments,
        customAnswer,
      });
      return res.json({ success: true, guest });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'RSVP-ის გაგზავნა ვერ მოხერხდა' });
    }
  });

  // Public: Guestbook Wishes
  app.get('/api/public/wishes/:invitationId', (req, res) => {
    const wishes = storage.getWishesByInvitation(req.params.invitationId);
    return res.json({ wishes });
  });

  app.post('/api/public/wishes', (req, res) => {
    const { invitationId, guestName, message } = req.body;
    if (!invitationId || !guestName || !message) {
      return res.status(400).json({ error: 'სახელი და მილოცვის ტექსტი აუცილებელია' });
    }
    const wish = storage.addWish(invitationId, guestName, message);
    return res.status(201).json({ wish });
  });

  // Orders: List
  app.get('/api/orders', authenticate, (req, res) => {
    const user = (req as any).user;
    const orders = storage.getOrders(user.id, user.role === 'admin');
    return res.json({ orders });
  });

  // Admin: Update Order
  app.put('/api/admin/orders/:id', authenticate, requireAdmin, (req, res) => {
    const { status } = req.body;
    const order = storage.updateOrderStatus(req.params.id, status);
    if (!order) {
      return res.status(404).json({ error: 'შეკვეთა ვერ მოიძებნა' });
    }
    return res.json({ order });
  });

  // Notifications
  app.get('/api/notifications', authenticate, (req, res) => {
    const user = (req as any).user;
    const notifications = storage.getNotifications(user.id);
    return res.json({ notifications });
  });

  app.put('/api/notifications/:id/read', authenticate, (req, res) => {
    const user = (req as any).user;
    const notif = storage.markNotificationRead(req.params.id, user.id);
    return res.json({ notification: notif });
  });

  app.put('/api/notifications/read-all', authenticate, (req, res) => {
    const user = (req as any).user;
    storage.markAllNotificationsRead(user.id);
    return res.json({ success: true });
  });

  // Admin: Users List
  app.get('/api/admin/users', authenticate, requireAdmin, (_req, res) => {
    const users = storage.getAllUsers();
    return res.json({ users });
  });

  app.put('/api/admin/users/:id/role', authenticate, requireAdmin, (req, res) => {
    const { role } = req.body;
    if (role !== 'customer' && role !== 'admin') {
      return res.status(400).json({ error: 'არასწორი როლი' });
    }
    const user = storage.setUserRole(req.params.id, role);
    return res.json({ user });
  });

  // Admin: Stats
  app.get('/api/admin/stats', authenticate, requireAdmin, (_req, res) => {
    const stats = storage.getAdminStats();
    return res.json({ stats });
  });

  // Admin: Pricing
  app.get('/api/admin/pricing', (_req, res) => {
    return res.json({ pricing: storage.getPricing() });
  });

  app.put('/api/admin/pricing', authenticate, requireAdmin, (req, res) => {
    const updated = storage.updatePricing(req.body);
    return res.json({ pricing: updated });
  });

  // Image Upload API (Accepts base64 dataUrl or binary image, validates size <= 10MB)
  app.post('/api/upload', authenticate, (req, res) => {
    try {
      const { imageBase64, filename } = req.body;
      if (!imageBase64) {
        return res.status(400).json({ error: 'ფოტო ვერ მოიძებნა' });
      }

      // Validate base64 format and size
      const matches = imageBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return res.status(400).json({ error: 'არასწორი ფოტოს ფორმატი' });
      }

      const mimeType = matches[1];
      if (!mimeType.startsWith('image/')) {
        return res.status(400).json({ error: 'დასაშვებია მხოლოდ ფოტოს ატვირთვა' });
      }

      const buffer = Buffer.from(matches[2], 'base64');
      if (buffer.length > 10 * 1024 * 1024) {
        return res.status(400).json({ error: 'ფოტოს ზომა არ უნდა აღემატებოდეს 10MB-ს' });
      }

      const ext = mimeType.split('/')[1]?.replace('jpeg', 'jpg') || 'jpg';
      const cleanName = (filename || 'photo').replace(/[^a-z0-9_-]/gi, '').substring(0, 20);
      const outputName = `${cleanName}_${Date.now()}.${ext}`;
      const outputPath = path.join(UPLOADS_DIR, outputName);

      fs.writeFileSync(outputPath, buffer);

      const url = `/uploads/${outputName}`;
      return res.json({ url, success: true });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'ფოტოს ატვირთვა ვერ მოხერხდა' });
    }
  });

  // --- VITE MIDDLEWARE / STATIC ASSETS ---
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[DENI Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
