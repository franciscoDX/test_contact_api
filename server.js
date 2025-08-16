require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { initDatabase, connectWithRetry } = require('./config/database');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
 fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use((error, req, res, next) => {
 console.error('Error:', error);
 
 if (error.code === 'LIMIT_FILE_SIZE') {
   return res.status(400).json({ error: 'the file is too large, maximum size is 5MB' });
 }
 
 if (error.message === 'should only allow image files') {
   return res.status(400).json({ error: 'only image files are allowed' });
 }
 
 res.status(500).json({ error: 'Internal server error' });
});


async function startServer() {
 try {
   await connectWithRetry();
   
   await initDatabase();
   
   const contactRoutes = require('./routes/contactRoutes');
   app.use('/api/contacts', contactRoutes);
   
   app.use(express.static(path.join(__dirname)));
   
   app.use('*', (req, res) => {
     if (req.originalUrl.startsWith('/api')) {
       return res.status(404).json({ error: 'API route not found' });
     }
     res.sendFile(path.join(__dirname, 'index.html'));
   });
   
   app.listen(port, '0.0.0.0', () => {
     console.log(`Server running on http://localhost:${port}`);
   });
 } catch (error) {
   
   setTimeout(startServer, 10000);
 }
}

startServer();