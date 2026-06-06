# Admin View Activity Diagram

This diagram describes the activities, options, and operational paths available within the Admin view of the Kedai management system.

## Activity Diagram - Mermaid Code

```mermaid
flowchart TD
    Start([Start: Admin Session]) --> Auth[Admin Authentication]
    Auth --> Dashboard[View Admin Dashboard]
    
    Dashboard --> Nav{Choose Module}
    
    subgraph Analytics["1. Dashboard & Analytics"]
        Nav --> ViewMetrics[Monitor Financial Performance]
        ViewMetrics --> ViewDailySales[Track Today's Sales, Transactions & Cash/E-Wallet Split]
        ViewDailySales --> ViewRecentTransactions[Audit Recent Transactions List]
    end
    
    subgraph StaffMgmt["2. Staff & Payroll Management"]
        Nav --> ManageStaff{Select Staff Action}
        ManageStaff --> InputStaffData[Enter Name, Email, IC, Role, Shift, Hourly Rate & PIN]
        InputStaffData --> SaveStaff[Persist to Firestore: staff, staffsummary & staffreport]
        ManageStaff --> CheckShiftStats[Analyze Attendance, Hours Worked & Shift Status]
        ManageStaff --> UpdateStaffDb[Modify Staff Details or Delete Profile]
    end
    
    subgraph StockMgmt["3. Stock & Inventory Control"]
        Nav --> ManageStock{Select Stock Action}
        ManageStock --> CheckStockLevels[Inspect Stock Levels & Low Stock Warnings]
        ManageStock --> InputProductDetails[Enter Name, Category, Unit, Threshold, Emoji & Qty]
        InputProductDetails --> SaveProduct[Save Item to stocks collection]
        ManageStock --> AddStockQty[Increment Item Total Quantity Atomically]
        ManageStock --> EditProduct[Modify Properties or Delete Item]
    end
    
    subgraph LedgerMgmt["4. Ledger & Accounting"]
        Nav --> ManageLedger{Select Ledger Action}
        ManageLedger --> CheckLedgerHist[Inspect Receipts, Income & Expense Feeds]
        ManageLedger --> InputLedgerData[Specify Type, Amount, Category, Description & Date]
        InputLedgerData --> SaveLedger[Add Document to expenses collection]
        ManageLedger --> RemoveLedgerDoc[Delete Entry Document]
    end

    subgraph AIMgmt["5. Akira AI Assistant"]
        Nav --> ChatSession{Select AI Action}
        ChatSession --> SubmitPrompt[Submit Prompt to Gemini AI]
        SubmitPrompt --> AnalyzeContext[AI Contextual Analysis of Sales, Stock & Ledger data]
        AnalyzeContext --> GetInsights[Receive Insights, Sales Predictions & Low-Stock Alerts]
        ChatSession --> LoadPastChats[Retrieve Past Sessions from chatSessions]
    end

    subgraph SettingsMgmt["6. Settings & Config"]
        Nav --> SystemConfig{Select Config Action}
        SystemConfig --> EditBizDetails[Update Business Name, Registration No, Address & Phone]
        SystemConfig --> ConfigureRates[Set Base Rates, Overtime Multipliers, EPF & SOCSO Rules]
        SystemConfig --> ManageShifts[Modify Morning / Afternoon / Night Shift Times]
    end

    %% Exit Session
    Dashboard --> Logout[Log Out]
    Logout --> End([End: Session Terminated])
```


## Explanation of Admin Workflows

1. **Dashboard & Analytics:**
   - Provides high-level operational statistics (live totals, cash vs. e-wallet distribution) and transaction history monitoring.

2. **Staff & Payroll Management:**
   - Enables creation of staff profiles, updating database records, and supervising hourly shifts.
   - Accesses reporting data to audit monthly totals and payroll distributions.

3. **Stock & Inventory Control:**
   - Oversees the products and packaging inventory.
   - Admin handles additions of new catalog items, direct restocking (atomic increments), adjustments of thresholds for low-stock alarms, and item removal.

4. **Financial Ledger Accounting:**
   - Displays cash flows, categorizing inputs as incomes or expenses.
   - Allows recording of overheads (rent, bills, logistics) and deletions.

5. **AI Assistant Integration (Akira):**
   - Synthesizes sales numbers, stock reports, and expense statistics through prompt structures to offer predictions, alerts, and operational recommendations.

6. **System Settings:**
   - Modifies organizational identifiers, shift schedules, and default financial percentages (EPF, SOCSO, overtime multipliers).
