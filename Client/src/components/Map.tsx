import React from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import GeoCoderMarker from './GeoCoderMarker';
interface MapProp {
  location: string;
}

const Map: React .FC<MapProp> = ({location}) => {
  
  return (
    <MapContainer 
      center={[53.35, 18.8]}
      zoom={5}
      scrollWheelZoom={false}
      style={{  
        height:"50vh",
        width:'100%',
        border:'2px solid black'
      }}>
    <TileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <GeoCoderMarker location={`${location}`} />

 
  </MapContainer>
  )
}

export default Map
