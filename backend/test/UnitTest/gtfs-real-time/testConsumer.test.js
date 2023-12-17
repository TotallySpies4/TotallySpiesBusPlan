import {beforeEach, describe, expect, it, jest} from "@jest/globals";
import { setupConsumerForCity } from '../../../src/gtfs-realtime/realtimeConsumer.js';
import { Kafka } from 'kafkajs';
import mongoose from 'mongoose';
import { VehiclePositions } from '../../../src/DBmodels/vehiclepositions.js';
import { Route, Trip } from '../../../src/DBmodels/busline.js';
import { StockholmVehicleDataProcessor } from '../../../src/gtfs-realtime/StockholmVehicleDataProcessor.js';
import { AmsterdamVehicleDataProcessor } from '../../../src/gtfs-realtime/AmsterdamVehicleDataProcessor.js';

// Mock mongoose connect method
jest.mock('mongoose', () => ({
  connect: jest.fn().mockResolvedValue(),
  Schema: {
    Types: { ObjectId: jest.fn() },
    // If you use other types, you may need to mock them as well.
    // For example: String: jest.fn(), Number: jest.fn(), ...
  },
}));

// Mock mongoose Schema
mongoose.Schema = jest.fn();

describe('Consumer Setup', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('sets up consumer for Amsterdam', async () => {
    Kafka.prototype.consumer.mockImplementation(() => ({
      connect: jest.fn().mockResolvedValue(),
      subscribe: jest.fn(),
      run: jest.fn(),
    }));

    await setupConsumerForCity('gtfs-realtime-amsterdam', 'amsterdam');

    expect(Kafka.prototype.consumer).toHaveBeenCalledTimes(1);
    const mockConsumerInstance = Kafka.prototype.consumer.mock.instances[0];
    expect(mockConsumerInstance.connect).toHaveBeenCalledTimes(1);
    expect(mockConsumerInstance.subscribe).toHaveBeenCalledWith({ topic: 'gtfs-realtime-amsterdam' });
    expect(mockConsumerInstance.run).toHaveBeenCalledTimes(1);
    expect(mongoose.connect).toHaveBeenCalledTimes(1);
  });

  it('sets up consumer for Stockholm', async () => {
    Kafka.prototype.consumer.mockImplementation(() => ({
      connect: jest.fn().mockResolvedValue(),
      subscribe: jest.fn(),
      run: jest.fn(),
    }));

    await setupConsumerForCity('gtfs-realtime-stockholm', 'stockholm');

    expect(Kafka.prototype.consumer).toHaveBeenCalledTimes(1);
    const mockConsumerInstance = Kafka.prototype.consumer.mock.instances[0];
    expect(mockConsumerInstance.connect).toHaveBeenCalledTimes(1);
    expect(mockConsumerInstance.subscribe).toHaveBeenCalledWith({ topic: 'gtfs-realtime-stockholm' });
    expect(mockConsumerInstance.run).toHaveBeenCalledTimes(1);
    expect(mongoose.connect).toHaveBeenCalledTimes(1);
  });
});
