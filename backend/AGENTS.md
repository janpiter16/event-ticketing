# EventFlow Development Guide

## Setup

### Backend
```bash
cd backend
php artisan migrate
php artisan serve
```

### Frontend
```bash
cd frontend
npm run dev
```

### Docker (Optional)
```bash
docker-compose up -d
```

## Key Commands

### Database
```bash
php artisan migrate
php artisan migrate:fresh --seed
php artisan migrate:rollback
```

### Code Generation
```bash
php artisan make:model ModelName -mrc
php artisan make:migration migration_name
php artisan make:controller ControllerName --api
```

### Testing
```bash
php artisan test
npm run test
```

### Linting
```bash
./vendor/bin/pint
npm run lint
```

## Project Structure

Backend: `backend/app/` organized by domain (Models, Controllers, Services, Policies)
Frontend: `frontend/src/` organized by feature (components, hooks, features, services, lib)

## Phase Tracking

- Phase 0 ✓ Foundation setup
- Phase 1 ✓ Database & Sanctum
- Phase 2 ✓ Authentication & Roles (auth endpoints, user roles, policies, tests)
- Phase 3 → Event Management (CRUD, publish/unpublish, categories, public listing)
