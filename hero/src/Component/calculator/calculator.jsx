/* global google */
import React, { useState, useContext, useEffect, useRef } from 'react';
import axios from 'axios';
import './calculator.css';
import { useNavigate } from 'react-router-dom';

import '@fortawesome/fontawesome-free/css/all.min.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWarehouse, faCrosshairs, faHeadphones, faShield } from '@fortawesome/free-solid-svg-icons';
import { DataContext } from '../../context/data';

function Calculator() {

    const [vehicleType, setVehicleType] = useState('');
    const [pickupAddress, setPickupAddress] = useState('');
    const [dropAddress, setDropAddress] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const { sharedState, setSharedState, sharedTo, setSharedTo, sharedFrom, setSharedFrom } = useContext(DataContext);
    const scriptRef = useRef(null);

    const navigate = useNavigate();

    useEffect(() => {
        let script = document.createElement("script");
        script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyBW_qOzlD7mqmQ7wCsxbJrYvMZiv5FxTGI&libraries=places";
        script.async = true;
        scriptRef.current = script;
        document.body.appendChild(script);

        script.onload = () => {
            if (window.google) {
              initializeAutocomplete();
            }
          };

        const initializeAutocomplete = () => {
            const input1 = document.getElementById("pickupAddress");
            const input2 = document.getElementById("dropAddress");
      
            if (input1) {
              const autocomplete1 = new google.maps.places.Autocomplete(input1);
              autocomplete1.addListener("place_changed", () => {
                const place = autocomplete1.getPlace();
                if (place.formatted_address) {
                  setPickupAddress(place.formatted_address);
                  setSharedFrom(place.formatted_address)
                }
              });
      
            if (input2) {
              const autocomplete2 = new google.maps.places.Autocomplete(input2);
              autocomplete2.addListener("place_changed", () => {
                const place = autocomplete2.getPlace();
                if (place.formatted_address) {
                  setDropAddress(place.formatted_address);
                  setSharedTo(place.formatted_address)
                }
              });
            }
          };
        } 

        return;
      }, []);

    const handleFormSubmit = async () => {

        

        if (vehicleType === '' || pickupAddress === '' || dropAddress === '') {
            setErrorMessage('Please fill in all fields before getting the estimation price.');
            return;
        }
        try {
            setErrorMessage('');
            const mapapi = `http://localhost:5000/api/distance?from=${pickupAddress}&to=${dropAddress}&vehicletype=${vehicleType}`

            const response = await axios.get(mapapi)
            if (response?.status == 200) {
                let distance = response?.data.distance
                let price = response?.data.price
                setSharedState({ distance: distance, price: price })
                navigate('/map');
            }
            console.log(response);


        } catch (e) {
            console.log("inside error: " + e.message);
            console.log(e.mesage)
        }
    };

    return (
        <div className='main_cont'>
            <div className='item1'>
                <div>
                    <h5>Quote</h5>
                    <h6 className='h6'><hr />Request A Quote</h6>
                    <h2>Cost <span>Calculator</span></h2>
                </div>
                <p>You can know the Price of your Transportation in Advance. We Offer Intelligent concepts for road and tail as well as complex special transport services.</p>

                <div className='box'>
                    <div className='box1'>
                        <FontAwesomeIcon icon={faWarehouse} className='font' />
                        <h3>Warehouse</h3>
                    </div>
                    <div className='box1'>
                        <FontAwesomeIcon icon={faCrosshairs} className='font' />
                        <h3>Online Tracking</h3>
                    </div>
                    <div className='box1'>
                        <FontAwesomeIcon icon={faHeadphones} className='font' />
                        <h3>Support 24/7</h3>
                    </div>
                    <div className='box1'>
                        <FontAwesomeIcon icon={faShield} className='font' />
                        <h3>Cargo Insurance</h3>
                    </div>
                </div>
            </div>
            <div className='item2'>
                <div className="form-container">
                    <h2 className='data'>Personal & Shipment Data</h2>
                    <hr />
                    <form>
                        <div className="form-group">
                            <select
                                id="vehicleType"
                                value={vehicleType}
                                onChange={e => setVehicleType(e.target.value)}
                            >
                                <option value="">Vehicle Type</option>
                                <option value="auto">Dala Auto (Max 1 Ton Passing)</option>
                                <option value="TataAce">Tata Ace/ Mahindra Supro (Max 1.2 Ton Passing)</option>
                                <option value="Smallpickupk">Mahindra Pick up 1.3/Tata Intra (Max 2.5 Ton Passing)</option>
                                <option value="largepickup">Mahindra Pick up 1.7/ Bada Dost (Max 3.5 Ton Passing)</option>
                                <option value="Eicher05ton">Eicher 14FT Four-Wheeler 05 Ton</option>
                                <option value="Eicher06ton">Eicher Six-Wheeler 06 Ton</option>
                                <option value="10ton">10 Ton Price (10-Wheeler)</option>
                                <option value="25ton">25 Ton Price (12-Wheeler)</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                id="pickupAddress"
                                value={pickupAddress}
                                onChange={e => setPickupAddress(e.target.value)}
                                placeholder="Enter pickup address"
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                id="dropAddress"
                                value={dropAddress}
                                onChange={e => setDropAddress(e.target.value)}
                                placeholder="Enter drop address"
                            />
                        </div>
                        {errorMessage && <p className="error-message">{errorMessage}</p>}
                        <div className="form-group">
                            <button type="button" onClick={handleFormSubmit}>Get Estimate Price</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Calculator;
