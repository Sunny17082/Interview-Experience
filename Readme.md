# 📚 InterviewInsights

**InterviewInsights** is a MERN stack-based web platform built to help students prepare for campus placements by fostering a collaborative community where users can share interview experiences, job openings, resources, and participate in discussions.

This platform aims to bridge the gap between students and the job market by providing real, peer-shared information and AI-powered enhancements to assist in placement preparation.

---

## 📌 Features

- 🏢 **Companies Page** — Browse companies visiting campus, with roles, eligibility criteria, and packages.
- 💬 **Discussion Forum** — Open platform for students to discuss interview strategies, doubts, and placement experiences.
- 📄 **Resources Section** — Students can upload useful study materials and guides, ranked by likes.
- 📝 **Interview Experiences** — 
  - Share detailed personal interview stories.
  - **AI-generated summaries** for quick reading.
  - **AI-generated answers** for interview questions shared by users.
  - **Sentiment analysis** to track feedback positivity.
  - Posts auto-disable after 3 reports and auto-delete after 24 hours if unresolved.
- 💼 **Jobs Page** — Share job and internship openings with automatic deletion on application deadline expiry.
- 🔒 **Authentication & Authorization**
  - JWT-based login/signup.
  - Google OAuth integration.
  - Email verification & password reset.
  - Secure password handling with bcrypt.
- 🛂 **Role-Based Access Control** — Different dashboards and permissions for admins, maintainers, and users.
- 📧 **Bulk Email Notifications** — Send important announcements via Nodemailer.
- ☁️ **Image Management** — Images stored and served via Cloudinary.

---

## 🛠️ Tech Stack

- **Frontend:** React.js, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (with Mongoose)
- **Authentication:** JWT, Google OAuth, bcrypt
- **AI Services:** Google Gemini API (for summaries and answer generation)
- **Cloud Storage:** Cloudinary
- **Email Services:** Nodemailer
- **Job Scheduling:** node-cron

---

## 🚀 Getting Started

### Prerequisites

- Node.js
- MongoDB
- Cloudinary Account
- Google OAuth credentials
- Email service credentials for Nodemailer
