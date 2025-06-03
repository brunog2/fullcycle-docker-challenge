require('dotenv').config()

const express = require('express');
const app = express();
const { connection } = require('./db');

// Initialize database and create table
async function initializeDatabase() {
    try {
        await connection.connect();
        console.log('Connected to MySQL');

        await connection.query('CREATE DATABASE IF NOT EXISTS fullcycle');
        console.log('Database created or already exists');

        await connection.query('USE fullcycle');

        await connection.query(`
            CREATE TABLE IF NOT EXISTS people (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL
            )
        `);
        console.log('Table people created or already exists');

    } catch (error) {
        await connection.end();

        console.error('Error initializing database:', error);
    }
}

// Initialize database before starting the server
initializeDatabase();

app.get('/', async (req, res) => {
    try {
        return await connection.query("SELECT COUNT(*) from people", async (err, peoplesCount) => {


            console.log(peoplesCount[0]['COUNT(*)'])
            // // Insert a new person
            await connection.query(`INSERT INTO people (name) VALUES ('Usuário ${peoplesCount[0]['COUNT(*)'] + 1}')`);
            console.log('1 record inserted');

            // // Get all people
            return await connection.query('SELECT * FROM people', (err, result) => {
                const text = '<h1>Full Cycle Rocks!</h1>';
                const peoples = result.map(item => `<p>${item.name}</p>`)
                console.log(result, peoples)
                return res.send(text + '\n' + peoples.join('\n'));
            })
        })
    } catch (error) {
        console.error('Error handling request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
