# Backend Wizards - Stage 1 API

A backend system that accepts a name, fetches demographic data from external APIs, classifies the data, stores it in a database, and exposes RESTful endpoints.

---

## 🚀 Features

- Accepts a name and fetches:
  - Gender (Genderize API)
  - Age (Agify API)
  - Nationality (Nationalize API)
- Classifies age group:
  - child (0–12)
  - teenager (13–19)
  - adult (20–59)
  - senior (60+)
- Stores data in SQLite database
- Prevents duplicate profiles
- REST API with filtering support
- Full error handling (502, 400, 404)

---

## 🛠 Tech Stack

- Node.js
- Express.js
- SQLite3
- Axios
- UUID v7
- CORS

---

## 📦 Installation

```bash
npm install