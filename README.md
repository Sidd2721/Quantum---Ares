# QUANTUM-ARES
**Architecture Security Validation Platform**

*"Prevent breaches before deployment by validating infrastructure architecture."*

---

## 2. PROJECT OVERVIEW

QUANTUM-ARES is an advanced cybersecurity infrastructure validation platform that analyzes infrastructure configurations before deployment.

The platform transforms infrastructure files into a unified **graph model**, runs them through specialized **security engines**, calculates a comprehensive **Security Index score**, and generates an actionable, verifiable **security report**.

### Risks Detected
- 🔓 **Hidden attack paths**
- 🔑 **Weak encryption algorithms**
- 🛡️ **Zero-trust architecture violations**
- 📦 **Supply-chain vulnerabilities**
- ⚛️ **Quantum cryptography risks**

---

## 3. SYSTEM ARCHITECTURE

QUANTUM-ARES operates across multiple layers, ensuring modular processing and scalable security validation.

### Frontend
- **React 18**
- **Vite**
- **TailwindCSS**
- **Cytoscape.js** (for graph visualization)

### Backend
- **FastAPI** (High-performance API layer)
- **Uvicorn** (ASGI server)
- **JWT (python-jose)** (Authentication)
- **Argon2** (Password hashing)

### Processing Layer
- **Celery Workers** (Async job processing)
- **Redis Task Queue** (Message broker)

### Core Engines
- **Graph Engine**
- **Zero-Trust Engine**
- **Quantum Risk Engine**
- **Attack Path Engine**
- **Supply Chain Engine**

### AI Advisory
- **Sentence-BERT** (sentence-transformers)
- **ChromaDB** (Semantic RAG Search)

### Database & Caching
- **PostgreSQL** (Persistent relational storage)
- **Redis Cache** (In-memory caching and WebSockets)

### Blockchain Anchor
- **web3.py** (Smart contract interaction)
- **Polygon Amoy** (Report verification anchoring)

---

## 4. ARCHITECTURE DIAGRAM

<!-- [INSERT SYSTEM ARCHITECTURE DIAGRAM HERE] -->

*Diagram Map: Upload IaC → FastAPI API → Celery parallel engines → Security Index → Report Generation → Blockchain Anchor.*

---

## 5. CORE ENGINES

### Graph Engine
Converts raw infrastructure configurations into a unified, queryable mathematical graph model.

### Zero-Trust Engine
Evaluates the architecture topology against strict zero-trust principles and NIST 800-207 guidelines.

### Quantum Risk Engine
Calculates the Quantum Vulnerability Index (QVI) score and estimates the "Harvest Now, Decrypt Later" (HNDL) exposure timeline.

### Attack Path Engine
Discovers and highlights potential attacker lateral movement routes from public ingress nodes to sensitive internal systems.

### Supply Chain Engine
Builds an SBOM (Software Bill of Materials) and cross-references dependencies against known vulnerability databases.

---

## 6. TECHNOLOGY STACK

**Frontend**
- React 18, TypeScript, TailwindCSS, Cytoscape.js

**Backend**
- FastAPI, Uvicorn, JWT, Argon2

**AI & Analytics**
- sentence-transformers, chromadb

**Infrastructure**
- Docker, Redis, PostgreSQL

**Deployment Target**
- Render Web Services

---

## 7. LOCAL DEVELOPMENT SETUP

To run the project locally on your machine:

### Backend

```bash
# Create and activate virtual environment
python -m venv venv

# Windows Prompt:
venv\Scripts\activate
# Linux/macOS:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start backend server
uvicorn saas_platform.backend.main:app --host 0.0.0.0 --port 8000 --reload
```

### Frontend

Open a new terminal session.

```bash
# Navigate to frontend (or stay in root if your package.json is mapped there)
cd frontend 

# Install dependencies
npm install

# Start development server
npm run dev
```

---

## 8. ENVIRONMENT VARIABLES

Create local `.env` files for both context layers.

### Backend Context
```ini
PYTHON_VERSION=3.11.9
SECRET_KEY=generate_secure_key
CORS_ORIGINS=http://localhost:5173
```

### Frontend Context
```ini
NODE_VERSION=20
VITE_API_URL=http://localhost:8000/api
```

---

## 9. RENDER DEPLOYMENT

The project is natively configured for Render deployment as two web services.

### Backend Service (quantum-ares-backend)
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn saas_platform.backend.main:app --host 0.0.0.0 --port $PORT`

### Frontend Service (quantum-ares-frontend)
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npx serve -s dist -l $PORT`

---

## 10. DIAGRAM PLACEHOLDERS

<!-- INSERT SECURITY ENGINE PIPELINE DIAGRAM HERE -->

<!-- INSERT INFRASTRUCTURE GRAPH VISUALIZATION HERE -->

<!-- INSERT SECURITY INDEX DASHBOARD SCREENSHOT HERE -->

---

## 11. TROUBLESHOOTING

### Out of Memory (OOM) Errors
- **Cause**: The `sentence-transformers` library downloads heavy PyTorch models on startup.
- **Fix**: Upgrade the Render plan temporarily, or remove `sentence-transformers` and `chromadb` from `requirements.txt` if ML advisory is not immediately needed.

### Frontend `react/jsx-runtime` Error
- **Cause**: React incorrectly configured as a `peerDependency`.
- **Fix**: Ensure React is listed in standard `dependencies` in `package.json`.

### Backend `jwt` Module Error
- **Cause**: Namespace conflict between `PyJWT` and `python-jose`.
- **Fix**: Remove `PyJWT`. Always use `python-jose` imports consistently across the codebase (`from jose import jwt`).

### CORS Error
- **Cause**: Incorrect `CORS_ORIGINS` value bridging the Frontend to the Backend.
- **Fix**: Set the backend environment variable exactly to the frontend's deployed URL (omit trailing slash).

### Data Resets After Reload
- **Cause**: The current system configuration relies on in-memory dictionary storage (`MOCK_USERS`, `SESSIONS_CACHE`) for the MVP stage.
- **Fix**: This is expected behavior. Implement the PostgreSQL persistence layer for production.

---

## 12. FUTURE IMPROVEMENTS

- **PostgreSQL Persistence**: Wire existing SQLAlchemy schemas to a live database.
- **Real-Time WebSocket Analysis**: Activate Redis Pub/Sub streams for live UI streaming.
- **Advanced AI Advisory**: Expand ChromaDB local RAG pipeline with higher context limits.
- **Enterprise Compliance Frameworks**: Integrate SOC2 and ISO27001 automated compliance checks.

---

## 13. CONTRIBUTING

Contributions to QUANTUM-ARES are highly encouraged. Please review our open issues, ensure local tests pass, maintain type safety across the frontend, and submit detailed pull requests outlining your architecture improvements.

---

## 14. LICENSE

This project is licensed under the MIT License. See the LICENSE file for more details.
