# 🔑 MySharpJob Test Users - Quick Reference

All users use **@mysharpjobs.ng** domain

---

## 👤 Admin User (Full CRUD Rights)
```
Email: admin@mysharpjobs.ng
Password: Admin@123
```

## 🔧 Main Artisan User
```
Email: artisan@mysharpjobs.ng
Password: Artisan@123
Profession: Professional Carpenter
Rate: ₦5,000/hour
```

## 👨‍💼 Main Client User
```
Email: client@mysharpjobs.ng
Password: Client@123
Jobs Posted: 23
Total Spent: ₦450,000
```

---

## Additional Test Users

### Artisans
```
plumber@mysharpjobs.ng      Password@123
electrician@mysharpjobs.ng  Password@123
painter@mysharpjobs.ng      Password@123
```

### Clients
```
james@mysharpjobs.ng        Password@123
grace@mysharpjobs.ng        Password@123
```

---

## Quick Commands

```bash
# View all users
php artisan users:show

# Reset and seed database
php artisan migrate:fresh --seed

# Run seeder only
php artisan db:seed
```

---

## Test Login (cURL)

```bash
# Admin
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@mysharpjobs.ng","password":"Admin@123"}'

# Artisan
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"artisan@mysharpjobs.ng","password":"Artisan@123"}'

# Client
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"client@mysharpjobs.ng","password":"Client@123"}'
```

---

**Total Users:** 8 (1 admin + 4 artisans + 3 clients)  
**Status:** ✅ Ready for use
