# Database Schema - Editable Artisan Profile

## Users Table Schema

Complete reference for all profile-related fields in the `users` table.

### Core Identity Fields

| Field | Type | Default | Nullable | Description |
|-------|------|---------|----------|-------------|
| `id` | bigint | AUTO | No | Primary key |
| `name` | varchar(255) | - | No | User's full name |
| `email` | varchar(255) | - | No | Unique email address |
| `password` | varchar(255) | - | No | Hashed password |
| `type` | enum | 'client' | No | User role: 'artisan' or 'client' |
| `phone` | varchar(20) | NULL | Yes | Phone number |
| `avatar` | varchar(500) | NULL | Yes | Profile picture URL |
| `location` | text | NULL | Yes | Address/location string |
| `bio` | text | NULL | Yes | Profile bio (max 1000 chars) |

### Profile Management Fields

| Field | Type | Default | Nullable | Description |
|-------|------|---------|----------|-------------|
| `avatar_updated_at` | timestamp | NULL | Yes | Last avatar change timestamp |
| `profile_updated_at` | timestamp | NULL | Yes | Last profile update timestamp |
| `profile_views` | integer | 0 | No | Number of profile page views |
| `profile_completed` | boolean | false | No | Profile completion status |
| `profile_completed_at` | timestamp | NULL | Yes | When profile was completed |
| `profile_completion_percentage` | integer | 0 | No | Completion percentage (0-100) |

### Artisan Professional Fields

| Field | Type | Default | Nullable | Description |
|-------|------|---------|----------|-------------|
| `skills` | json | NULL | Yes | Array: `[{"name": "Plumbing", "level": "Expert"}]` |
| `specializations` | json | NULL | Yes | Structured specialization data |
| `experience` | integer | NULL | Yes | Years of experience (0-100) |
| `years_experience` | decimal(4,1) | NULL | Yes | More precise experience value |
| `hourly_rate` | decimal(10,2) | NULL | Yes | Hourly rate in currency (₦) |
| `service_radius` | integer | 20 | No | Service coverage in kilometers (5-100) |
| `is_available` | boolean | true | No | Current availability status |

### Skills JSON Structure

```json
[
  {
    "name": "Plumbing",
    "level": "Expert"
  },
  {
    "name": "Welding",
    "level": "Intermediate"
  },
  {
    "name": "Pipe Installation",
    "level": "Beginner"
  }
]
```

**Valid Skill Levels:**
- `Beginner`
- `Intermediate`
- `Expert`

### Certifications & Portfolio

| Field | Type | Default | Nullable | Description |
|-------|------|---------|----------|-------------|
| `certifications` | json | NULL | Yes | Array of certification objects |
| `certifications_verified` | boolean | false | No | Admin verification flag |
| `portfolio_images` | json | NULL | Yes | Array of image URLs |
| `portfolio_updated_at` | timestamp | NULL | Yes | Last portfolio change |

### Certifications JSON Structure

```json
[
  {
    "name": "Master Plumber Certification",
    "issuer": "Nigerian Plumbing Association",
    "date": "2020-06-15"
  },
  {
    "name": "Advanced Welding Certificate",
    "issuer": "Trade Institute Lagos",
    "date": "2021-03-20"
  }
]
```

### Portfolio Images JSON Structure

```json
[
  "/storage/portfolios/abc123.jpg",
  "/storage/portfolios/def456.jpg",
  "/storage/portfolios/ghi789.jpg"
]
```

**Constraints:**
- Maximum 10 images
- Each image max 5MB
- Formats: JPEG, PNG, JPG

### Rating & Performance

| Field | Type | Default | Nullable | Description |
|-------|------|---------|----------|-------------|
| `rating` | decimal(3,2) | 0.00 | No | Average rating (0.00-5.00) |
| `review_count` | integer | 0 | No | Total number of reviews |
| `completed_jobs` | integer | 0 | No | Number of completed jobs |
| `response_time` | string | NULL | Yes | Average response time |

### Additional Artisan Fields

| Field | Type | Default | Nullable | Description |
|-------|------|---------|----------|-------------|
| `languages` | json | NULL | Yes | Array of languages spoken |
| `social_links` | json | NULL | Yes | Social media profile links |
| `working_hours` | json | NULL | Yes | Business hours configuration |
| `preferred_categories` | json | NULL | Yes | Preferred job categories |
| `emergency_service` | boolean | false | No | Offers emergency services |
| `insurance_verified` | boolean | false | No | Insurance verification status |
| `verification_documents` | json | NULL | Yes | KYC document URLs |
| `location_settings` | json | NULL | Yes | Geo-location preferences |
| `bank_details` | json | NULL | Yes | Payment account information |

### Languages JSON Structure

```json
[
  "English",
  "Yoruba",
  "Hausa",
  "Igbo"
]
```

### Social Links JSON Structure

```json
{
  "facebook": "https://facebook.com/profile",
  "twitter": "https://twitter.com/handle",
  "instagram": "https://instagram.com/profile",
  "linkedin": "https://linkedin.com/in/profile"
}
```

### Client-Specific Fields

| Field | Type | Default | Nullable | Description |
|-------|------|---------|----------|-------------|
| `company_name` | varchar(255) | NULL | Yes | Business/company name |
| `business_type` | varchar(100) | NULL | Yes | Type of business |
| `company_registration_number` | varchar(100) | NULL | Yes | Business registration ID |
| `tax_id` | varchar(100) | NULL | Yes | Tax identification number |
| `jobs_posted` | integer | 0 | No | Total jobs posted |
| `total_spent` | decimal(10,2) | 0.00 | No | Total amount spent |
| `preferred_payment_method` | varchar(50) | NULL | Yes | Default payment method |

### Verification & Security

| Field | Type | Default | Nullable | Description |
|-------|------|---------|----------|-------------|
| `is_verified` | boolean | false | No | Account verification status |
| `is_email_verified` | boolean | false | No | Email verification status |
| `email_verification_token` | varchar(100) | NULL | Yes | Token for email verification |
| `password_reset_token` | varchar(100) | NULL | Yes | Token for password reset |
| `password_reset_expires` | timestamp | NULL | Yes | Reset token expiration |

### Activity Tracking

| Field | Type | Default | Nullable | Description |
|-------|------|---------|----------|-------------|
| `last_active` | timestamp | NULL | Yes | Last activity timestamp |
| `joined_date` | timestamp | CURRENT | No | Account creation date |
| `created_at` | timestamp | CURRENT | No | Record creation timestamp |
| `updated_at` | timestamp | CURRENT | No | Record update timestamp |

## Indexes

```sql
-- Performance optimization indexes
INDEX idx_email (email)
INDEX idx_type (type)
INDEX idx_location (location(100))
INDEX idx_is_verified (is_verified)
INDEX idx_is_available (is_available)
INDEX idx_rating (rating)
INDEX idx_hourly_rate (hourly_rate)
INDEX idx_service_radius (service_radius)
```

## Model Casts

These fields are automatically cast by the Eloquent model:

```php
'joined_date' => 'datetime',
'last_active' => 'datetime',
'avatar_updated_at' => 'datetime',
'portfolio_updated_at' => 'datetime',
'profile_updated_at' => 'datetime',
'password_reset_expires' => 'datetime',

'skills' => 'array',
'specializations' => 'array',
'certifications' => 'array',
'portfolio_images' => 'array',
'languages' => 'array',
'social_links' => 'array',
'preferred_categories' => 'array',
'verification_documents' => 'array',
'location_settings' => 'array',
'bank_details' => 'array',
'working_hours' => 'array',

'rating' => 'decimal:2',
'hourly_rate' => 'decimal:2',
'total_spent' => 'decimal:2',
'years_experience' => 'decimal:1',

'is_available' => 'boolean',
'is_verified' => 'boolean',
'is_email_verified' => 'boolean',
'emergency_service' => 'boolean',
'insurance_verified' => 'boolean',
'certifications_verified' => 'boolean',
'profile_completed' => 'boolean',

'password' => 'hashed'
```

## Fillable Fields

All fields that can be mass-assigned via the API:

```php
[
    // Core fields
    'name', 'email', 'password', 'type', 'avatar', 'phone', 
    'location', 'bio',
    
    // Profile management
    'avatar_updated_at', 'profile_updated_at', 'profile_views',
    'profile_completed', 'profile_completed_at', 
    'profile_completion_percentage',
    
    // Artisan professional
    'skills', 'specializations', 'experience', 'years_experience',
    'hourly_rate', 'is_available', 'service_radius',
    
    // Certifications & portfolio
    'certifications', 'certifications_verified', 
    'portfolio_images', 'portfolio_updated_at',
    
    // Additional artisan
    'languages', 'social_links', 'working_hours', 
    'preferred_categories', 'emergency_service', 
    'insurance_verified', 'verification_documents',
    'location_settings', 'bank_details',
    
    // Performance metrics
    'rating', 'review_count', 'completed_jobs', 'response_time',
    
    // Client fields
    'company_name', 'business_type', 'jobs_posted', 
    'total_spent', 'preferred_payment_method',
    'company_registration_number', 'tax_id',
    
    // Verification
    'is_verified', 'is_email_verified', 'last_active'
]
```

## Hidden Fields

Fields excluded from JSON responses:

```php
[
    'password',
    'refresh_token',
    'email_verification_token',
    'password_reset_token',
    'password_reset_expires'
]
```

## Migration Commands

### Run New Migration

```bash
php artisan migrate
```

### Rollback Latest Migration

```bash
php artisan migrate:rollback
```

### Rollback All & Migrate Fresh

```bash
php artisan migrate:fresh
```

### Check Migration Status

```bash
php artisan migrate:status
```

## Query Examples

### Get All Available Artisans

```php
$artisans = User::where('type', 'artisan')
    ->where('is_available', true)
    ->where('is_verified', true)
    ->orderBy('rating', 'desc')
    ->get();
```

### Get Artisans by Skill

```php
$plumbers = User::where('type', 'artisan')
    ->whereJsonContains('skills', ['name' => 'Plumbing'])
    ->get();
```

### Get High-Rated Artisans

```php
$topArtisans = User::where('type', 'artisan')
    ->where('rating', '>=', 4.5)
    ->where('review_count', '>=', 10)
    ->orderBy('rating', 'desc')
    ->take(10)
    ->get();
```

### Search by Service Radius

```php
$nearbyArtisans = User::where('type', 'artisan')
    ->where('is_available', true)
    ->where('service_radius', '>=', 20)
    ->get();
```

### Update Profile Fields

```php
$user->update([
    'skills' => [
        ['name' => 'Plumbing', 'level' => 'Expert'],
        ['name' => 'Welding', 'level' => 'Intermediate']
    ],
    'hourly_rate' => 5500,
    'is_available' => true,
    'profile_updated_at' => now()
]);
```

## Data Validation Rules

### Skills Array Validation

```php
'skills' => 'array',
'skills.*.name' => 'required|string|max:100',
'skills.*.level' => 'required|in:Beginner,Intermediate,Expert'
```

### Certifications Array Validation

```php
'certifications' => 'array',
'certifications.*.name' => 'required|string|max:255',
'certifications.*.issuer' => 'required|string|max:255',
'certifications.*.date' => 'required|date'
```

### Portfolio Images Validation

```php
'images' => 'array|max:10',
'images.*' => 'image|mimes:jpeg,png,jpg|max:5120'
```

### Profile Update Validation

```php
'name' => 'string|max:255',
'phone' => 'string|max:20',
'bio' => 'string|max:1000',
'location' => 'string|max:500',
'experience' => 'integer|min:0|max:100',
'hourly_rate' => 'numeric|min:0|max:999999.99',
'service_radius' => 'integer|min:5|max:100',
'is_available' => 'boolean'
```

---

**Reference:** This schema supports the complete editable artisan profile feature with frontend integration at `src/pages/Profile/EditableArtisanProfile.tsx`.
