import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Simple health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Kedai backend server is running!' });
});

app.listen(PORT, () => {
  console.log(`[Server] Backend server running on port ${PORT}`);
});
