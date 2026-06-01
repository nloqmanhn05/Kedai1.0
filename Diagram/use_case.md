# Kedai - Use Case Diagram

## Overview
This diagram represents all the actors (Admin, Staff, AI Assistant, and Firebase Backend) and their interactions with the various features of the Kedai business management system.

### Authentication Requirements
**Both Admin and Staff must authenticate via Sign In (UC2) before accessing the app's features.** Only unauthenticated users can access the Landing page and Sign Up page. After authentication, users are directed to their respective dashboards based on their role.

## Use Case Diagram - Mermaid Code

```mermaid
usecase diagram
    actor Admin as "Admin/Owner"
    actor Staff as "Staff"
    actor AI as "Akira AI\nAssistant"
    actor Firebase as "Firebase\nBackend"

    rectangle "Authentication & Account" {
        usecase UC1 as "Sign Up"
        usecase UC2 as "Sign In"
        usecase UC3 as "Logout"
        usecase UC4 as "Manage Profile"
    }

    rectangle "Dashboard" {
        usecase UC5 as "View Financial\nOverview"
        usecase UC6 as "Track Daily\nEarnings"
        usecase UC7 as "View Cash vs\nE-wallet"
        usecase UC8 as "Monitor Live\nTransactions"
    }

    rectangle "Ledger Management" {
        usecase UC9 as "Record Income"
        usecase UC10 as "Record Expenses"
        usecase UC11 as "View Ledger\nHistory"
        usecase UC12 as "Export Ledger\nData (XLSX)"
    }

    rectangle "Stock & Inventory" {
        usecase UC13 as "Add Stock Item"
        usecase UC14 as "Update Stock\nLevel"
        usecase UC15 as "View Inventory"
        usecase UC16 as "Set Low Stock\nThreshold Alert"
        usecase UC17 as "Filter by\nCategory"
    }

    rectangle "Staff Management" {
        usecase UC18 as "Add Staff\nMember"
        usecase UC19 as "Track\nAttendance"
        usecase UC20 as "Record Work\nHours"
        usecase UC21 as "Calculate\nPayroll"
        usecase UC22 as "Manage Shift\nConfiguration"
        usecase UC23 as "Update Staff\nStatus"
    }

    rectangle "Transaction History" {
        usecase UC24 as "Record Sale\nTransaction"
        usecase UC25 as "View Transaction\nHistory"
        usecase UC26 as "Filter by Staff\nor Date"
    }

    rectangle "AI Assistant" {
        usecase UC27 as "Start New Chat\nSession"
        usecase UC28 as "Ask Business\nQuestions"
        usecase UC29 as "Get Financial\nInsights"
        usecase UC30 as "View Chat\nHistory"
    }

    rectangle "Settings & Configuration" {
        usecase UC31 as "Update Business\nProfile"
        usecase UC32 as "Configure Payroll\nRates"
        usecase UC33 as "Manage\nNotifications"
        usecase UC34 as "View App\nSettings"
    }

    %% Admin use cases
    Admin --> UC1
    Admin --> UC2
    Admin --> UC3
    Admin --> UC4
    Admin --> UC5
    Admin --> UC6
    Admin --> UC7
    Admin --> UC8
    Admin --> UC9
    Admin --> UC10
    Admin --> UC11
    Admin --> UC12
    Admin --> UC13
    Admin --> UC14
    Admin --> UC15
    Admin --> UC16
    Admin --> UC17
    Admin --> UC18
    Admin --> UC19
    Admin --> UC20
    Admin --> UC21
    Admin --> UC22
    Admin --> UC23
    Admin --> UC24
    Admin --> UC25
    Admin --> UC26
    Admin --> UC27
    Admin --> UC28
    Admin --> UC29
    Admin --> UC30
    Admin --> UC31
    Admin --> UC32
    Admin --> UC33
    Admin --> UC34

    %% Staff use cases (limited access)
    Staff --> UC2
    Staff --> UC3
    Staff --> UC4
    Staff --> UC5
    Staff --> UC8
    Staff --> UC14
    Staff --> UC15
    Staff --> UC16
    Staff --> UC17
    Staff --> UC24
    Staff --> UC25
    Staff --> UC26
    Staff --> UC27
    Staff --> UC28
    Staff --> UC30
    Staff --> UC34

    %% AI Assistant use cases
    AI --> UC28
    AI --> UC29
    AI --> UC27

    %% Firebase backend connections
    Firebase --> UC1
    Firebase --> UC2
    Firebase --> UC3
    Firebase --> UC9
    Firebase --> UC10
    Firebase --> UC11
    Firebase --> UC13
    Firebase --> UC14
    Firebase --> UC18
    Firebase --> UC19
    Firebase --> UC24
    Firebase --> UC25
    Firebase --> UC27
    Firebase --> UC30

    %% Use case relationships (extensions/inclusions)
    UC1 ..|> UC4 : <<include>>
    UC2 ..|> UC4 : <<include>>
    UC9 ..|> UC11 : <<extend>>
    UC10 ..|> UC11 : <<extend>>
    UC24 ..|> UC6 : <<extend>>
    UC24 ..|> UC8 : <<extend>>
    UC14 ..|> UC16 : <<extend>>
    UC28 ..|> UC29 : <<extend>>
    UC21 ..|> UC20 : <<include>>
```

## Key Features

### Actors:
- **Admin/Owner**: Full access to all features
- **Staff**: Limited access (operations only, no financial configuration)
- **Akira AI Assistant**: Provides business insights and chat support
- **Firebase Backend**: Handles data persistence and authentication

### Use Cases by Module:
1. **Authentication & Account** (4 use cases) - User login, registration, and profile management
2. **Dashboard** (4 use cases) - Financial overview and transaction monitoring
3. **Ledger Management** (4 use cases) - Income/expense tracking and export
4. **Stock & Inventory** (5 use cases) - Stock management and alerts
5. **Staff Management** (6 use cases) - Personnel and payroll management
6. **Transaction History** (3 use cases) - Sales transaction tracking
7. **AI Assistant** (4 use cases) - Chat sessions and business insights
8. **Settings & Configuration** (4 use cases) - App customization

## How to Use in draw.io:

1. Go to [draw.io](https://draw.io)
2. Create a new diagram
3. In the Mermaid code block above, copy all the code
4. Paste it into draw.io
5. The diagram will render automatically
