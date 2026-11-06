# MEDIFLOW – Integrated Dispensary Management System

This project is an enhanced development starter for a single dispensary. It uses React + TypeScript + Vite, Spring Boot 3, Spring Security/JWT and MySQL.

## Included modules
- Login with JWT and BCrypt password hashes
- Role-based navigation and backend method-level authorization
- Patient registration and search
- Reception visit creation and doctor waiting list
- Doctor consultation notes: symptoms, duration, history, examination, provisional/final diagnosis, advice and medicine instructions
- Doctor laboratory requests linked to the same visit
- Laboratory result entry and separate ADMIN/MANAGER verification
- Verified laboratory results returned to the doctor queue
- Existing billing, invoice and payment endpoints/pages
- User management and ADMIN-only account enable/disable
- Patient record compilation with PDF and Excel export
- English, Kiswahili and Arabic interface foundation (RTL for Arabic)
- Health-focused navy, teal and mint interface

## Main patient workflow
1. Reception registers a patient.
2. Reception creates a visit; the visit appears in the doctor's queue.
3. Doctor records symptoms, history, examination and diagnosis.
4. Doctor sends one or more laboratory requests from the consultation.
5. Laboratory technician enters results and submits them for verification.
6. ADMIN or MANAGER verifies the result. The visit is marked `RESULTS_READY_FOR_DOCTOR` when all orders for that visit are verified.
7. Doctor refreshes/receives the updated worklist (the doctor and laboratory pages poll every 15 seconds), reviews results, and saves final diagnosis/advice/medicine instructions.
8. Authorized staff compile the patient's visits, laboratory results and invoices into a PDF or Excel workbook.

## Roles
- ADMIN: system-wide access and user activation/deactivation
- MANAGER: operational overview, user creation/listing, and lab verification
- RECEPTIONIST: patient registration and visit creation
- NURSE: view visits and record triage through the protected API
- DOCTOR: clinical consultation and lab requests/results review
- LAB_TECHNICIAN: receive lab orders and submit results
- CASHIER: billing and payments
- ACCOUNTANT: billing and financial records
- RECORDS_OFFICER: patient records and authorized exports
- PHARMACIST: limited access in this starter; a full inventory/dispensing workflow is not implemented yet

## Run locally

### Database
Create the database:
```sql
CREATE DATABASE mediflow CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Backend
Configure `backend/src/main/resources/application.properties`:
- DB username/password
- A private JWT secret of at least 32 characters
- Enable bootstrap only to create the first admin.

For first admin creation, temporarily set:
```properties
app.bootstrap.enabled=true
app.bootstrap.username=admin
app.bootstrap.password=Use-A-Unique-Strong-Password-Here
app.bootstrap.full-name=System Administrator
```
The bootstrap password must be at least 14 characters. After the first successful creation, set `app.bootstrap.enabled=false` and restart the backend.

Run from `backend`:
```bash
mvn spring-boot:run
```
Backend: `http://localhost:8080`

### Frontend
Run from `frontend`:
```bash
npm install
npm run dev
```
Frontend: `http://localhost:5173`

The frontend uses `xlsx`, `jspdf`, and `jspdf-autotable` for exports. These are included in `package.json`; run `npm install` after updating the project.

## Important implementation notes
- Existing database tables are updated by Hibernate `ddl-auto=update`. Back up your database before running the updated backend against existing patient data.
- Role restrictions are enforced in the backend with `@PreAuthorize`; frontend navigation is only an additional usability layer.
- Lab result entry and verification are separated: LAB_TECHNICIAN submits; ADMIN/MANAGER verifies. Production deployments should introduce a dedicated lab supervisor/verifier role if required.
- The current starter does not yet implement a complete pharmacy stock/dispensing module, appointment scheduling, a dedicated audit-event table, SMS/email notifications, insurance claims, or production-grade backup/restore.
- PDF/Excel export is available to authorized users in the Records page. Protect downloaded files and use patient consent/access policies according to local law and facility policy.
- This starter is not certified medical software and must be clinically validated, security-tested, backed up, and configured to the facility's procedures before use with real patient information.
