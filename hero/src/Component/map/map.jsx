import React, { useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './map.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRoute, faIndianRupeeSign } from '@fortawesome/free-solid-svg-icons';
import { DataContext } from '../../context/data';

function Map() {
  const navigate = useNavigate();
  const { sharedState, setSharedState, sharedTo, setSharedTo, sharedFrom, setSharedFrom } = useContext(DataContext);

  useEffect(() => {
    const loadGoogleMaps = () => {
      if (!window.google) {
        const script = document.createElement('script');
        script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBW_qOzlD7mqmQ7wCsxbJrYvMZiv5FxTGI&libraries=places,directions';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);

        script.onload = () => {
          initMap();
        };
      }
       else {
        initMap();
      }
    };
    
    const initMap = () => {
      const map = new window.google.maps.Map(document.getElementById("googleMap"), {
        center: { lat: 35.254, lng: -0.2459 }, 
        zoom: 12,
        mapTypeId: window.google.maps.MapTypeId.ROADMAP
      });


      const directionsService = new window.google.maps.DirectionsService();
      const directionsRenderer = new window.google.maps.DirectionsRenderer();

      directionsRenderer.setMap(map);

      // Define a request for the directions
      const request = {
        origin: sharedFrom, 
        destination: sharedTo, 
        travelMode: window.google.maps.TravelMode.DRIVING,
        unitSystem: window.google.maps.UnitSystem.IMPERIAL
      };

      directionsService.route(request, (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          directionsRenderer.setDirections(result);
        } else {
          directionsRenderer.setDirections({routes:[]});
          map.setCenter({ lat: 35.254, lng: -0.2459 })
          console.error(`Directions request failed due to ${status}`);
        }
      });
    };
    initMap();

    loadGoogleMaps();

  }, []);

  


  const handleRedirect = () => {
    navigate('/calculator');
  };

  return (
    <div className='main'>
      <div className='main1'>
        <div className='distance'>
          <FontAwesomeIcon icon={faRoute} className='routt' />
          <h3>{sharedState?.distance}</h3>
        </div>
        <div className='price'>
          <FontAwesomeIcon icon={faIndianRupeeSign} className='rout' />
          <h3>{sharedState?.price}</h3>
        </div>
        <button className='btn' onClick={handleRedirect}>
          Try Another One
        </button>
      </div>
      {/* <div className="map-container">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3741.43126193841!2d85.81733797377458!3d20.32379521162074!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a19092dddbe5f31%3A0x78f41b636bb99411!2sezTruck%20%7C%20House%20Shifting%20Services%20%7C%20Mini%20Truck%20Booking%20Services%20%7C%20Online%20Truck%20Booking!5e0!3m2!1sen!2sin!4v1724821920856!5m2!1sen!2sin"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Google Map"
        ></iframe>
      </div> */}
      <div id="googleMap" className='googleMap'>

      </div>
    </div>
  );
}

export default Map;
