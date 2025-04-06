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
  const [accelerationPercentage, setAccelerationPercentage] = useState(100); // State for acceleration percentage
  const [isRecording, setIsRecording] = useState(false); // Nouvel état pour suivre l'enregistrement

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
            acceleration: response.data.capacite_acceleration,
            braking: response.data.capacite_freinage,
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
      if (event.key === 'z') {
        const validAcceleration = typeof carAttributes.acceleration === 'number' ? carAttributes.acceleration : 0; // Ensure acceleration is valid
        const effectiveAcceleration = (validAcceleration * accelerationPercentage) / 100; // Adjust acceleration based on percentage

        setSpeed((prevSpeed) => Math.min(prevSpeed + effectiveAcceleration, 240)); // Use acceleration for speed increase
        console.log('Acceleration value:', effectiveAcceleration); // Log the acceleration value for debugging

        // Start tracking event
        if (isRecording && !eventData.startTime) {
          const startTime = new Date();
          setEventData((prev) => ({ ...prev, startTime, speedVariation: effectiveAcceleration })); // Example speed variation

          // Send data to the mouvement endpoint
          axios.post('http://localhost:5000/api/mouvements/insert', {
            voiture_id: selectedCar, // Use selected car ID
            depart: startTime.toISOString(), // Start time
            arrivee: null, // End time will be updated later
            duree: 0, // Duration will be calculated later
            distance: 0, // Distance will be calculated later
          })
            .then((response) => {
              const mouvementId = response.data.id; // Get the inserted mouvement ID
              console.log('Mouvement recorded:', response.data);

              // Update eventData with mouvementId
              setEventData((prev) => ({ ...prev, mouvementId }));

              // Send data to the events endpoint
              axios.post('http://localhost:5000/api/events', {
                mouvement_id: mouvementId, // Use the mouvement ID
                vitesse_de_depart: effectiveAcceleration,
                distance: 0, // To be calculated
              }).catch(error => {
                console.error('Error sending event data:', error);
              });
            })
            .catch((error) => {
              console.error('Error inserting mouvement:', error);
            });
        }
      } else if (event.key === 'ArrowDown') {
        const validBraking = typeof carAttributes.braking === 'number' ? carAttributes.braking : 0; // Ensure braking is valid
        setSpeed((prevSpeed) => Math.max(prevSpeed - validBraking, 0)); // Use braking for speed decrease

        // Start tracking event
        if (isRecording && !eventData.startTime) {
          const startTime = new Date();
          setEventData((prev) => ({ ...prev, startTime, speedVariation: -validBraking })); // Example speed variation

          // Send data to the mouvement endpoint
          axios.post('http://localhost:5000/api/mouvements/insert', {
            voiture_id: selectedCar, // Use selected car ID
            depart: startTime.toISOString(), // Start time
            arrivee: null, // End time will be updated later
            duree: 0, // Duration will be calculated later
            distance: 0, // Distance will be calculated later
          })
            .then((response) => {
              const mouvementId = response.data.id; // Get the inserted mouvement ID
              console.log('Mouvement recorded:', response.data);

              // Update eventData with mouvementId
              setEventData((prev) => ({ ...prev, mouvementId }));

              // Send data to the events endpoint
              axios.post('http://localhost:5000/api/events', {
                mouvement_id: mouvementId, // Use the mouvement ID
                vitesse_de_depart: -validBraking,
                distance: 0, // To be calculated
              }).catch(error => {
                console.error('Error sending event data:', error);
              });
            })
            .catch((error) => {
              console.error('Error inserting mouvement:', error);
            });
        }
      }
    };

    const handleKeyUp = () => {
      // Stop tracking event
      if (!isRecording || !eventData.startTime || !eventData.mouvementId) return;

      const endTime = new Date();
      const distance = speed * ((endTime - eventData.startTime) / 1000); // Calculate distance
      setEventData((prev) => ({ ...prev, endTime, distance }));

      // Update the mouvement in the database
      axios.put('http://localhost:5000/api/mouvements/update', {
        id: eventData.mouvementId, // Use the mouvement ID stored in eventData
        voiture_id: selectedCar, // Use selected car ID
        arrivee: endTime.toISOString(), // End time
        duree: (endTime - eventData.startTime) / 60000, // Duration in minutes
        distance: distance, // Calculated distance
      }).then(response => {
        console.log('Mouvement updated:', response.data);
      }).catch(error => {
        console.error('Error updating mouvement:', error);
      });

      // Reset event data
      setEventData({ startTime: null, endTime: null, distance: 0, speedVariation: 0, mouvementId: null });
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [eventData.startTime, eventData.speedVariation, speed, selectedCar, carAttributes, accelerationPercentage, isRecording, eventData.mouvementId]); // Add carAttributes to dependencies

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
            <option key={car.id} value={car.id}>{car.marque}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="acceleration-percentage">Acceleration Percentage:</label>
        <input
          type="number"
          id="acceleration-percentage"
          value={accelerationPercentage}
          onChange={(e) => setAccelerationPercentage(Math.max(0, Math.min(100, e.target.value)))}
        />
      </div>
      <button
        onClick={() => setIsRecording((prev) => !prev)}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: isRecording ? 'red' : 'green',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
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
