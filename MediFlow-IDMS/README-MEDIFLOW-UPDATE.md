# MEDIFLOW updated project

## Main improvements
- Frontend pages are separated into `src/pages/` (login, dashboard, patients, visits/nurse triage, doctor, laboratory, billing, users, records).
- Shared UI components and types are in `src/components/shared.tsx` and `src/types.ts`.
- Login includes password show/hide, remember-username option, clearer error messages, and health-themed motion.
- New patient registration automatically creates the patient's first visit in `WAITING_FOR_TRIAGE`.
- Nurse triage now saves structured vitals and sends the visit to `WAITING_FOR_DOCTOR`.
- Doctor queue excludes visits still waiting for triage and displays the recorded nursing observations.
- Corrected Patient table index column name to `full_name`.

## Database setup
Start MySQL in XAMPP. Create database `dispensary` if it does not exist:
```sql
CREATE DATABASE IF NOT EXISTS dispensary CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Check `backend/src/main/resources/application.properties`:
- datasource username/password must match your local MySQL account.
- set a private random `app.jwt.secret` with at least 32 characters.
- To create the first ADMIN account, temporarily set:
  `app.bootstrap.enabled=true`
  `app.bootstrap.username=admin@gmail.com`
  `app.bootstrap.password=<a private password of at least 14 characters>`
  `app.bootstrap.full-name=MEDIFLOW Administrator`
- Start backend once. Confirm the admin exists, then set `app.bootstrap.enabled=false` and restart.
- Do not share your private bootstrap or JWT secrets.

## Run backend
Open CMD:
```cmd
cd backend
mvn clean spring-boot:run
```
Backend: `http://localhost:8080`

## Run frontend
Open another CMD:
```cmd
cd frontend
npm install
npm run dev
```
Open the Vite URL shown in the terminal (commonly `http://localhost:5173`).

## Important workflow
Reception registers a new patient -> backend creates patient + first visit -> Nurse records triage -> visit enters Doctor queue -> Doctor documents consultation and requests tests -> Lab records and verifies results -> Doctor reviews and finalizes care.

The archive intentionally excludes `node_modules` and Maven `target`; dependencies/build output are recreated by the commands above.
