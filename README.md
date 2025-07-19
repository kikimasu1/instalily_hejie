# PartSelect AI Chat Agent

<div align="center">
  <img src="https://i.ibb.co/HDDX9wDq/Wechat-IMG140.png" alt="PartSelect Logo" width="120" height="120" style="border-radius: 50%;">
  
  <h3>AI-Powered Chat Interface for Appliance Parts Discovery</h3>
  
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
</div>

## 🚀 Overview

A modern chat interface built for PartSelect's appliance parts business. This application demonstrates AI-powered customer conversations with product recommendations, built using React, Express.js, and the Deepseek AI API.

### Current Features

- **🤖 AI Chat Interface** - Natural language conversations using Deepseek AI
- **📱 Responsive Design** - Mobile-optimized interface that works on all screen sizes
- **🛒 Shopping Cart** - Add products to cart directly from chat recommendations
- **⚡ Real-Time Messaging** - WebSocket communication with typing indicators
- **📊 Basic Analytics** - Simple analytics dashboard for conversation tracking
- **🎯 Product Cards** - Visual product display with mock product data
- **📎 File Upload** - Image upload capability for customer support

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript for type-safe development
- **Vite** for fast development and optimized builds
- **shadcn/ui** component library built on Radix UI primitives
- **Tailwind CSS** for responsive, utility-first styling
- **TanStack Query** for efficient data fetching and state management
- **Wouter** for lightweight client-side routing

### Backend
- **Express.js** with TypeScript for API development
- **WebSocket** integration for real-time chat functionality
- **Deepseek AI** integration for natural language processing
- **In-memory storage** for session data (chat history, cart items)
- **Static product data** for demonstration purposes

### Development & Deployment
- **Vite** for fast frontend development and building
- **Hot Module Replacement** for rapid development iteration
- **TypeScript** compilation across frontend and backend
- **Replit-ready** with npm run dev workflow

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Client  │    │  Express Server │    │   Deepseek AI   │
│                 │    │                 │    │                 │
│ • Chat Interface│◄──►│ • WebSocket API │◄──►│ • Chat Responses│
│ • Product Cards │    │ • REST Endpoints│    │ • Product Suggest│
│ • Shopping Cart │    │ • Static Data   │    │                 │
│ • Analytics     │    │ • Session Mgmt  │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       
         │                       │                       
         ▼                       ▼                       
┌─────────────────┐    ┌─────────────────┐    
│  TanStack Query │    │   In-Memory     │    
│                 │    │   Storage       │    
│ • Data Caching  │    │                 │    
│ • State Sync    │    │ • Chat History  │    
│ • API Calls     │    │ • Cart Items    │    
└─────────────────┘    └─────────────────┘    
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Git for version control
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/partselect-ai-chat.git
   cd partselect-ai-chat
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env file
   cp .env.example .env
   
   # Add your Deepseek API key
   DEEPSEEK_API_KEY=your_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5000` to see the application

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DEEPSEEK_API_KEY` | API key for Deepseek AI service | Yes |
| `NODE_ENV` | Environment (development/production) | No |

## 📱 Features in Detail

### AI Chat Interface
- **Natural Language Processing**: Uses Deepseek AI to understand customer queries
- **Conversation Flow**: Maintains chat history within session
- **Product Suggestions**: AI can recommend products based on descriptions
- **File Upload**: Supports image uploads for customer support scenarios

### Shopping Cart Features
- **Product Cards**: Visual display of recommended products with mock data
- **Add to Cart**: Users can add items to cart from chat recommendations
- **Cart Sidebar**: Responsive cart that opens on both mobile and desktop
- **Session Storage**: Cart contents persist during the session

### Responsive Interface
- **Mobile-First Design**: Touch-optimized interface for mobile devices
- **Desktop Support**: Full-featured desktop experience
- **Responsive Navigation**: Horizontally scrollable quick action buttons on mobile
- **Cross-Browser**: Works on modern web browsers

### Basic Analytics
- **Simple Dashboard**: Basic analytics page showing conversation data
- **Mock Metrics**: Demonstrates analytics concepts with sample data
- **Performance Tracking**: Basic system monitoring capabilities

## 🗂️ Project Structure

```
partselect-ai-chat/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── Chat/       # Chat interface components
│   │   │   ├── Cart/       # Shopping cart components
│   │   │   ├── Analytics/  # Analytics dashboard
│   │   │   └── ui/         # shadcn/ui components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions
│   │   ├── pages/          # Page components
│   │   └── index.css       # Global styles
│   └── index.html          # HTML entry point
├── server/                 # Express backend application
│   ├── data/               # Static data and fixtures
│   ├── services/           # Business logic services
│   ├── index.ts            # Server entry point
│   ├── routes.ts           # API route definitions
│   └── storage.ts          # Data storage interface
├── shared/                 # Shared TypeScript types
│   └── schema.ts           # Database schemas and types
├── package.json            # Project dependencies
├── vite.config.ts          # Vite configuration
├── tailwind.config.ts      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## 🧪 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Type checking
npm run type-check

# Linting and type checking
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

### Key Development Commands

```bash
# Install new dependencies
npm install package-name

# Update existing packages
npm update

# Check for outdated packages
npm outdated

# Run type checking across all projects
npx tsc --noEmit
```

### Code Quality

- **TypeScript**: Full type coverage across frontend, backend, and shared code
- **ESLint**: Configured for consistent code style and error prevention
- **Prettier**: Automatic code formatting for maintainable codebase
- **Husky**: Pre-commit hooks for quality assurance

## 🌐 API Reference

### Chat Endpoints

```typescript
// Get chat history
GET /api/chat/:sessionId
Response: { messages: Message[] }

// Send message (WebSocket)
WS /api/chat/ws
Event: { type: 'message', sessionId: string, content: string, image?: string }
```

### Cart Endpoints

```typescript
// Get cart contents
GET /api/cart/:sessionId
Response: { items: CartItem[], total: string, itemCount: number }

// Add item to cart
POST /api/cart/add
Body: { sessionId: string, productId: number, quantity: number }

// Update item quantity
PUT /api/cart/:sessionId/:productId
Body: { quantity: number }

// Remove item from cart
DELETE /api/cart/:sessionId/:productId
```

### Analytics Endpoints

```typescript
// Get system analytics
GET /api/analytics/system
Response: { totalSessions: number, averageResponseTime: number, ... }

// Get conversation insights
GET /api/analytics/insights
Response: { sessionMetrics: object, behaviorData: object }
```

## 🚀 Deployment

### Production Build

```bash
# Build the frontend
npm run build

# Start the server (development mode)
npm run dev
```

### Environment Setup

1. **Set environment variables**
   ```bash
   export DEEPSEEK_API_KEY=your_api_key
   ```

2. **Static Asset Serving**
   The Express server serves built frontend assets from the `client/dist` directory.

### Deployment Platforms

- **Replit**: Ready for Replit deployment with npm run dev
- **Vercel/Netlify**: Frontend can be deployed separately
- **Any Node.js host**: Standard Express.js application

## 🤝 Contributing

We welcome contributions from the community! Here's how to get started:

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Contribution Guidelines

- **Code Style**: Follow the existing TypeScript and React patterns
- **Testing**: Ensure all features work across different screen sizes
- **Documentation**: Update README and code comments for new features
- **Performance**: Consider impact on load times and responsiveness

### Areas for Contribution

- 🗄️ Database integration (PostgreSQL, MongoDB)
- 🔐 User authentication and session management
- 🧪 Unit and integration testing
- 🎨 UI/UX improvements and animations
- 📊 Real analytics with actual data persistence
- 🌐 Internationalization (i18n) support

## 📊 Performance Metrics

### Current Performance

- **Frontend**: Fast Vite build and hot reload
- **Chat Response**: Depends on Deepseek API response time
- **Mobile**: Responsive design works on mobile devices
- **Bundle Size**: Optimized with Vite build process

### Current Limitations

- **Storage**: In-memory only (data lost on server restart)
- **Scalability**: Single-server deployment
- **Authentication**: No user authentication system
- **Database**: No persistent database integration

## 🛡️ Security

### Data Protection

- **Input Validation**: All user inputs sanitized and validated
- **HTTPS Only**: Secure communication in production
- **Session Management**: Secure session handling with expiration
- **API Rate Limiting**: Protection against abuse and spam

### Privacy

- **Data Minimization**: Only collect necessary user information
- **Session Storage**: Chat history stored temporarily for user experience
- **No Tracking**: Respect user privacy with minimal analytics
- **GDPR Compliant**: Data handling follows privacy regulations

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

### Core Contributors

- **Lead Developer**: Full-stack development and architecture
- **UI/UX Designer**: Interface design and user experience
- **Product Manager**: Feature planning and business requirements
- **DevOps Engineer**: Deployment and infrastructure

### Acknowledgments

- **PartSelect Team**: Domain expertise and business requirements
- **Deepseek AI**: Advanced language model capabilities
- **Open Source Community**: Amazing tools and libraries that made this possible

## 📞 Support

### Getting Help

- **Documentation**: Check this README and inline code comments
- **Issues**: Report bugs and request features via GitHub Issues
- **Discussions**: Join community discussions for questions and ideas
- **Email**: Contact the team at support@partselect.com

### Reporting Issues

When reporting issues, please include:

1. **Environment**: Browser, device, operating system
2. **Steps to Reproduce**: Clear steps to trigger the issue
3. **Expected Behavior**: What should happen
4. **Actual Behavior**: What actually happens
5. **Screenshots**: Visual evidence when applicable

---

<div align="center">
  <p><strong>Built with ❤️ for the DIY community</strong></p>
  <p>Helping homeowners fix what matters most since 1999</p>
  
  [![GitHub stars](https://img.shields.io/github/stars/your-username/partselect-ai-chat?style=social)](https://github.com/your-username/partselect-ai-chat/stargazers)
  [![GitHub forks](https://img.shields.io/github/forks/your-username/partselect-ai-chat?style=social)](https://github.com/your-username/partselect-ai-chat/network/members)
</div>