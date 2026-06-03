```mermaid
   
    participant User
    participant UI as Web/Mobile UI
    participant AuthCtx as AuthContext Provider
    participant FirebaseAuth as Firebase Auth Service
    participant FirestoreHook as Firestore Hook Layer
    participant Firestore as Firebase Firestore
    participant Gemini as Vertex AI / Gemini
    participant Notification as Notification Service

    User->>UI: Submit login credentials
    UI->>AuthCtx: Validate credentials
    AuthCtx->>FirebaseAuth: signInWithEmailAndPassword
    FirebaseAuth-->>AuthCtx: Return auth token
    AuthCtx-->>UI: Authenticated session established

    UI->>FirestoreHook: Request initial data
    FirestoreHook->>Firestore: Read collections
    Firestore-->>FirestoreHook: Real-time snapshot
    FirestoreHook-->>UI: Render state

    UI->>FirestoreHook: Submit checkout transaction
    FirestoreHook->>Firestore: Write transaction and update stock
    Firestore-->>FirestoreHook: Commit confirmation
    FirestoreHook-->>UI: Transaction successful

    UI->>Gemini: Send sales context / chat prompt
    Gemini-->>UI: Return AI insights
    UI->>Notification: Request receipt or order alert
    Notification-->>UI: Delivery confirmation

```
