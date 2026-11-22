# ReTech – Refurbished Electronics E-Commerce Platform

ReTech is a full-stack e-commerce web application designed for selling refurbished electronic products such as smartphones, laptops, audio devices, and wearables.

The platform provides customers with a shopping experience and administrators with tools to manage orders, inventory, and device health reports.

**Live Website:** https://retech-ecommerce.netlify.app/

**GitHub Repository:** https://github.com/sanjay13022006/retech

---

## Features

### Customer Features
- Browse refurbished electronic products.
- Search and filter products by category.
- View product details and specifications.
- Compare multiple products.
- Add products to the shopping cart.
- Place orders through the checkout system.
- Track orders using order reference and phone number.
- Receive order confirmation and status notification emails.
- View device health reports, including battery health and overall condition.
- Check product stock availability.

### Admin Features
- Secure administrator authentication.
- Support for multiple authorized administrators.
- Admin dashboard for managing orders.
- View customer and order information.
- Update order statuses.
- Send automatic customer email notifications when order statuses change.
- Manage product inventory and stock quantities.
- Monitor low-stock and out-of-stock products.
- Create and publish device health reports.

---

## Technology Stack

| Technology | Purpose |
|---|---|
| React | Frontend development |
| Vite | Development server and build tool |
| Tailwind CSS | Styling and responsive design |
| JavaScript | Application logic |
| React Router | Page navigation |
| Lucide React | Icons |
| Supabase | Authentication, database and backend services |
| PostgreSQL | Database |
| Supabase Edge Functions | Server-side email notifications |
| Resend | Email delivery |
| Netlify | Website hosting |
| GitHub | Version control and source code hosting |

---

## Project Structure

```text
retech/
│
├── public/
│   └── _redirects
│
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   └── Products.jsx
│   │
│   ├── context/
│   │   ├── CartContext.jsx
│   │   └── CompareContext.jsx
│   │
│   ├── lib/
│   │   └── supabase.js
│   │
│   ├── pages/
│   │   ├── Admin.jsx
│   │   ├── AdminLogin.jsx
│   │   ├── AdminInventory.jsx
│   │   ├── AdminHealthReports.jsx
│   │   ├── Checkout.jsx
│   │   ├── Cart.jsx
│   │   ├── ProductDetails.jsx
│   │   ├── ProductComparison.jsx
│   │   └── TrackOrder.jsx
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
└── vite.config.js
```

*The structure above is illustrative. Check your actual project files before adding or renaming folders.*

---

## Installation and Setup

### Prerequisites

Install the following:

- Node.js and npm
- Git
- A Supabase account

### 1. Clone the repository

```bash
git clone https://github.com/sanjay13022006/retech.git
```

### 2. Navigate into the project

```bash
cd retech
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file in the project root.

Copy the structure from `.env.example`:

```env
VITE_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
```

Replace the placeholders with your own Supabase project details.

### 5. Start the development server

```bash
npm run dev
```

Open the local URL displayed in your terminal, usually:

```text
http://localhost:5173
```

---

## Supabase Configuration

ReTech uses Supabase for its backend functionality.

To run your own instance, configure:

1. A Supabase project.
2. Supabase Authentication for administrator accounts.
3. The required PostgreSQL tables:
   - `orders`
   - `order_items`
   - `inventory`
   - `device_health_reports`
4. Row Level Security (RLS) policies.
5. The `track_order` database function.
6. The `place_order_with_inventory` database function.
7. The required Edge Functions for email notifications.

You must configure the database schema, policies, functions, and administrator permissions in your own Supabase project. The frontend alone does not create these resources.

---

## Email Notifications

ReTech uses Resend with Supabase Edge Functions to send:

- Order confirmation emails.
- Order status update emails.

Configure the required secrets in your Supabase project:

```text
RESEND_API_KEY
```

The sender email address must be authorized by Resend. A verified sending domain is recommended for production use.

---

## Deployment

The frontend is deployed using Netlify.

To deploy your own version:

1. Push the project to GitHub.
2. Import the repository into Netlify.
3. Set the build command to:

```bash
npm run build
```

4. Set the publish directory to:

```text
dist
```

5. Add the required Supabase environment variables.
6. Deploy the application.

For React Router support, configure the Netlify redirect:

```text
/*    /index.html   200
```

---

## Security Notes

- Never commit your `.env` file.
- Never expose your Supabase service-role key in frontend code.
- Keep Resend API keys in Supabase Edge Function secrets.
- Enable Row Level Security on database tables.
- Restrict administrator access using authenticated user IDs.
- Configure your own administrator accounts and database policies.

The Supabase publishable key is intended for frontend use when appropriate RLS policies are configured.

---

## Future Improvements

Potential improvements include:

- Payment gateway integration.
- Database-backed product management.
- Customer authentication and accounts.
- Wishlist persistence.
- Advanced analytics and sales reports.
- Improved inventory tracking for individual refurbished devices.

---

## License

This project is currently shared as source code. No explicit open-source license has been specified yet.

If you want others to reuse, modify, or distribute the project, consider adding an appropriate license.

---

**Developed as ReTech – Giving Technology a Second Life.**