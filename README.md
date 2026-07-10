# Force Tracker

Force Tracker is a field employee management and tracking prototype. **Currently, the application is in an early MVP / frontend mockup stage.** While the user interfaces are well-designed and feature-rich, most of the data is mocked and not yet fully connected to a persistent backend.

## ⚠️ Current Implementation Status

Here is the actual working status of the main features:

*   **Time & Attendance (Timesheets):**             
    *   *Status:* **Mocked**
    *   *Details:* The UI displays timesheet records, but the data is completely hardcoded on the frontend. Features like exporting to PDF/Excel are UI-only buttons and not yet implemented.
*   **Site Visits Management:** 
    *   *Status:* **Partially Working**
    *   *Details:* The mobile interface allows accessing the camera and capturing photos. However, when submitting the report, it currently sends a hardcoded payload to the backend API, ignoring the user's notes and the actual captured image.
*   **Admin Task Management:** 
    *   *Status:* **Mocked**
    *   *Details:* The dashboard displays a list of tasks, but this data comes from static mock files. Marking tasks as complete or deleting them only updates the local browser state and does not persist to any backend. "Add Task" is currently a non-functional button.
*   **Admin Live Map Tracking:** 
    *   *Status:* **Mocked**
    *   *Details:* The real-time tracking map uses Leaflet, but employee locations are hardcoded with simulated "jitter" to look like movement. No real GPS data is being tracked or fetched from a server.
*   **Database & Storage:**
    *   *Status:* **In-Memory**
    *   *Details:* Although PostgreSQL and Drizzle ORM are set up in the codebase dependencies and schema files, the Express backend currently uses a temporary in-memory map (`MemStorage`) to store data. Any data sent to the backend will be lost when the server restarts.

## 🛠️ Technology Stack

*   **Frontend:** React 19, Vite, Tailwind CSS, Radix UI, shadcn/ui, Framer Motion, React Leaflet (Maps)
*   **Backend:** Node.js, Express (Currently using an in-memory storage implementation)
*   **Configured (but unused) DB:** PostgreSQL, Drizzle ORM
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
