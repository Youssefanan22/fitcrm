# FitCRM (Assignment 2)

FitCRM is a lightweight frontend-only CRM webapp for fitness professionals to manage clients, track goals, and view suggested exercises.

## Tech Stack
- HTML, CSS (Flexbox/Grid)
- JavaScript (DOM + localStorage)

## Features
- Add client (saved in localStorage)
- Client list with:
  - View (opens client details page)
  - Edit (repopulates form + saves updates)
  - Delete (with confirmation)
  - Search (by name)
- Client view shows details + 5 suggested exercises fetched from Wger REST API

## Data Persistence
Client data is stored in `localStorage` under the key `fitcrm_clients` and persists across refreshes.

## Run Locally
Open `index.html` in your browser.

## Deployment
Deploy on GitHub Pages or Netlify.
- Live link: (paste here)
- Repo link: (paste here)
