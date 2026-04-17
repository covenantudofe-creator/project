# Backend Profiles API

A simple RESTful API that generates user profiles using external data sources (gender, age, nationality) and stores them in an in-memory database. Built with Node.js and Express.


---

## 📦 Features

- Create user profile with name
- Fetch all profiles
- Fetch single profile by ID
- Delete profile by ID
- Integrates external APIs:
  - Gender prediction (genderize.io)
  - Age prediction (agify.io)
  - Nationality prediction (nationalize.io)
- Clean JSON responses
- Fully RESTful structure

---

## 🛠️ Tech Stack

- Node.js
- Express.js
- Axios
- UUID
- In-memory database (no external DB required)

---

## 📁 Project Structure
project/
│
├── controllers/
│ └── profileController.js
│
├── routes/
│ └── profiles.js
│
├── database.js
├── server.js
├── test-api.js
└── package.json


---


---

## 🔗 API Endpoints

### 1. Root
/GET


Response:
```json
{
  "message": "API is running..."
}

2. Create Profile

Request Body:
POST /api/profiles

{
  "name": "ella"
}
Request Body:
{
  "status": "success",
  "data": {
    "id": "uuid",
    "name": "ella",
    "gender": "female",
    "age": 53,
    "country_id": "CM"
  }
}

3. Get All Profiles
GET /api/profiles/:id

4. Get Profile by ID
GET /api/profiles/:id

5. Delete Profile
DELETE /api/profiles/:id

Testing the API

A test script is included:

node test-api.js

It automatically:

Creates a profile
Fetches all profiles
Fetches single profile
Deletes profile

⚙️ Setup Instructions

1. Clone repository
git clone https://github.com/your-repo-url.git

git clone https://github.com/your-repo-url.git

3. Start server
npm run dev

Server runs on:

http://localhost:3000
🌍 Environment Notes

No .env file required for basic setup.

Important Notes
This project uses an in-memory database (data resets on restart)
External APIs are required for profile generation
Designed for learning and API integration practice
👨‍💻 Author

Built by: Godscovenant Patrick Udofe
