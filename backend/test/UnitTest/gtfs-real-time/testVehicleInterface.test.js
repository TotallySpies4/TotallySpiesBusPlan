import {describe, it, expect, beforeEach} from '@jest/globals';
import {IVehicleDataProcessor} from "../../../src/gtfs-realtime/IVehicleDataProcessor.js";

describe('IVehicleDataProcessor', () => {
    let dataProcessor;

    beforeEach(() => {
        dataProcessor = new IVehicleDataProcessor();
    });

    it('should throw an error when createNewVehicle is called', () => {
        expect(() => {
            dataProcessor.createNewVehicle();
        }).toThrow("Method 'process()' must be implemented.");
    });

    it('should throw an error when updateVehicle is called', () => {
        expect(() => {
            dataProcessor.updateVehicle();
        }).toThrow("Method 'process()' must be implemented.");
    });
});
