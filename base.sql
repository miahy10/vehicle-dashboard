-- Création de la base de données
DROP DATABASE IF EXISTS automobile;
CREATE DATABASE automobile;
USE automobile;

-- Table Voiture
CREATE TABLE voiture (
    id INT AUTO_INCREMENT PRIMARY KEY,
    marque VARCHAR(25) NOT NULL,
    capacite_acceleration DECIMAL(5,2) NOT NULL, -- capacité d'accélération en km/h/s
    capacite_freinage DECIMAL(5,2) NOT NULL, -- capacité de freinage en km/h/s
    conso DECIMAL(5,2) NOT NULL,  -- consommation
    reservoir DECIMAL(5,2) NOT NULL  -- capacité du réservoir
);

-- Table Mouvement
CREATE TABLE mouvement (
    id INT AUTO_INCREMENT PRIMARY KEY,
    voiture_id INT,
    depart DATETIME,
    arrivee DATETIME,
    duree DECIMAL(5,2),  -- en minutes
    distance DECIMAL(10,2),  -- en km
    FOREIGN KEY (voiture_id) REFERENCES voiture(id) ON DELETE CASCADE,
    CONSTRAINT check_dates CHECK (depart < arrivee)
);

-- Table Événement
CREATE TABLE event (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mouvement_id INT NOT NULL,
    vitesse_de_depart BIGINT NOT NULL,
    distance DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (mouvement_id) REFERENCES mouvement(id) ON DELETE CASCADE
);


-- Insertion des données dans la table voiture
INSERT INTO voiture (marque, capacite_acceleration, capacite_freinage, Conso, reservoir) VALUES
('Toyota', 8.5, 35.2, 6.2, 45.0),
('Peugeot', 9.2, 38.1, 5.8, 50.0),
('Renault', 7.8, 32.5, 6.5, 48.0),
('BMW', 6.3, 40.0, 8.1, 55.0),
('Mercedes', 6.8, 42.3, 7.9, 60.0);

-- Insertion des données dans la table mouvement
INSERT INTO mouvement (id_voiture, T1, T2, Duree, variation) VALUES
(1, '2023-01-10 08:00:00', '2023-01-10 08:30:00', 30.00, 1.5),
(2, '2023-01-10 09:15:00', '2023-01-10 09:45:00', 30.00, 2.1),
(3, '2023-01-10 10:30:00', '2023-01-10 11:15:00', 45.00, 3.2),
(1, '2023-01-11 14:00:00', '2023-01-11 14:45:00', 45.00, 2.8),
(4, '2023-01-12 16:20:00', '2023-01-12 17:05:00', 45.00, 4.5),
(5, '2023-01-13 07:30:00', '2023-01-13 08:30:00', 60.00, 5.2),
(2, '2023-01-14 12:00:00', '2023-01-14 12:40:00', 40.00, 2.3),
(3, '2023-01-15 15:15:00', '2023-01-15 16:00:00', 45.00, 3.0);

-- Insertion des données dans la table event
INSERT INTO event (mouvement_id, vitesse_de_depart, distance) VALUES
(1, 0, 0),
(2, 0, 0),
(3, 0, 0),
(4, 0, 0),
(5, 0, 0),
(6, 0, 0),
(7, 0, 0),
(8, 0, 0);

-- ou bien

INSERT INTO event (mouvement_id, vitesse_de_depart, distance)
SELECT id, 0, 0
FROM mouvement;









les technologie utiliser sont postgresql, libpqxx, c++ et gtkmm pour la conception de ce projet



# connecte le projet avec la base de donne postgresql avec libpqxx
    -Fait tous les class et connecte les variables Acceleration , freinage , consomation et reservoire ( la consomation doit etre en litre par seconde;l'acceleration et le freinage en km/h/s et le reservoire en litre)

# dans le code 
    -ajoute une fonction pour calculer la distance parcourue  de la voiture en fonction de l'acceleration et du temps
    -ajoute une fonction pour enregistrer pour faire une enregistrement te tous les mouvement (acceleration ,maintient de la vitesse ,freinage )dans un temps donne
    -ajoute une fonction pour faire un replay de l'enregistrement 
    -ajoute une fonction accelere pour accelerer la voiture (la fonction doit aussi servir pour le freinage)
    -dans l'interface il y a une input pour de pourcentage pour varier l'acceleration de la voiture (l'acceleration max est toujour fixe et c'est l'acceleration dans la base mais on peut le varier avec cette input)utilise la fonction accelere
# dans l'affichage 
    -ajoute une liste deroulante pour selectionner la voiture qu'on veut utiliser 
    -ajoute une input de pourcentage pour varier l'acceleration de la voiture (l'acceleration max est toujour fixe et c'est l'acceleration dans la base mais on peut le varier avec cette input)
    -afficher la distance parcourue
    -ajoutre une bouton start and stop pour utiliser la fonction enregistrer 
    -ajoute une autre bouton pour faire un replay de l'enregistrement
    -dans le terminal afficher tous les mouvement de la voiture 
    -un compeutur de vitesse qui affiche la vitesse de la voiture en temps reel linite a 240 km/h  samblable a un compteur de vitesse de voiture et afficher la vitesse de la voiture en temps reel en chiffre
    -affiche le reservoir de la voiture en temps reel (fait comme un progres bar)
    -ajoute le bouton accelerer et freiner 
    -ajoute une liste deroulante pour selectionner la voiture qu'on veut utiliser
    -l'interface doit etre digne d'une voiture de course  

