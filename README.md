# 🩺 Medscope — Africa-Focused Epidemic Simulation & AI-Powered Health Response System

**Medscope** is a decentralized outbreak simulation and public health coordination platform tailored for **African nations**. By combining **CrewAI’s autonomous agents** with **Masumi’s Cardano-powered blockchain** identity and funding system, Medscope enables governments, NGOs, and hospitals to simulate epidemics, coordinate responses, and transparently manage crisis funding.

🏆 Built for the **African Blockchain Championship 2025**, Medscope is aligned with **SDG 3 (Good Health and Well-being)** and aims to bridge the gap between **epidemic forecasting, trust, and action** in the African context.

🔗 **Live Demo**: [medscop.vercel.app](https://medscop.vercel.app)

---

## 🌍 Africa’s Public Health Crisis

Africa faces **over 100+ health emergencies annually**, yet:

- 🔴 Outbreak forecasting systems are either **nonexistent or centralized**
- 🔴 Health financing is **slow, opaque, and corruption-prone**
- 🔴 Decision-making lacks **data and trust accountability**

> **Medscope is built to address this — through simulation, AI coordination, and blockchain verification.**

---

## 💡 Our Solution

A full-stack public health intelligence tool that enables:

- 🧪 Disease simulation with real-time data inputs
- 🧠 Autonomous multi-agent AI strategy
- 💳 Blockchain-based outbreak funding transparency
- 📊 Dashboard-driven role-based response coordination

---
## 🖼️ Screenshots

![Landing](public/landing-page.png)
![Signup](public/4.png)
![Dashboard](public/5.png)

---

## 🧠 How It Works

### 1️⃣ Epidemic Simulation  
Select from preloaded diseases (COVID-19, Cholera, Ebola) and control variables:

- Transmission rate  
- Population density  
- Vaccination %  
- Government response delay  

🎥 Outputs: Spread curves, mortality rates, hospitalization needs.

### 2️⃣ AI Crew Coordination (via CrewAI)  
Each simulation creates a smart agent crew:

| Agent            | Description                                                |
| ---------------- | ---------------------------------------------------------- |
| Policy Advisor   | Recommends NPIs (lockdowns, vax, isolation)                |
| Logistics Agent  | Allocates hospital beds, oxygen, medics                    |
| Government Agent | Simulates funding delays, poor planning                    |
| Sentiment Agent  | Tracks public reaction to decisions (simulated sentiment)  |
![AI Agents](public/agent.png)
![Crew flow](public/6.png)
Agents are defined in `agents.yaml`, coordinated in `crew.py`, and leverage `LangChain + Gemini`.

### 3️⃣ Blockchain Funding via Masumi  
All financial activity during outbreak simulation is routed via **Masumi testnet wallets**:

- 🎓 Agent wallet identity is created via **Masumi DID**
- 💸 Simulate funding transfers (in test ADA)
- 📝 Log all agent actions immutably
- 📊 Use `/admin` dashboard to monitor funds and impact

---

## 🧪 Key Features

| Feature                    | Description                                                      |
| ------------------------- | ---------------------------------------------------------------- |
| 🧬 Epidemic Simulator      | Model disease spread over time                                   |
| 🧠 Multi-Agent Intelligence| Autonomous AI teams plan, debate, and act                        |
| 🏦 Blockchain Funding Flow | Masumi-backed wallet simulations and DID-based logging           |
| 📈 Dashboards              | Role-specific UI for hospital, NGO, government, and researchers  |
| 🌍 Open Data               | WHO, CDC, NHS, India APIs for authentic scenario generation      |

---

## 🧩 Required `.env` Keys

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/medscope?schema=public"

# Supabase
NEXT_PUBLIC_SUPABASE_URL=""
NEXT_PUBLIC_SUPABASE_ANON_KEY=""

# Blockchain / Masumi
ENCRYPTION_KEY="32_character_secure_key"
ADMIN_KEY="admin_secure_key"
BLOCKFROST_API_KEY_PREPROD="your_blockfrost_api_key"

# Wallet Seeds (DO NOT COMMIT IN PROD)
PURCHASE_WALLET_MNEMONIC=""
SELLING_WALLET_MNEMONIC=""
COLLECTION_WALLET_ADDRESS=""
````

---

## ⚙️ Tech Stack

| Layer            | Technology                                        |
| ---------------- | ------------------------------------------------- |
| Frontend         | Next.js, TailwindCSS, TypeScript                  |
| Backend          | Node.js, Express, Prisma, PostgreSQL              |
| Blockchain       | Masumi (Cardano testnet), Blockfrost SDK          |
| AI Orchestration | CrewAI, Gemini, LangChain, agents.yaml/tasks.yaml |
| Data Layer       | WHO, CDC, NHS UK, Indian Govt. APIs               |
| Auth             | Supabase                                          |
| Visualization    | Chart.js, Leaflet.js, React Flow                  |

---

## 🚀 Local Development Setup

### 1. Clone the Repo

```bash
git clone https://github.com/yab-g4u/medscop.git
cd medscop
```

### 2. Set Up Environment

```bash
cp .env.example .env
```

Fill in the values listed above.

### 3. Install Dependencies & Prepare DB

```bash
npm install
cd frontend
npm install
cd ..
npx prisma db push
```

### 4. Run the App

```bash
npm run dev
```

---

## 🧠 AI Crew Use Case Scenarios

* "Policy Agent" decides to recommend lockdown only after seeing mortality > 20%
* "Logistics Agent" reroutes oxygen tanks from Region B to Region A based on demand
* "Sentiment Agent" warns of civil unrest risk if vax policy is extended
* "Government Agent" delays response by 2 weeks → triggers higher case peak

![AI Agents](public/agent.png)

---

## 💸 Masumi Blockchain Integration

Simulated wallets include:

* 🏛️ **Government Agent Wallet**
* 🤝 **NGO Coordination Wallet**
* 🏥 **Hospital Admin Wallet**
* 🎓 **Researcher Analytics Wallet**

All transactions are tracked, confirmed (simulated via Blockfrost), and linked to agent actions.

> Actions like `registerAgent()`, `transferFunds()`, `logDecision()` are routed via `/lib/masumi/client.ts`

---


## 📡 Data Sources Used

* **WHO Epidemic Reports**
* **CDC Cholera & FluView APIs**
* **India COVID Hospital Open Data (data.gov.in)**
* **NHS UK Emergency Bed Stats API**

---

## 🔐 Security & Ethics

* 🔐 `.env` stores all secrets — never hardcoded
* ✅ No real ADA or private keys are used — only **preprod**
* 🔎 Transparent logging for demo actions
* 🔄 All actions are sandboxed in simulation logic

---

## 🧭 Roadmap

| Feature                              | Status        |
| ------------------------------------ | ------------- |
| CrewAI YAML Agent Architecture       | ✅ Done        |
| Masumi Funding & Logging Integration | ✅ Done        |
| Role-Based Dashboards                | ✅ Done        |
| CSV Upload for Prediction            | ⏳ In Progress |
| Real-Time AI Role Negotiation        | ⏳ Next Sprint |
| PDF Export for Simulation Reports    | ⏳ Planned     |

---

## 🧑🏾‍💻 Team Medscope — Built By Africans, For Africa

| Name           | Role                |
| -------------- | ------------------- |
| Yeabsera Sisay | Product & Code Lead |

---

> **Medscope** empowers African nations to prepare smarter, respond faster, and fund better — using intelligence and transparency, not chaos.
>
> AI meets blockchain, for public health that works. 🌍🧠💳




