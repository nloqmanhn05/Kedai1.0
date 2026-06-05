# Code Citations

## License: unknown
https://github.com/usc20199350218/msmp_public/blob/d8f2bad87aef5e1a52dff5780d777e9d2bf93689/work/useCase4.puml

```
Based on my analysis of your app, here's a comprehensive Mermaid use case diagram for your **Kedai** business management system. This code can be pasted directly into draw.io:

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

    %% Use case relationships (extensions/
```

