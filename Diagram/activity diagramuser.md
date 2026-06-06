# Staff Flow Activity Diagram

This diagram describes the lifecycle of a staff member's shift from registration to clock-out, detailing PIN verifications, live sales transactions, inventory management, and automated payroll calculations.

## Activity Diagram - Mermaid Code

```mermaid
flowchart TD
    Start([Start: Staff Member Lifecycle]) --> AdminRegister[Admin Registers Staff in Settings]
    AdminRegister --> SetDetails[Define Name, Role, Shift, Rate & 7-Digit PIN]
    SetDetails --> FirestoreCreate[Create Firestore Records in staff, staffsummary & staffreport]
    
    FirestoreCreate --> SelectProfile[Staff Selects Profile on Settings Page]
    SelectProfile --> ClickClockIn[Click 'Clock In']
    ClickClockIn --> PinPromptIn[Prompt for PIN verification]
    
    PinPromptIn --> EnterPinIn{Verify PIN Code}
    EnterPinIn -- Incorrect PIN --> AlertIn[Show Error Alert] --> ClickClockIn
    EnterPinIn -- Correct PIN --> SystemClockIn[System Records Clock-In Timestamp & Sets Status 'In Progress']
    
    SystemClockIn --> ActiveShift{Daily Shift Operations}
    
    ActiveShift -- Record Checkout Transaction --> CheckoutSale[Process Sales Checkout]
    CheckoutSale --> UpdateLiveSales[Increment Transactions Count & Accumulate Cash / E-Wallet Earnings]
    UpdateLiveSales --> ActiveShift
    
    ActiveShift -- Update Inventory --> RestockItem[Add Stock Items, Update Quantity or Restock]
    RestockItem --> ActiveShift
    
    ActiveShift -- End Shift --> ClickClockOut[Click 'Clock Out']
    ClickClockOut --> PinPromptOut[Prompt for PIN verification]
    
    PinPromptOut --> EnterPinOut{Verify PIN Code}
    EnterPinOut -- Incorrect PIN --> AlertOut[Show Error Alert] --> ClickClockOut
    EnterPinOut -- Correct PIN --> CalcShiftHours[Calculate Elapsed Shift Work Hours]
    
    CalcShiftHours --> CheckFirstAttendance{First Shift of Today?}
    CheckFirstAttendance -- Yes --> IncAttendance[Increment Attendance Days & Log Date] --> SumHours
    CheckFirstAttendance -- No --> SumHours[Add Shift Hours to Accumulated Total Hours]
    
    SumHours --> CalcEarnings[Calculate Pay: Shift Hours * Hourly Rate]
    CalcEarnings --> FirestoreSync[Sync stats to Firestore: Set Shift Status to 'Ended']
    FirestoreSync --> End([End: Shift Completed])
```

## Description of Key Stages

1. **Staff Registration:**
   - Managed by the system administrator under the **Staff Accounts** tab in Settings.
   - Staff credentials (including hourly rates and verification PINs) are initialized.
   - Creates three distinct records in Firestore: `staff` (identity), `staffsummary` (sales performance), and `staffreport` (attendance & payroll).

2. **Shift Clock-In Flow:**
   - Staff logs in via their user role and goes to the Settings page.
   - Upon clicking **Clock In**, the system requires verification of their 7-digit PIN.
   - Validating the PIN updates their shift status to `"In Progress"` and records the `clockInTimestamp`.

3. **Daily Operations (Active Shift):**
   - **Sales Transaction:** Every checkout handled by the staff records their name and totals transaction counts as well as cash/e-wallet values.
   - **Stock Inventory:** Staff can add items, restock quantities, and manage low-stock thresholds.

4. **Shift Clock-Out Flow:**
   - Staff verifies their identity using the PIN.
   - The system calculates elapsed minutes since `clockInTimestamp` and logs it as a decimal work hour value.
   - Checks if they have clocked in previously today (to prevent duplicate attendance counts).
   - Multiplies elapsed hours by their base rate to calculate the day's earnings, increments total pay, and updates their shift status to `"Ended"`.
