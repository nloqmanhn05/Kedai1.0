# Kedai System Architecture & Data Flow

This diagram illustrates the high-level architecture of the Kedai business management system, detailing the interactions between the client-side application, custom React hooks/providers, Firebase backend, and the Google Gemini AI engine.

```mermaid
graph TB
    %% Styling Classes
    classDef frontend fill:#e7deff,stroke:#4c22bd,stroke-width:2px,color:#1e0061
    classDef logic fill:#e0f2f1,stroke:#00695c,stroke-width:2px,color:#004d40
    classDef backend fill:#fff7e6,stroke:#ffa000,stroke-width:2px,color:#663c00
    classDef ai fill:#e1f5fe,stroke:#0288d1,stroke-width:2px,color:#01579b
    classDef database fill:#f1f8e9,stroke:#558b2f,stroke-width:2px,color:#1b5e20

    subgraph Client_Presentation [Client / UI Presentation Layer]
        direction TB
        LANDING_UI[Landing Page / Brand Showcase]
        AUTH_UI[SignIn & SignUp Modules]
        DASH_UI[Dashboard Module<br/>Real-time Stats & Overview]
        POS_UI[POS / Menu & Checkout Checkout Module]
        LEDGER_UI[Ledger / Expense Manager & Reports]
        STOCK_UI[Stock Routing Interface]
        STOCK_ADMIN[Admin Stock View<br/>Full Inventory & Seed CRUD]
        STOCK_STAFF[Staff Stock View<br/>Quick Restock & Adjustment]
        STAFF_UI[Staff Directory & Management]
        TX_HIST_UI[Transaction History logs]
        SETT_UI[Settings & Business Configuration]
        AI_UI[Akira AI Assistant Chat Interface]
    end

    subgraph Client_State_Logic [Client-Side State & Firestore Hooks Layer]
        direction TB
        AUTH_CTX[AuthContext Provider<br/>Global Firebase Auth State]
        
        HOOK_STOCK[useStockFirestore<br/>Real-time stock subscription]
        HOOK_EXP[useExpensesFirestore<br/>Real-time expense operations]
        HOOK_TX[useTransactionsFirestore<br/>Real-time transaction operations]
        HOOK_CHAT[useChatSessionsFirestore<br/>Real-time AI Chat states]
        
        FIREBASE_CONFIG[Firebase SDK Init / firebase.ts]
    end

    subgraph Backend_Processing [Backend & Authentication Layer]
        direction TB
        FB_AUTH[Firebase Auth Service]
        SEC_RULES[Firestore Security Rules]
    end

    subgraph AI_Intelligence [AI Layer]
        direction TB
        GEMINI_API[Google Cloud Vertex AI<br/>Gemini 2.5 Flash]
        NLP_PROC[Natural Language Chat & Inquiries]
        FIN_INSIGHTS[Financial Insights & Auditing Engine]
    end

    subgraph Persistence_Layer [Database & Storage Layer]
        direction TB
        FS_DB[(Firebase Firestore)]
        COLL_STOCKS[stocks collection]
        COLL_TXS[transactions collection]
        COLL_EXPS[expenses collection]
        COLL_CHATS[chats collection]
        COLL_META[metadata/stock_status doc]
    end

    %% UI to State Connections
    AUTH_UI --> AUTH_CTX
    STOCK_UI --> STOCK_ADMIN & STOCK_STAFF
    STOCK_ADMIN & STOCK_STAFF --> HOOK_STOCK
    LEDGER_UI --> HOOK_EXP
    POS_UI & TX_HIST_UI --> HOOK_TX
    AI_UI --> HOOK_CHAT

    %% State Layer connections
    AUTH_CTX -- "Validates User Sessions" --> FB_AUTH
    HOOK_STOCK & HOOK_EXP & HOOK_TX & HOOK_CHAT --> FIREBASE_CONFIG
    FIREBASE_CONFIG -- "Authenticated Queries" --> SEC_RULES
    SEC_RULES -- "Enforced Security" --> FS_DB

    %% Database Internal Links
    FS_DB --- COLL_STOCKS
    FS_DB --- COLL_TXS
    FS_DB --- COLL_EXPS
    FS_DB --- COLL_CHATS
    FS_DB --- COLL_META

    %% AI Ingestion & Feedback
    AI_UI -- "Sends prompt + context" --> GEMINI_API
    GEMINI_API --> NLP_PROC & FIN_INSIGHTS
    HOOK_TX & HOOK_EXP --> AI_UI
    FIN_INSIGHTS -- "Responds with recommendations" --> AI_UI

    %% Apply Styling
    class LANDING_UI,AUTH_UI,DASH_UI,POS_UI,LEDGER_UI,STOCK_UI,STOCK_ADMIN,STOCK_STAFF,STAFF_UI,TX_HIST_UI,SETT_UI,AI_UI frontend
    class AUTH_CTX,HOOK_STOCK,HOOK_EXP,HOOK_TX,HOOK_CHAT,FIREBASE_CONFIG logic
    class FB_AUTH,SEC_RULES backend
    class GEMINI_API,NLP_PROC,FIN_INSIGHTS ai
    class FS_DB,COLL_STOCKS,COLL_TXS,COLL_EXPS,COLL_CHATS,COLL_META database
```

---

## Component Analysis & Data Flows

### 1. Unified Authentication Flow
*   The `AuthContext` component hooks into Firebase's `onAuthStateChanged` handler, wrapping the entire app in `App.tsx`.
*   Restricts routing so unauthenticated users land on `/` (Landing) or `/login` / `/register`.
*   Passes active session payloads to secure Firestore hooks.

### 2. Double-Branched Inventory (Stock) Flow
*   `Stock.tsx` acts as a role-based router interface.
*   **Administrators** are presented with `AdminStockView.tsx`, enabling deep item editing, removal, and seed-loading operations.
*   **Staff members** are restricted to `StaffStockView.tsx` which optimizes workflow speed with simplified adjustment controls (quick restocks, one-tap increments).
*   Both modules consume real-time reactive streams provided by `useStockFirestore.ts`, reading from the `'stocks'` collection and publishing updates directly to the `'metadata/stock_status'` document.

### 3. Point-of-Sale (POS) & General Ledger Integration
*   The `Menu.tsx` component houses local checkout states, communicating transactions to `useTransactionsFirestore.ts`.
*   Every processed checkout triggers real-time writes into Firestore's `'transactions'` collection.
*   Simultaneously, expense registrations and reports in `Ledger.tsx` write into the `'expenses'` collection.
*   These collections directly feed real-time aggregated metrics to `Dashboard.tsx` dynamically.

### 4. Natural Language Intelligence Engine
*   `AIAssistant.tsx` (the Akira AI companion) coordinates user inputs with Google Cloud Vertex AI endpoints (or Google Gen AI SDK) using the `@google/genai` interface.
*   Provides contextual inputs by fetching current financial structures (such as transactions and expenses streams) to allow real-time calculations, anomalies detection, and smart balance tracking.
*   Historical logs of chats are safely archived under the `'chats'` collection (`useChatSessionsFirestore.ts`) per logged-in user.