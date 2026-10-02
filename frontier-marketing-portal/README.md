# Frontier Marketing Request Portal

A working React + TypeScript MVP for Frontier Bank's marketing request workflow. It runs with local mock data and localStorage so the employee portal and private marketing dashboard can be reviewed before connecting Entra ID, Azure SQL, file storage, and email automation.

## Run locally

1. Install Node.js 20+.
2. Copy `.env.example` to `.env` and replace the three store URLs.
3. Run `npm install`.
4. Run `npm run dev`.
5. Open the local URL shown by Vite.

## Demo access

Use the role switch in the header to preview Employee and Marketing experiences. This is for prototyping only. Production access must use Microsoft Entra ID and server-side authorization.

## Included

- 12 request tiles
- 9 internal request forms
- 3 configurable external links
- Local request-number generation for demo use
- My Requests page
- Marketing summary dashboard
- Standard and Moody Center Kanban boards
- Status updates and submitter-facing notes
- Browser-persisted mock data

## Production connection points

Replace `src/services/store.ts` with API calls. Request numbers, permissions, email delivery, attachments, auditing, and status transitions must be enforced by the server in production.
