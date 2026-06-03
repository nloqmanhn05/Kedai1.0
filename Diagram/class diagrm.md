## Overview
This diagram represents the class structure and relationships of the Kedai business management system, including entities like User, Admin, Staff, Dashboard, Ledger, Stock, Transactions, Chat Sessions, and supporting services.

### Key Classes
- **User**: Base class for all users (Admin, Staff)
- **Admin**: Extended user with full system access
- **Staff**: Extended user with limited operations
- **Dashboard**: Financial overview and real-time metrics
- **Ledger**: Income/expense tracking and history
- **Stock**: Inventory management system
- **Transaction**: Sales transactions with items
- **ChatSession**: AI assistant interactions
- **PayrollRecord**: Salary and work hour management
- **FirebaseService**: Backend persistence and authentication

## Class Diagram - Mermaid Code

```mermaid 
    class User {
        -userId: string
        -email: string
        -password: string
        -fullName: string
        -role: string
        -createdAt: DateTime
        +signUp()
        +signIn()
        +logout()
        +updateProfile()
    }

    class Admin {
        -adminId: string
        -permissions: string[]
        +manageStaff()
        +configurePayroll()
        +viewAllReports()
        +exportData()
    }

    class Staff {
        -staffId: string
        -department: string
        -salary: number
        +recordSale()
        +updateInventory()
        +viewOwnTransactions()
    }

    class Dashboard {
        -dashboardId: string
        -totalEarnings: number
        -dailyEarnings: number
        -cashBalance: number
        -eWalletBalance: number
        +calculateTotalEarnings()
        +getDailyEarnings()
        +getCashVsEWallet()
        +getTransactionSummary()
    }

    class Ledger {
        -ledgerId: string
        -entries: Entry[]
        -totalIncome: number
        -totalExpenses: number
        +recordIncome()
        +recordExpense()
        +viewHistory()
        +exportToXLSX()
    }

    class Entry {
        -entryId: string
        -type: string
        -amount: number
        -description: string
        -date: DateTime
        +create()
        +update()
        +delete()
    }

    class Stock {
        -stockId: string
        -items: StockItem[]
        -lastUpdated: DateTime
        +addItem()
        +updateLevel()
        +viewInventory()
        +setLowStockAlert()
    }

    class StockItem {
        -itemId: string
        -name: string
        -quantity: number
        -category: string
        -price: number
        -lowStockThreshold: number
        +updateQuantity()
        +getCategoryItems()
        +checkLowStock()
    }

    class Transaction {
        -transactionId: string
        -amount: number
        -paymentMethod: string
        -timestamp: DateTime
        -staff: Staff
        -items: TransactionItem[]
        +recordSale()
        +calculateTotal()
        +getTransactionHistory()
    }

    class TransactionItem {
        -itemId: string
        -quantity: number
        -unitPrice: number
        +calculateLineTotal()
    }

    class ChatSession {
        -sessionId: string
        -messages: Message[]
        -createdAt: DateTime
        -updatedAt: DateTime
        +startSession()
        +addMessage()
        +getInsights()
        +saveHistory()
    }

    class Message {
        -messageId: string
        -sender: string
        -content: string
        -timestamp: DateTime
        +create()
        +getResponse()
    }

    class PayrollRecord {
        -payrollId: string
        -staff: Staff
        -workHours: number
        -hourlyRate: number
        -totalSalary: number
        +calculatePayroll()
        +recordWorkHours()
        +generatePayslip()
    }

    class Notification {
        -notificationId: string
        -type: string
        -message: string
        -recipient: User
        -isRead: boolean
        +sendNotification()
        +markAsRead()
    }

    class FirebaseService {
        -authService: AuthService
        -firestoreService: FirestoreService
        +authenticate()
        +readData()
        +writeData()
        +deleteData()
    }

    class AuthService {
        -apiKey: string
        +signUp()
        +signIn()
        +verifyToken()
        +logout()
    }

    class FirestoreService {
        -database: Firestore
        +createDocument()
        +readDocument()
        +updateDocument()
        +deleteDocument()
        +queryCollection()
    }

    class AIService {
        -geminiAPI: string
        +sendPrompt()
        +getInsights()
        +generateRecommendations()
    }

    %% Relationships
    User <|-- Admin : inheritance
    User <|-- Staff : inheritance
    User "1" --> "*" Notification : receives
    
    Dashboard "1" --> "1" User : viewedBy
    Dashboard "1" --> "*" Transaction : displays
    
    Ledger "1" --> "*" Entry : contains
    Ledger "1" --> "1" User : ownedBy
    
    Stock "1" --> "*" StockItem : contains
    Stock "1" --> "1" Admin : managedBy
    
    Transaction classDiagram
    class User {
        -userId: string
        -email: string
        -password: string
        -fullName: string
        -role: string
        -createdAt: DateTime
        +signUp()
        +signIn()
        +logout()
        +updateProfile()
    }

    class Admin {
        -adminId: string
        -permissions: string[]
        +manageStaff()
        +configurePayroll()
        +viewAllReports()
        +exportData()
    }

    class Staff {
        -staffId: string
        -department: string
        -salary: number
        +recordSale()
        +updateInventory()
        +viewOwnTransactions()
    }

    class Dashboard {
        -dashboardId: string
        -totalEarnings: number
        -dailyEarnings: number
        -cashBalance: number
        -eWalletBalance: number
        +calculateTotalEarnings()
        +getDailyEarnings()
        +getCashVsEWallet()
        +getTransactionSummary()
    }

    class Ledger {
        -ledgerId: string
        -entries: Entry[]
        -totalIncome: number
        -totalExpenses: number
        +recordIncome()
        +recordExpense()
        +viewHistory()
        +exportToXLSX()
    }

    class Entry {
        -entryId: string
        -type: string
        -amount: number
        -description: string
        -date: DateTime
        +create()
        +update()
        +delete()
    }

    class Stock {
        -stockId: string
        -items: StockItem[]
        -lastUpdated: DateTime
        +addItem()
        +updateLevel()
        +viewInventory()
        +setLowStockAlert()
    }

    class StockItem {
        -itemId: string
        -name: string
        -quantity: number
        -category: string
        -price: number
        -lowStockThreshold: number
        +updateQuantity()
        +getCategoryItems()
        +checkLowStock()
    }

    class Transaction {
        -transactionId: string
        -amount: number
        -paymentMethod: string
        -timestamp: DateTime
        -staff: Staff
        -items: TransactionItem[]
        +recordSale()
        +calculateTotal()
        +getTransactionHistory()
    }

    class TransactionItem {
        -itemId: string
        -quantity: number
        -unitPrice: number
        +calculateLineTotal()
    }

    class ChatSession {
        -sessionId: string
        -messages: Message[]
        -createdAt: DateTime
        -updatedAt: DateTime
        +startSession()
        +addMessage()
        +getInsights()
        +saveHistory()
    }

    class Message {
        -messageId: string
        -sender: string
        -content: string
        -timestamp: DateTime
        +create()
        +getResponse()
    }

    class PayrollRecord {
        -payrollId: string
        -staff: Staff
        -workHours: number
        -hourlyRate: number
        -totalSalary: number
        +calculatePayroll()
        +recordWorkHours()
        +generatePayslip()
    }

    class Notification {
        -notificationId: string
        -type: string
        -message: string
        -recipient: User
        -isRead: boolean
        +sendNotification()
        +markAsRead()
    }

    class FirebaseService {
        -authService: AuthService
        -firestoreService: FirestoreService
        +authenticate()
        +readData()
        +writeData()
        +deleteData()
    }

    class AuthService {
        -apiKey: string
        +signUp()
        +signIn()
        +verifyToken()
        +logout()
    }

    class FirestoreService {
        -database: Firestore
        +createDocument()
        +readDocument()
        +updateDocument()
        +deleteDocument()
        +queryCollection()
    }

    class AIService {
        -geminiAPI: string
        +sendPrompt()
        +getInsights()
        +generateRecommendations()
    }

    User <|-- Admin
    User <|-- Staff
    User "1" --> "*" Notification : receives
    Dashboard "1" --> "1" User : viewedBy
    Dashboard "1" --> "*" Transaction : displays
    Ledger "1" --> "*" Entry : contains
    Ledger "1" --> "1" User : ownedBy
    Stock "1" --> "*" StockItem : contains
    Stock "1" --> "1" Admin : managedBy
    Transaction "1" --> "*" TransactionItem : contains
    Transaction "1" --> "1" Staff : createdBy
    ChatSession "1" --> "*" Message : contains
    ChatSession "1" --> "1" User : belongsTo
    PayrollRecord "1" --> "1" Staff : recordFor
    PayrollRecord "1" --> "1" Admin : createdBy
    FirebaseService "1" --> "1" AuthService : uses
    FirebaseService "1" --> "1" FirestoreService : uses
    Ledger "1" --> "1" FirestoreService : persistsTo
    Stock "1" --> "1" FirestoreService : persistsTo
    Transaction "1" --> "1" FirestoreService : persistsTo
    ChatSession "1" --> "1" FirestoreService : persistsTo
    ChatSession "1" --> "1" AIService : communicatesWith
```

    ## Key Features

### Class Hierarchy:
- **User** (Base Class) - Common attributes and methods
  - **Admin** - Administrative operations and configuration
  - **Staff** - Staff operations and sales
  
### Entity Classes:
1. **Dashboard** - Financial overview and earnings tracking
2. **Ledger & Entry** - Income/expense management
3. **Stock & StockItem** - Inventory management with categories
4. **Transaction & TransactionItem** - Sales transactions
5. **ChatSession & Message** - AI conversation history
6. **PayrollRecord** - Salary and hour tracking
7. **Notification** - System notifications

### Service Classes:
- **FirebaseService** - Main backend orchestrator
- **AuthService** - Authentication and authorization
- **FirestoreService** - Database operations
- **AIService** - Google Gemini integration

### Relationships:
- **Inheritance**: Admin and Staff extend User
- **Composition**: Classes contain multiple child entities (Ledger contains Entries, etc.)
- **Association**: Classes reference other classes (Dashboard displays Transactions, etc.)
