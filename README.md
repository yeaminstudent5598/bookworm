# 📚 BookWorm - Personalized Book Recommendation & Reading Tracker

> A full-stack web application that helps users discover books, track reading progress, write reviews, and get personalized book recommendations to enhance their reading habits.

![Status](https://img.shields.io/badge/status-active-success)
![Live](https://img.shields.io/badge/live-deployed-blue)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)

**Live Demo:** [https://bookworm-xi-blond.vercel.app](https://bookworm-xi-blond.vercel.app)

---

## 🌟 Overview

BookWorm is a personalized book recommendation and reading tracker application designed to make discovering and tracking books engaging and intuitive. With role-based access control for both regular users and administrators, BookWorm provides a comprehensive platform for managing personal libraries, discovering new reads, and connecting with the reading community.

The application features:
- 📚 **Personal Reading Tracker** - Organize books into shelves (Want to Read, Currently Reading, Read)
- 💡 **Smart Recommendations** - AI-powered suggestions based on reading history
- ⭐ **Review & Rating System** - Community-driven reviews with moderation
- 🎓 **Learning Hub** - Curated tutorial videos for book lovers
- 👨‍💼 **Admin Dashboard** - Complete content management system
- 📊 **Reading Analytics** - Visualize reading statistics and goals

---

## 🎯 Key Features

### 👤 User Features

#### 📖 Book Discovery & Personal Library
- Browse all books with search functionality
- Filter by genre and rating range
- Sort by rating and popularity
- Add books to three shelves: "Want to Read", "Currently Reading", "Read"
- Track reading progress (pages/percentage)
- View book details with cover images

#### ⭐ Reviews & Ratings
- Write detailed reviews with 1-5 star ratings
- View approved community reviews
- Edit or delete own reviews
- Review moderation system ensures quality

#### 🎯 Personalized Recommendations
- Smart algorithm based on:
  - Most common genres from "Read" shelf
  - Average ratings given by user
  - Books with highest community-approved reviews in similar genres
- Display 12-18 recommended books on dashboard
- Fallback recommendations for new users (popular & highly-rated books)
- Tooltip explaining why each book is recommended

#### 📊 Reading Dashboard
- Personalized welcome message
- Reading statistics (books read, total pages, average rating)
- Reading challenges/goals for annual targets
- Progress visualization with circular progress bars
- Reading streak tracking
- Genre breakdown pie chart
- Monthly reading bar chart

#### 🎓 Tutorial Hub
- Access to 10-12 embedded YouTube videos
- Book recommendation and review tips
- Reading tips and strategies
- Video management by admins

#### 👥 Community Features (Bonus)
- Follow other users
- Activity feed showing:
  - Users adding books to shelves
  - 5-star ratings given
  - Books completed
- Social engagement tracking

### 🛡️ Admin Features

#### 📚 Book Management
- **Create Books**: Add title, author, genre, description, cover image upload
- **View All Books**: Table/list view with thumbnails and quick actions
- **Edit Books**: Update all book information
- **Delete Books**: With confirmation modal and data validation
- Bulk operations support

#### 📂 Genre/Category Management
- Create new genres
- View and edit existing genres
- Delete genres (with book count validation)
- Organize book categories

#### ✅ Review Moderation
- View all pending reviews
- Approve reviews to make public
- Delete inappropriate reviews
- Approve/reject in bulk
- Track review statistics

#### 👨‍💼 User Management
- View all registered users
- Promote users to Admin role
- Demote Admin back to User role
- View user activity and statistics
- Manage user accounts

#### 🎥 Tutorial Management
- Add YouTube video links
- Edit tutorial information
- Delete outdated tutorials
- Organize videos by category

#### 📊 Admin Dashboard
- Total books count
- Total users count
- Pending reviews count
- Latest activities
- User growth chart
- Genre distribution chart
- Books per month chart
- Popular books by shelf additions

---

## 🛠️ Technology Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Recharts** - Beautiful data visualizations
- **Axios** - HTTP client
- **JWT Decode** - Token management
- **Cookies-next** - Cookie handling

### Backend
- **Next.js API Routes** - Serverless backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework (implicit via Next.js)

### Database & Authentication
- **MongoDB** - NoSQL database (MongoDB Atlas)
- **Mongoose** - MongoDB object modeling
- **JWT (JSON Web Tokens)** - Stateless authentication
- **bcryptjs** - Password hashing and security
- **Redis** - Session caching and rate limiting

### File Storage
- **Cloudinary** - Cloud storage for book covers and profile photos

### Email Service
- **Nodemailer** - Email sending
- **Gmail SMTP** - Email provider

### Development Tools
- **ESLint** - Code linting
- **Tailwind CSS** - CSS framework
- **TypeScript** - Type checking

---

## 📋 Project Structure

```
bookworm/
├── src/
│   ├── modules/                    # Business logic modules
│   │   ├── auth/                   # Authentication
│   │   ├── book/                   # Book management
│   │   ├── genre/                  # Genre management
│   │   ├── review/                 # Review system
│   │   ├── user/                   # User management
│   │   ├── shelf/                  # Reading shelves
│   │   ├── library/                # User library
│   │   ├── tutorial/               # Tutorials
│   │   ├── stats/                  # Statistics
│   │   └── dashboard/              # Dashboard data
│   ├── app/                        # Next.js app directory
│   │   ├── api/v1/                 # API routes
│   │   │   ├── auth/               # Auth endpoints
│   │   │   ├── admin/              # Admin endpoints
│   │   │   ├── user/               # User endpoints
│   │   │   ├── books/              # Book endpoints
│   │   │   ├── genres/             # Genre endpoints
│   │   │   ├── reviews/            # Review endpoints
│   │   │   ├── tutorials/          # Tutorial endpoints
│   │   │   ├── shelf/              # Shelf endpoints
│   │   │   └── recommendations/    # Recommendation endpoints
│   │   ├── (auth)/                 # Auth pages
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── forgot-password/
│   │   │   └── reset-password/
│   │   ├── (user)/                 # User pages
│   │   │   ├── dashboard/
│   │   │   ├── books/
│   │   │   ├── my-library/
│   │   │   ├── tutorials/
│   │   │   └── profile/
│   │   ├── (admin)/                # Admin pages
│   │   │   ├── admin/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── books/
│   │   │   │   ├── genres/
│   │   │   │   ├── users/
│   │   │   │   ├── reviews/
│   │   │   │   ├── tutorials/
│   │   │   │   └── profile/
│   │   ├── globals.css             # Global styles
│   │   ├── layout.tsx              # Root layout
│   │   └── page.tsx                # Root page
│   ├── lib/                        # Utility functions
│   │   ├── dbConnect.ts            # Database connection
│   │   ├── jwt.ts                  # JWT utilities
│   │   ├── cloudinary.ts           # Cloudinary integration
│   │   ├── sendEmail.ts            # Email sending
│   │   ├── axios.ts                # Axios instance
│   │   └── redis.ts                # Redis client
│   ├── middleware/
│   │   └── authMiddleware.ts       # Authentication middleware
│   ├── components/                 # Reusable React components
│   │   ├── shared/                 # Shared components
│   │   └── books/                  # Book components
│   ├── constants/
│   │   └── navLinks.ts
│   └── middleware.ts               # Next.js middleware
├── public/                         # Static assets
├── .env.local                      # Environment variables
├── next.config.ts                  # Next.js configuration
├── tsconfig.json                   # TypeScript configuration
├── tailwind.config.js              # Tailwind CSS configuration
└── package.json
```

---

## ⚙️ Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bookworm

# JWT
JWT_SECRET=your_jwt_secret_key_min_32_characters
JWT_ACCESS_SECRET=access_secret
JWT_ACCESS_EXPIRES=1d
JWT_REFRESH_SECRET=refresh_secret
JWT_REFRESH_EXPIRES=7d

# Node Environment
NODE_ENV=development

# Cloudinary (Image Upload)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# API URL
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_JWT_SECRET=your_jwt_secret_key

# Email Service (SMTP Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=your_email@gmail.com

# Redis Cache
REDIS_HOST=your_redis_host
REDIS_PORT=your_redis_port
REDIS_USERNAME=default
REDIS_PASSWORD=your_redis_password
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- npm or yarn
- MongoDB Atlas account
- Cloudinary account
- Gmail account with app password
- Redis account

### Installation & Setup

**1. Clone the repository**
```bash
git clone https://github.com/yeaminstudent5598/bookworm
cd bookworm
```

**2. Install dependencies**
```bash
npm install
```

**3. Configure environment variables**
Create a `.env.local` file in the root directory and add all required variables (see Environment Variables section).

**4. Run the development server**
```bash
npm run dev
```

**5. Open in your browser**
Navigate to `http://localhost:3000`

---

## 🔐 Authentication & Access Control

### Authentication System

**Registration Process:**
- Users provide: Name, Email, Photo, Password
- Photo is uploaded to Cloudinary
- Password is hashed using bcryptjs
- Email uniqueness is validated
- Strong password validation is enforced

**Login Process:**
- Users login with Email and Password
- JWT tokens are issued on successful authentication
- Tokens include user role and permissions
- Refresh token mechanism for session management

### Route Protection & RBAC

**Public Routes:**
- `/api/v1/auth/register` - User registration
- `/api/v1/auth/login` - User login
- `/api/v1/auth/forgot-password` - Password recovery
- `/api/v1/auth/reset-password` - Password reset

**Protected Routes:**
- All user and admin routes require JWT authentication
- Role-based access control enforced

**Default Route Behavior:**
- `No public homepage` - Unauthenticated users redirected to login
- `Normal User` - Default route redirects to `/user/dashboard`
- `Admin User` - Default route redirects to `/admin/admin/dashboard`

**User Roles:**
- **User** - Standard user with limited permissions
- **Admin** - Full system access with management capabilities

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
  "password": "SecurePassword123!",
  "photo": "file_upload"
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

Response:
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { id, name, email, role },
    "token": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

**Forgot Password**
```http
POST /api/v1/auth/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}
```

**Reset Password**
```http
POST /api/v1/auth/reset-password
Content-Type: application/json

{
  "token": "reset_token",
  "password": "NewPassword123!"
}
```

**Change Password**
```http
POST /api/v1/auth/change-password
Authorization: Bearer {token}
Content-Type: application/json

{
  "oldPassword": "OldPassword123!",
  "newPassword": "NewPassword123!"
}
```

### Book Endpoints

**Get All Books**
```http
GET /api/v1/books?page=1&limit=12&genre=fiction&sortBy=rating&search=harry
```

**Get Single Book**
```http
GET /api/v1/books/:id
```

**Create Book (Admin Only)**
```http
POST /api/v1/admin/books
Authorization: Bearer {admin_token}
Content-Type: multipart/form-data

{
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "genre": "genre_id",
  "description": "Classic American novel",
  "coverImage": "file_upload",
  "publicationYear": 1925,
  "pages": 180,
  "isbn": "978-0-7432-7356-5"
}
```

**Update Book (Admin Only)**
```http
PUT /api/v1/admin/books/:id
Authorization: Bearer {admin_token}
Content-Type: multipart/form-data

{
  "title": "Updated Title",
  "genre": "genre_id"
}
```

**Delete Book (Admin Only)**
```http
DELETE /api/v1/admin/books/:id
Authorization: Bearer {admin_token}
```

### Genre Endpoints

**Get All Genres**
```http
GET /api/v1/genres
```

**Create Genre (Admin Only)**
```http
POST /api/v1/admin/genres
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "name": "Science Fiction",
  "description": "Future and technology stories"
}
```

**Update Genre (Admin Only)**
```http
PUT /api/v1/admin/genres/:id
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "name": "Updated Name",
  "description": "Updated description"
}
```

**Delete Genre (Admin Only)**
```http
DELETE /api/v1/admin/genres/:id
Authorization: Bearer {admin_token}
```

### Shelf & Library Endpoints

**Add Book to Shelf**
```http
POST /api/v1/shelf
Authorization: Bearer {token}
Content-Type: application/json

{
  "bookId": "book_id",
  "shelfType": "wantToRead|currentlyReading|read",
  "pagesRead": 100,
  "totalPages": 300
}
```

**Get My Library**
```http
GET /api/v1/user/library
Authorization: Bearer {token}
```

**Update Reading Progress**
```http
PUT /api/v1/shelf/:shelfId
Authorization: Bearer {token}
Content-Type: application/json

{
  "pagesRead": 150
}
```

### Review Endpoints

**Get Book Reviews**
```http
GET /api/v1/reviews?bookId=book_id&status=approved
```

**Create Review**
```http
POST /api/v1/reviews
Authorization: Bearer {token}
Content-Type: application/json

{
  "bookId": "book_id",
  "rating": 5,
  "comment": "Amazing book! Highly recommended.",
  "readDate": "2026-01-10"
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

### Admin Review Moderation

**Get Pending Reviews**
```http
GET /api/v1/admin/reviews?status=pending
Authorization: Bearer {admin_token}
```

**Approve Review**
```http
PUT /api/v1/admin/reviews/:id
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "status": "approved"
}
```

**Delete Review**
```http
DELETE /api/v1/admin/reviews/:id
Authorization: Bearer {admin_token}
```

### Recommendation Endpoints

**Get Personalized Recommendations**
```http
GET /api/v1/recommendations
Authorization: Bearer {token}
```

### Tutorial Endpoints

**Get All Tutorials**
```http
GET /api/v1/tutorials
```

**Create Tutorial (Admin Only)**
```http
POST /api/v1/admin/tutorials
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "title": "How to Choose Your Next Book",
  "youtubeLink": "https://youtube.com/watch?v=...",
  "description": "Tips for selecting books"
}
```

**Update Tutorial (Admin Only)**
```http
PUT /api/v1/admin/tutorials/:id
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "title": "Updated Title"
}
```

**Delete Tutorial (Admin Only)**
```http
DELETE /api/v1/admin/tutorials/:id
Authorization: Bearer {admin_token}
```

### User Management (Admin Only)

**Get All Users**
```http
GET /api/v1/admin/users?page=1&limit=10
Authorization: Bearer {admin_token}
```

**Get User Details**
```http
GET /api/v1/admin/users/:id
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

### Dashboard & Stats

**Get User Dashboard Stats**
```http
GET /api/v1/user/dashboard-stats
Authorization: Bearer {token}
```

**Get Admin Dashboard Stats**
```http
GET /api/v1/admin/stats
Authorization: Bearer {admin_token}
```

**Get User Growth Chart**
```http
GET /api/v1/admin/user-growth
Authorization: Bearer {admin_token}
```

---

## 🔑 Test Credentials

### Admin Account
```
Email: admin@bookworm.com
Password: admin123456
```

### Sample User Account
```
Email: pixelandcode07@gmail.com
Password: user123456
```

---

## 🎨 Design & UI/UX

### Features
- **Responsive Design** - Optimized for mobile, tablet, and desktop
- **Dark Forest Green Theme** - Cozy library aesthetic with warm colors
- **Smooth Animations** - Framer Motion for transitions
- **Accessibility** - WCAG compliant with semantic HTML
- **Loading States** - Skeleton loaders and spinners
- **Error Handling** - Clear error messages and user feedback
- **Image Optimization** - Next.js Image component for book covers

### Pages & Components
- Beautiful book cards with lazy loading
- Responsive navigation and sidebar
- Modal dialogs for confirmations
- Toast notifications for actions
- Form validation with helpful messages
- Charts and visualizations for analytics

---

## 📊 Advanced Features Implemented

### Reading Tracker & Goals
- Annual reading goals with progress tracking
- Circular progress bars for goal completion
- Books read this year counter
- Total pages read statistics
- Average rating given to books
- Genre breakdown with pie chart
- Reading streak tracking
- Monthly reading bar chart
- Reading timeline visualization

### Recommendation Algorithm
- Multiple factor analysis:
  - Most read genres
  - User rating patterns
  - Community-approved reviews
  - Similar user preferences
- 12-18 books displayed on dashboard
- Smart fallback for new users
- "Why this book?" tooltip explanations

### Community Features
- Follow/unfollow users
- Activity feed with notifications
- User following list
- Reading milestones sharing
- Community engagement metrics

### Admin Analytics
- Total books and users count
- Pending reviews count
- User growth trends
- Genre distribution
- Books added per month
- Popular books by shelf additions
- Review approval rates

---

## 🔒 Security Implementation

- **JWT Authentication** - Secure token-based authentication
- **Password Security** - bcryptjs hashing with salt rounds
- **CORS Protection** - Configured for production domains
- **Input Validation** - Zod schema validation on all inputs
- **Rate Limiting** - Redis-based request throttling
- **Email Verification** - Optional Forgot Password
- **Password Reset** - Secure token-based password recovery
- **Role-Based Access** - Granular permission checking
- **HTTPS Ready** - Optimized for secure deployment

---

## 🚀 Deployment

### Deploy to Vercel

**1. Connect GitHub Repository**
```bash
# Push code to GitHub
git add .
git commit -m "Initial commit"
git push origin main
```

**2. Import to Vercel**
- Go to https://vercel.com
- Click "Add New" → "Project"
- Select your GitHub repository
- Configure project settings

**3. Set Environment Variables**
In Vercel dashboard → Settings → Environment Variables, add:
- MONGODB_URI
- JWT_SECRET
- CLOUDINARY_CLOUD_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET
- NEXT_PUBLIC_API_URL
- SMTP_HOST
- SMTP_PORT
- SMTP_USER
- SMTP_PASS
- SMTP_FROM
- REDIS_HOST
- REDIS_PORT
- REDIS_USERNAME
- REDIS_PASSWORD

**4. Deploy**
- Vercel automatically deploys on push
- Check deployment status in Vercel dashboard

### Environment Setup for Production
```env
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://your-domain.vercel.app
JWT_ACCESS_EXPIRES=1d
JWT_REFRESH_EXPIRES=7d
```

---

## 📈 Performance Optimizations

- **Next.js Image Optimization** - Automatic image resizing and optimization
- **Server-Side Rendering (SSR)** - For book lists and details
- **Static Generation (SSG)** - For genres and popular books
- **Incremental Static Regeneration (ISR)** - Auto-update static pages
- **Code Splitting** - Automatic route-based splitting
- **Lazy Loading** - Images and components load on demand
- **Redis Caching** - Cache frequently accessed data
- **API Response Caching** - Reduce database queries
- **CDN Delivery** - Vercel's global CDN for fast delivery

---

## 📋 API Response Format

All API responses follow a consistent format:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { },
  "statusCode": 200
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error message",
  "error": "Error details",
  "statusCode": 400
}
```

---

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration with valid/invalid data
- [ ] User login and logout
- [ ] Add book to shelf
- [ ] Update reading progress
- [ ] Write and edit review
- [ ] Admin book CRUD operations
- [ ] Admin genre management
- [ ] Review moderation
- [ ] Recommendation algorithm
- [ ] Search and filter functionality
- [ ] Mobile responsiveness
- [ ] Error handling
- [ ] Loading states

---

## 🐛 Error Handling

### Common Errors & Solutions

**MongoDB Connection Error**
- Verify MONGODB_URI in .env.local
- Check MongoDB Atlas IP whitelist

**JWT Token Error**
- Clear browser cookies
- Re-login to get new token
- Check JWT_SECRET in .env.local

**Cloudinary Upload Error**
- Verify Cloudinary credentials
- Check file size (max 10MB)
- Ensure file is image format

**Email Not Sending**
- Verify Gmail credentials
- Enable "Less secure app access"
- Use Gmail App Password

**Redis Connection Error**
- Verify Redis credentials
- Check Redis host and port
- Ensure Redis database is running

---

## 📝 Git Commits

Project contains 12+ meaningful commits on both client and server repositories:

Example commits:
```
1. Initial project setup with Next.js and TypeScript
2. Configure MongoDB and Mongoose schemas
3. Implement authentication system with JWT
4. Create book management CRUD operations
5. Add review and rating system
6. Implement genre management
7. Build personalized recommendation algorithm
8. Create admin dashboard with analytics
9. Add reading tracker and shelf system
10. Implement tutorial management
11. Add user management features
12. Deploy to Vercel and configure production
```

---

## 📱 Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari 12+
- Edge (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

---



---

## 🙏 Acknowledgments

- Programming Hero for the opportunity
- Next.js and React communities
- MongoDB documentation
- Vercel hosting platform
- All open-source libraries used

---

## 👨‍💻 Author

**Yeamin Madbor**
- Full Stack Web Developer
- MERN & Next.js 
- GitHub: [@Yeamin-Madbor](https://github.com/yeaminstudent5598)
- LinkedIn: [linkedin.com/in/yeamin-madbor](https://www.linkedin.com/in/yeamin-madbor-83b3302b8/)

---

**Made with ❤️ for book lovers | Programming Hero Job Task**

*Last Updated: January 2026 | BookWorm v1.0.0*