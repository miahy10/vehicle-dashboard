const express = require('express');
const cors = require('cors'); // Import CORS middleware

const bodyParser = require('body-parser');
const connection = require('./src/db');

const app = express();
app.use(cors());// Use CORS middleware

const PORT = 5000; // You can change the port if needed

app.use(bodyParser.json());

// API endpoint to insert event data
app.post('/api/events', (req, res) => {
    const { idvoiture, heure_debut, heure_fin, variation_de_vitesse, distance_parcourue } = req.body;

    const query = 'INSERT INTO event (idvoiture, heure_debut, heure_fin, variation_de_vitesse, distance_parcourue) VALUES (?, ?, ?, ?, ?)';
    connection.query(query, [idvoiture, heure_debut, heure_fin, variation_de_vitesse, distance_parcourue], (err, results) => {
        if (err) {
            console.error('Error inserting event:', err);
            return res.status(500).json({ error: 'Database insertion error' });
        }
        res.status(201).json({ message: 'Event recorded successfully', id: results.insertId });
    });
});

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

app.get('/api/voiture/:id', (req, res) => {
    const carId = req.params.id; // Get the car ID from the request parameters
    console.log(`Fetching attributes for car ID: ${carId}`); // Log the car ID

    const query = 'SELECT acceleration, freinage FROM voiture WHERE id = ?'; // Query to fetch car attributes
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

// Start the server


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
