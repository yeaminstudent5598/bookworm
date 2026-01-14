# 📚 BookWorm - Your Personal Cozy Library

**BookWorm** is a comprehensive digital library management system designed to provide a cozy and efficient reading experience. Built with the MERN stack and Next.js, it features role-based access, reading progress tracking, and personalized book recommendations.

---

## 🚀 Live Demo & Links
- **Live URL:** [https://bookworm-demo.vercel.app](https://bookworm-demo.vercel.app)
- **Client Repository:** [https://github.com/Yeamin-Madbor/bookworm](https://github.com/Yeamin-Madbor/bookworm)
- **Server Repository:** [https://github.com/Yeamin-Madbor/bookworm-server](https://github.com/Yeamin-Madbor/bookworm-server)

---

## 🔑 Admin Credentials (For Testing)
> **Email:** admin@bookworm.com  
> **Password:** admin123456

---

## ✨ Key Features

### 👤 User Features
- **Personalized Dashboard:** A premium dark forest green dashboard with reading stats and progress charts.
- **Reading Tracker:** Manage books through "Want to Read", "Currently Reading", and "Read" shelves.
- **Smart Recommendations:** Get book suggestions based on your reading history and favorite genres.
- **Community Feed:** Stay updated with what other readers are adding or finishing.
- **Tutorial Hub:** Access curated YouTube video guides on literature and reading tips.
- **Book Reviews:** Leave detailed reviews and ratings for books you've read.

### 🛡️ Admin Features
- **Library Management:** Full CRUD operations for books, authors, and genres.
- **Review Moderation:** Approve or delete user reviews before they go public.
- **User Management:** View all registered users and manage roles (User to Admin).
- **Advanced Analytics:** Visualized stats using Recharts (Total books, users, and pending tasks).
- **System Monitoring:** Track pending reviews and platform activity.

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 14+** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animations and transitions
- **Recharts** - Data visualizations

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Mongoose** - MongoDB object modeling

### Database & Authentication
- **MongoDB Atlas** - Cloud database
- **JWT (JSON Web Tokens)** - Secure authentication
- **Role-Based Access Control (RBAC)** - Permission management

---

## ⚙️ Environment Variables

To run this project, create a `.env.local` file in the root directory and add the following variables:

```env
# Database
MONGODB_URI=your_mongodb_atlas_connection_string

# Authentication
JWT_SECRET=your_super_secret_jwt_key

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
API_BASE_URL=http://localhost:3000/api/v1

# Environment
NEXT_PUBLIC_ENVIRONMENT=development
```

---

## 🏃 Getting Started

### Prerequisites
- Node.js v18+ and npm/yarn installed
- MongoDB Atlas account
- Git installed

### Installation Steps

**1. Clone the repository:**
```bash
git clone https://github.com/Yeamin-Madbor/bookworm.git
cd bookworm
```

**2. Install dependencies:**
```bash
npm install
# or
yarn install
```

**3. Configure environment variables:**
Create a `.env.local` file and add the variables listed in the Environment Variables section above.

**4. Run the development server:**
```bash
npm run dev
# or
yarn dev
```

**5. Open in your browser:**
Navigate to `http://localhost:3000`

---

## 📁 Project Structure

```
bookworm/
├── app/
│   ├── api/                      # API routes (/api/v1)
│   ├── (dashboard)/              # Dashboard routes (protected)
│   ├── (auth)/                   # Authentication routes (login, register)
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/
│   ├── shared/                   # Shared components
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   └── Footer.tsx
│   ├── dashboard/                # Dashboard-specific components
│   │   ├── StatsCard.tsx
│   │   ├── ReadingChart.tsx
│   │   └── BookShelf.tsx
│   └── ui/                       # Reusable UI components
│       ├── Button.tsx
│       ├── Card.tsx
│       └── Modal.tsx
├── lib/
│   ├── db.ts                     # MongoDB connection
│   ├── auth.ts                   # Authentication logic
│   ├── validations.ts            # Zod schemas
│   └── utils.ts                  # Utility functions
├── models/
│   ├── User.ts                   # User schema
│   ├── Book.ts                   # Book schema
│   ├── Review.ts                 # Review schema
│   └── Author.ts                 # Author schema
├── public/
│   ├── images/
│   └── icons/
├── styles/
│   ├── globals.css
│   └── variables.css
├── .env.local                    # Environment variables (create this)
├── .gitignore
├── next.config.js                # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
├── tailwind.config.js            # Tailwind CSS configuration
└── package.json
```

---

## 📚 API Documentation

### Authentication Endpoints

**Register User**
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Login User**
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Get Profile**
```http
GET /api/v1/auth/profile
Authorization: Bearer {jwt_token}
```

### Books Endpoints

**Get All Books**
```http
GET /api/v1/books
```

**Get Single Book**
```http
GET /api/v1/books/:id
```

**Create Book (Admin Only)**
```http
POST /api/v1/books
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "genre": "Fiction",
  "description": "A classic American novel",
  "coverImage": "https://...",
  "publicationYear": 1925,
  "pages": 180,
  "isbn": "978-0-7432-7356-5"
}
```

**Update Book (Admin Only)**
```http
PUT /api/v1/books/:id
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "title": "Updated Title",
  "genre": "Classic Fiction"
}
```

**Delete Book (Admin Only)**
```http
DELETE /api/v1/books/:id
Authorization: Bearer {admin_token}
```

### Reviews Endpoints

**Get Book Reviews**
```http
GET /api/v1/reviews/:bookId
```

**Create Review**
```http
POST /api/v1/reviews
Authorization: Bearer {token}
Content-Type: application/json

{
  "bookId": "book_id",
  "rating": 5,
  "comment": "Amazing book!",
  "readDate": "2024-01-10"
}
```

**Update Review**
```http
PUT /api/v1/reviews/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "rating": 4,
  "comment": "Great book"
}
```

**Delete Review**
```http
DELETE /api/v1/reviews/:id
Authorization: Bearer {token}
```

### Admin Endpoints

**Get Dashboard Stats**
```http
GET /api/v1/admin/dashboard
Authorization: Bearer {admin_token}
```

**Get All Users**
```http
GET /api/v1/admin/users
Authorization: Bearer {admin_token}
```

**Get Pending Reviews**
```http
GET /api/v1/admin/reviews/pending
Authorization: Bearer {admin_token}
```

**Approve Review**
```http
PUT /api/v1/admin/reviews/:id/approve
Authorization: Bearer {admin_token}
```

**Change User Role**
```http
PUT /api/v1/admin/users/:id/role
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "role": "admin"
}
```

---

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication with expiration
- **Password Hashing** - bcrypt for secure password storage
- **Role-Based Access Control (RBAC)** - Fine-grained permission management
- **Input Validation** - Zod schemas for data validation
- **CORS Protection** - Properly configured cross-origin requests
- **Rate Limiting** - Prevent API abuse
- **HTTPS Only** - Enforced in production

---

## 📦 Dependencies

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "mongoose": "^7.0.0",
    "jsonwebtoken": "^9.0.0",
    "bcryptjs": "^2.4.3",
    "tailwindcss": "^3.0.0",
    "framer-motion": "^10.0.0",
    "recharts": "^2.10.0",
    "zod": "^3.22.0",
    "axios": "^1.6.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/react": "^18.0.0",
    "@types/node": "^20.0.0",
    "tailwindcss": "^3.0.0"
  }
}
```

---

## 🎨 Design Features

- **Dark Forest Green Theme** - Eye-friendly cozy color palette
- **Responsive Design** - Optimized for mobile, tablet, and desktop
- **Smooth Animations** - Framer Motion for delightful interactions
- **Modern UI** - Clean and intuitive interface
- **Accessibility** - WCAG compliant with proper semantic HTML
- **Fast Performance** - Optimized images and lazy loading

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts and set environment variables in dashboard
```

### Environment Variables in Vercel Dashboard
- `MONGODB_URI`
- `JWT_SECRET`
- `NEXT_PUBLIC_API_URL`

### Deploy to Other Platforms

**Netlify:**
```bash
npm run build
# Deploy the .next folder
```

**Docker:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 📊 Key Features in Detail

### Reading Progress Tracking
- Visual progress bars for each book
- Percentage completion tracking
- Reading time estimates
- Reading streak counter
- Completion certificates

### Smart Recommendations
- Collaborative filtering based on user history
- Genre-based suggestions
- Popular picks in favorite categories
- Trending books this week
- Personalized suggestions based on ratings

### Community Features
- Share reading milestones
- Follow other readers
- See what friends are reading
- Participate in reading discussions
- Create and join reading clubs

### Analytics Dashboard
- Total books in library
- Total users on platform
- Average reading time
- Most popular books
- Top-rated reviews
- Pending moderation tasks

---

## 🧪 Testing

### Running Tests
```bash
npm run test
```

### Test Coverage
```bash
npm run test:coverage
```

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🔗 Links

| Link | URL |
|------|-----|
| **Live Demo** | https://bookworm-demo.vercel.app |
| **Client Repo** | https://github.com/Yeamin-Madbor/bookworm |
| **Server Repo** | https://github.com/Yeamin-Madbor/bookworm-server |
| **Issues** | https://github.com/Yeamin-Madbor/bookworm/issues |
| **Discussions** | https://github.com/Yeamin-Madbor/bookworm/discussions |

---

## 👨‍💻 Author

**Yeamin Madbor**

Full Stack Web Developer | MERN Specialist | Next.js Enthusiast

- **LinkedIn:** [linkedin.com/in/yeamin-madbor](https://linkedin.com/in/yeamin-madbor)
- **GitHub:** [@Yeamin-Madbor](https://github.com/Yeamin-Madbor)
- **Portfolio:** [yeamin-madbor.vercel.app](https://yeamin-madbor.vercel.app)
- **Email:** yeamin@example.com

---

## ❓ FAQ

**Q: Is BookWorm free?**  
A: Yes, BookWorm is completely free and open-source.

**Q: Can I use BookWorm for commercial purposes?**  
A: Yes, under the MIT License with proper attribution.

**Q: How often is BookWorm updated?**  
A: Regular updates are released monthly with new features and improvements.

**Q: How do I report bugs?**  
A: Please open an issue on our GitHub repository with detailed information.

**Q: Can I contribute to the project?**  
A: Yes! We welcome contributions. Please see the Contributing section below.

**Q: What should I do if I forget my password?**  
A: Use the "Forgot Password" link on the login page. A reset link will be sent to your email.

**Q: Is my reading data private?**  
A: Yes, your data is private and only visible to you unless you choose to share it.

---

## 🤝 Contributing

Contributions are welcome! Here's how to contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contribution Guidelines
- Follow the existing code style
- Write clear commit messages
- Update documentation as needed
- Test your changes before submitting

---

## 📞 Support

For support, questions, or feedback:
- **Email:** support@bookworm.com
- **GitHub Issues:** [Open an issue](https://github.com/Yeamin-Madbor/bookworm/issues)
- **GitHub Discussions:** [Start a discussion](https://github.com/Yeamin-Madbor/bookworm/discussions)

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Recharts](https://recharts.org/) - Charts library
- [Framer Motion](https://www.framer.com/motion/) - Animation library

---

**Made with ❤️ for book lovers everywhere**

*Last updated: January 2024 | BookWorm v1.0.0*
*Follow us on [Twitter](https://twitter.com) | [Facebook](https://facebook.com)*