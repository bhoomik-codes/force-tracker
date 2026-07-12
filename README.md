# Force Tracker - Field Workforce SaaS

Force Tracker is a hardware-free field employee management and tracking SaaS application. It was originally built as a prototype for a hackathon challenge (see [The Problem Statement](#the-hackathon-problem-statement)) and has since been heavily refactored into a fully functional, highly-secure product connected to a genuine PostgreSQL database.

---

## 🏆 The Hackathon Problem Statement

Indian businesses with field teams (sales reps, service engineers, delivery staff) struggle with fake attendance, incorrect visit logs, and zero visibility—often resorting to manual WhatsApp tracking. Most cannot afford hardware biometrics or GPS trackers.

**The Challenge:** Build a lightweight, hardware-free Field Workforce SaaS using only mobile phone GPS and a simple web admin panel to track attendance, daily tasks, visits, and productivity.

**Key Requirements:**
- Admin Web Dashboard (Team management, live location, attendance, task creation).
- Employee Mobile App/PWA (GPS attendance, task execution, photo proofs, background location streaming).
- Hardware-Free (No RFID, no biometrics).
- Offline-capable for low network areas.

---

## 🚀 Evolution from MVP to Production

The original codebase (backed up in `attached_assets/Field-Force-Tracker_*.zip`) was a rapid prototype that relied heavily on mock data and scaffolding to demonstrate the UI flow for the hackathon judges. 

**Here is how we have evolved the app from the original MVP:**

1. **Database & Persistence:**
   - **MVP:** Relied entirely on in-memory storage arrays and mock data.
   - **Now:** Fully integrated with a production-ready **PostgreSQL** database using **Drizzle ORM**.
2. **Real-time GPS Tracking:**
   - **MVP:** The Live Map plotted offline agents in fake cities (Delhi, Noida) and hardcoded their battery levels to 100% to simulate a busy map.
   - **Now:** The map strictly filters out offline employees and renders markers exclusively using genuine GPS coordinates from the database and secure live WebSocket pings.
3. **Analytics & Reports:**
   - **MVP:** Rendered beautiful charts powered by hardcoded static arrays.
   - **Now:** All charts (Attendance, Task Trends, Task Distribution) are dynamically computed from live timesheets and task completion data.
4. **Security & Code Quality:**
   - **MVP:** Contained hardcoded plaintext passwords (`"admin123"`), exposed IDOR vulnerabilities on API routes, and was bloated with over 40 unused UI components and 30 unused npm dependencies.
   - **Now:** Enforces `scrypt` password hashing, robust session-based IDOR protection on all `PUT`/`DELETE` routes, and has been completely stripped of all dead code and UI bloat.

---

## 🏗️ Current Implementation Status

Here is the actual working status of the main features:

*   **Time & Attendance (Timesheets):**             
    *   *Status:* **Working (UI/DB Connected)**
    *   *Details:* The UI displays timesheet records dynamically fetched from PostgreSQL. Exporting to PDF/CSV is fully functional using `jspdf`.
*   **Admin Reports:**
    *   *Status:* **Working (Live Data)**
    *   *Details:* The analytics dashboard renders dynamic charts based on live data. 
*   **Admin Task Management:** 
    *   *Status:* **Working**
    *   *Details:* Admins can successfully create, edit, mark as complete, or delete tasks.
*   **Admin Settings:** 
    *   *Status:* **Working**
    *   *Details:* Admins can securely persist company profiles and tracking intervals to the PostgreSQL `settings` table.
*   **Site Visits Management:** 
    *   *Status:* **Partially Working (Next Milestone)**
    *   *Details:* The mobile interface accesses the camera, but submitting the report currently sends a hardcoded payload. Real photo uploading is pending.

---

## 🗺️ Roadmap: Moving Forward

To fully satisfy the original hackathon requirements and build a market-ready SaaS, our next milestones include:

1. **Genuine Photo Uploads & Proofs:** Fix the "Site Visit" mobile flow to upload actual captured photos (via AWS S3 or Local Storage) and attach genuine notes instead of the current hardcoded API payload.
2. **Offline Mode & Background Sync:** Implement Service Workers or IndexedDB caching to allow field agents to punch in, punch out, and complete tasks in zero-network areas, automatically syncing the data when the connection returns.
3. **Battery-Friendly Background Pings:** Optimize the mobile web app to stream background GPS pings every 3-5 minutes without draining device batteries.

---

## 🛠️ Technology Stack

*   **Frontend:** React 19, Vite, Tailwind CSS, Radix UI, shadcn/ui, React Leaflet (Maps)
*   **Backend:** Node.js, Express, Passport.js (Authentication), WebSockets
*   **Database:** PostgreSQL, Drizzle ORM
*   **Shared:** Zod for schema validation

## 🚀 Getting Started

1.  Clone the repository:
    ```bash
    cd force-tracker
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3. Configure your `.env` file with your `DATABASE_URL` and `SESSION_SECRET`.
4. Push the schema to your database:
    ```bash
    npm run db:push
    ```
5.  Start the development server:
    ```bash
    npm run dev
    ```
    
The frontend will be accessible at `http://localhost:5000`.
