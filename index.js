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

// =============== Salary Routes ===============

app.get('/salaries', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM salary');
        console.log('[V] Salaries retrieved successfully');
        res.status(200).json({ message: 'Salaries retrieved successfully', data: rows });
    } catch (error) {
        console.error('[X] Error retrieving salaries:', error);
        res.status(500).json({ message: 'Error retrieving salaries' });
    }
})

app.get('/salaries/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query('SELECT * FROM salary WHERE employeeNumber = ?', [id]);
        console.log('[V] Salaries retrieved successfully');
        res.status(200).json({ message: 'Salaries retrieved successfully', data: rows });
    } catch (error) {
        console.error('[X] Error retrieving salaries:', error);
        res.status(500).json({ message: 'Error retrieving salaries' });
    }
})

app.post('/salaries/create', async (req, res) => {
    const { emp, salary, deduction, netsalary, month } = req.body;
    try {
        await db.query('INSERT INTO salary(EmployeeNumber, GrossSalary , TotalDeduction , NetSalary , month) VALUES (?, ?, ?, ?, ?)',
            [emp, salary, deduction, netsalary, month]);
        console.log('[V] Salary created successfully');
        res.status(201).json({ message: 'Salary created successfully' });
    } catch (error) {
        console.error('[X] Error creating salary:', error);
        res.status(500).json({ message: 'Error creating salary' });
    }
})

app.put('/salaries/update/:id', async (req, res) => {
    const { id } = req.params;
    const { salary, deduction, netsalary } = req.body;
    try {
        const [rows] = await db.query('UPDATE salary SET GrossSalary = ?, TotalDeduction = ?, NetSalary = ? WHERE employeeNumber = ?',
            [salary, deduction, netsalary, id]);
        if (rows.length === 0) {
            console.log('[X] Salary not found for update');
            res.status(404).json({ message: 'Salary not found' });
        } else {
            console.log('[V] Salary updated successfully');
            res.status(200).json({ message: 'Salary updated successfully' });
        }
    } catch (error) {
        console.error('[X] Error updating salary:', error);
        res.status(500).json({ message: 'Error updating salary' });
    }
})

app.delete('/salaries/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM salary WHERE employeeNumber = ?', [id]);
        console.log('[V] Salary deleted successfully');
        res.status(200).json({ message: 'Salary deleted successfully' });
    } catch (error) {
        console.error('[X] Error deleting salary:', error);
        res.status(500).json({ message: 'Error deleting salary' });
    }
})

// =============== Payroll Routes ===============

app.get('/payrolls', async (req, res) => {
    try {
        await db.query(`
                SELECT e.FirstName, e.LastName, e.Postion, d.DepartmentName, s.NetSalary, s.month
                FROM employee e
                JOIN department d ON e.DepartmentCode = d.DepartmentCode
                JOIN salary s ON e.employeeNumber = s.EmployeeNumber
            `);
    } catch (error) {
        console.error('[X] Error retrieving payrolls:', error);
        res.status(500).json({ message: 'Error retrieving payrolls' });
    }
})

app.get('/payrolls/:month', async (req, res) => {
    const { month } = req.params;
    try {
        await db.query(`
                SELECT e.FirstName, e.LastName, e.Postion, d.DepartmentName, s.NetSalary, s.month
                FROM employee e
                JOIN department d ON e.DepartmentCode = d.DepartmentCode
                JOIN salary s ON e.employeeNumber = s.EmployeeNumber
                WHERE s.month = ?
            `, [month]);
    } catch (error) {
        console.error('[X] Error retrieving payrolls:', error);
        res.status(500).json({ message: 'Error retrieving payrolls' });
    }
})


app.listen(port, () => {
    console.log(`Server is running here: http://localhost:${port}`);
})