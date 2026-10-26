# 🌿 EcoScore AI — Carbon-Risk & Supply Chain Intelligence

> **Turning Hidden Environmental & Supply Chain Risks Into Actionable Financial Intelligence**  
> *Built for the Hindsight Hackathon*

---

## 🚀 Overview
**EcoScore AI** is an enterprise-grade supply chain ESG auditor that translates emissions data, utility bills, and compliance records into actionable financial risk and credit underwriting metrics. 

Unlike traditional static dashboards that evaluate supplier reports in isolation, EcoScore AI integrates the official **Hindsight SDK** (`hindsight-client`) to give the AI agent **persistent multi-turn memory**. The agent remembers past audit failures, unverified utility data, and carbon spikes across multiple quarters, automatically applying risk score penalties for repeat non-compliance.

---

## 🧠 How Hindsight Memory is Integrated
EcoScore AI relies on Hindsight's core memory loops:
1. **Memory Recall (`client.recall()`):** Before evaluating a new supplier submission, the backend queries the Hindsight memory bank to retrieve historical compliance logs and past infractions.
2. **Evaluate & Penalize:** If a supplier repeats a past failure (e.g., missing Scope 2 verification), the system automatically penalizes their EcoScore rating.
3. **Memory Retention (`client.retain()`):** Once the audit is processed, the outcome is pushed back into Hindsight so future quarterly audits automatically inherit this historical context.

---

## 🎬 2-Minute Demo Walkthrough (What to Look For)

1. **📊 Portfolio Heatmap:** Overview of supplier portfolio Scope 1, 2, and 3 emissions alongside high-level risk badges.
2. **📁 Document AI Auditor:** Upload or input supplier audit data (e.g., *Supplier C*). Click **"Run Audit & Retain Hindsight Memory"** to see live memory recall penalize repeat offenders by -30 pts.
3. **💻 Live SDK Inspector:** Real-time log console showing active `client.recall()` and `client.retain()` execution payloads.
4. **🧠 Hindsight Memory Console:** Direct query interface to test memory recall across past quarters.
5. **🏦 FinTech Underwriting:** Interactive slider calculating bank credit default provisions based on CBAM carbon tax exposure ($/tCO₂e).

---

## 🛠️ Tech Stack
* **Frontend:** HTML5, Tailwind CSS, JavaScript (Vanilla), Chart.js
* **Backend:** Python, FastAPI, Uvicorn
* **Memory Engine:** Hindsight Vector SDK (`hindsight-client`)

---

## ⚙️ Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/your-username/ecoscore-ai.git](https://github.com/your-username/ecoscore-ai.git)
   cd ecoscore-ai