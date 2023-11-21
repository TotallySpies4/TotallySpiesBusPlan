import React, { useState } from "react";

export const ReroutingButton = () => {
  const [isReroutingPressed, setReroutingPressed] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedBusLine, setSelectedBusLine] = useState(null);

  // const handleRerouting = async() => {
  //   setReroutingPressed(true);
  //   if (selectedCity && selectedBusLine) {
  //     setReroutingPressed(true);
  
  //     try {
  //       const response = await fetch(
  //         http://localhost:5000/reroute?city=${selectedCity}&busLine=${selectedBusLine}
  //       );
  //       const data = await response.json();
  //       console.log(data);
  //       setReroutingPressed(false);
  
  //     } catch (error) {
  //       console.error("Error during rerouting:", error);
  //     } finally {
  //       setReroutingPressed(false);
  //     }
  //   }
  // };

  const buttonColor =
    selectedCity && selectedBusLine && !isReroutingPressed
      ? "bg-blue-500 hover:bg-blue-700"
      : "bg-gray-500";

  return (
    <button
      type="button"
      id="rerouting-button"
      className={`flex h-10 items-center text-white font-bold py-2 px-4 rounded-full shadow-xl ${buttonColor}`}
      // onClick={handleRerouting}
      disabled={isReroutingPressed || !selectedCity || !selectedBusLine}>
      Rerouting
    </button>
  );
};