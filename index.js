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
    db.getConnection();
    console.log('[V] Database connection successful');
} catch (error) {
    console.error('[X] Database connection failed:', error);
}

// =============== Department Routes ===============

app.get('/departments', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM department');
        console.log('[V] Departments retrieved successfully');
        res.status(200).json({ message: 'Departments retrieved successfully', data: rows });
    } catch (error) {
        console.error('[X] Error retrieving departments:', error);
        res.status(500).json({ message: 'Error retrieving departments' });
    }
})

app.post('/departments/create', async (req, res) => {
    const { code, name, salary } = req.body;
    try {
        await db.query('INSERT INTO department(DepartmentCode, DepartmentName, GrossSalary) VALUES (?, ?, ?)', [code, name, salary]);
        console.log('[V] Department created successfully');
        res.status(201).json({ message: 'Department created successfully' });
    } catch (error) {
        console.error('[X] Error creating department:', error);
        res.status(500).json({ message: 'Error creating department' });
    }
})

// =============== Employees Routes ===============

app.get('/employees', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM employee');
        console.log('[V] Employees retrieved successfully');
        res.status(200).json({ message: 'Employees retrieved successfully', data: rows });
    } catch (error) {
        console.error('[X] Error retrieving employees:', error);
        res.status(500).json({ message: 'Error retrieving employees' });
    }
})

app.get('/employees/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query('SELECT * FROM employee WHERE employeeNumber = ?', [id]);
        console.log('[V] Employee retrieved successfully');
        res.status(200).json({ message: 'Employee retrieved successfully', data: rows });
    } catch (error) {
        console.error('[X] Error retrieving employee:', error);
        res.status(500).json({ message: 'Error retrieving employee' });
    }
})

app.post('/employees/create', async (req, res) => {
    const { fname, lname, position, address, phone, gender, code } = req.body;
    try {
        await db.query('INSERT INTO employee(FirstName, LastName, Position, Address, Telephone, Gender, DepartmentCode) VALUES (?, ?, ?, ?, ?, ?, ?)', 
            [fname, lname, position, address, phone, gender, code]);
        console.log('[V] Employee created successfully');
        res.status(201).json({ message: 'Employee created successfully' });
    } catch (error) {
        console.error('[X] Error creating employee:', error);
        res.status(500).json({ message: 'Error creating employee' });
    }
})


// =============== Department Routes ===============


app.listen(port, () => {
    console.log(`Server is running here: http://localhost:${port}`);
})