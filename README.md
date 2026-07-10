# Force Tracker

Force Tracker is a field employee management and tracking application. **The application is now a fully functional product connected to a Postgres database.** It includes user authentication, REST APIs for employee management, and real database persistence.

## ⚠️ Current Implementation Status

Here is the actual working status of the main features:

*   **Time & Attendance (Timesheets):**             
    *   *Status:* **Working (UI/DB Connected)**
    *   *Details:* The UI displays timesheet records dynamically fetched from the database. Features like exporting to PDF/Excel are UI-only buttons and not yet implemented.
*   **Site Visits Management:** 
    *   *Status:* **Partially Working**
    *   *Details:* The mobile interface allows accessing the camera and capturing photos. However, when submitting the report, it currently sends a hardcoded payload to the backend API, ignoring the user's notes and the actual captured image.
*   **Admin Task Management:** 
    *   *Status:* **Working**
    *   *Details:* The dashboard displays a list of tasks fetched from the database. Admins can successfully create, edit, mark as complete, or delete tasks.
*   **Admin Live Map Tracking:** 
    *   *Status:* **Mocked**
    *   *Details:* The real-time tracking map uses Leaflet, but employee locations are hardcoded with simulated "jitter" to look like movement. No real GPS data is being tracked or fetched from a server.
*   **Database & Storage:**
    *   *Status:* **PostgreSQL via Drizzle ORM**
    *   *Details:* The Express backend uses PostgreSQL and Drizzle ORM for fully persistent data storage.

## 🛠️ Technology Stack

*   **Frontend:** React 19, Vite, Tailwind CSS, Radix UI, shadcn/ui, Framer Motion, React Leaflet (Maps)
*   **Backend:** Node.js, Express, Passport.js (Authentication)
*   **Database:** PostgreSQL, Drizzle ORM
*   **Shared:** Zod for schema validation

## 📂 Project Structure

```
force-tracker/
├── client/         # React frontend application (Pages, Mock Data)
├── server/         # Express backend application (In-memory storage)
├── shared/         # Shared TypeScript interfaces and Drizzle/Zod schemas
├── script/         # Build and utility scripts
└── ...
```

## 🚀 Getting Started

### Prerequisites

*   Node.js (v20+)

### Installation

1.  Clone the repository and navigate to the project directory:
    ```bash
    cd force-tracker
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start the development server:
    ```bash
    npm run dev
    ```

The application will be running concurrently, with the frontend accessible at `http://localhost:5000`.

*(Note: While `DATABASE_URL` and `npm run db:push` are defined in the project, they are not strictly required to run the current MVP since the backend defaults to in-memory storage).*
