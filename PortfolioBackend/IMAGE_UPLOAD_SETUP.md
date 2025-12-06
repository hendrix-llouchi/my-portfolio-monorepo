# Image Upload Setup for Projects

## Overview

The `ProjectController` now supports image uploads via `multipart/form-data`. Images are stored in `storage/app/public/projects` and accessible via the public storage link.

## Setup Steps

### 1. Create Storage Link

Laravel requires a symbolic link to make uploaded files accessible via the web:

```bash
cd PortfolioBackend
php artisan storage:link
```

This creates a link from `public/storage` to `storage/app/public`, allowing images to be served.

### 2. Verify Directory Exists

The `projects` directory will be created automatically when you upload the first image. However, you can create it manually:

```bash
mkdir -p storage/app/public/projects
```

## API Usage

### Creating a Project with Image

**Request:**
```
POST /api/projects
Content-Type: multipart/form-data
Authorization: Bearer {token}
```

**Form Data:**
- `title`: string (required)
- `description`: string (required)
- `tech_stack`: string or array (required)
  - Can be: `["React", "Laravel"]` (JSON string)
  - Or: `React, Laravel` (comma-separated)
  - Or: Array format
- `image`: file (optional)
  - Types: jpeg, png, jpg, gif, svg
  - Max size: 2MB
- `demo_link`: string (optional)
- `repo_link`: string (optional)

**Response:**
```json
{
  "id": 1,
  "title": "My Project",
  "description": "Project description",
  "tech_stack": ["React", "Laravel"],
  "image_url": "http://127.0.0.1:8000/storage/projects/abc123.jpg",
  "demo_link": null,
  "repo_link": null,
  "created_at": "2025-12-04T22:30:00.000000Z",
  "updated_at": "2025-12-04T22:30:00.000000Z"
}
```

### Updating a Project with New Image

When updating with a new image:
- The old image file is automatically deleted
- The new image is stored and URL updated

### Deleting a Project

When a project is deleted:
- The associated image file is automatically deleted from storage

## Frontend Integration Example

### Using Axios with FormData

```javascript
const formData = new FormData();
formData.append('title', 'My Project');
formData.append('description', 'Project description');
formData.append('tech_stack', JSON.stringify(['React', 'Laravel']));
formData.append('image', fileInput.files[0]); // File from input

await api.post('/projects', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});
```

### Using Fetch

```javascript
const formData = new FormData();
formData.append('title', 'My Project');
formData.append('description', 'Project description');
formData.append('tech_stack', 'React, Laravel');
formData.append('image', fileInput.files[0]);

await fetch('http://127.0.0.1:8000/api/projects', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
  },
  body: formData,
});
```

## Validation Rules

- **Image**: 
  - Must be an image file
  - Allowed types: jpeg, png, jpg, gif, svg
  - Maximum size: 2MB (2048 KB)
  - Optional field

## Storage Location

- **Storage Path**: `storage/app/public/projects/`
- **Public URL**: `http://127.0.0.1:8000/storage/projects/{filename}`
- **Database**: Full URL stored in `image_url` field

## Troubleshooting

### Images Not Displaying

1. **Check storage link exists:**
   ```bash
   ls -la public/storage
   ```
   Should show a symlink to `../storage/app/public`

2. **Recreate storage link:**
   ```bash
   php artisan storage:link
   ```

3. **Check file permissions:**
   ```bash
   chmod -R 755 storage/app/public
   ```

### Upload Fails

- Check file size (must be ≤ 2MB)
- Verify file type (jpeg, png, jpg, gif, svg only)
- Ensure `storage/app/public/projects` directory exists and is writable

### Old Images Not Deleting

- Check file permissions on `storage/app/public/projects`
- Verify the old image path is correct in the database

