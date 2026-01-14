<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BookWorm README Generator</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }

        .panel {
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }

        .panel-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            font-size: 18px;
            font-weight: 600;
        }

        .panel-content {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
        }

        .code-block {
            background: #f5f5f5;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 15px;
            margin: 15px 0;
            font-family: 'Courier New', monospace;
            font-size: 13px;
            overflow-x: auto;
            position: relative;
            color: #333;
        }

        .code-block code {
            display: block;
            white-space: pre-wrap;
            word-wrap: break-word;
        }

        .copy-btn {
            position: absolute;
            top: 10px;
            right: 10px;
            background: #667eea;
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 12px;
            transition: background 0.3s;
        }

        .copy-btn:hover {
            background: #764ba2;
        }

        .copy-btn.copied {
            background: #4caf50;
        }

        textarea {
            width: 100%;
            height: 100%;
            border: none;
            padding: 0;
            font-family: 'Courier New', monospace;
            font-size: 13px;
            resize: none;
            color: #333;
        }

        h2 {
            color: #667eea;
            margin: 20px 0 10px 0;
            font-size: 16px;
        }

        h3 {
            color: #764ba2;
            margin: 15px 0 8px 0;
            font-size: 14px;
        }

        p {
            color: #666;
            margin: 8px 0;
            line-height: 1.6;
        }

        .button-group {
            display: flex;
            gap: 10px;
            margin: 20px 0;
        }

        .btn {
            flex: 1;
            padding: 10px 15px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s;
        }

        .btn-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }

        .btn-secondary {
            background: #f0f0f0;
            color: #333;
            border: 1px solid #ddd;
        }

        .btn-secondary:hover {
            background: #e0e0e0;
        }

        .info-box {
            background: #e3f2fd;
            border-left: 4px solid #667eea;
            padding: 12px;
            margin: 15px 0;
            border-radius: 4px;
            color: #1565c0;
            font-size: 13px;
        }

        .success-msg {
            display: none;
            background: #4caf50;
            color: white;
            padding: 10px;
            border-radius: 6px;
            margin-bottom: 15px;
            animation: slideIn 0.3s ease;
        }

        .success-msg.show {
            display: block;
        }

        @keyframes slideIn {
            from { transform: translateY(-20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }

        @media (max-width: 1024px) {
            .container {
                grid-template-columns: 1fr;
            }
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
            font-size: 13px;
        }

        table th, table td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: left;
        }

        table th {
            background: #f5f5f5;
            font-weight: 600;
        }

        .preview {
            line-height: 1.8;
        }

        .preview code {
            background: #f5f5f5;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Preview Panel -->
        <div class="panel">
            <div class="panel-header">📖 Preview</div>
            <div class="panel-content preview">
                <div class="success-msg" id="successMsg">✓ কপি হয়েছে!</div>
                
                <h2>📚 BookWorm - Your Personal Cozy Library</h2>
                <p><strong>BookWorm</strong> is a comprehensive digital library management system designed to provide a cozy and efficient reading experience. Built with the MERN stack and Next.js, it features role-based access, reading progress tracking, and personalized book recommendations.</p>

                <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">

                <h2>🚀 Live Demo & Links</h2>
                <p>• <strong>Live URL:</strong> <code>https://bookworm-demo.vercel.app</code></p>
                <p>• <strong>Client Repository:</strong> <code>https://github.com/Yeamin-Madbor/bookworm</code></p>
                <p>• <strong>Server Repository:</strong> <code>https://github.com/Yeamin-Madbor/bookworm-server</code></p>

                <h2>🔑 Admin Credentials (For Testing)</h2>
                <div class="info-box">
                    <strong>Email:</strong> <code>admin@bookworm.com</code><br>
                    <strong>Password:</strong> <code>admin123456</code>
                </div>

                <h2>✨ Key Features</h2>
                <h3>👤 User Features</h3>
                <p>• <strong>Personalized Dashboard:</strong> Premium dark forest green dashboard with reading stats and progress charts.</p>
                <p>• <strong>Reading Tracker:</strong> Manage books through "Want to Read", "Currently Reading", and "Read" shelves.</p>
                <p>• <strong>Smart Recommendations:</strong> Book suggestions based on reading history and favorite genres.</p>
                <p>• <strong>Community Feed:</strong> Stay updated with what other readers are adding or finishing.</p>
                <p>• <strong>Tutorial Hub:</strong> Access curated YouTube video guides on literature and reading tips.</p>

                <h3>🛡️ Admin Features</h3>
                <p>• <strong>Library Management:</strong> Full CRUD operations for books, authors, and genres.</p>
                <p>• <strong>Review Moderation:</strong> Approve or delete user reviews before they go public.</p>
                <p>• <strong>User Management:</strong> View all registered users and manage roles (User to Admin).</p>
                <p>• <strong>Advanced Analytics:</strong> Visualized stats using Recharts (Total books, users, and pending tasks).</p>

                <h2>🛠️ Tech Stack</h2>
                <p>• <strong>Frontend:</strong> Next.js 14+, TypeScript, Tailwind CSS, Framer Motion.</p>
                <p>• <strong>Backend:</strong> Node.js, Express.js, Mongoose.</p>
                <p>• <strong>Database:</strong> MongoDB Atlas.</p>
                <p>• <strong>Authentication:</strong> JWT (JSON Web Tokens) with Role-Based Access Control (RBAC).</p>
                <p>• <strong>Charts:</strong> Recharts for analytical visualization.</p>
            </div>
        </div>

        <!-- Code Panel -->
        <div class="panel">
            <div class="panel-header">💻 README.md Code</div>
            <div class="panel-content">
                <div class="button-group">
                    <button class="btn btn-primary" onclick="copyAllCode()">📋 Copy All Code</button>
                    <button class="btn btn-secondary" onclick="downloadCode()">⬇️ Download</button>
                </div>
                <textarea id="codeArea" readonly></textarea>
            </div>
        </div>
    </div>

    <script>
        const readmeContent = `# 📚 BookWorm - Your Personal Cozy Library

**BookWorm** is a comprehensive digital library management system designed to provide a cozy and efficient reading experience. Built with the MERN stack and Next.js, it features role-based access, reading progress tracking, and personalized book recommendations.

---

## 🚀 Live Demo & Links
- **Live URL:** https://bookworm-demo.vercel.app
- **Client Repository:** https://github.com/Yeamin-Madbor/bookworm
- **Server Repository:** https://github.com/Yeamin-Madbor/bookworm-server

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

### 🛡️ Admin Features
- **Library Management:** Full CRUD operations for books, authors, and genres.
- **Review Moderation:** Approve or delete user reviews before they go public.
- **User Management:** View all registered users and manage roles (User to Admin).
- **Advanced Analytics:** Visualized stats using Recharts (Total books, users, and pending tasks).

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 14+, TypeScript, Tailwind CSS, Framer Motion.
- **Backend:** Node.js, Express.js, Mongoose.
- **Database:** MongoDB Atlas.
- **Authentication:** JWT (JSON Web Tokens) with Role-Based Access Control (RBAC).
- **Charts:** Recharts for analytical visualization.
- **Styling:** Custom "Cozy Library" Theme (Dark Green Palette).

---

## ⚙️ Environment Variables
To run this project, add the following variables to your \`.env.local\` file:

\`\`\`env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
\`\`\`

---

## 🏃 Getting Started

### 1. Clone the repository:
\`\`\`bash
git clone https://github.com/Yeamin-Madbor/bookworm.git
cd bookworm
\`\`\`

### 2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

### 3. Configure environment variables:
Create a \`.env.local\` file and add the variables mentioned above.

### 4. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

### 5. Open in browser:
Go to \`http://localhost:3000\`

---

## 📁 Project Structure

\`\`\`
bookworm/
├── app/
│   ├── api/                      # API routes
│   ├── (dashboard)/              # Dashboard pages
│   ├── (auth)/                   # Auth pages
│   └── layout.tsx
├── components/
│   ├── shared/                   # Shared components
│   ├── dashboard/                # Dashboard components
│   └── ui/                       # UI components
├── lib/
│   ├── db.ts                     # Database connection
│   ├── auth.ts                   # Auth logic
│   └── validations.ts
├── models/
│   ├── User.ts
│   ├── Book.ts
│   ├── Review.ts
│   └── Author.ts
├── public/                       # Static assets
├── .env.local                    # Environment variables
└── package.json
\`\`\`

---

## 📚 API Endpoints

### Authentication
\`\`\`
POST /api/v1/auth/register
POST /api/v1/auth/login
GET /api/v1/auth/profile
POST /api/v1/auth/logout
\`\`\`

### Books
\`\`\`
GET /api/v1/books                 # Get all books
GET /api/v1/books/:id             # Get single book
POST /api/v1/books                # Create book (Admin)
PUT /api/v1/books/:id             # Update book (Admin)
DELETE /api/v1/books/:id          # Delete book (Admin)
\`\`\`

### Reviews
\`\`\`
GET /api/v1/reviews/:bookId       # Get reviews for book
POST /api/v1/reviews              # Create review
PUT /api/v1/reviews/:id           # Update review
DELETE /api/v1/reviews/:id        # Delete review
\`\`\`

### Admin
\`\`\`
GET /api/v1/admin/dashboard       # Dashboard stats
GET /api/v1/admin/users           # All users
GET /api/v1/admin/reviews         # Pending reviews
PUT /api/v1/admin/users/:id       # Update user role
\`\`\`

---

## 🔐 Security

- **JWT Authentication** - Secure token-based authentication
- **Role-Based Access Control** - Fine-grained permissions
- **Password Hashing** - bcrypt encryption
- **Input Validation** - Zod schema validation
- **CORS Protection** - Properly configured origins

---

## 🚀 Deployment

### Deploy to Vercel
\`\`\`bash
npm i -g vercel
vercel
\`\`\`

Then add environment variables in Vercel dashboard:
- MONGODB_URI
- JWT_SECRET
- NEXT_PUBLIC_API_URL

---

## 🎨 Features Highlight

✨ **Dark Forest Green Theme** - Eye-friendly cozy design
📱 **Fully Responsive** - Works on all devices
⚡ **Fast Loading** - Optimized performance
🎯 **User-Friendly** - Intuitive interface
📊 **Advanced Analytics** - Recharts visualizations
🔒 **Secure** - JWT + RBAC authentication

---

## 📝 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Yeamin Madbor**
- Full Stack Web Developer | MERN Specialist
- LinkedIn: https://linkedin.com/in/yeamin-madbor
- GitHub: https://github.com/Yeamin-Madbor
- Email: yeamin@example.com

---

## ❓ FAQ

**Q: Is BookWorm free?**  
A: Yes, completely free and open-source.

**Q: Can I use this commercially?**  
A: Yes, under MIT License with proper attribution.

**Q: How do I report bugs?**  
A: Open an issue on GitHub with detailed information.

**Q: How often is it updated?**  
A: Regular updates monthly with new features.

---

**Made with ❤️ for book lovers everywhere**`;

        document.getElementById('codeArea').value = readmeContent;

        function copyAllCode() {
            const codeArea = document.getElementById('codeArea');
            codeArea.select();
            document.execCommand('copy');
            
            const msg = document.getElementById('successMsg');
            msg.classList.add('show');
            setTimeout(() => msg.classList.remove('show'), 2000);
        }

        function downloadCode() {
            const element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(readmeContent));
            element.setAttribute('download', 'README.md');
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        }
    </script>
</body>
</html>