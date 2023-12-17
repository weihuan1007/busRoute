import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, Polyline, mapId } from '@react-google-maps/api';
import './LocationTracker.css';
import AdminNavbar from './AdminNavbar';
import CustomMarker from '../../../assets/bus-stop.png';
import busRoutes from './busRoutes';

const containerStyle = {
  width: '60%',
  height: '600px',
  position: 'absolute',
  top: '40px',
  left: '250px',
  padding: '20px',
};

const center = {
  lat: 1.559803,
  lng: 103.637998,
};

// Initial static markers
const staticMarkers = [
  { position: { lat: 1.5593613531032313, lng: 103.63280919934147 }, name: 'KRP 1' },
  { position: { lat: 1.5594488031178655, lng: 103.63181397038748 }, name: 'KRP 2' },
  { position: { lat: 1.5581984657886114, lng: 103.63013361402903 }, name: 'KRP 3' },
  { position: { lat: 1.557820767476252, lng: 103.62933025021609 }, name: 'KRP 4' },
  { position: { lat: 1.5583386592877633, lng: 103.62772119148106 }, name: 'PKU' },
  { position: { lat: 1.5666014101927015, lng: 103.62692956217548 }, name: 'KDSE 1' },
  { position: { lat: 1.5664661331768341, lng: 103.62710887123512 }, name: 'KDSE 2' },
  { position: { lat: 1.5680164884613657, lng: 103.62444943229734 }, name: 'KDSE 3' },
  { position: { lat: 1.5600993131033718, lng: 103.62924840747273 }, name: 'KTF 1' },
  { position: { lat: 1.5611031811814065, lng: 103.63092734040339 }, name: 'KTF 2' },
  { position: { lat: 1.559717628544402, lng: 103.63474936112164 }, name: 'Central Point' },
  { position: { lat: 1.5612972023347578, lng: 103.63259352721195 }, name: 'Arked Cengal 1' },
  { position: { lat: 1.5611806042328233, lng: 103.63249300698176 }, name: 'Arked Cengal 2' },
  { position: { lat: 1.5616945552654073, lng: 103.62929878111245 }, name: 'KTR 1' },
  { position: { lat: 1.5627521550241115, lng: 103.62758295044863 }, name: 'KTR 2' },
  { position: { lat: 1.5637730222723685, lng: 103.62742170059452 }, name: 'KTR 3' },
  { position: { lat: 1.5648820767159544, lng: 103.62786828500501 }, name: 'KTR 4' },
  { position: { lat: 1.5627194781848628, lng: 103.63643945417387 }, name: 'FKA' },
  { position: { lat: 1.5626948582674094, lng: 103.63913654898062 }, name: 'N24' },
  { position: { lat: 1.5603335706721926, lng: 103.64158337666292 }, name: 'P19' },
  { position: { lat: 1.5579997226065976, lng: 103.64022169009499 }, name: 'FKE' },
  { position: { lat: 1.561264743364688, lng: 103.63656142789215 }, name: 'D01' },
  { position: { lat: 1.5615944858197506, lng: 103.63788622412557 }, name: 'D05' },
  { position: { lat: 1.5610828431095982, lng: 103.63938375441512 }, name: 'D06' },
  { position: { lat: 1.5597934647349028, lng: 103.64023198090993 }, name: 'FKM' },
  { position: { lat: 1.562936701100379, lng: 103.63445242438802 }, name: 'Galeri Siswa' },
  { position: { lat: 1.5627086675590907, lng: 103.63371663411134 }, name: 'M47 FKA' },
  { position: { lat: 1.5643049534446607, lng: 103.63610083280307 }, name: 'KTDI 1' },
  { position: { lat: 1.565417619661972, lng: 103.63474853988065 }, name: 'KTDI 2' },
  { position: { lat: 1.5650261632665665, lng: 103.63408603425545 }, name: 'KTDI 3' },
  { position: { lat: 1.5643903339996748, lng: 103.63199008436337 }, name: 'KTHO 1' },
  { position: { lat: 1.5641559871406108, lng: 103.63001114274475 }, name: 'KTHO 2' },
  { position: { lat: 1.5630614695886158, lng: 103.63030683669072 }, name: 'KTHO 3' },
  { position: { lat: 1.5566240984619724, lng: 103.64265398120011 }, name: 'KTC 1' },
  { position: { lat: 1.557163780980274, lng: 103.64460804863758 }, name: 'KTC 2' },
  { position: { lat: 1.5550735791790977, lng: 103.64436190624637 }, name: 'KTC 3' },
  { position: { lat: 1.555303544104901, lng: 103.64635970136622 }, name: 'KTC 4' },
  { position: { lat: 1.5548746884774363, lng: 103.6481206383835 }, name: 'KTC 5' },
  { position: { lat: 1.56065612985083, lng: 103.6489486679352 }, name: 'K10' },
  { position: { lat: 1.5587169453312855, lng: 103.64928607410961 }, name: 'K9' },
  { position: { lat: 1.5644510049424385, lng: 103.65342512137904 }, name: 'T02' },
  { position: { lat: 1.56294159971074, lng: 103.65491863373651 }, name: 'Senai' },
  { position: { lat: 1.5600262825573668, lng: 103.65579333466705 }, name: 'FM' },
  { position: { lat: 1.5567385130069766, lng: 103.64755398760182 }, name: 'KP' },
  { position: { lat: 1.5644306398717538, lng: 103.63842002374014 }, name: 'FKT' },
  { position: { lat: 1.5665533254432862, lng: 103.64036316383651 }, name: 'N29' },
  { position: { lat: 1.5757059386867645, lng: 103.61964077715756 }, name: 'KDOJ 1' },
  { position: { lat: 1.5751600074453354, lng: 103.6181358780248 }, name: 'KDOJ 2' }
];

const busData = [
  { id: 1, position: { lat: 1.5586928453191957, lng: 103.63528569782638 }, route: [{ lat: 1.5586928453191957, lng: 103.63528569782638 }, { lat: 1.5603304157190552, lng: 103.63485874559022 }] },
  // Add more buses with their routes as needed
];

const routeKeys = Object.keys(busRoutes);

function LocationTracker() {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyCJ6a-xeKOWK4JWSifzJJfSUNWvlGaLfzU',
  });

  const [map, setMap] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [visibleRoute, setVisibleRoute] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);

  const onLoad = React.useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback() {
    setMap(null);
  }, []);

  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
  };

  const handleShowBusRoute = (routeKey) => {
    // Check if the clicked route is already visible
    if (visibleRoute === routeKey) {
      // If yes, close the route
      setVisibleRoute(null);
      setSelectedRoute(null);
    } else {
      // If not, set the clicked route to be visible
      setVisibleRoute(routeKey);
      setSelectedRoute(busRoutes[routeKey].route);
    }
  };

  if (loadError) {
    return <p>Error loading map: {loadError.message}</p>;
  }

  if (!isLoaded) {
    return <p>Loading map...</p>;
  }


  return (
    <div>
      <div>
        <AdminNavbar />
      </div>
      <div style={containerStyle}>
        {/* Map Container */}
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={center}
          zoom={16}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={{ mapId: "556e9663519326d5" }}
          className="google-map"
        >
          {selectedRoute && (
            <Polyline
              path={selectedRoute}
              options={{
                strokeColor: "#00FF00", // Change the color as needed
                strokeOpacity: 1,
                strokeWeight: 5,
              }}
            />
          )}

          {/* Static markers */}
          {staticMarkers.map((marker) => (
            <div key={marker.name}>
              <Marker
                position={marker.position}
                onClick={() => handleMarkerClick(marker)}
                options={{
                  icon: {
                    url: CustomMarker,
                    scaledSize: new window.google.maps.Size(18, 18),
                  },
                }}
              />
              {selectedMarker === marker && (
                <InfoWindow
                  position={marker.position}
                  onCloseClick={() => setSelectedMarker(null)}
                >
                  <div>
                    <h3>{marker.name}</h3>
                  </div>
                </InfoWindow>
              )}
            </div>
          ))}

          {/* Bus markers */}
          {busData.map((bus) => (
            <div key={bus.id}>
              <Marker
                position={bus.position}
                onClick={() => handleMarkerClick(bus)}
                options={{
                  icon: {
                    url: CustomMarker,
                    scaledSize: new window.google.maps.Size(18, 18),
                  },
                }}
              />
            </div>
          ))}
        </GoogleMap>
      </div>

      {/* Button Container */}
      <div className='buttonContainerStyle'>
        {routeKeys.slice(0, 8).map((routeKey) => {
          const isRouteVisible = visibleRoute === routeKey;

          return (
            <button
              key={routeKey}
              onClick={() => handleShowBusRoute(routeKey)}
              style={{ margin: '5px', color: isRouteVisible ? '#FF0000' : 'inherit' }}
            >
              {`${routeKey}`}
            </button>
          );
        })}
      </div>
    </div>
  );
}


export default LocationTracker;