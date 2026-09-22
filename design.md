# Design System & UI/UX Specification — EventFlow

> Dokumen ini adalah **single source of truth untuk visual design, interaction design, responsive behavior, dan UX quality bar** EventFlow.

---

# 1. Design Vision

EventFlow harus terlihat seperti **produk SaaS event modern yang benar-benar digunakan organizer dan peserta**, bukan template admin, mockup Dribbble, atau output AI generatif yang penuh dekorasi.

Karakter visual:

```text
Professional
Premium
Warm
Modern
Calm
Trustworthy
Human-designed
Efficient
```

Prinsip utama:

> **Clarity over decoration.**

Desain harus membantu user menyelesaikan tugas dengan cepat:
- menemukan event;
- membeli/mendaftar tiket;
- melihat ticket;
- melakukan check-in;
- membuat event;
- memahami performa event.

---

# 2. Anti AI-Slop Rules

Ini adalah aturan wajib.

## Hindari

- gradient besar sebagai background utama;
- glassmorphism di seluruh halaman;
- neon/glow;
- terlalu banyak rounded card;
- semua elemen `rounded-full`;
- shadow besar;
- terlalu banyak icon;
- 3D illustration generik;
- avatar random dekoratif;
- terlalu banyak statistik card;
- dashboard yang terdiri dari banyak widget tanpa hierarchy;
- heading raksasa yang tidak proporsional;
- warna accent yang berganti-ganti;
- grafik hanya untuk mempercantik halaman;
- teks marketing generik seperti "Unlock your potential";
- layout center-aligned untuk semua section.

## Jangan membuat pola

```text
Hero besar
↓
Gradient
↓
6 cards
↓
4 charts
↓
Table
```

secara berulang pada setiap halaman.

---

# 3. Visual Direction

Gaya utama:

## Modern Editorial SaaS

Gunakan:
- typography yang kuat;
- whitespace terukur;
- border tipis;
- surface neutral;
- accent yang terkendali;
- hierarchy yang jelas;
- card hanya ketika berguna;
- table/list yang bersih.

Referensi prinsip visual boleh mengambil inspirasi dari produk SaaS produktivitas seperti Linear, Asana, Notion, Stripe, atau Eventbrite, tetapi **jangan menyalin identitas visual mereka**.

EventFlow harus mempunyai karakter sendiri.

---

# 4. Design Personality

EventFlow harus terasa:

```text
Confident, not loud
Premium, not luxurious
Friendly, not playful
Clean, not empty
Dense, not cluttered
Modern, not futuristic
```

---

# 5. Color System

Gunakan palette neutral dengan satu primary accent.

Arah warna:

```text
Primary       → deep indigo / blue
Background    → warm neutral
Surface       → white / slightly warm white
Text          → deep neutral
Muted         → slate
Border        → subtle neutral
Success       → green
Warning       → amber
Danger        → red
Info          → blue
```

Contoh token:

```css
--color-background
--color-surface
--color-surface-elevated
--color-border
--color-text-primary
--color-text-secondary
--color-text-muted
--color-primary
--color-primary-hover
--color-success
--color-warning
--color-danger
--color-info
```

Jangan menambahkan warna baru tanpa alasan.

---

# 6. Semantic Color Rules

Primary digunakan untuk:
- primary CTA;
- active navigation;
- links;
- selected state.

Success digunakan untuk:
- payment success;
- registration confirmed;
- check-in success;
- certificate available.

Warning digunakan untuk:
- pending payment;
- ticket almost sold out;
- event approaching.

Danger digunakan untuk:
- payment failed;
- event cancelled;
- destructive action.

Jangan membuat setiap status mempunyai warna yang sangat kuat.

---

# 7. Typography

Pilih satu font utama yang mudah dibaca:

```text
Inter
atau
Geist
atau
Plus Jakarta Sans
```

Pilih satu secara konsisten.

Hierarchy:

```text
Display
H1
H2
H3
Body Large
Body
Body Small
Caption
Label
```

Rules:
- heading tidak perlu terlalu besar;
- body text harus nyaman dibaca;
- line-height harus longgar untuk deskripsi;
- gunakan weight untuk hierarchy, bukan hanya warna;
- jangan menggunakan lebih dari satu font family tanpa alasan.

---

# 8. Spacing System

Gunakan spacing token:

```text
4
8
12
16
20
24
32
40
48
64
80
```

Aturan:
- 4–12 untuk hubungan internal element;
- 16–24 untuk group;
- 24–40 untuk section;
- 48–80 untuk page-level separation.

Jangan menentukan margin/padding random di setiap halaman.

---

# 9. Border Radius

Gunakan radius moderat:

```text
6px  → controls kecil
8px  → input/button
10px → card kecil
12px → card/panel
14px → modal/panel besar
16px → hero/large surface tertentu
```

Pill hanya untuk:
- status;
- tags;
- compact filter;
- badge.

Button utama tetap berbentuk rounded rectangle.

---

# 10. Shadow

Default gunakan border dan surface contrast.

Shadow hanya untuk:
- dropdown;
- modal;
- popover;
- drawer;
- elevated menu.

Shadow harus halus.

Jangan memberikan shadow pada semua card.

---

# 11. Iconography

Gunakan satu icon library konsisten, misalnya **Lucide**.

Rules:
- stroke konsisten;
- ukuran konsisten;
- jangan gunakan emoji sebagai icon utama;
- icon harus membantu scanning;
- icon bukan dekorasi semata.

---

# 12. Layout

Desktop baseline:

```text
Sidebar
   │
   └── Topbar
          │
          └── Page Header
                 │
                 └── Content
```

Main content harus mempunyai max-width yang masuk akal.

Jangan membuat content memanjang penuh ke seluruh layar pada monitor besar.

---

# 13. Public Website

Public-facing pages harus terasa lebih editorial daripada dashboard.

Halaman:

```text
Home
Events
Event Detail
Login
Register
Help
```

Gunakan visual event yang kuat tetapi jangan membuat landing page penuh gradient.

---

# 14. Landing Page

Struktur yang disarankan:

```text
Top Navigation
↓
Hero
↓
Featured Events / Discovery
↓
Why EventFlow
↓
How it works
↓
Organizer CTA
↓
Footer
```

Hero harus mempunyai:
- headline singkat;
- supporting text;
- primary CTA;
- secondary CTA;
- product/event preview yang realistis.

Jangan membuat hero kosong dengan ilustrasi abstrak yang terlalu besar.

---

# 15. Public Event Listing

Gunakan:

```text
Page header
Search
Filters
Sort
Event grid/list
Pagination
```

Event card minimal:

```text
Cover
Category
Title
Date
Venue / Online
Price / Free
CTA
```

Jangan menampilkan 10 metadata sekaligus.

---

# 16. Event Card

Prioritas:

```text
Cover
↓
Title
↓
Date + location
↓
Price
```

Secondary information:
- category;
- organizer;
- seat availability.

Gunakan hover state ringan.

---

# 17. Event Detail

Hierarki:

```text
Breadcrumb
↓
Cover / Event visual
↓
Title
Organizer
Date / Location
Primary CTA
↓
Description
Schedule
Speaker
Venue
Terms
```

Untuk desktop, ticket purchase panel boleh sticky di sisi kanan.

Untuk mobile, CTA ticket dapat menjadi sticky bottom action.

---

# 18. Ticket Selection

Gunakan selection panel yang jelas.

Contoh:

```text
Early Bird
Rp50.000
[ - ] 1 [ + ]

Regular
Rp75.000
[ - ] 0 [ + ]

----------------
Total Rp50.000

[ Continue ]
```

Jangan menggunakan card bertingkat terlalu banyak.

---

# 19. Checkout

Checkout harus fokus dan minim distraksi.

Layout desktop:

```text
Participant Information     Order Summary

Form                         Ticket
                             Qty
                             Price
                             Total

                             [ Pay / Register ]
```

Progress indicator boleh digunakan:

```text
Details → Review → Payment → Done
```

---

# 20. Payment State

State harus jelas:

```text
Pending
Success
Failed
Expired
Cancelled
```

Success page harus memberikan CTA:

```text
View Ticket
Download Ticket
Back to Events
```

---

# 21. Digital Ticket

Ticket harus terlihat premium dan mudah dipindai.

Informasi:

```text
Event Name
Participant
Ticket Type
Date
Venue
Ticket Number
QR Code
```

Visual:
- clean white/surface;
- strong event title;
- clear QR;
- sufficient spacing;
- jangan terlalu banyak ornamen.

Mobile harus nyaman untuk screenshot atau ditampilkan saat check-in.

---

# 22. QR Check-in Interface

Ini merupakan halaman operasional, sehingga prioritasnya adalah **speed + clarity**.

Desktop:

```text
Event selector
Scanner
Recent check-ins
Stats
```

Mobile:

```text
Camera scanner
↓
Large result state
↓
Next scan
```

Result:

### Valid
Gunakan visual success yang jelas tetapi tidak berlebihan.

### Invalid
Tampilkan alasan:

```text
Ticket not found
Ticket already checked in
Ticket cancelled
Ticket does not belong to this event
```

---

# 23. Organizer Dashboard

Jangan membuat dashboard penuh widget.

Struktur:

```text
Page Header
Quick actions
Key metrics
Upcoming events
Recent registrations
Event performance
```

Quick actions:

```text
+ Create Event
Manage Events
View Participants
```

Metrics cukup 3–5 yang paling relevan.

---

# 24. Organizer Event Management

Gunakan sidebar/tab context:

```text
Overview
Details
Tickets
Participants
Check-in
Certificates
Reports
Settings
```

Active navigation harus subtle.

---

# 25. Event Creation

Event creation merupakan workflow panjang.

Gunakan multi-step form bila jumlah field cukup banyak:

```text
1. Basics
2. Schedule
3. Venue
4. Tickets
5. Settings
6. Review
```

Aturan:
- simpan progress;
- validasi per step;
- tampilkan completion status;
- jangan meminta semua field dalam satu form panjang.

---

# 26. Participant Management

Gunakan table/list yang clean.

Kolom utama:

```text
Participant
Ticket
Payment
Check-in
Registered
Action
```

Filter:
- ticket type;
- payment;
- check-in;
- registration date.

Action dapat menggunakan icon menu agar tidak memenuhi tabel.

---

# 27. Certificate Management

Organizer melihat:

```text
Certificate Template
Eligible Participants
Issued
Pending
```

Batch action:

```text
[ Generate Certificates ]
```

Progress generation harus menggunakan background job dan memberikan state yang jelas.

---

# 28. Participant Dashboard

Fokus pada event yang dimiliki user.

```text
Upcoming Tickets
↓
Upcoming Events
↓
Past Events
↓
Certificates
```

Jangan menampilkan analytics organizer kepada participant.

---

# 29. Profile

Gunakan layout sederhana:

```text
Profile
Personal information
Password & security
Notifications
```

---

# 30. Notifications

Notification panel dibagi:

```text
Today
Earlier
```

Unread menggunakan subtle background tint + dot.

Jangan menggunakan badge merah besar untuk semua status.

---

# 31. Admin Dashboard

Admin dashboard lebih dense dibanding participant dashboard, tetapi tetap memiliki hierarchy.

Informasi:

```text
Platform users
Organizers
Events
Registrations
Revenue / platform metrics jika relevan
Moderation queue
Recent activity
```

---

# 32. Tables

Table rules:
- header jelas;
- divider tipis;
- hover row;
- pagination;
- sticky header bila table panjang;
- responsive fallback.

Mobile:
- gunakan horizontal scroll bila kolom memang diperlukan; atau
- transform menjadi compact cards.

Jangan membuat tabel menyusut sampai tidak terbaca.

---

# 33. Forms

Form harus memiliki:
- label;
- helper text jika perlu;
- required marker jika perlu;
- error message;
- focus state;
- disabled state;
- loading state.

Error message harus spesifik.

Buruk:

```text
Invalid input
```

Lebih baik:

```text
Event end time must be later than the start time.
```

---

# 34. Modal

Modal digunakan untuk:
- confirmation;
- quick edit;
- short form;
- destructive action.

Workflow panjang menggunakan page/drawer.

---

# 35. Drawer

Gunakan drawer untuk:
- ticket details;
- participant detail;
- quick edit;
- filter panel;
- check-in detail.

Desktop dan mobile harus memiliki behavior yang berbeda secara tepat jika diperlukan.

---

# 36. Empty States

Harus terasa purposeful.

Contoh:

```text
No events yet

Create your first event to start accepting registrations.

[ Create Event ]
```

Jangan gunakan illustration besar tanpa fungsi.

---

# 37. Loading States

Prioritas:
- skeleton;
- inline loading;
- button progress;
- scanner state.

Jangan mengganti seluruh halaman dengan spinner besar jika hanya sebagian data yang loading.

---

# 38. Error States

Error harus menjelaskan:
1. apa yang gagal;
2. apakah data tetap aman;
3. apa yang harus dilakukan.

Contoh:

```text
We couldn't load your participants.
Your event is safe. Try again.

[ Retry ]
```

---

# 39. Toast

Toast untuk feedback singkat:

```text
Event published
Ticket type created
Participant checked in
Certificate generation started
```

Jangan menggunakan toast untuk keputusan penting.

---

# 40. Motion

Motion harus subtle.

Durasi:

```text
150–250ms
```

Gunakan untuk:
- dropdown;
- modal;
- drawer;
- hover;
- toast;
- drag feedback.

Jangan membuat seluruh halaman animate pada initial load.

Support `prefers-reduced-motion`.

---

# 41. Responsive Strategy

Target:

```text
360px
390px
640px
768px
1024px
1280px
1440px+
```

Mobile bukan desktop yang diperkecil.

---

# 42. Mobile Navigation

Participant public pages:
- simple top navigation;
- CTA mudah dijangkau.

Dashboard:
- sidebar → drawer;
- topbar dipadatkan;
- search dapat menjadi icon/action.

---

# 43. Mobile Check-in

Halaman scanner harus menjadi **single-purpose interface**.

Prioritas:

```text
Camera
↓
Scan
↓
Result
↓
Next scan
```

Jangan menaruh chart kompleks di scanner page.

---

# 44. Accessibility

Wajib:
- semantic HTML;
- keyboard navigation;
- focus visible;
- labels;
- accessible error messages;
- contrast yang memadai;
- touch target nyaman;
- reduced motion.

Interactive element tidak boleh bergantung pada color saja.

---

# 45. Dark Mode

Dark mode boleh ditambahkan.

Jika tersedia, gunakan design token berbeda; jangan sekadar membalik warna.

Dark mode harus tetap nyaman untuk:
- ticket detail;
- dashboard;
- table;
- scanner.

QR scanner result harus tetap mempunyai contrast tinggi.

---

# 46. Component Library

Component reusable minimal:

```text
Button
IconButton
Input
Textarea
Select
DatePicker
SearchInput
Tabs
Dropdown
Modal
Drawer
Toast
Badge
Avatar
Card
Table
Pagination
Breadcrumb
EmptyState
LoadingState
Skeleton
EventCard
TicketCard
StatusBadge
ProgressBar
Stat
Timeline
NotificationItem
QRCodeTicket
ScannerResult
```

---

# 47. Component States

Setiap interactive component harus mempunyai:

```text
Default
Hover
Focus
Active
Disabled
Loading
Error
Selected
```

---

# 48. Design Tokens

Gunakan tokens untuk:
- color;
- typography;
- spacing;
- radius;
- shadow;
- motion;
- z-index.

Frontend implementation harus mengonsumsi token yang sama, bukan membuat nilai acak per halaman.

---

# 49. Content Design

Copy harus singkat, konkret, dan manusiawi.

Gunakan:

```text
Create Event
Publish Event
View Ticket
Scan Ticket
Download Certificate
```

Hindari generic AI copy seperti:

```text
Elevate your event experience
Unlock seamless engagement
Empower your journey
```

kecuali memang dibutuhkan pada marketing copy.

---

# 50. Edge Case UI

Design harus tetap baik pada:

```text
0 events
1 event
100 events
very long event title
very long organizer name
sold out event
free event
online event
cancelled event
payment pending
payment expired
invalid QR
already checked in
camera permission denied
certificate not ready
large participant list
```

---

# 51. Security-aware UI

UI tidak boleh menjadi satu-satunya security layer.

Contoh:
- hide organizer controls dari participant;
- tetapi backend tetap menegakkan authorization;
- hide staff controls bila tidak punya assignment;
- QR result tetap berasal dari server validation.

---

# 52. Event Status Visual

Gunakan status badge yang tenang:

```text
Draft
Published
Ongoing
Completed
Cancelled
Archived
```

Tidak semua status perlu menggunakan saturated background.

---

# 53. Ticket Status Visual

```text
Pending Payment
Confirmed
Checked In
Cancelled
Refunded
Expired
```

Pastikan user memahami status tanpa mengandalkan color saja.

---

# 54. Payment Status Visual

```text
Pending
Paid
Failed
Expired
Refunded
```

Payment success harus paling mudah dikenali pada checkout result.

---

# 55. Dashboard Quality Rule

Sebelum menambahkan component pada dashboard, tanyakan:

1. Apakah informasi ini membantu keputusan user?
2. Apakah bisa ditampilkan lebih sederhana?
3. Apakah data lebih cocok menjadi list daripada card?
4. Apakah user perlu melihatnya setiap kali membuka dashboard?

Jika tidak, pindahkan ke halaman detail.

---

# 56. Visual Density

EventFlow memiliki dua mode density secara alami:

### Discovery
Lebih airy dan visual.

Digunakan pada:
- landing;
- event listing;
- event detail.

### Operations
Lebih compact.

Digunakan pada:
- organizer dashboard;
- participant table;
- check-in;
- certificate management.

Jangan menggunakan satu density untuk seluruh aplikasi.

---

# 57. Implementation Workflow

Jangan langsung mengubah seluruh UI.

Urutan:

```text
1. Inspect existing frontend
2. Audit current components
3. Map pages
4. Create tokens
5. Build core primitives
6. Update application shell
7. Redesign public discovery
8. Redesign event detail
9. Redesign checkout/ticket
10. Redesign organizer dashboard
11. Redesign event management
12. Redesign participant management
13. Redesign scanner
14. Redesign certificate
15. Responsive refinement
16. Accessibility review
17. Visual QA
```

---

# 58. Jangan Merusak Business Logic

Redesign tidak boleh mengubah tanpa alasan:
- API contract;
- database;
- business rules;
- authentication;
- authorization;
- payment logic;
- check-in validation.

Perubahan fokus pada:
- layout;
- component;
- hierarchy;
- spacing;
- typography;
- color;
- interactions;
- responsive behavior.

---

# 59. Visual QA Checklist

## Visual

```text
[ ] Typography consistent
[ ] Colors consistent
[ ] Spacing consistent
[ ] Radius consistent
[ ] Icon style consistent
[ ] Shadow subtle
```

## UX

```text
[ ] Primary CTA jelas
[ ] User tahu lokasinya
[ ] Error mudah dimengerti
[ ] Loading tidak mengganggu
[ ] Empty state mempunyai CTA
[ ] Important actions mudah ditemukan
```

## Responsive

```text
[ ] 360px
[ ] 390px
[ ] 768px
[ ] 1024px
[ ] 1280px
[ ] 1440px
```

## Anti AI-Slop

```text
[ ] Tidak terlalu banyak gradient
[ ] Tidak terlalu banyak glassmorphism
[ ] Tidak terlalu banyak card
[ ] Tidak semua button pill
[ ] Tidak banyak icon dekoratif
[ ] Tidak ada chart tanpa fungsi
[ ] Tidak ada whitespace yang sia-sia
[ ] Tidak ada layout template generik yang berulang
```

---

# 60. Final Quality Bar

Hasil akhir harus memberi kesan:

> **"Ini adalah produk event management yang siap digunakan, bukan prototype AI."**

Jika visual terlihat terlalu generik, terlalu dekoratif, atau terlalu mirip dashboard template, redesign ulang hierarchy dan composition terlebih dahulu — bukan hanya mengganti warna.

---

# 61. Final Deliverable

File ini harus dipakai oleh developer sebagai sumber kebenaran desain.

```text
/docs/PRD.md
/docs/design.md
```

`PRD.md` menjelaskan **apa yang harus dibangun**.

`design.md` menjelaskan **bagaimana produk tersebut harus terasa, terlihat, dan digunakan**.
