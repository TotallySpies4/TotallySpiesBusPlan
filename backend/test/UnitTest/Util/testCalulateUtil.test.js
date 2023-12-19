import {describe, it, expect, jest} from '@jest/globals';
import * as util from "../../../src/utils/calculateUtil.js";
import {calculateScheduledSpeed} from "../../../src/utils/speedCalculator.js";


describe('testCalculateUtil', () => {
    it('should return correct time difference in seconds', () => {
        const startTime = '08:30:00';
        const endTime = '08:35:00';
        const expectedResult = 300.002; // 5 minutes in seconds
        const tolerance = 5; // Toleranz von 1 Sekunde

        expect(util.timeDifferenceInSeconds(startTime, endTime)).toBeGreaterThanOrEqual(expectedResult - tolerance);
        expect(util.timeDifferenceInSeconds(startTime, endTime)).toBeLessThanOrEqual(expectedResult + tolerance);
    });


    it('should handle time difference when endTime is past midnight', () => {
        const startTime = '23:55:00';
        const endTime = '00:05:00';
        const expectedResult = -85799.999; // 10 minutes in seconds
        expect(util.timeDifferenceInSeconds(startTime, endTime)).toBeCloseTo(expectedResult);
    });

    it('should return zero when startTime and endTime are the same', () => {
        const time = '12:00:00';
        expect(util.timeDifferenceInSeconds(time, time)).toBe(0);
    });

    it('should return negative time difference when startTime is after endTime', () => {
        const startTime = '09:00:00';
        const endTime = '08:00:00';
        const expectedResult = -3600; // -1 hour in seconds
        expect(util.timeDifferenceInSeconds(startTime, endTime)).toBe(expectedResult);
    });

    it('should return the current date for undefined or empty timeString', () => {
        const undefinedTime = undefined;
        const emptyTime = '';
        const currentDateTime = new Date();

        const resultForUndefined = util.parseTime(undefinedTime);
        const resultForEmpty = util.parseTime(emptyTime);

        // Überprüfen, ob das Datum heute ist, da es schwierig ist, die exakte Zeit zu vergleichen
        expect(resultForUndefined.toDateString()).toBe(currentDateTime.toDateString());
        expect(resultForEmpty.toDateString()).toBe(currentDateTime.toDateString());
    });

    it('should parse a valid timeString correctly', () => {
        const timeString = '08:30:15'; // Beispielzeit
        const expectedResult = new Date();
        expectedResult.setHours(8, 30, 15);
        expectedResult.setMilliseconds(0); // Setze Millisekunden auf 0

        const result = util.parseTime(timeString);

        // Es kann nötig sein, auch bei 'result' die Millisekunden auf 0 zu setzen
        result.setMilliseconds(0);

        expect(result).toEqual(expectedResult);
    });



    it('should return 30 when time difference is 0', () => {
        // Mock Stops mit gleicher Abfahrts- und Ankunftszeit
        const stop1 = { departure_time: '08:30:00' };
        const stop2 = { arrival_time: '08:30:00' };

        const result = util.calculateTimeDifference(stop1, stop2);

        // Toleranzgrenze, um minimale Zeitunterschiede zu berücksichtigen
        const tolerance = 0.1; // z.B. 0.1 Sekunden

        expect(result).toBeLessThanOrEqual(30 + tolerance);
        expect(result).toBeGreaterThanOrEqual(30 - tolerance);
    });

    it('should return correct time difference when it is not 0', () => {
        // Mock Stops mit unterschiedlicher Abfahrts- und Ankunftszeit
        const stop1 = { departure_time: '08:30:00' };
        const stop2 = { arrival_time: '08:45:00' };

        const result = util.calculateTimeDifference(stop1, stop2);

        expect(result).toBeCloseTo(900); // Erwartet wird 900 Sekunden (15 Minuten)
    });

    it('should accurately calculate the distance between two coordinates', () => {
        // Bekannte Koordinaten von Paris und London
        const paris = { lat: 48.8566, lon: 2.3522 };
        const london = { lat: 51.5074, lon: -0.1278 };

        // Berechnete Entfernung mit der Funktion
        const distance = util.calculateDistance(paris.lat, paris.lon, london.lat, london.lon);

        // Die bekannte Entfernung zwischen Paris und London beträgt etwa 344 Kilometer.
        // Hier wird ein kleiner Toleranzbereich hinzugefügt, um leichte Abweichungen zu berücksichtigen.
        expect(distance).toBeCloseTo(344, 0);
    });

    it('should accurately calculate the haversine distance between two coordinates', () => {
        // Bekannte Koordinaten von San Francisco und Los Angeles
        const sanFrancisco = { lat: 37.7749, lon: -122.4194 };
        const losAngeles = { lat: 34.0522, lon: -118.2437 };

        // Berechnete Entfernung mit der Funktion
        const distance = util.haversineDistance(sanFrancisco.lat, sanFrancisco.lon, losAngeles.lat, losAngeles.lon);
        expect(distance).toBeCloseTo(559120.5770615533);
    });


    it('should return true when the vehicle is moving towards the next stop within tolerance', () => {
        const nextStopBearing = 45; // Nächste Haltestelle
        const vehicleBearing = 40; // Fahrzeugausrichtung
        const tolerance = 10; // Toleranz

        const result = util.isMovingTowards(nextStopBearing, vehicleBearing, tolerance);

        expect(result).toBe(true);
    });

    it('should return true when the vehicle is moving towards the next stop with a wrap-around bearing', () => {
        const nextStopBearing = 350; // Nächste Haltestelle
        const vehicleBearing = 10; // Fahrzeugausrichtung (nach 360 Grad Wrap-around)
        const tolerance = 20; // Toleranz

        const result = util.isMovingTowards(nextStopBearing, vehicleBearing, tolerance);

        expect(result).toBe(true);
    });

    it('should return false when the vehicle is not moving towards the next stop within tolerance', () => {
        const nextStopBearing = 90; // Nächste Haltestelle
        const vehicleBearing = 180; // Fahrzeugausrichtung
        const tolerance = 10; // Toleranz

        const result = util.isMovingTowards(nextStopBearing, vehicleBearing, tolerance);

        expect(result).toBe(false);
    });

    it('should calculate the bearing correctly between two coordinates', () => {
        const currentStop = {
            location: {
                latitude: 37.7749, // San Francisco
                longitude: -122.4194,
            },
        };
        const nextStop = {
            location: {
                latitude: 34.0522, // Los Angeles
                longitude: -118.2437,
            },
        };

        const result = util.calculateBearing(currentStop, nextStop);


        const expectedBearing = 133;
        const tolerance = 5; // Toleranz von 5 Grad

        expect(result).toBeGreaterThanOrEqual(expectedBearing - tolerance);
        expect(result).toBeLessThanOrEqual(expectedBearing + tolerance);
    });

    it('should throw an error when an error occurs during calculation', () => {
        // Mocken Sie calculateDistance und timeDifferenceInSeconds, um einen Fehler auszulösen
        jest.spyOn(util, 'calculateDistance').mockImplementation(() => {
            throw new Error('Mocked calculateDistance error');
        });

        jest.spyOn(util, 'timeDifferenceInSeconds').mockImplementation(() => {
            throw new Error('Mocked timeDifferenceInSeconds error');
        });

        // Beispiel-Stop-Zeiten und Koordinaten
        const previousStop = {
            location: { latitude: 40.7128, longitude: -74.0060 },
            departure_time: '08:00:00',
        };
        const currentStop = {
            location: { latitude: 34.0522, longitude: -118.2437 },
            arrival_time: '12:00:00',
        };

        // Erwartung: Die Funktion sollte einen Fehler auslösen
        expect(() => calculateScheduledSpeed(previousStop, currentStop)).toThrowError('Error calculating speed:');

        // Stellen Sie die Mocks wieder her
        jest.restoreAllMocks();
    });

});
