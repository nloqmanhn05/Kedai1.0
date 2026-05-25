# XAMPP MySQL Setup Guide for Kedai App

## Prerequisites
- XAMPP installed and running (Apache + MySQL)
- Node.js and npm installed
- VS Code with the project open

## Step 1: Start XAMPP

1. Open XAMPP Control Panel
2. Click **Start** for:
   - Apache
   - MySQL

✅ Both should show green "Running" status

## Step 2: Create Database and Tables

1. Go to `http://localhost/phpmyadmin`
2. Click on the **SQL** tab at the top
3. Copy and paste the entire content from `server/database.sql`
4. Click **Go** to execute the SQL
5. You should see three tables created:
   - `ledger`
   - `transactions`
   - `stock`

✅ Database is now ready!

## Step 3: Start the App

```bash
# In VS Code terminal, run:
npm run dev
```

This will start:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## API Endpoints

### Ledger API
- `GET /api/ledger` - Get all ledger entries
- `GET /api/ledger/:id` - Get single entry
- `POST /api/ledger` - Create new entry
- `PUT /api/ledger/:id` - Update entry
- `DELETE /api/ledger/:id` - Delete entry

### Transactions API
- `GET /api/transactions` - Get all transactions
- `GET /api/transactions/range/:startDate/:endDate` - Get by date range
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

## Usage Example (in React component)

```tsx
import { ledgerAPI, transactionAPI } from './lib/api';

export default function MyComponent() {
  const [ledger, setLedger] = useState([]);

  useEffect(() => {
    // Fetch all ledger entries
    ledgerAPI.getAll().then(setLedger);
  }, []);

  const handleAddEntry = async () => {
    await ledgerAPI.create({
      description: 'New entry',
      amount: 1000,
      type: 'income',
      date: new Date().toISOString(),
    });
    // Refresh data
    ledgerAPI.getAll().then(setLedger);
  };

  return (
    <div>
      <button onClick={handleAddEntry}>Add Entry</button>
      {ledger.map(entry => (
        <div key={entry.id}>{entry.description}: {entry.amount}</div>
      ))}
    </div>
  );
}
```

## Troubleshooting

### Database Connection Error
- Check MySQL is running in XAMPP
- Verify `.env` file has correct DB credentials
- Default XAMPP MySQL user: `root` with empty password

### Port Already in Use
- Frontend port 3000: Kill any process on 3000
- Backend port 5000: Change `PORT=5000` in `.env`

### API Not Responding
- Check backend terminal for errors
- Visit http://localhost:5000/api/health to verify

## Project Structure

```
server/
├── config.ts          # Database connection
├── server.ts          # Express server
├── database.sql       # SQL schema (run once)
├── routes/
│   ├── ledger.ts     # Ledger CRUD endpoints
│   └── transactions.ts # Transaction CRUD endpoints

src/
├── lib/
│   └── api.ts        # Frontend API client functions
└── pages/
    ├── Ledger.tsx    # Use ledgerAPI here
    ├── Dashboard.tsx
    └── ...
```

## Next Steps

1. **Replace Supabase calls** with new API calls in React components
2. **Use ledgerAPI and transactionAPI** from `src/lib/api.ts`
3. **Test endpoints** with Postman or browser
4. **Deploy** when ready (update `VITE_API_URL` for production)

---

For more help, check terminal logs or visit http://localhost:5000/api/health
