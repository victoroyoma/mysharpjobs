# Editable Artisan Profile - Quick Reference Card

## 🚀 Quick Commands

```bash
# Run migration
cd backend && php artisan migrate

# Create storage link
php artisan storage:link

# Start backend
php artisan serve

# Start frontend (new terminal)
npm run dev
```

## 🔌 API Endpoints Cheat Sheet

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/profiles/me` | Get profile |
| PUT | `/api/profiles/me` | Update profile |
| PUT | `/api/profiles/availability` | Toggle availability |
| POST | `/api/profiles/avatar` | Upload avatar |
| POST | `/api/profiles/portfolio` | Upload portfolio |
| DELETE | `/api/profiles/portfolio/{index}` | Delete portfolio image |

## 📦 Request/Response Examples

### Update Profile
```json
PUT /api/profiles/me

Request:
{
  "name": "John Doe",
  "phone": "+234 123 456 7890",
  "bio": "Professional artisan",
  "location": "Lagos",
  "skills": [{"name": "Plumbing", "level": "Expert"}],
  "certifications": [{"name": "Cert", "issuer": "Issuer", "date": "2023-01-15"}],
  "experience": 5,
  "hourly_rate": 5000,
  "service_radius": 20
}

Response:
{
  "status": "success",
  "message": "Profile updated successfully",
  "data": { /* user object */ }
}
```

### Toggle Availability
```json
PUT /api/profiles/availability

Request:
{
  "is_available": false
}

Response:
{
  "status": "success",
  "message": "Availability updated successfully",
  "data": { "is_available": false }
}
```

### Upload Avatar
```
POST /api/profiles/avatar
Content-Type: multipart/form-data

Form Data:
  image: [File]

Response:
{
  "status": "success",
  "data": { "avatar": "/storage/avatars/xyz.jpg" }
}
```

### Delete Portfolio Image
```
DELETE /api/profiles/portfolio/2

Response:
{
  "status": "success",
  "message": "Portfolio image deleted successfully",
  "data": { "portfolio_images": [...] }
}
```

## ✅ Validation Quick Reference

### Skills Array
```json
{
  "skills": [
    {
      "name": "string (max 100)",
      "level": "Beginner|Intermediate|Expert"
    }
  ]
}
```

### Certifications Array
```json
{
  "certifications": [
    {
      "name": "string (max 255)",
      "issuer": "string (max 255)",
      "date": "YYYY-MM-DD"
    }
  ]
}
```

### Field Limits
- `name`: max 255 chars
- `phone`: max 20 chars
- `bio`: max 1000 chars
- `location`: max 500 chars
- `experience`: 0-100 years
- `hourly_rate`: 0-999999.99
- `service_radius`: 5-100 km

### File Uploads
- **Avatar:** 5MB max, images only (jpeg, png, jpg, gif)
- **Portfolio:** 5MB per image, max 10 total, images only (jpeg, png, jpg)

## 🔒 Security Checklist

- ✅ All endpoints require authentication
- ✅ Artisan-only endpoints enforce role check
- ✅ File type validation (images only)
- ✅ File size limits enforced
- ✅ Input validation on all fields
- ✅ SQL injection prevention (Eloquent)
- ✅ XSS protection (React escaping)

## 🗄️ Database Fields

### Core Profile
```
name, email, phone, avatar, location, bio
```

### Artisan Professional
```
skills (JSON), experience (int), hourly_rate (decimal),
service_radius (int), is_available (bool)
```

### Certifications & Portfolio
```
certifications (JSON), portfolio_images (JSON)
```

### Timestamps
```
avatar_updated_at, portfolio_updated_at, profile_updated_at
```

## 🧪 Testing Checklist

### Must Test
- [ ] Profile loads
- [ ] Edit/View mode toggle
- [ ] Avatar upload
- [ ] Skills add/remove
- [ ] Certifications add/remove
- [ ] Portfolio upload/delete
- [ ] All fields save
- [ ] Availability toggle
- [ ] Cancel reverts changes

### Validation Tests
- [ ] Empty skill name → error
- [ ] Invalid skill level → error
- [ ] Missing certification field → error
- [ ] File > 5MB → error
- [ ] 11th portfolio image → prevented

## 🐛 Troubleshooting

### Images not loading?
```bash
php artisan storage:link
```

### 422 Validation error?
- Check skill levels: Beginner, Intermediate, Expert (exact case)
- Check date format: YYYY-MM-DD
- Check all required fields filled

### 500 Server error?
```bash
tail -f backend/storage/logs/laravel.log
chmod -R 775 backend/storage
```

### CORS error?
Check `backend/config/cors.php`:
```php
'allowed_origins' => ['http://localhost:3000']
```

## 📁 File Locations

### Backend
- **Migration:** `backend/database/migrations/2025_10_05_000000_enhance_users_profile_fields.php`
- **Model:** `backend/app/Models/User.php`
- **Controller:** `backend/app/Http/Controllers/ProfileController.php`
- **Routes:** `backend/routes/api.php`

### Frontend
- **Component:** `src/pages/Profile/EditableArtisanProfile.tsx`

### Docs
- `EDITABLE_PROFILE_BACKEND_COMPLETE.md`
- `DATABASE_SCHEMA_REFERENCE.md`
- `EDITABLE_PROFILE_TESTING_GUIDE.md`
- `EDITABLE_PROFILE_IMPLEMENTATION_SUMMARY.md`

## 🎯 Feature Summary

| Feature | Status | Notes |
|---------|--------|-------|
| Database Schema | ✅ Complete | 9 new fields added |
| API Endpoints | ✅ Complete | 6 endpoints ready |
| Profile Update | ✅ Complete | Unified method with validation |
| Avatar Upload | ✅ Complete | 5MB limit, auto-delete old |
| Portfolio Gallery | ✅ Complete | Max 10 images, CRUD operations |
| Skills CRUD | ✅ Complete | Name + level validation |
| Certifications CRUD | ✅ Complete | Name + issuer + date |
| Availability Toggle | ✅ Complete | Instant update, no save needed |
| Frontend Component | ✅ Complete | 769 lines, full functionality |
| Documentation | ✅ Complete | 4 comprehensive guides |

## 📊 HTTP Status Codes

- `200` - Success
- `401` - Unauthenticated (no token)
- `403` - Forbidden (wrong role)
- `404` - Not found
- `422` - Validation error
- `500` - Server error

## 🌐 URLs

- **Backend:** http://localhost:8000
- **Frontend:** http://localhost:3000
- **Profile Page:** http://localhost:3000/artisan/profile
- **API Base:** http://localhost:8000/api

## 💾 Storage Structure

```
storage/app/public/
├── avatars/        # Profile pictures
└── portfolios/     # Portfolio images

public/storage/     # Symlink to above
```

## 📝 Common Tasks

### Add a new skill field?
1. Update validation in `ProfileController@update()`
2. Add to `$fillable` in User model
3. Add to frontend form
4. Test validation

### Change file size limit?
1. Update validation: `max:5120` (KB)
2. Update `upload_max_filesize` in php.ini
3. Update frontend validation message

### Add new profile field?
1. Create migration
2. Run `php artisan migrate`
3. Add to `$fillable` in User model
4. Add validation in controller
5. Update frontend component

---

**Quick Start:** Run migration → Create storage link → Start servers → Test at http://localhost:3000/artisan/profile

**Full Docs:** See `EDITABLE_PROFILE_TESTING_GUIDE.md` for comprehensive testing instructions.
