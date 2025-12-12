# Quick Start Guide

Get the Secret Messenger application running in 5 minutes.

## Option 1: Local Development (Recommended)

### Prerequisites
- Node.js 18+ installed
- PostgreSQL 12+ installed and running

### Step 1: Database Setup

Create a PostgreSQL database:
```bash
createdb secret_messenger
```

Or use Docker:
```bash
cd infrastructure
docker-compose up -d
```

### Step 2: Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env and update DATABASE_URL if needed

# Set up database schema
npx prisma generate
npx prisma migrate dev

# Start server
npm run dev
```

Server runs on `http://localhost:3001`

### Step 3: Frontend Setup

In a new terminal:
```bash
cd frontend

# Install dependencies
npm install

# Set up environment
cp .env.example .env.local

# Start dev server
npm run dev
```

App runs on `http://localhost:3000`

## Testing the Application

1. **Register**: Go to http://localhost:3000/register
   - Create an account with email, username, and password

2. **Create Another Account**: Open an incognito window and register again

3. **Search Users**: Click "Search Users" and find the other account

4. **Chat**: Click "Chat" to start messaging

5. **Real-time Features**:
   - Messages appear instantly
   - See typing indicators
   - View read status

## Component Development

View UI components in Storybook:
```bash
cd frontend
npm run storybook
```

Opens at `http://localhost:6006`

## Common Issues

### Database Connection Error
- Ensure PostgreSQL is running
- Check DATABASE_URL in backend/.env
- For Docker: `docker-compose up -d`

### Port Already in Use
- Backend: Change PORT in backend/.env
- Frontend: `npm run dev -- -p 3001`

### CORS Errors
- Ensure FRONTEND_URL in backend/.env matches your frontend URL
- Default: http://localhost:3000

## Production Deployment

### Build Backend
```bash
cd backend
npm run build
npm start
```

### Build Frontend
```bash
cd frontend
npm run build
npm start
```

## Environment Variables Checklist

**Backend (.env)**
- [ ] DATABASE_URL set to your PostgreSQL
- [ ] JWT_SECRET changed from default
- [ ] FRONTEND_URL matches your frontend domain

**Frontend (.env.local)**
- [ ] NEXT_PUBLIC_API_URL points to backend
- [ ] NEXT_PUBLIC_SOCKET_URL points to backend

## Useful Commands

### Backend
```bash
npm run dev              # Start dev server
npm run build            # Build for production
npm run lint             # Run linter
npm run typecheck        # Check TypeScript
npx prisma studio       # View database GUI
npx prisma migrate dev  # Create migrations
```

### Frontend
```bash
npm run dev              # Start dev server
npm run build            # Build for production
npm run lint             # Run linter
npm run typecheck        # Check TypeScript
npm run storybook        # Start component library
npm run build-storybook  # Build Storybook
```

## Next Steps

1. **Customize**: Modify colors in `frontend/tailwind.config.js`
2. **Add Features**: Check the components in `frontend/components/`
3. **Deploy**: Use Vercel for frontend, Railway/Heroku for backend
4. **Database**: Connect to AWS RDS PostgreSQL for production

## Getting Help

- Check backend logs: `npm run dev` in backend folder
- Check frontend logs: `npm run dev` in frontend folder
- View Storybook stories: `npm run storybook` in frontend folder
- Review API endpoints in main README.md

## Key Files to Know

- **Backend API routes**: `backend/src/routes/`
- **Database schema**: `backend/prisma/schema.prisma`
- **Frontend components**: `frontend/components/`
- **Frontend pages**: `frontend/app/`
- **State management**: `frontend/store/`

Enjoy building! 🚀
