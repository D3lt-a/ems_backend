const express = require('express');
const mysql = require('mysql2/promise');

const port = 5000;
const app = express();
app.use(express.json());

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'internershipdb'
})

try {
    db.getConnection()
    console.log('[V] Database connection successful');
} catch (error) {
    console.error('[X] Database connection failed:', error);
}


app.listen(port, () => {
    console.log(`Server is running here: http://localhost:${port}`);
})