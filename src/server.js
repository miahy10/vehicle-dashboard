const express = require('express');
const cors = require('cors'); // Import CORS middleware

const bodyParser = require('body-parser');
const connection = require('./src/db');

const app = express();
app.use(cors()); // Use CORS middleware

const PORT = 5000; // You can change the port if needed

app.use(bodyParser.json());

// API endpoint to insert event data
app.post('/api/events', (req, res) => {
    const { mouvement_id, vitesse_de_depart, distance } = req.body;

    const query = 'INSERT INTO event (mouvement_id, vitesse_de_depart, distance) VALUES (?, ?, ?)';
    connection.query(query, [mouvement_id, vitesse_de_depart, distance], (err, results) => {
        if (err) {
            console.error('Error inserting event:', err);
            return res.status(500).json({ error: 'Database insertion error' });
        }
        res.status(201).json({ message: 'Event recorded successfully', id: results.insertId });
    });
});

// API endpoint to fetch all cars
app.get('/api/voiture', (req, res) => {
    const query = 'SELECT * FROM voiture'; // Query to fetch all cars
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching cars:', err);
            return res.status(500).json({ error: 'Database fetching error' });
        }
        res.status(200).json(results); // Send the car data as a response
    });
});

// API endpoint to fetch car attributes by ID
app.get('/api/voiture/:id', (req, res) => {
    const carId = req.params.id; // Get the car ID from the request parameters
    console.log(`Fetching attributes for car ID: ${carId}`); // Log the car ID

    const query = 'SELECT capacite_acceleration, capacite_freinage FROM voiture WHERE id = ?'; // Query to fetch car attributes
    connection.query(query, [carId], (err, results) => {
        if (err) {
            console.error('Error fetching car attributes:', err);
            return res.status(500).json({ error: 'Database fetching error' });
        }
        if (results.length > 0) {
            res.status(200).json(results[0]); // Send the car attributes as a response
        } else {
            res.status(404).json({ error: 'Car not found' }); // Handle case where car is not found
        }
    });
});

// API endpoint to fetch movements
app.get('/api/mouvements/select', (req, res) => {
    const query = 'SELECT * FROM mouvement'; // Query to fetch all movements
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching movements:', err);
            return res.status(500).json({ error: 'Database fetching error' });
        }
        res.status(200).json(results); // Send the movement data as a response
    });
});

// API endpoint to insert movement data
app.post('/api/mouvements/insert', (req, res) => {
    const { voiture_id, depart, arrivee, duree, distance } = req.body;

    const query = `
        INSERT INTO mouvement (voiture_id, depart, arrivee, duree, distance) 
        VALUES (?, ?, ?, ?, ?)
    `;
    connection.query(query, [voiture_id, depart, arrivee, duree, distance], (err, results) => {
        if (err) {
            console.error('Error inserting movement:', err);
            return res.status(500).json({ error: 'Database insertion error' });
        }
        res.status(201).json({ message: 'Movement recorded successfully', id: results.insertId });
    });
});

app.put('/api/mouvements/update', (req, res) => {
    const { id, arrivee, duree, distance } = req.body;

    const query = `
        UPDATE mouvement 
        SET arrivee = ?, duree = ?, distance = ?
        WHERE id = ?
    `;
    connection.query(query, [arrivee, duree, distance, id], (err, results) => {
        if (err) {
            console.error('Error updating movement:', err);
            return res.status(500).json({ error: 'Database update error' });
        }
        if (results.affectedRows > 0) {
            res.status(200).json({ message: 'Movement updated successfully' });
        } else {
            res.status(404).json({ error: 'Movement not found' });
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});