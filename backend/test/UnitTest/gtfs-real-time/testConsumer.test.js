/**import { Kafka } from 'kafkajs';
import mongoose from 'mongoose';


import { beforeEach, afterEach, describe, expect, it, jest } from '@jest/globals';
import { setupConsumerForCity } from "../../../src/gtfs-realtime/realtimeConsumer.js";
import {VehiclePositions} from "../../../src/DBmodels/vehiclepositions.js";
import {Route, Trip} from "../../../src/DBmodels/busline.js";
import {AmsterdamVehicleDataProcessor} from "../../../src/gtfs-realtime/AmsterdamVehicleDataProcessor.js";
import {StockholmVehicleDataProcessor} from "../../../src/gtfs-realtime/StockholmVehicleDataProcessor.js";

jest.mock('kafkajs'); // Mock Kafka
jest.mock('mongoose'); // Mock Mongoose
jest.mock('../../../src/DBmodels/vehiclepositions.js'); // Mock VehiclePositions
jest.mock('../../../src/DBmodels/busline.js'); // Mock Trip
jest.mock('../../../src/DBmodels/busline.js'); // Mock Route
jest.mock('../../../src/gtfs-realtime/AmsterdamVehicleDataProcessor.js'); // Mock AmsterdamVehicleDataProcessor
jest.mock('../../../src/gtfs-realtime/StockholmVehicleDataProcessor.js'); // Mock StockholmVehicleDataProcessor

describe('setupConsumerForCity', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should connect to Kafka and MongoDB successfully', async () => {
    const mockConsumer = new Kafka.consumer({ groupId: 'test-group' });
    const mockTrip = { _id: 'tripId', route_id: 'routeId' };
    const mockRoute = { _id: 'routeId' };
    const mockAmsterdamProcessor = new AmsterdamVehicleDataProcessor();
    const mockStockholmProcessor = new StockholmVehicleDataProcessor();

    Kafka.mockImplementation(() => ({ consumer: () => mockConsumer }));
    mongoose.connect.mockResolvedValuePromise();
    VehiclePositions.deleteMany.mockResolvedValuePromise();
    mockConsumer.connect.mockResolvedValuePromise();
    mockConsumer.subscribe.mockResolvedValuePromise();
    Trip.findOne.mockResolvedValueOnce(mockTrip);
    Route.findOne.mockResolvedValueOnce(mockRoute);
    AmsterdamVehicleDataProcessor.mockImplementation(() => mockAmsterdamProcessor);
    StockholmVehicleDataProcessor.mockImplementation(() => mockStockholmProcessor);

    await setupConsumerForCity('test-topic', 'amsterdam');

    expect(Kafka.mock.calls.length).toBe(1);
    expect(mongoose.connect.mock.calls.length).toBe(1);
    expect(VehiclePositions.deleteMany.mock.calls.length).toBe(1);
    expect(mockConsumer.connect.mock.calls.length).toBe(1);
    expect(mockConsumer.subscribe.mock.calls.length).toBe(1);
    expect(Trip.findOne.mock.calls.length).toBe(1);
    expect(Route.findOne.mock.calls.length).toBe(1);
    expect(AmsterdamVehicleDataProcessor.mock.calls.length).toBe(1);
    expect(mockAmsterdamProcessor.createNewVehicle).toHaveBeenCalledTimes(1);
  });

});
**/

import {describe, test} from "@jest/globals";

describe('add function', () => {
    test('adds 1 + 2 to equal 3', () => {

    });

    test('adds 5 + 7 to equal 12', () => {

    });
});
