# Admin Panel API Setup Guide

## Prerequisites

### 1. Install Laravel Sanctum (if not already installed)

Laravel 12 includes Sanctum by default, but you may need to publish the migrations:

```bash
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate
```

If Sanctum is not installed, add it via Composer:

```bash
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate
```

### 2. Seed Admin User

```bash
php artisan db:seed --class=AdminSeeder
```

**Admin Credentials:**
- Email: `admin@example.com`
- Password: `password`

**⚠️ Important:** Change the password in production!

## API Endpoints

### Authentication

#### POST `/api/login`
Login and receive an API token.

**Request:**
```json
{
  "email": "admin@example.com",
  "password": "password"
}
```

**Response (200):**
```json
{
  "user": {
    "id": 1,
    "name": "Admin",
    "email": "admin@example.com"
  },
  "token": "1|xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
}
```

**Error (422):**
```json
{
  "message": "The provided credentials are incorrect.",
  "errors": {
    "email": ["The provided credentials are incorrect."]
  }
}
```

#### POST `/api/logout`
Logout and delete the current access token.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "message": "Logged out successfully."
}
```

### Protected Admin Routes

All protected routes require the `Authorization: Bearer {token}` header.

#### Projects
- `POST /api/projects` - Create project
- `PUT /api/projects/{id}` - Update project
- `DELETE /api/projects/{id}` - Delete project
- `GET /api/projects` - **Public** (no auth required)

#### Skills
- `POST /api/skills` - Create skill
- `PUT /api/skills/{id}` - Update skill
- `DELETE /api/skills/{id}` - Delete skill
- `GET /api/skills` - **Public** (no auth required)

#### Experiences
- `POST /api/experiences` - Create experience
- `PUT /api/experiences/{id}` - Update experience
- `DELETE /api/experiences/{id}` - Delete experience
- `GET /api/experiences` - **Public** (no auth required)

#### Contact Messages
- `GET /api/messages` - Get all contact form submissions (admin only)

## Testing with cURL

### 1. Login
```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'
```

Save the token from the response.

### 2. Get Messages (Protected)
```bash
curl -X GET http://localhost:8000/api/messages \
  -H "Accept: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 3. Create Project (Protected)
```bash
curl -X POST http://localhost:8000/api/projects \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "New Project",
    "description": "Project description",
    "tech_stack": ["React", "Laravel"],
    "image_url": null,
    "demo_link": null,
    "repo_link": null
  }'
```

### 4. Logout
```bash
curl -X POST http://localhost:8000/api/logout \
  -H "Accept: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Frontend Integration

When making authenticated requests from your admin panel:

```javascript
const token = localStorage.getItem('admin_token');

fetch(`${API_URL}/messages`, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
});
```

## Security Notes

1. **Change default password** in production
2. **Use HTTPS** in production
3. **Store tokens securely** (httpOnly cookies recommended for production)
4. **Implement token refresh** for better security
5. **Rate limit** login endpoints to prevent brute force attacks

