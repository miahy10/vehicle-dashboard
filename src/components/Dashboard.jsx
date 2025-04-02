import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios for making HTTP requests

import Speedometer from './Speedometer';
import Tachometer from './Tachometer';
import FuelGauge from './FuelGauge';
import TemperatureGauge from './TemperatureGauge';

const Dashboard = () => {
  const [speed, setSpeed] = useState(0);
  const [rpm] = useState(1.5); // Valeur fixe pour l'instant (1500 RPM)
const [eventData, setEventData] = useState({ startTime: null, endTime: null, distance: 0, speedVariation: 0 }); // State for event tracking
  const [selectedCar, setSelectedCar] = useState(null); // State for selected car
  const [carOptions, setCarOptions] = useState([]); // State for car options
  const [loading, setLoading] = useState(true); // Loading state
  const [carAttributes, setCarAttributes] = useState({ acceleration: 0, braking: 0 }); // State for car attributes

  const [fuel] = useState(0.1); // Valeur fixe (proche de "E")
  const [temperature] = useState(0.5); // Valeur fixe (milieu entre C et H)

  useEffect(() => {
    // Fetch car options from the server
    const fetchCars = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/voiture'); // Adjust the endpoint as necessary
        setCarOptions(response.data);
        setSelectedCar(response.data[0]?.id); // Set default selected car
      } catch (error) {
        console.error('Error fetching car data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  useEffect(() => {
    if (selectedCar) {
      // Fetch car attributes when a car is selected
      const fetchCarAttributes = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/voiture/${selectedCar}`); // Adjust the endpoint as necessary
          setCarAttributes({
            acceleration: response.data.acceleration,
            braking: response.data.freinage,
          }); // Set car attributes based on the response
          console.log('Car attributes:', response.data); // Log the fetched attributes
        } catch (error) {
          console.error('Error fetching car attributes:', error);
        }
      };

      fetchCarAttributes();
    }
  }, [selectedCar]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      // if (event.key === 'ArrowUp') {
      if (event.key === 'z') {
        setSpeed((prevSpeed) => Math.min(prevSpeed + carAttributes.acceleration, 240)); // Use acceleration for speed increase
        console.log('Acceleration value:', carAttributes.acceleration); // Log the acceleration value for debugging
        // Start tracking event
        if (!eventData.startTime) {
          setEventData((prev) => ({ ...prev, startTime: new Date(), speedVariation: carAttributes.acceleration })); // Example speed variation
        }
        // Send data to backend
        axios.post('http://localhost:5000/api/events', {
          idvoiture: selectedCar, // Use selected car ID
          heure_debut: new Date(),
          heure_fin: null, // To be set on keyup
          variation_de_vitesse: carAttributes.acceleration,
          distance_parcourue: 0, // To be calculated
        }).catch(error => {
          console.error('Error sending event data:', error);
        });
      } else if (event.key === 'ArrowDown') {
        console.log('Braking value:', carAttributes.braking); // Log the braking value for debugging
        const validBraking = typeof carAttributes.braking === 'number' ? carAttributes.braking : 0; // Ensure braking is a valid number
        setSpeed((prevSpeed) => Math.max(prevSpeed - validBraking, 0)); // Use braking for speed decrease
        // Start tracking event
        if (!eventData.startTime) {
          setEventData((prev) => ({ ...prev, startTime: new Date(), speedVariation: -validBraking })); // Example speed variation
        }
        // Send data to backend
        axios.post('http://localhost:5000/api/events', {
          idvoiture: selectedCar, // Use selected car ID
          heure_debut: new Date(),
          heure_fin: null, // To be set on keyup
          variation_de_vitesse: -validBraking,
          distance_parcourue: 0, // To be calculated
        }).catch(error => {
          console.error('Error sending event data:', error);
        });
      }
    };

    const handleKeyUp = () => {
      // Stop tracking event
      if (eventData.startTime) {
        const endTime = new Date();
        const distance = speed * ((endTime - eventData.startTime) / 1000); // Calculate distance
        setEventData((prev) => ({ ...prev, endTime, distance }));
        
        // Update the event in the database
        axios.post('http://localhost:5000/api/events', {
          idvoiture: selectedCar, // Use selected car ID
          heure_debut: eventData.startTime,
          heure_fin: endTime,
          variation_de_vitesse: eventData.speedVariation,
          distance_parcourue: distance,
        }).then(response => {
          console.log('Event recorded:', response.data);
        }).catch(error => {
          console.error('Error recording event:', error);
        });

        setEventData({ startTime: null, endTime: null, distance: 0, speedVariation: 0 }); // Reset event data
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [eventData.startTime, eventData.speedVariation, speed, selectedCar, carAttributes]); // Add carAttributes to dependencies

  if (loading) {
    return <div>Loading cars...</div>; // Loading state
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh', backgroundColor: '#1a1a1a', padding: '20px' }}>
      <div>
        <label htmlFor="car-select">Select a car:</label>
        <select
          id="car-select"
          value={selectedCar}
          onChange={(e) => setSelectedCar(e.target.value)}
        >
          {carOptions.map(car => (
            <option key={car.id} value={car.id}>{car.modele}</option>
          ))}
        </select>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
        <Speedometer speed={speed} />
        <Tachometer rpm={rpm} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
        <FuelGauge fuel={fuel} />
        <TemperatureGauge temperature={temperature} />
      </div>
      {/* Digital Screen for Speed and Distance */}
      <div
        style={{
          marginTop: '30px',
          padding: '10px 20px',
          backgroundColor: '#333',
          color: '#fff',
          borderRadius: '10px',
          textAlign: 'center',
          fontSize: '1.5rem',
          fontFamily: 'Arial, sans-serif',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        }}
      >
        <div>Speed: {speed} km/h</div>
        <div>Distance: {eventData.distance} km</div>
      </div>
    </div>
  );
};

export default Dashboard;
