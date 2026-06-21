# 🚀 CodeBuddy - Real-Time Code Collaboration Platform

A powerful real-time collaborative code editor that allows multiple developers to write, edit, and share code simultaneously in the same virtual room.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![React](https://img.shields.io/badge/React-19.2-blue)
![Socket.io](https://img.shields.io/badge/Socket.io-4.8-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [How It Works](#how-it-works)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)

## 🎯 Overview

CodeBuddy is a web-based collaborative code editor built with Next.js and Socket.IO. It enables developers to code together in real-time, making pair programming and team coding sessions seamless and efficient. Users can create or join rooms using unique room IDs and collaborate with teammates instantly.

## ✨ Features

### Current Features

- ✅ **Real-time Collaboration**: Multiple users can edit code simultaneously
- ✅ **Room-based System**: Create or join rooms using unique IDs
- ✅ **CodeMirror Integration**: Professional code editor with syntax highlighting
- ✅ **JSX/JavaScript Support**: Full support for JavaScript and JSX syntax
- ✅ **Auto-completion**: Intelligent code completion for faster coding
- ✅ **Auto-closing Brackets & Tags**: Automatic closing of brackets, quotes, and HTML/JSX tags
- ✅ **Dark Theme**: Eye-friendly One Dark theme
- ✅ **User Presence**: See who's in the room with you
- ✅ **Responsive UI**: Works seamlessly across different screen sizes
- ✅ **WebSocket Communication**: Fast and reliable real-time updates

### Editor Features

- Line numbers
- Syntax highlighting for JavaScript/JSX
- Auto-indentation
- Bracket matching
- Code folding
- Multiple cursor support
- Customizable font (Fira Code, Consolas, Monaco)

## 🛠️ Tech Stack

### Frontend
- **Next.js 16.0** - React framework with App Router
- **React 19.2** - UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS 4.0** - Utility-first CSS framework
- **CodeMirror 6** - Advanced code editor component

### Backend
- **Socket.IO 4.8** - Real-time bidirectional communication
- **Express.js** - HTTP server
- **Node.js** - Runtime environment

### Additional Libraries
- **UUID** - Unique room ID generation
- **@codemirror/lang-javascript** - JavaScript language support
- **@codemirror/lang-html** - HTML/JSX support
- **@codemirror/theme-one-dark** - Dark theme
- **@codemirror/autocomplete** - Auto-completion features

## 📁 Project Structure

```
realtime-code-collaboration/
├── app/
│   ├── api/
│   │   ├── socketExpress.js      # Express + Socket.IO server
│   │   └── socketServer.js       # Alternative socket server
│   ├── components/
│   │   ├── Editor.tsx            # Main CodeMirror editor component
│   │   └── Toast.html            # Toast notification component
│   ├── editor/
│   │   └── [roomId]/
│   │       └── page.tsx          # Editor room page (dynamic route)
│   ├── socket.js                 # Socket.IO client initialization
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page (room creation/join)
├── public/                       # Static assets
├── .env.local                    # Environment variables (create this)
├── package.json                  # Dependencies
├── next.config.ts                # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
├── tailwind.config.js            # Tailwind CSS configuration
└── README.md                     # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Shivam-Shukla96/realtime-code-collaborator.git
   cd realtime-code-collaboration
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   touch .env.local
   ```
   Add the following:
   ```env
   NEXT_PUBLIC_SERVER_URL=http://localhost:5000
   ```

4. **Start the Socket.IO server**
   ```bash
   node app/api/socketExpress.js
   ```

5. **Start the Next.js development server** (in a new terminal)
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

### Usage

1. **Create a Room**
   - Click "Create Room" on the home page
   - A unique room ID will be generated
   - Enter your username
   - Click "Join Room"

2. **Join an Existing Room**
   - Get the room ID from your teammate
   - Enter the room ID and your username
   - Click "Join Room"

3. **Start Coding**
   - Start typing in the editor
   - Your changes will be visible to all users in real-time
   - See other users in the sidebar

## 🔧 Environment Variables

Create a `.env.local` file in the root directory:

```env
# Socket.IO Server URL
NEXT_PUBLIC_SERVER_URL=http://localhost:5000
```

## 🔄 How It Works

### Architecture

```
┌─────────────┐         WebSocket         ┌─────────────────┐
│   Client 1  │◄────────────────────────►│                 │
└─────────────┘                           │  Socket.IO      │
                                          │    Server       │
┌─────────────┐         WebSocket         │   (Port 5000)   │
│   Client 2  │◄────────────────────────►│                 │
└─────────────┘                           └─────────────────┘
                                                   │
                                                   ▼
                                          ┌─────────────────┐
                                          │   Room-based    │
                                          │   Broadcasting  │
                                          └─────────────────┘
```

### Data Flow

1. **User joins a room**
   - Client emits `join` event with `roomId` and `username`
   - Server adds user to the room
   - Server broadcasts `user-joined` to other users in the room

2. **User edits code**
   - CodeMirror detects changes
   - Client emits `edit` event with updated content
   - Server broadcasts to all users in the same room
   - Other clients update their editor content

3. **User disconnects**
   - Server detects disconnect
   - Server broadcasts to room members
   - User is removed from the client list

## 🚧 Future Enhancements

### High Priority
- [ ] **Multiple Language Support** - Add Python, Java, C++, Go, Rust, etc.
- [ ] **Code Execution** - Run code directly in the browser with output display
- [ ] **File System** - Create, save, and manage multiple files/folders
- [ ] **Version Control** - Track changes, undo/redo, and change history
- [ ] **Chat Feature** - Built-in messaging for team communication
- [ ] **Video/Audio Call** - Integrated video conferencing for remote teams

### Medium Priority
- [ ] **User Authentication** - Login/signup with OAuth (Google, GitHub)
- [ ] **Persistent Storage** - Save sessions to database (MongoDB/PostgreSQL)
- [ ] **Code Sharing** - Export and share code snippets as links
- [ ] **Themes** - Multiple editor themes (Light/Dark/Monokai/Solarized)
- [ ] **Keyboard Shortcuts** - Customizable shortcuts and commands
- [ ] **Split View** - Multiple editor panes for comparing code
- [ ] **Terminal Integration** - Built-in terminal for running commands
- [ ] **Collaborative Cursor** - See other users' cursors in real-time

### Low Priority
- [ ] **AI Code Assistant** - AI-powered code suggestions and completions
- [ ] **Code Formatting** - Prettier/ESLint integration
- [ ] **Collaborative Drawing** - Whiteboard feature for diagrams
- [ ] **Screen Sharing** - Share your screen with teammates
- [ ] **Mobile App** - Native iOS and Android applications
- [ ] **Plugin System** - Extensible architecture for custom extensions
- [ ] **Analytics Dashboard** - Usage statistics and insights

### Performance & Security
- [ ] **Rate Limiting** - Prevent abuse and spam
- [ ] **Code Encryption** - End-to-end encryption for code transmission
- [ ] **Room Passwords** - Password-protected private rooms
- [ ] **Admin Controls** - Room moderation and user management
- [ ] **Performance Optimization** - Handle 100+ concurrent users per room
- [ ] **CDN Integration** - Faster static asset delivery
- [ ] **Conflict Resolution** - Better handling of simultaneous edits

## 🐛 Known Issues & Fixes

- ✅ **Fixed**: Hydration error - Implemented client-side-only rendering for CodeMirror
- ✅ **Fixed**: Socket initialization - Corrected syntax in socket.js
- ⚠️ Socket connection may need manual refresh if server restarts
- ⚠️ Large code files (>10MB) may cause performance issues

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

**Shivam Shukla**
- GitHub: [@Shivam-Shukla96](https://github.com/Shivam-Shukla96)
- Repository: [realtime-code-collaborator](https://github.com/Shivam-Shukla96/realtime-code-collaborator)

## 🙏 Acknowledgments

- CodeMirror for the amazing editor component
- Socket.IO for real-time communication capabilities
- Next.js team for the excellent React framework
- Tailwind CSS for beautiful styling utilities
- All contributors and users of this project

## 📞 Support

For support or questions:
- Open an issue in the [GitHub repository](https://github.com/Shivam-Shukla96/realtime-code-collaborator/issues)
- Star ⭐ the project if you find it useful!

---

**Built with ❤️ by Shivam**

© 2025 CodeBuddy - Real-Time Code Collaboration Platform. All rights reserved.
