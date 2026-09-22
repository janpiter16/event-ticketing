# PRD — EventFlow
## Event Management & Ticketing Platform

> **Dokumen ini adalah single source of truth untuk perencanaan dan pembangunan EventFlow**, sebuah aplikasi web manajemen event dan ticketing skala kecil–menengah.

---

## 1. Ringkasan Produk

**Nama produk sementara:** EventFlow

EventFlow adalah platform web yang membantu penyelenggara membuat dan mengelola event, menjual/menyalurkan tiket, mengelola peserta, melakukan check-in menggunakan QR Code, menerbitkan sertifikat, serta memantau performa event melalui dashboard.

Produk ditujukan untuk:
- seminar;
- workshop;
- pelatihan;
- konferensi kecil;
- webinar/hybrid event;
- event komunitas;
- kegiatan kampus/sekolah;
- event organisasi dan perusahaan.

EventFlow harus terasa seperti produk SaaS yang benar-benar dapat digunakan, bukan sekadar aplikasi CRUD.

---

# 2. Tujuan Produk

### Tujuan utama

1. Memudahkan organizer membuat dan menerbitkan event.
2. Memudahkan peserta menemukan event dan melakukan registrasi.
3. Mengurangi proses check-in manual melalui QR Code.
4. Memberikan data peserta dan statistik event secara terpusat.
5. Mempermudah penerbitan sertifikat peserta.
6. Menyediakan workflow event yang jelas dari publikasi sampai selesai.

### Non-goals MVP

Fitur berikut tidak wajib pada MVP:
- marketplace event lintas organizer;
- subscription/billing SaaS organizer;
- native mobile application;
- livestreaming engine sendiri;
- advanced marketing automation;
- AI event planner;
- dynamic seat map kompleks;
- multi-currency;
- microservices architecture.

---

# 3. Target Pengguna dan Role

## 3.1 Super Admin

Mengelola keseluruhan platform.

Hak akses:
- mengelola user;
- mengelola organizer;
- melihat seluruh event;
- menonaktifkan event yang melanggar aturan;
- melihat audit log;
- melihat platform statistics;
- mengelola kategori event;
- mengelola pengaturan global.

## 3.2 Organizer / Event Owner

Pemilik dan pengelola event.

Hak akses:
- membuat event;
- mengubah event;
- menerbitkan/unpublish event;
- membuat kategori/ticket type;
- menetapkan harga;
- melihat peserta;
- melakukan export;
- mengelola check-in staff;
- menerbitkan sertifikat;
- melihat dashboard event.

## 3.3 Event Staff / Check-in Staff

Petugas operasional event.

Hak akses:
- melihat event yang ditugaskan;
- melakukan scan QR;
- melihat status tiket;
- melakukan manual check-in bila diizinkan;
- melihat daftar peserta sesuai permission;
- melihat statistik check-in.

Tidak dapat:
- mengubah pengaturan event;
- mengubah harga;
- menghapus event;
- mengelola user platform.

## 3.4 Participant

Peserta event.

Hak akses:
- register/login;
- melihat event;
- mendaftar event;
- melakukan pembayaran jika event berbayar;
- melihat tiket;
- menampilkan QR Code;
- menerima notifikasi;
- mengunduh sertifikat setelah memenuhi syarat;
- melihat riwayat pendaftaran.

---

# 4. User Journey

## 4.1 Organizer membuat event

```text
Login
  ↓
Dashboard Organizer
  ↓
Create Event
  ↓
Isi Informasi Event
  ↓
Buat Ticket Type
  ↓
Preview
  ↓
Publish
  ↓
Event Live
```

## 4.2 Participant mendaftar

```text
Landing/Event Listing
  ↓
Event Detail
  ↓
Pilih Tiket
  ↓
Isi Data
  ↓
Checkout
  ↓
Pembayaran (jika berbayar)
  ↓
Tiket Terbit
  ↓
QR Code
```

## 4.3 Check-in

```text
Staff Login
  ↓
Pilih Event
  ↓
Scan QR
  ↓
Validasi Ticket
  ↓
Ticket Valid?
  ├── Tidak → Tolak / tampilkan alasan
  └── Ya → Check-in
               ↓
           Activity Log
```

## 4.4 Sertifikat

```text
Event selesai
  ↓
Peserta memenuhi syarat
  ↓
Organizer menerbitkan certificate batch
  ↓
Certificate tersedia
  ↓
Peserta download
```

---

# 5. Scope MVP

MVP wajib mencakup:

```text
Authentication
Role & authorization
Organizer profile
Event CRUD
Event publishing
Public event listing
Event detail
Ticket type
Quota/stock ticket
Registration
Checkout
Payment status
Digital ticket
QR Code
Check-in
Participant management
Event dashboard
Export participant
Certificate generation
Notification in-app
Audit/activity log
Responsive UI
```

---

# 6. Feature Priorities

| Feature | Priority | Dependency |
|---|---|---|
| Authentication | P0 | - |
| Role & Permission | P0 | Authentication |
| Organizer profile | P0 | Authentication |
| Event CRUD | P0 | Organizer |
| Publish/unpublish event | P0 | Event |
| Public event listing | P0 | Event |
| Ticket type | P0 | Event |
| Registration | P0 | Event + Ticket |
| Payment workflow | P0 untuk paid event | Registration |
| Digital ticket | P0 | Registration |
| QR Code | P0 | Ticket |
| Check-in | P0 | QR + Staff |
| Participant list | P0 | Registration |
| Dashboard | P0 | Event + Registration |
| Certificate | P1 | Participant + Event |
| Export | P1 | Participant |
| In-app notification | P1 | Registration/Event |
| Email notification | P1 | Notification |
| Promo code | P2 | Payment |
| Seat map | P2 | Event |
| AI event assistant | P3 | Future |

---

# 7. Information Architecture

```text
Public
├── Home
├── Events
├── Event Detail
├── Login
├── Register
└── About / Help

Participant
├── Dashboard
├── My Tickets
├── My Registrations
├── Certificates
├── Notifications
└── Profile

Organizer
├── Dashboard
├── My Events
│   ├── Overview
│   ├── Event Settings
│   ├── Ticket Types
│   ├── Participants
│   ├── Check-in
│   ├── Certificates
│   └── Reports
├── Team / Staff
├── Notifications
└── Profile

Super Admin
├── Dashboard
├── Users
├── Organizers
├── Events
├── Categories
├── Audit Logs
└── Settings
```

---

# 8. Functional Requirements

## FR-001 Authentication

Sistem harus menyediakan:
- register;
- login;
- logout;
- forgot password;
- reset password;
- current user;
- profile;
- change password.

### Acceptance criteria

- user dapat membuat akun dengan email valid;
- password disimpan dalam bentuk hash;
- session/token tidak diekspos secara tidak aman;
- endpoint protected menolak request tanpa authentication.

---

## FR-002 Event CRUD

Organizer dapat membuat event dengan data:

```text
name
description
category
cover_image
start_at
end_at
registration_open_at
registration_close_at
venue_name
venue_address
latitude
longitude
is_online
online_url
terms_and_conditions
status
```

Status event:

```text
DRAFT
PUBLISHED
ONGOING
COMPLETED
CANCELLED
ARCHIVED
```

### Business rules

- event DRAFT belum dapat dibeli publik;
- event hanya dapat PUBLISHED jika data minimum lengkap;
- event yang sudah COMPLETED tidak dapat menerima registrasi baru;
- event CANCELLED tidak dapat menerima pembayaran baru;
- organizer hanya boleh mengelola event miliknya;
- super admin dapat mengakses seluruh event.

---

## FR-003 Event Listing

Public user dapat:
- melihat event published;
- search;
- filter kategori;
- filter online/offline;
- filter tanggal;
- sort berdasarkan tanggal/relevansi.

Pagination wajib digunakan.

---

## FR-004 Ticket Type

Organizer dapat membuat jenis tiket:

```text
name
code
description
price
quota
sale_start_at
sale_end_at
min_purchase
max_purchase
is_active
```

Contoh:

```text
Early Bird  = Rp50.000
Regular     = Rp75.000
VIP         = Rp150.000
```

### Business rules

- quota tidak boleh negatif;
- ticket yang tidak aktif tidak dapat dibeli;
- jumlah pembelian tidak boleh melewati max_purchase;
- sistem harus mencegah overselling melalui transaksi database/locking yang sesuai.

---

## FR-005 Registration

Participant memilih:
- event;
- ticket type;
- quantity;
- data peserta tambahan jika diperlukan.

Sistem membuat registration dengan status:

```text
PENDING_PAYMENT
PAID
CONFIRMED
CANCELLED
EXPIRED
REFUNDED
```

Untuk event gratis, sistem dapat melewati payment dan langsung CONFIRMED setelah validasi.

---

## FR-006 Payment

Untuk MVP, gunakan gateway payment eksternal yang tersedia di Indonesia, misalnya Midtrans.

Flow:

```text
Create Registration
  ↓
Create Payment Transaction
  ↓
Payment Gateway
  ↓
Webhook
  ↓
Verify Signature / Status
  ↓
Update Registration
  ↓
Issue Ticket
```

### Penting

Status pembayaran tidak boleh ditentukan hanya berdasarkan redirect dari browser.

Webhook gateway menjadi sumber validasi status transaksi, setelah signature/status diverifikasi.

Jangan menyimpan data kartu sensitif.

---

## FR-007 Digital Ticket

Setelah pembayaran/registration confirmed:

Sistem membuat:
- ticket number;
- QR code;
- ticket type;
- participant name;
- event info;
- valid status.

Contoh ticket number:

```text
EVT-20260922-000001
```

QR Code tidak boleh hanya berisi data pribadi plaintext. Gunakan token unik yang dapat divalidasi server.

---

## FR-008 Check-in

Staff melakukan scan QR.

Validasi:

```text
Ticket exists?
Ticket belongs to this event?
Registration paid/confirmed?
Already checked in?
Ticket cancelled/refunded?
```

Jika valid:

```text
check_in_at = now
checked_in_by = staff_id
status = CHECKED_IN
```

Jika sudah check-in:
- tampilkan status;
- jangan membuat check-in kedua.

---

## FR-009 Participant Management

Organizer dapat:
- mencari peserta;
- filter ticket type;
- filter payment status;
- filter check-in status;
- melihat detail peserta;
- export peserta.

---

## FR-010 Dashboard

### Organizer Dashboard

Minimal:

```text
Total Events
Published Events
Total Registrations
Total Revenue
Tickets Sold
Check-in Rate
Upcoming Events
Recent Registrations
```

Chart:
- registrations over time;
- ticket sales by ticket type;
- check-in progress.

### Staff Dashboard

```text
Assigned Events
Total Participants
Checked In
Remaining
Check-in Rate
```

### Participant Dashboard

```text
Upcoming Tickets
Past Events
Certificates
Recent Notifications
```

### Admin Dashboard

```text
Total Users
Total Organizers
Total Events
Published Events
Total Registrations
Platform Activity
```

---

## FR-011 Certificate

Organizer dapat menentukan template sertifikat.

MVP minimal:
- participant name;
- event name;
- date;
- certificate number;
- organizer name;
- verification token/URL.

Certificate dapat diterbitkan individual maupun batch.

Certificate number harus unik.

---

## FR-012 Notification

MVP channel:
- in-app notification.

P1:
- email.

Event notification minimal:
- registration confirmed;
- payment success;
- ticket issued;
- event reminder;
- event cancelled;
- certificate available;
- staff assignment.

---

## FR-013 Audit & Activity

Aktivitas sensitif dicatat:

```text
login
create event
update event
publish event
cancel event
create ticket type
registration
payment status update
check-in
certificate issued
member/staff changes
admin actions
```

Audit log tidak boleh dihapus oleh organizer/staff.

---

# 9. Business Rules

| ID | Rule |
|---|---|
| BR-001 | User harus authenticated untuk melakukan registration yang membutuhkan akun. |
| BR-002 | Organizer hanya dapat mengelola event miliknya. |
| BR-003 | Staff hanya dapat melakukan check-in pada event yang ditugaskan. |
| BR-004 | Ticket hanya dapat dibuat untuk event yang dimiliki/diizinkan organizer. |
| BR-005 | Paid ticket harus memiliki payment status valid sebelum ticket dianggap confirmed. |
| BR-006 | Webhook payment harus diverifikasi sebelum mengubah status transaksi. |
| BR-007 | QR ticket harus divalidasi server. |
| BR-008 | Satu ticket tidak dapat digunakan dua kali untuk check-in. |
| BR-009 | Event completed/cancelled tidak menerima registration baru. |
| BR-010 | Quota ticket tidak boleh oversold. |
| BR-011 | Certificate hanya dapat diberikan kepada peserta yang memenuhi syarat event. |
| BR-012 | Data lintas organizer harus terisolasi. |

---

# 10. Data Model

Minimal tabel:

```text
users
roles / role mapping
organizer_profiles
event_categories
events
event_staff
ticket_types
registrations
registration_items
payments
tickets
check_ins
certificates
certificate_templates
notifications
audit_logs
```

Relasi inti:

```text
User
 ├── OrganizerProfile
 ├── Registrations
 ├── EventStaff
 ├── Tickets
 └── Notifications

Event
 ├── TicketTypes
 ├── Registrations
 ├── EventStaff
 ├── Certificates
 └── AuditLogs

Registration
 ├── RegistrationItems
 ├── Payment
 └── Ticket

Ticket
 └── CheckIn
```

---

# 11. Database Requirements

Gunakan **PostgreSQL**.

Gunakan:
- foreign key;
- unique constraint;
- check constraint bila sesuai;
- index untuk query populer;
- timestamps;
- soft delete hanya pada entity yang membutuhkan recovery/audit.

Index minimal:

```text
events.status
events.start_at
events.organizer_id
events.category_id
ticket_types.event_id
registrations.event_id
registrations.user_id
registrations.status
payments.external_reference
payments.status
tickets.ticket_number
tickets.event_id
check_ins.ticket_id
notifications.user_id
notifications.read_at
```

---

# 12. API Design

Gunakan REST API.

Base:

```text
/api
```

## Auth

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
POST /api/auth/forgot-password
POST /api/auth/reset-password
```

## Events

```text
GET    /api/events
POST   /api/events
GET    /api/events/{event}
PUT    /api/events/{event}
DELETE /api/events/{event}
POST   /api/events/{event}/publish
POST   /api/events/{event}/unpublish
POST   /api/events/{event}/cancel
```

## Ticket Types

```text
GET    /api/events/{event}/ticket-types
POST   /api/events/{event}/ticket-types
PUT    /api/ticket-types/{ticketType}
DELETE /api/ticket-types/{ticketType}
```

## Registration

```text
POST /api/events/{event}/registrations
GET  /api/registrations
GET  /api/registrations/{registration}
POST /api/registrations/{registration}/cancel
```

## Payment

```text
POST /api/registrations/{registration}/checkout
POST /api/payments/webhook
GET  /api/payments/{payment}
```

## Tickets

```text
GET /api/tickets
GET /api/tickets/{ticket}
GET /api/tickets/{ticket}/qr
```

## Check-in

```text
POST /api/events/{event}/check-ins/validate
POST /api/events/{event}/check-ins
GET  /api/events/{event}/check-ins
```

## Certificates

```text
POST /api/events/{event}/certificates/generate
GET  /api/certificates
GET  /api/certificates/{certificate}
GET  /api/certificates/{certificate}/download
GET  /api/certificates/{certificate}/verify
```

## Notifications

```text
GET  /api/notifications
POST /api/notifications/{notification}/read
POST /api/notifications/read-all
```

## Dashboard

```text
GET /api/dashboard/organizer
GET /api/dashboard/staff
GET /api/dashboard/participant
GET /api/dashboard/admin
```

Response success:

```json
{
  "success": true,
  "message": "Data berhasil diproses",
  "data": {}
}
```

Response error:

```json
{
  "success": false,
  "message": "Data tidak valid",
  "errors": {}
}
```

---

# 13. Technical Architecture

Gunakan modular monolith sebagai baseline.

```text
Browser
   ↓
React + Vite
   ↓
Laravel REST API
   ├── Auth
   ├── Event Domain
   ├── Registration Domain
   ├── Payment Domain
   ├── Ticket Domain
   ├── Check-in Domain
   ├── Certificate Domain
   └── Notification Domain
   ↓
PostgreSQL

Redis
 ├── Queue
 └── Cache

External Services
 ├── Payment Gateway
 ├── Email Provider
 └── Object Storage
```

Jangan menggunakan microservices untuk MVP.

---

# 14. Tech Stack

## Frontend

```text
React
TypeScript
Vite
Tailwind CSS
React Router
TanStack Query
React Hook Form
Zod
Axios
```

Untuk QR/check-in:
- gunakan library QR scanner yang kompatibel dengan browser;
- implementasi scan harus graceful ketika permission kamera ditolak.

## Backend

```text
Laravel
PHP 8.3+
Laravel Sanctum
Eloquent ORM
Form Request
API Resource
Policy
Service Layer
Queue
Notifications
```

## Database

```text
PostgreSQL
```

## Infrastructure

```text
Docker
Docker Compose
Nginx atau reverse proxy platform
Redis
```

## Storage

```text
S3-compatible object storage
```

## Testing

```text
Pest/PHPUnit
Vitest
React Testing Library
Playwright
```

---

# 15. Frontend Structure

```text
frontend/
└── src/
    ├── components/
    ├── layouts/
    ├── pages/
    ├── features/
    │   ├── auth/
    │   ├── events/
    │   ├── tickets/
    │   ├── registrations/
    │   ├── checkin/
    │   ├── certificates/
    │   └── dashboard/
    ├── services/
    ├── hooks/
    ├── lib/
    ├── types/
    ├── utils/
    └── router/
```

Gunakan feature-oriented structure untuk domain yang cukup besar.

---

# 16. Backend Structure

```text
backend/app/
├── Http/
│   ├── Controllers/Api
│   ├── Requests
│   └── Resources
├── Models
├── Policies
├── Services
├── Actions
├── Jobs
├── Events
├── Listeners
├── Notifications
└── Support
```

Controller harus tipis.
Business logic penting berada pada service/action/domain layer.

---

# 17. Security

Wajib:
- authentication;
- role/permission backend;
- policy authorization;
- rate limiting untuk endpoint sensitif;
- request validation;
- file validation;
- secure upload path;
- signed/opaque QR token;
- webhook signature verification;
- IDOR protection;
- mass assignment protection;
- XSS protection;
- CORS configuration;
- security headers;
- tidak menyimpan data kartu pembayaran sensitif.

Khusus multi-organizer:

> Organizer A tidak boleh membaca atau mengubah event, peserta, ticket, payment, atau certificate milik Organizer B hanya dengan mengganti ID pada URL/API.

---

# 18. Performance

Gunakan:
- pagination;
- eager loading;
- indexed query;
- queue untuk email/certificate generation;
- image optimization;
- cache untuk data publik yang sesuai;
- lazy load data dashboard bila diperlukan.

Jangan mengambil seluruh participant ke browser sekaligus.

---

# 19. Notifications & Queue

Gunakan Redis Queue untuk pekerjaan seperti:

```text
send registration email
send event reminder
generate certificate batch
process report/export
cleanup temporary assets
```

Failed jobs wajib dapat diinspeksi.

---

# 20. Testing Strategy

## Backend

Test minimal:
- auth;
- role/permission;
- event CRUD;
- publish rule;
- ticket quota;
- registration;
- payment webhook verification;
- ticket generation;
- check-in duplicate prevention;
- certificate rule;
- tenant isolation.

## Frontend

Test minimal:
- form validation;
- event creation;
- ticket selection;
- registration flow;
- QR display;
- scanner states;
- role-specific navigation.

## E2E

Skenario wajib:

```text
Organizer register
→ create event
→ create ticket
→ publish
→ Participant register
→ payment/confirmation
→ ticket issued
→ Staff scan QR
→ check-in success
→ Organizer sees participant/check-in
→ certificate generated
→ Participant downloads certificate
```

---

# 21. Edge Cases

Harus ditangani:
- quota habis saat dua user checkout bersamaan;
- payment pending terlalu lama;
- webhook dikirim dua kali;
- payment berhasil tetapi browser participant tertutup;
- ticket dibatalkan setelah pembayaran;
- QR digunakan dua kali;
- kamera tidak diizinkan;
- event dibatalkan setelah peserta membeli tiket;
- participant mencoba mengakses ticket milik orang lain;
- organizer menghapus/arsip event yang sudah memiliki peserta;
- certificate digenerate ulang;
- network putus saat check-in.

---

# 22. UI/UX Requirements

Aplikasi harus:
- profesional;
- premium;
- tenang;
- mudah dipahami;
- responsive;
- tidak penuh card;
- tidak terlihat seperti template admin generik;
- tidak menggunakan gradient berlebihan;
- tidak menggunakan glassmorphism sebagai gaya utama;
- mempunyai hierarchy visual yang kuat.

Detail design berada di:

```text
/docs/design.md
```

`design.md` harus dianggap sebagai sumber kebenaran untuk visual/interaction design.

---

# 23. Accessibility

Minimal:
- semantic HTML;
- keyboard navigation;
- visible focus state;
- label form;
- error state yang jelas;
- contrast yang memadai;
- reduced motion support;
- touch-friendly controls.

---

# 24. Build Roadmap

## Phase 0 — Analysis
- inspect repository;
- baca PRD dan design;
- buat project analysis.

## Phase 1 — Foundation
- Laravel;
- React;
- Docker;
- PostgreSQL;
- Redis;
- Sanctum;
- health check.

## Phase 2 — Authentication
- register;
- login;
- logout;
- role;
- profile;
- password reset.

## Phase 3 — Event Management
- category;
- event CRUD;
- media;
- venue/location;
- publish workflow.

## Phase 4 — Ticketing
- ticket types;
- quota;
- registration;
- pricing.

## Phase 5 — Payment
- checkout;
- gateway integration;
- webhook;
- payment status.

## Phase 6 — Ticket & QR
- ticket generation;
- QR code;
- ticket detail.

## Phase 7 — Check-in
- scanner;
- ticket validation;
- duplicate prevention;
- check-in dashboard.

## Phase 8 — Participants
- participant list;
- filters;
- export.

## Phase 9 — Certificate
- template;
- batch generation;
- download;
- verification.

## Phase 10 — Notification
- in-app;
- email queue.

## Phase 11 — Dashboard & Reporting
- metrics;
- charts;
- reports.

## Phase 12 — Testing & Security
- unit;
- feature;
- E2E;
- security review;
- performance.

## Phase 13 — UI/UX Polish
- implement design system;
- responsive refinement;
- accessibility;
- visual QA.

## Phase 14 — Deployment
- production build;
- migration;
- queue worker;
- storage;
- environment configuration;
- health check.

**Tidak menggunakan VPS sebagai requirement deployment.** Target deployment harus tetap memungkinkan menggunakan managed/container platform atau shared hosting yang mendukung kebutuhan aplikasi. Deployment-specific provider dapat dipilih kemudian berdasarkan biaya dan kebutuhan.

---

# 25. Definition of Done

Fitur dianggap selesai jika:

```text
[ ] Backend selesai
[ ] Database/migration selesai
[ ] Validation selesai
[ ] Authorization selesai
[ ] API selesai
[ ] Frontend selesai
[ ] Loading state
[ ] Empty state
[ ] Error state
[ ] Responsive
[ ] Test relevan lulus
[ ] Documentation diperbarui
```

---

# 26. Acceptance Test MVP

### AT-001 Organizer

Given organizer login
When organizer membuat event dan publish
Then event muncul di public listing.

### AT-002 Participant

Given event published
When participant memilih ticket dan submit registration
Then registration tercatat.

### AT-003 Payment

Given paid registration
When gateway mengirim webhook valid
Then payment dan registration diperbarui menjadi status yang sesuai.

### AT-004 Ticket

Given registration confirmed
When ticket dibuat
Then participant dapat melihat ticket dan QR.

### AT-005 Check-in

Given ticket valid
When staff scan QR
Then participant menjadi checked-in.

### AT-006 Duplicate Check-in

Given ticket sudah checked-in
When QR yang sama discan lagi
Then sistem menolak check-in kedua.

### AT-007 Tenant Isolation

Given organizer A dan B
When organizer A mencoba mengakses resource organizer B
Then access denied.

---

# 27. Metrics

Product metrics:
- published events;
- registrations;
- paid conversion;
- tickets sold;
- check-in rate;
- certificate download rate;
- event completion rate.

Technical metrics:
- API error rate;
- webhook failures;
- queue failures;
- average response time;
- database slow queries.

---

# 28. Risk Register

| Risk | Impact | Mitigation |
|---|---|---|
| Overselling ticket | High | DB transaction + locking/concurrency strategy |
| Payment mismatch | High | Verified webhook + idempotency |
| Duplicate check-in | High | Unique check-in constraint/business rule |
| Cross-organizer access | Critical | Policies + scoped queries + tests |
| Large certificate batch | Medium | Queue/background job |
| Large image uploads | Medium | File limit + object storage |
| Overengineering | Medium | Modular monolith + MVP scope |

---

# 29. Repository Convention

Branch:

```text
main
develop
feature/*
fix/*
```

Commit:

```text
feat:
fix:
refactor:
test:
docs:
chore:
```

---

# 30. Project Environment

Baseline development stack:

```text
Node.js 22 LTS-compatible environment
PHP 8.3+
Laravel
PostgreSQL
Redis
Docker
```

Do not force a Node upgrade if the existing Node 22 environment is compatible with the selected frontend dependencies.

---

# 31. Deployment (Non-VPS)

VPS **bukan requirement**.

Deployment target harus memenuhi:
- HTTPS;
- PostgreSQL/MySQL managed database;
- persistent storage/object storage;
- background worker jika queue digunakan;
- scheduler jika reminder digunakan;
- environment variables;
- build command untuk frontend/backend;
- HTTPS webhook endpoint untuk payment provider.

Alternatif deployment dapat menggunakan:
- managed container platform;
- managed application platform;
- shared hosting yang mendukung Laravel + Node build workflow, bila kompatibel;
- managed PostgreSQL;
- object storage terpisah.

Detail provider dapat ditentukan pada tahap deployment sesuai budget dan kemampuan hosting.

---

# 32. Final Deliverables

Target proyek menghasilkan:

```text
React Frontend
Laravel REST API
PostgreSQL database
Redis queue/cache
Docker configuration
Authentication
Role-based access
Event management
Ticketing
Payment workflow
QR ticket
Check-in
Participant management
Certificate
Notification
Dashboard
Reports/export
Testing suite
Documentation
Design system
Deployment configuration tanpa ketergantungan pada VPS
```

---

# 33. AI Coding Agent Rules

Jika dokumen ini digunakan oleh Antigravity/Cursor/Claude Code:

1. Baca `PRD.md` dan `design.md` sebelum coding.
2. Jangan mengerjakan seluruh aplikasi sekaligus.
3. Ikuti phase secara berurutan.
4. Inspect repository sebelum mengubah file.
5. Reuse code yang sehat.
6. Jangan merusak business logic existing.
7. Jangan membuat dummy implementation untuk fitur inti.
8. Setiap feature harus memiliki acceptance criteria dan test.
9. Jangan menganggap frontend validation sebagai security.
10. Jangan membuat API baru yang bentrok dengan API spec tanpa mendokumentasikannya.
11. Setelah setiap phase, jalankan test relevan.
12. Laporkan file yang berubah, test yang dijalankan, dan issue yang tersisa.

---

# 34. Final Acceptance Checklist

```text
[ ] Semua role bekerja sesuai permission
[ ] Organizer dapat membuat dan publish event
[ ] Public dapat menemukan event
[ ] Participant dapat register
[ ] Payment flow tervalidasi
[ ] Ticket dan QR dibuat
[ ] Check-in bekerja
[ ] Duplicate check-in ditolak
[ ] Participant list benar
[ ] Certificate tersedia sesuai syarat
[ ] Notification bekerja
[ ] Audit/activity tersedia
[ ] Dashboard akurat
[ ] Cross-organizer access tidak mungkin
[ ] Responsive
[ ] Accessibility dasar terpenuhi
[ ] Automated tests lulus
[ ] Production build berhasil
[ ] Deployment tidak bergantung pada VPS
```
