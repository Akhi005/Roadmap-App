# Roadmap App

A collaborative roadmap platform where users can interact with predefined roadmap items through upvoting and threaded discussions.

## Architecture Decisions

### Frontend: React
- **Why React?** 
  - Component reusability for roadmap items and comment threads
  - Efficient state management with Context API
  - Rich ecosystem for future enhancements
  - Virtual DOM for performance with dynamic content

### Backend: Node.js/Express
- **Why this stack?**
  - JavaScript unification across stack
  - Middleware architecture perfect for auth handling
  - Fast prototyping capabilities
  - MongoDB compatibility for hierarchical data

### Database: MongoDB
- **Why MongoDB?**
  - Flexible schema for evolving roadmap items
  - Native JSON support matches React state
  - Document structure ideal for nested comments
  - Scalability for voting operations

### Authentication: JWT
- Refresh token rotation for security
- Bcrypt password hashing

## Feature Design Philosophy

### 1. Authentication System
- **Implementation:** 
  - Email/password auth with JWT
  - Protected routes using auth middleware
- **Trade-offs:** 
  - Considered OAuth but prioritized simplicity
- **Security Measures:**
  - Session expiration after 24h

### 2. Nested Comment System
- **Design Choice:** 
  - Parent-reference model with depth tracking
  - Recursive component rendering
- **Constraints:**
  - Level 3 nesting limit enforced server-side
  - Max 300 characters per comment
- **UI Approach:**
  - Visual indentation with border accents
  - Progressive disclosure of replies

### 3. Voting Mechanism
- **Implementation:**
  - Unique compound index to prevent duplicates
  - Atomic updates for vote counts
  - Optimistic UI updates
- **Trade-offs:**
  - Prioritized read performance over write consistency

### 4. Roadmap Display
- **Filtering System:**
  - Server-side filtering for performance
  - Memoized selectors for client-side sorting
- **UI Patterns:**
  - Card-based layout with status badges
  - Skeleton loading states

## Code Structure & Conventions

### Frontend Structure
src/
├── components/ # Reusable UI components
├── context/ # Global state management
├── utils/ # Helper functions
└── pages/ # Page-level components

### Backend Structure
backend/
├── Api/
│   ├── .vercel/
│   ├── node_modules/
│   ├── .env
│   ├── .gitignore
│   ├── index.js # All API routes here
│   ├── package-lock.json
│   ├── package.json
│   └── vercel.json

### Coding Standards
1. **Component Design:**
   - Atomic design principles
   - Container/presentational separation
   - Memoized React components

2. **Naming Conventions:**
   - PascalCase for components
   - camelCase for functions/variables

3. **Style Guide:**
   - ESLint (Airbnb config)
   - Prettier code formatting
   - CSS-in-JS with Tailwind utility classes

4. **API Design:**
   - RESTful endpoints
   - JSON error standardization
   - Versioned API routes (/api/v1/)

## Key Technical Challenges

### 1. Nested Comment Performance
**Challenge:** Efficiently loading and rendering deep comment hierarchies  
**Solution:**  
- Implemented recursive component rendering
- Added depth-limiting on backend

### 2. Real-time Interaction Sync
**Challenge:** Keeping UI in sync with voting/comment actions  
**Solution:**  
- Optimistic UI updates
- Context API for global state

## Trade-offs Made

1. **State Management:**
   - Chose Context API over Redux to reduce boilerplate
   - Trade-off: Potentially less scalable for huge apps

2. **Database Modeling:**
   - Denormalized vote counts for performance
   - Trade-off: Requires atomic update operations

3. **Error Handling:**
   - Frontend toast notifications
   - Trade-off: Less granular than field-level errors

## How to Run Locally

### Prerequisites
- Node.js
- MongoDB Atlas account or local instance

### Installation
```bash
# Clone repository
git clone https://github.com/akhi005/roadmap-app.git

# Install backend dependencies
cd Api
npm install

# Install frontend dependencies
cd Client
cd src
npm install

# Start both servers (in separate terminals)
cd Api && node index.js
cd Client/src && npm run dev
