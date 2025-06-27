# 🩺 Medscope — Simulated Outbreak Response & AI-Driven Public Health System

**Medscope** is an AI-powered simulation platform designed to **analyze and respond to real-world disease outbreaks**. By integrating decentralized protocols from **Masumi** and intelligent agents from **CrewAI**, Medscope enables public health institutions, NGOs, and researchers to **simulate epidemic scenarios**, **predict disease transmission**, and **optimize resource allocation** — especially for underserved communities.

Built for the **African Blockchain Championship 2025**, Medscope aligns with **SDG 3 (Good Health and Well-being)** by offering a **data-driven, real-time, and decentralized framework** for modern public health preparedness.

🔗 **Live Demo**: [medscop.vercel.app](https://medscop.vercel.app/)

---

## 🌍 Problem We’re Solving

Many health systems remain **reactive, underfunded**, and **unprepared** for outbreaks. Medscope tackles this by offering:

* 📊 **Simulated disease outbreak modeling**
* 🧠 **AI agents for strategic planning**
* 💸 **Decentralized funding simulations via Masumi**
* 🌐 **Global transparency and open access to insights**

---

## 🚀 Key Features

### 🧪 Epidemic Simulation Engine

* Simulate diseases like COVID-19, Ebola, and Cholera
* Adjust parameters: transmission rate, population, vaccination, response delay
* Visualize spread with interactive timelines and maps

### 🧠 AI Multi-Agent System (CrewAI)

* **Medical Policy Advisor** – Recommends public health interventions
* **Logistics Agent** – Allocates resources (beds, staff, medicine)
* **Public Sentiment Monitor** – Tracks public reaction (simulated)
* **Government Simulator** – Models impact of policy delays

### 💳 Masumi-Powered Funding

* Simulate financial flows using **preprod ADA**
* Use cases:

  * Government/NGO simulation wallets
  * Medical personnel payment simulation
  * Track funding across agent

### 📚 Real-World Simulation Datasets

* Integrated from:

  * WHO Epidemic Reports
  * CDC Influenza Dataset
  * India COVID Resources (data.gov.in)
  * NHS medical response APIs

---

## ⚙️ Tech Stack

| Layer      | Tools                                   |
| ---------- | --------------------------------------- |
| Frontend   | Next.js, TailwindCSS, TypeScript        |
| Backend    | Node.js, Express, PostgreSQL, Prisma    |
| AI Agents  | CrewAI, Gemini, LangChain               |
| Blockchain | Masumi (Cardano-based testnet)          |
| Data       | WHO, CDC, NHS, India Gov                |
| Auth       | Supabase                                |
| Visuals    | Leaflet.js (Maps), Chart.js, React Flow |

---

Here's a sneakpeak to show you:

![Screenshot of the project's main interface](public/landing-page.png "Main Project View")
![Screenshot of the project's main interface](public/landing2.png "Main Project View")
![Screenshot of the project's main interface](public/landing3.png "Main Project View")

## 🧪 Getting Started (Local Dev Setup)

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yab-g4u/medscope.git
cd medscope
```

### 2️⃣ Setup Environment Variables

Create a `.env` file and add:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/medscope?schema=public"

# Masumi + Blockchain
ENCRYPTION_KEY="32_character_secure_key"
ADMIN_KEY="admin_secure_key"
BLOCKFROST_API_KEY_PREPROD="your_blockfrost_api_key"
PURCHASE_WALLET_MNEMONIC="wallet seed"
SELLING_WALLET_MNEMONIC="wallet seed"
COLLECTION_WALLET_ADDRESS=""
```

### 3️⃣ Install Dependencies & Setup DB

```bash
npm install
cd frontend
npm install
cd ..
npx prisma db push
```

### 4️⃣ Start Development Server

```bash
npm run dev
```

---

## 💡 Simulating Outbreaks

Visit `http://localhost:3000/simulation`

* Choose a disease (e.g., Cholera)
* Adjust:

  * Population size
  * Vaccination rate
  * Transmission rate
  * Government response delay
* View:

  * Epidemic curves
  * Mortality rate
  * Resource usage

---

## 🧠 AI Agent Use Cases

| Agent            | Role                                                              |
| ---------------- | ----------------------------------------------------------------- |
| Policy Advisor   | Predicts outcomes of interventions (lockdowns, vaccination, etc.) |
| Logistics        | Allocates medical resources during simulation                     |
| Government       | Simulates delay and decision impact on outbreak curves            |
| Public Sentiment | Analyzes public trust/sentiment from social data                  |

All agents are autonomous and coordinated through CrewAI's multi-agent architecture.

---

## 💸 Masumi Integration

* Simulate outbreak funding using **test ADA**
* Wallets:

  * Purchasing (NGO/government)
  * Selling (health agents)
  * Collection (aid pool)
* Dashboard: `/admin` for tracking transactions and wallets

---

## 📊 Real-World Datasets Used

* WHO Epidemic Reports
* CDC Flu Surveillance Data
* India COVID Hospital Resources (data.gov.in)
* NHS API for hospital & response stats

---

## 🔐 Security Notes

* Store wallet seed phrases in `.env` (do **not** commit!)
* All blockchain transactions run on **Masumi Preprod Testnet**

---

## ✨ Roadmap

* [x] CrewAI agent system (MVP)
* [x] Masumi ADA simulation & payments
* [ ] Exportable PDF reports
* [ ] Mobile-friendly dashboard UI
* [ ] AI-based outbreak prediction from uploaded CSVs

---

## 🤝 Team Medscope

| Name     | Role                |
| -------- | ------------------- |
| Yeabsera | Project Manager     |

---

> Designed to empower **global collaboration** in epidemic preparedness and sustainable public health innovation. 🌐
 
