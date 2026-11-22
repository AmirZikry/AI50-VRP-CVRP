# 🚛 AI50 – CVRP Solver 🚚

A web app to solve and compare the **Capacitated Vehicle Routing Problem (CVRP)** on the XML100 benchmark instances.
Pick an instance, a solver (heuristic, metaheuristic or AI Approach) and an optional optimizer, run it, and compare cost, gap to the best known solution, number of vehicles and runtime.

- **Backend:** Python 3.11+ · FastAPI · vrplib · numpy
- **Frontend:** React 19 · TypeScript · Vite · Tailwind 4 · shadcn/ui · Zustand

> Course project, UTBM – AI50.

---

## 1. Configuration

Create two small `.env` files. They are **not committed** (listed in `.gitignore`).

**`WebApp/backend/.env`**: which web page address the API accepts (CORS):

```
REACT_APP_URL=http://localhost:5173
```

If this file is missing, the API can answer `Internal Server Error` on every request.
The address must match exactly what you see in the browser bar: `localhost` and `127.0.0.1` are different origins.

**`WebApp/frontend/.env`** (optional): where the API lives. Defaults to `http://localhost:8000`.

```
VITE_API_URL=http://localhost:8000
```

Vite only exposes variables that start with `VITE_`. After editing this file, restart `npm run dev`.
---

## 2. Quick start

You need **two terminals**: one for the API, one for the web page.

### Requirements

| Tool | Version |
|---|---|
| Python | 3.11 or newer |
| Node.js | 20 or newer (22 recommended) |
| Git | any recent |

### Get the code

```bash
git clone https://github.com/AmirZikry/AI50-VRP-CVRP.git
cd AI50-VRP-CVRP
git checkout dev
```

### Terminal 1: backend (API on port 8000)

Run every command **from the repository root** (the folder that contains `main.py`).

```bash
python -m venv .venv

# macOS / Linux
source .venv/bin/activate
# Windows (PowerShell)
.venv\Scripts\Activate.ps1

pip install -r requirements.txt

cd WebApp/backend
fastapi dev main.py 
```

Check it works: open <http://127.0.0.1:8000/options/>. You should see JSON with `instances`, `solvers` and `optimizers`.
Interactive API docs: <http://127.0.0.1:8000/docs>.

### Terminal 2: frontend (web page on port 5173)

```bash
cd WebApp/frontend
npm install
npm run dev
```

Open <http://localhost:5173>.

---

Next part coming soon ....
