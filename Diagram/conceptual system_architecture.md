### Conceptual Architecture Diagram

```mermaid
graph LR
subgraph Core["Core System: Kedai POS Platform"]
    App["Web & Mobile Interface"]
    API["Application Layer"]
    DB["Primary Data Store"]
end
User["Users (Staff, Admins, Customers)"]
Auth["Authentication Service"]
Payment["Payment Gateway"]
Stock["Inventory Service"]
Notification["Notification Service"]
Analytics["Reporting Service"]
User -->|Login / Browse Menu| App
App -->|API requests| API
API -->|Read / Write| DB
API -->|Verify credentials| Auth
API -->|Process payment| Payment
API -->|Sync inventory| Stock
API -->|Send receipts| Notification
API -->|Generate reports| Analytics
Auth -->|Auth result| API
Payment -->|Payment confirmation| API
Stock -->|Stock update| API
Notification -->|Notification events| API
Analytics -->|Reporting data| API
```

This Mermaid diagram is formatted to be compatible with draw.io's Mermaid import and still shows the core Kedai POS platform, external entities, and their main interactions.
