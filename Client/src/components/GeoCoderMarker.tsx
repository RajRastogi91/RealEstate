import React, { useState, useEffect } from 'react'
import { Marker, Popup, useMap } from 'react-leaflet'     
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import icon from 'leaflet/dist/images/marker-icon.png'
import iconshadow from 'leaflet/dist/images/marker-shadow.png'
import * as ELG from 'esri-leaflet-geocoder';
interface GeoCoderMarkerProp {
    location: string;
}

let DefaultIcon = L.icon ({
    iconUrl: icon,
    shadowUrl: iconshadow
})
L.Marker.prototype.options.icon = DefaultIcon

const GeoCoderMarker: React.FC<GeoCoderMarkerProp> = ({location}) => {
    const map = useMap();    
    const [position, setPosition] = useState<[number, number]>([53.35, 18.8]);
    // console.log(map)  

    useEffect(() => {
        ELG.geocode().text(location).run((err:any, results:any)=> {        
            if (err) {
                console.error("Error");
                return;
            }
            if(results?.results?.length > 0){
                const{lat, lng} = results.results[0].latlng;
                setPosition([lat, lng]);    
                map.flyTo([lat, lng], 9);
            }
        });   
    }, [location, map]);
    
   
  return (
    <Marker position={position} icon={DefaultIcon}>
        <Popup>{location}</Popup>    
    </Marker>
  )
}

export default GeoCoderMarker
