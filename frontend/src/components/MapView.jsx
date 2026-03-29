import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const MapView = ({ locations = [] }) => {
  const valid = locations.filter(
    l => (l.lat || l.latitude) && (l.lng || l.longitude || l.lon)
  );

  return (
    <div style={{
      height: "450px",
      borderRadius: "10px",
      overflow: "hidden"
    }}>
      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        style={{ height: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {valid.map((loc, i) => {
          const lat = loc.lat || loc.latitude;
          const lng = loc.lng || loc.longitude || loc.lon;

          return (
            <Marker key={i} position={[lat, lng]}>
              <Popup>
                🌍 Attack <br />
                IP: {loc.ip}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapView;