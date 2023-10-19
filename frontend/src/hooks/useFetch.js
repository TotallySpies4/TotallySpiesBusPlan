import { useState, useEffect } from "react";
const useFetch = (url) => {

    const [ws, setWs] = useState(null);
    const [buses, setBuses] = useState([]);
    const [selectedBus, setSelectedBus] = useState(null);

    useEffect(() => {
        const wsInstance = new WebSocket(url);
        setWs(wsInstance);

        wsInstance.onopen = () => {
            console.log("Connected to the websocket");
        };

        wsInstance.onmessage = (event) => {
            if(event.data === "Hello from server!") {
                console.log(event.data);
            } else {
                const data = JSON.parse(event.data);

                if (data.type === 'ALL_BUS_LINES') {
                    try {
                        const allBusLine = JSON.parse(event.data);
                        console.log(allBusLine.payload);
                        setBuses(allBusLine.payload);


                    } catch (error) {
                        console.error("Error parsing the incoming data:", error);
                    }
                } else if (data.type === 'BUS_LINE_DETAILS') {
                    try {
                        const busLineDetail = JSON.parse(event.data);
                        console.log(busLineDetail);
                        setSelectedBus(busLineDetail.payload);
                    } catch (error) {
                        console.error("Error parsing the incoming data:", error);
                    }
                }
            }
        };

        wsInstance.onclose = () => {
            console.log("Disconnected from the websocket");
    };
    return () => {
        ws.close();
    }
}, [url]);
    const sendRequest = (message) => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(message);
        }
    };
    return { buses, selectedBus, ws , sendRequest};
};

export default useFetch;