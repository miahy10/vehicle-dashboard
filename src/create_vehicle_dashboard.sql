-- Create Database
DROP DATABASE IF EXISTS vehicle_dashboard;

CREATE DATABASE vehicle_dashboard;

-- Use the new database
USE vehicle_dashboard;

-- Create voiture table
CREATE TABLE voiture (
    id INT AUTO_INCREMENT PRIMARY KEY,
    modele VARCHAR(255) NOT NULL,
    acceleration FLOAT NOT NULL,
    freinage FLOAT NOT NULL
);

-- Create event table
CREATE TABLE event (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idvoiture INT,
    heure_debut DATETIME NOT NULL,
    heure_fin DATETIME,
    variation_de_vitesse FLOAT NOT NULL,
    distance_parcourue FLOAT NOT NULL,
    FOREIGN KEY (idvoiture) REFERENCES voiture(id)
);

-- Insertion d'une voiture dans la table voiture
INSERT INTO voiture (modele, acceleration, freinage)
VALUES ('Nissan GT-R R32', 4.0, 3.0),
('Nissan GT-R R33', 3.8, 2.9),
('Nissan GT-R R34', 3.5, 2.8),
('Nissan GT-R R35', 3.2, 2.5);

