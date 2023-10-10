import React, { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { formatTime } from "./utils/utils.js";
import Select from "react-select";

const Map = ({ selectedBus, setSidebarOpen, isSidebarOpen }) => {
  return (
    <div className="map">
      <MapContainer
        center={[52.520008, 13.404954]}
        zoom={13}
        style={{ height: "100vh", width: "100vw" }}
        zoomControl={false}>
        <button
          className="sidebar-toggle"
          onClick={() => setSidebarOpen(!isSidebarOpen)}>
          {!isSidebarOpen && (
            <div className="w-24 h-24">
              <img src="/icon/bus-station.png" alt="Filter bus line" />
            </div>
          )}
        </button>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {selectedBus &&
          selectedBus.stop_times.map((stopTime) => (
            <Marker
              key={stopTime.stop_id}
              position={[
                stopTime.location.latitude,
                stopTime.location.longitude,
              ]}>
              <Popup>
                {stopTime.stop_name} - {stopTime.arrival_time.slice(0, -3)}
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
};

export default Map;
