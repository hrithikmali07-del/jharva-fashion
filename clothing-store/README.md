# clothing-store

A premium, minimal fashion ecommerce website built with **Node.js + Express + MongoDB + EJS + Tailwind CSS**.

## Features

- Home page with featured products
- Shop page with all products
- Product details page
- Session-based cart (add/update/remove)
- Checkout with **Cash on Delivery only**
- Orders persisted in MongoDB
- Admin panel with login:
  - Add / Edit / Delete products
  - View orders
  - Mark orders as Shipped
- Security basics:
  - Helmet headers
  - CSRF protection
  - Rate limiting on admin login
  - Input validation and sanitization
  - Mongo query sanitization
- Production-ready structure with environment variables

## Project Structure

```bash
clothing-store/
├── app.js
├── server.js
├── config/
│   └── db.js
├── middleware/
├── models/
├── routes/
├── scripts/
├── utils/
├── public/
│   ├── css/
│   └── images/
├── views/
│   ├── admin/
│   ├── cart/
│   ├── checkout/
│   ├── errors/
│   ├── partials/
│   └── store/
└── .env.example
```

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy environment template:
   ```bash
   cp .env.example .env
   ```
3. Update `.env` values (`MONGODB_URI`, `SESSION_SECRET`, admin credentials).
4. Seed sample products:
   ```bash
   npm run seed
   ```
5. Start app:
   ```bash
   npm run dev
   ```
6. Open `http://localhost:3000`.

## Admin Credentials

Set these in `.env`:

- `ADMIN_EMAIL`
- `ADMIN_PASSWORD_HASH`

Generate a hash:

```bash
node -e "console.log(require('bcryptjs').hashSync('YourStrongPassword123!', 10))"
```

## Main Routes

- `/` - Home
- `/shop` - Shop listing
- `/product/:slug` - Product detail
- `/cart` - Cart
- `/checkout` - Checkout (COD only)
- `/admin/login` - Admin login
- `/admin/dashboard` - Admin dashboard

## Deployment (Render)

1. Push project to GitHub.
2. In Render, create **Web Service** from repo.
3. Configure:
   - Build command: `npm install`
   - Start command: `npm start`
4. Add environment variables from `.env.example`.
5. Use MongoDB Atlas URI for `MONGODB_URI`.
6. Deploy.

### Connect Custom Domain on Render

1. Open Render service → **Settings** → **Custom Domains**.
2. Add your domain (e.g. `shop.yourdomain.com`).
3. In your DNS provider, add the CNAME/A records shown by Render.
4. Wait for DNS propagation and SSL issuance.

## Deployment (Railway)

1. Create a new project from GitHub repo in Railway.
2. Add MongoDB plugin (or use Atlas) and set `MONGODB_URI`.
3. Set environment variables from `.env.example`.
4. Railway auto-detects Node app and runs `npm start`.

### Connect Custom Domain on Railway

1. Open service → **Settings** → **Domains**.
2. Add domain/subdomain.
3. Add DNS records required by Railway (usually CNAME for subdomain).
4. Confirm verification and HTTPS.

## Production Notes

- Set `NODE_ENV=production`.
- Use strong random `SESSION_SECRET`.
- Keep admin password hash secure and rotate periodically.
- For media uploads, add a cloud storage service (Cloudinary/S3) later.

## License

MIT
