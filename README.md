# 🚀 Md Abdul Mamun - Portfolio & Blog Platform

A modern, full-stack portfolio and blog platform built with Next.js 15, featuring a comprehensive content management system, authentication, and a beautiful responsive design.

## 🌟 Overview

This is a professional portfolio website and blog platform for **Md Abdul Mamun**, a passionate Software Engineer with 3+ years of experience. The platform showcases projects, technical blogs, skills, and provides a complete admin dashboard for content management.

### Live Frontent: https://portfolio-mamun.vercel.app/

### Live Backend: https://portfolio-mamun-api.vercel.app/

## ✨ Key Features

### 🎨 Frontend Features

- **Modern Portfolio Design**: Clean, responsive design with smooth animations
- **Hero Section**: Professional introduction with call-to-action buttons
- **Skills Showcase**: Interactive cards displaying technical expertise
- **Projects Gallery**: Detailed project showcases with live demos and source code links
- **Blog System**: Featured blog posts with categories and tags
- **About Me Section**: Professional background and experience
- **Contact Form**: Direct communication channel
- **Dark/Light Theme**: System-aware theme switching
- **Mobile-First Design**: Fully responsive across all devices

### 🔐 Authentication & Authorization

- **NextAuth.js Integration**: Secure authentication system
- **Role-Based Access**: USER, ADMIN, SUPER_ADMIN roles
- **Protected Routes**: Dashboard access control
- **Session Management**: Persistent user sessions

### 📊 Admin Dashboard

- **Content Management**: Create, edit, delete blogs and projects
- **User Management**: Admin user controls
- **Category Management**: Blog category organization
- **Profile Management**: User profile updates
- **Rich Text Editor**: Quill.js integration for content creation
- **File Upload**: Image and document management

### 🛠 Technical Features

- **Server Actions**: Modern Next.js server-side operations
- **API Routes**: RESTful API endpoints
- **Type Safety**: Full TypeScript implementation
- **Form Validation**: Zod schema validation with React Hook Form
- **Data Tables**: Advanced table components with sorting and pagination
- **Toast Notifications**: User feedback system
- **SEO Optimized**: Meta tags and structured data

## 🏗 Project Structure

```
portfolio/
├── public/                     # Static assets
│   ├── blog/                  # Blog images
│   ├── images/                # General images
│   ├── icons/                 # Icon assets
│   └── mamun.pdf             # Resume/CV
├── src/
│   ├── actions/              # Server actions
│   │   ├── auth.ts          # Authentication actions
│   │   ├── blogs.ts         # Blog CRUD operations
│   │   ├── categories.ts    # Category management
│   │   ├── projects.ts      # Project management
│   │   └── users.ts         # User management
│   ├── app/                 # Next.js App Router
│   │   ├── (dashboard)/     # Protected admin routes
│   │   │   ├── blogs/       # Blog management
│   │   │   ├── projects/    # Project management
│   │   │   ├── user/        # User management
│   │   │   └── profile/     # Profile management
│   │   ├── (public)/        # Public routes
│   │   │   ├── (auth)/      # Authentication pages
│   │   │   ├── about-me/    # About page
│   │   │   ├── blog/        # Blog listing and details
│   │   │   ├── contact-me/  # Contact page
│   │   │   └── project/     # Project showcase
│   │   └── api/             # API routes
│   ├── components/          # React components
│   │   ├── modules/         # Feature-specific components
│   │   │   ├── Home/        # Homepage sections
│   │   │   ├── Auth/        # Authentication forms
│   │   │   ├── Blogs/       # Blog components
│   │   │   ├── Projects/    # Project components
│   │   │   └── Dashboard/   # Admin dashboard
│   │   ├── shared/          # Reusable components
│   │   └── ui/              # shadcn/ui components
│   ├── helpers/             # Utility functions
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Library configurations
│   ├── providers/           # Context providers
│   ├── services/            # API services
│   └── types/               # TypeScript definitions
├── components.json          # shadcn/ui configuration
├── next.config.ts          # Next.js configuration
├── package.json            # Dependencies
├── tailwind.config.js      # Tailwind CSS configuration
└── tsconfig.json          # TypeScript configuration
```

## 🛠 Technology Stack

### Frontend

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui + Radix UI
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod validation
- **Rich Text**: Quill.js (react-quilljs)
- **Theme**: next-themes (Dark/Light mode)

### Backend & Database

- **API**: Next.js API Routes
- **Authentication**: NextAuth.js v4
- **Database**: External API integration
- **Validation**: Zod schemas
- **File Handling**: Next.js built-in support

### Development Tools

- **Package Manager**: npm
- **Linting**: ESLint
- **Build Tool**: Turbopack (Next.js)
- **Type Checking**: TypeScript
- **Code Formatting**: Prettier (implied)

### Deployment & Performance

- **Hosting**: Vercel-ready
- **Images**: Next.js Image Optimization
- **SEO**: Built-in Next.js SEO features
- **Performance**: Server-side rendering, static generation

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/almamun2b/portfolio.git
   cd portfolio
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:

   ```env
   NEXTAUTH_SECRET=your-nextauth-secret
   NEXTAUTH_URL=http://localhost:3000
   NEXT_PUBLIC_BASE_API=your-api-base-url
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 📱 Features Walkthrough

### Public Pages

- **Homepage** (`/`): Hero section, skills, projects, blogs, and contact
- **About Me** (`/about-me`): Detailed professional background
- **Projects** (`/project`): Portfolio showcase with filtering
- **Blog** (`/blog`): Technical articles and insights
- **Contact** (`/contact-me`): Professional contact form

### Admin Dashboard

- **Dashboard** (`/dashboard`): Overview and analytics
- **Blog Management** (`/blogs`): Create, edit, and manage blog posts
- **Project Management** (`/projects`): Portfolio project management
- **User Management** (`/user`): Admin user controls
- **Profile** (`/profile`): Personal profile management

## 🎨 Design System

The project uses a consistent design system built on:

- **Color Palette**: CSS custom properties with dark/light mode support
- **Typography**: Geist Sans and Geist Mono fonts
- **Spacing**: Tailwind CSS spacing scale
- **Components**: shadcn/ui component library
- **Animations**: Smooth transitions and hover effects

## 🔧 Configuration

### Tailwind CSS

The project uses Tailwind CSS v4 with custom configurations for:

- Custom color schemes
- Typography scales
- Animation utilities
- Responsive breakpoints

### Next.js Configuration

- **Image Optimization**: Remote pattern support for external images
- **Turbopack**: Enhanced development and build performance
- **App Router**: Modern routing with layouts and loading states

## 🧪 Development Guidelines

### Code Organization

- **Components**: Organized by feature in `modules/` and reusable in `shared/`
- **Types**: Centralized TypeScript definitions
- **Actions**: Server-side operations using Next.js Server Actions
- **Hooks**: Custom React hooks for reusable logic

### Best Practices

- **Type Safety**: Full TypeScript coverage
- **Component Composition**: Reusable and composable components
- **Performance**: Optimized images, lazy loading, and code splitting
- **Accessibility**: ARIA labels and keyboard navigation support

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main branch

### Manual Deployment

1. Build the project: `npm run build`
2. Upload the `.next` folder and other necessary files
3. Configure your hosting environment

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Md Abdul Mamun**

- Portfolio: [Your Portfolio URL]
- Email: almamun2b@gmail.com
- LinkedIn: [Your LinkedIn Profile]
- GitHub: [@almamun2b](https://github.com/almamun2b)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework for production
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful and accessible components
- [Radix UI](https://www.radix-ui.com/) - Low-level UI primitives
- [Framer Motion](https://www.framer.com/motion/) - Animation library

---

⭐ **Star this repository if you found it helpful!**
