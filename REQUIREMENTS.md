
# FitCRM – Assignment #2 Requirements

## Project Overview
**Project Name:** FitCRM – Simple Client Manager for a Fitness Program  
**Project Type:** Frontend-only (HTML, CSS, JavaScript)  
**Target Users:** Fitness instructors, personal trainers, small gym owners  
**Purpose:** Build a lightweight CRM web app to manage client information and track fitness goals.

---

## Functional Requirements

### Page 1: New Client Form
- Form fields:
  - Name (text) **required**
  - Email (email) **required**
  - Phone (tel) **required**
  - Fitness Goal (text or dropdown) **required**
  - Membership Start Date (date) **required**
  - Training History (textarea, optional)
- Action:
  - **Add Client** button saves client data to `localStorage`.
  - Data persists across page refreshes.

### Page 2: Client List View
- Display all clients stored in `localStorage`.
- Actions for each client:
  - **Edit:** Opens edit form populated with existing data; saving updates `localStorage`.
  - **Delete:** Removes client after confirmation.
  - **View:** Navigates to Client View page with selected client.
- **Search:** Filter clients by name.

### Page 3: Client View
- Display client details:
  - Name
  - Email
  - Phone
  - Fitness Goal
  - Membership Start Date
  - Training History
- **Exercises for Next Session:**
  - Fetch and display **5 exercises** from an online workout REST API (e.g., Wger).
  - If API fails, show a reasonable fallback list.

---

## Non-Functional Requirements
- **Data Persistence:** Use `localStorage`; data must persist on refresh.
- **Responsive Design:** Works on desktop and mobile using Flexbox/Grid; media queries optional.
- **Form Validation:** Required fields, email format validation.
- **Code Quality:** Clean, organized, commented code.

---

## Suggested File Structure
```
fitcrm/
├── index.html
├── clients.html
├── client.html
├── css/
│   └── styles.css
├── js/
│   └── main.js
├── README.md
```

---

## Deployment Requirements
- App must be accessible online without downloading code.
- Deploy using **GitHub Pages** or **Netlify**.
- Provide:
  - Public GitHub repository link.
  - Live deployed app link.

---

## Submission Checklist
- [ ] Public GitHub repository
- [ ] Clean file structure and readable code
- [ ] Live deployment link works
- [ ] README includes description, tech stack, and deployment method

---

## Grading Criteria
- **Correctness & Functionality:** 30 pts
- **UI/UX:** 20 pts
- **Code Quality:** 10 pts
- **Deployment:** 10 pts
