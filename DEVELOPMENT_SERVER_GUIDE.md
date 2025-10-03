# 🚀 MySharpJobs Development Server Guide

## Quick Start Commands

You now have **multiple ways** to start both the frontend and backend simultaneously!

---

## ✅ Method 1: PowerShell Script (Recommended for Windows)

```powershell
.\start-dev.ps1
```

**What it does:**
- ✅ Starts Laravel backend on `http://localhost:8000`
- ✅ Starts Reverb WebSocket server on `ws://localhost:6001`
- ✅ Starts React frontend on `http://localhost:5173`
- ✅ Starts queue worker for background jobs
- ✅ Starts pail for real-time logs (with composer dev)

---

## ✅ Method 2: Batch File (Windows CMD)

```cmd
start-dev.bat
```

Same functionality as the PowerShell script, works in Windows Command Prompt.

---

## ✅ Method 3: Composer Command (From backend directory)

```bash
cd backend
composer dev
```

**What it runs:**
- Laravel backend server
- Reverb WebSocket server
- React frontend (from parent directory)
- Queue listener
- Pail logs viewer

All services run in parallel with color-coded output!

---

## ✅ Method 4: Custom Artisan Command (From backend directory)

```bash
cd backend
php artisan serve:all
```

**Options:**
```bash
# Custom host and ports
php artisan serve:all --host=0.0.0.0 --port=9000 --reverb-port=6002 --frontend-port=3000

# Get help
php artisan serve:all --help
```

---

## 🎯 Service URLs

Once started, access these URLs:

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:5173 | React development server with HMR |
| **Backend API** | http://localhost:8000 | Laravel API endpoints |
| **WebSocket** | ws://localhost:6001 | Laravel Reverb real-time server |
| **Queue Worker** | (background) | Processes async jobs |
| **Logs** | (terminal) | Real-time application logs |

---

## 📝 What Each Service Does

### 🔷 Laravel Backend (Port 8000)
- REST API endpoints for all application features
- Authentication via Laravel Sanctum
- Database operations
- File uploads and storage
- Broadcasting events

### 🔷 Reverb WebSocket Server (Port 6001)
- Real-time notifications
- Live chat/messaging
- Job status updates
- Live notifications for artisans and clients

### 🔷 React Frontend (Port 5173)
- User interface with hot module replacement (HMR)
- Real-time UI updates via WebSocket
- Responsive design with Tailwind CSS
- Interactive maps for location tracking

### 🔷 Queue Worker
- Processes background jobs
- Sends emails asynchronously
- Handles scheduled tasks
- Manages intensive operations

---

## 🛠️ Manual Individual Server Commands

If you need to start servers individually:

### Backend Only
```bash
cd backend
php artisan serve
# Runs on http://localhost:8000
```

### Reverb WebSocket Only
```bash
cd backend
php artisan reverb:start
# Runs on ws://localhost:6001
```

### Frontend Only
```bash
npm run dev
# Runs on http://localhost:5173
```

### Queue Worker Only
```bash
cd backend
php artisan queue:listen
```

---

## 🎨 Color-Coded Output

When using `composer dev` or `php artisan serve:all`, the terminal output is color-coded:

- **🔵 Blue**: Backend server logs
- **🟣 Purple**: Reverb WebSocket logs
- **🟢 Green**: Frontend (React) logs
- **🔴 Pink**: Queue worker logs
- **🟠 Orange**: Application logs (pail)

---

## 🔄 Stopping All Servers

Press **Ctrl+C** in the terminal to stop all services. The `--kill-others-on-fail` flag ensures all services stop together.

---

## 📦 Requirements

Ensure you have installed:

1. **PHP 8.2+** with required extensions
2. **Composer** (PHP dependency manager)
3. **Node.js 18+** and **npm** (for frontend)
4. **MySQL/PostgreSQL** (database)
5. **concurrently** package (auto-installed if missing)

---

## 🧪 Testing the Setup

After starting the servers:

1. **Test Backend**: Visit http://localhost:8000/api/health
2. **Test Frontend**: Visit http://localhost:5173
3. **Test WebSocket**: Open browser console and check for "✅ Laravel Echo initialized"

---

## 🔐 Login Credentials (Seeded Users)

Test the application with these accounts:

### Admin User
- **Email**: admin@mysharpjobs.ng
- **Password**: Admin@123
- **Access**: Full CRUD rights & admin dashboard

### Artisan User
- **Email**: artisan@mysharpjobs.ng
- **Password**: Artisan@123
- **Role**: Professional service provider

### Client User
- **Email**: client@mysharpjobs.ng
- **Password**: Client@123
- **Role**: Job poster

**View all users**: `php artisan users:show`

---

## 🐛 Troubleshooting

### Port Already in Use
If you see "port already in use" error:

```bash
# Check what's using port 8000 (backend)
netstat -ano | findstr :8000

# Check what's using port 5173 (frontend)
netstat -ano | findstr :5173

# Check what's using port 6001 (Reverb)
netstat -ano | findstr :6001

# Kill process by PID
taskkill /PID <PID> /F
```

### Concurrently Not Found
```bash
# Install globally
npm install -g concurrently

# Or use npx (auto-downloads)
npx concurrently --version
```

### Database Connection Error
```bash
cd backend
# Check .env file has correct database credentials
php artisan config:clear
php artisan migrate
php artisan db:seed
```

### WebSocket Connection Failed
1. Ensure Reverb is running on port 6001
2. Check `backend/config/reverb.php` configuration
3. Verify Echo configuration in `src/config/echo.ts`
4. Check browser console for connection errors

---

## 📚 Additional Commands

### Database Management
```bash
cd backend

# Fresh migration with seeding
php artisan migrate:fresh --seed

# Show seeded users
php artisan users:show

# Run only seeders
php artisan db:seed
```

### Cache Management
```bash
cd backend

# Clear all caches
php artisan optimize:clear

# Build production cache
php artisan optimize
```

### Frontend Build
```bash
# Development build with HMR
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

---

## 🎯 Development Workflow

1. **Start servers**: `.\start-dev.ps1` or `cd backend && composer dev`
2. **Make changes**: Edit files in `src/` (frontend) or `backend/` (backend)
3. **See changes**: Frontend hot-reloads automatically, backend may need refresh
4. **Test**: Use seeded credentials to log in and test features
5. **Debug**: Check color-coded terminal output for errors
6. **Stop**: Press Ctrl+C when done

---

## 📖 Related Documentation

- `DATABASE_SEEDER_DOCUMENTATION.md` - Database seeding details
- `QUICK_LOGIN_REFERENCE.md` - All user credentials
- `API_DOCUMENTATION.md` - Backend API endpoints
- `WEBSOCKET_COMPLETE_SUMMARY.md` - WebSocket implementation
- `FRONTEND_INTEGRATION_GUIDE.md` - Frontend API integration

---

## 🎉 Summary

You now have a **fully integrated development environment** where:

- ✅ One command starts everything
- ✅ All services run in parallel
- ✅ Color-coded output for easy debugging
- ✅ Hot module replacement for frontend
- ✅ Real-time WebSocket connections
- ✅ Background job processing
- ✅ Live application logs

**Happy coding! 🚀**
