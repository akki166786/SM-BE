# Secret Messenger

A secure, real-time 1-on-1 messaging application built with modern web technologies.

## Features

- **User Authentication**: Secure registration and login with JWT tokens
- **Real-time Messaging**: Socket.io for instant message delivery
- **User Search**: Find and start conversations with other users
- **Conversation History**: Persistent message storage
- **Message Types**: Support for text, images, videos, GIFs, documents, and locations
- **Read Status**: See when messages are read
- **Typing Indicators**: Know when someone is typing
- **Responsive UI**: Works on desktop and mobile devices

## Architecture

```
├── backend/              # Node.js + Express API
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── services/     # Business logic
│   │   ├── routes/       # API endpoints
│   │   ├── middlewares/  # Auth & error handling
│   │   ├── db/          # Database setup
│   │   ├── config/      # Configuration
│   │   ├── types/       # TypeScript types
│   │   └── utils/       # Helper functions
│   └── prisma/          # ORM schema
├── frontend/             # Next.js + React
│   ├── app/             # App router pages
│   ├── components/      # Reusable components
│   ├── hooks/           # Custom React hooks
│   ├── store/           # Zustand stores
│   ├── styles/          # CSS files
│   └── .storybook/      # Component library
└── infrastructure/      # Docker & deployment
```

## Tech Stack

### Backend
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Real-time**: Socket.io
- **Auth**: JWT (jsonwebtoken)
- **Validation**: Zod
- **Password Hashing**: bcrypt

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Real-time**: Socket.io-client
- **Components**: Storybook

## Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL 12+
- Docker (optional)

## Setup

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Edit `.env` with your configuration:
```
DATABASE_URL=postgresql://user:password@localhost:5432/secret_messenger
JWT_SECRET=your_super_secret_key
```

5. Set up database:
```bash
npx prisma generate
npx prisma migrate dev
```

6. Start the server:
```bash
npm run dev
```

Server will run on `http://localhost:3001`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Edit `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

5. Start the development server:
```bash
npm run dev
```

App will be available at `http://localhost:3000`

## Running with Docker

Start PostgreSQL using Docker Compose:
```bash
cd infrastructure
docker-compose up -d
```

Database will be available at `localhost:5432` with:
- Username: `messenger_user`
- Password: `messenger_password`
- Database: `secret_messenger`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Log in
- `GET /api/auth/verify` - Verify token

### Users
- `GET /api/users/search?username=query` - Search users
- `GET /api/users/profile` - Get current user profile

### Conversations
- `POST /api/conversations` - Create new conversation
- `GET /api/conversations` - List all conversations
- `GET /api/conversations/:conversationId` - Get conversation details

### Messages
- `POST /api/messages` - Send message
- `GET /api/messages/:conversationId` - Fetch messages (paginated)
- `PUT /api/messages/:conversationId/read` - Mark as read

## WebSocket Events

### Client → Server
- `join_conversation(conversationId)` - Join conversation room
- `leave_conversation(conversationId)` - Leave conversation room
- `send_message(data, callback)` - Send message
- `typing(conversationId)` - Emit typing status
- `stop_typing(conversationId)` - Stop typing

### Server → Client
- `new_message` - Receive new message
- `user_typing` - User started typing
- `user_stop_typing` - User stopped typing

## Component Library (Storybook)

View and develop components in isolation:

```bash
cd frontend
npm run storybook
```

Available at `http://localhost:6006`

## Components

- **TextInput** - Text field with validation
- **Button** - Versatile button component
- **ChatBubble** - Message display
- **ConversationCard** - Conversation preview
- **TopBar** - Navigation header
- **MessageInputBox** - Message composition
- **FileUploader** - Drag-and-drop file upload
- **LoadingSkeleton** - Loading states

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Input validation with Zod
- Secure WebSocket connections
- Message access control

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/db
JWT_SECRET=your_secret_key
JWT_EXPIRY=7d
NODE_ENV=development
PORT=3001
AWS_ACCESS_KEY=
AWS_SECRET_KEY=
AWS_S3_BUCKET=
AWS_S3_REGION=us-east-1
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

## Development

### Running Tests (Backend)
```bash
cd backend
npm run test
```

### Type Checking
```bash
npm run typecheck
```

### Linting
```bash
npm run lint
```

## Building for Production

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm start
```

## Database Schema

### User
- id (string, primary key)
- email (string, unique)
- username (string, unique)
- passwordHash (string)
- createdAt (datetime)
- updatedAt (datetime)

### Conversation
- id (string, primary key)
- initiatorId (string, foreign key)
- participantId (string, foreign key)
- createdAt (datetime)
- updatedAt (datetime)

### Message
- id (string, primary key)
- conversationId (string, foreign key)
- senderId (string, foreign key)
- content (string)
- messageType (string: text, image, video, gif, document, location)
- mediaUrl (string, optional)
- isRead (boolean)
- createdAt (datetime)
- updatedAt (datetime)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this project for learning and development

## Support

For issues, questions, or suggestions, please open an issue on GitHub.
