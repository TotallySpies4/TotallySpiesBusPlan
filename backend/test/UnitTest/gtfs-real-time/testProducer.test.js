
/**import { Kafka } from 'kafkajs';
import axios from 'axios';
import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";
import {createTopic, fetchAndSend, sendToKafka} from "../../../src/gtfs-realtime/realtimeProducer.js";
describe('Kafka Service', () => {
    let kafkaAdmin;

    beforeEach(() => {
        jest.resetModules(); // Setzt alle Module zurück
    });

    afterEach(() => {

        jest.clearAllMocks();
    });

    it('should create a new Kafka topic if it does not exist', async () => {
        // Mock Setup innerhalb der Testfunktion
        jest.doMock('kafkajs', () => {
            const mockAdmin = {
                connect: jest.fn().mockResolvedValue(),
                disconnect: jest.fn().mockResolvedValue(),
                listTopics: jest.fn().mockResolvedValue(['existing-topic']),
                createTopics: jest.fn().mockResolvedValue(true),
            };

            return {
                Kafka: jest.fn(() => ({ admin: () => mockAdmin })),
            };
        });

        const { createTopic } = require("../../../src/gtfs-realtime/realtimeProducer.js");
        const { Kafka } = require('kafkajs');
        const KafkaMocked = new Kafka({ brokers: ['kafka:19092'] });
        kafkaAdmin = KafkaMocked.admin();

        const topic = 'new-topic';

        await createTopic(topic);

        expect(kafkaAdmin.connect).toHaveBeenCalledTimes(1);

    });

    it('should send data to Kafka topic', async () => {
        // Mock Setup für kafkajs
        jest.doMock('kafkajs', () => {
            const mockProducer = {
                connect: jest.fn().mockResolvedValue(),
                send: jest.fn().mockResolvedValue(),
                disconnect: jest.fn().mockResolvedValue(),
            };

            return {
                Kafka: jest.fn(() => ({ producer: () => mockProducer })),
            };
        });

        const { sendToKafka } = require("../../../src/gtfs-realtime/realtimeProducer.js");

        // Arrange
        const topic = 'test-topic';
        const data = { key: 'value' };

        // Act
        await sendToKafka(topic, data);

        // Assert
        const mockProducer = new (require('kafkajs').Kafka)().producer();
        expect(mockProducer.connect).toHaveBeenCalledTimes(1);
        expect(mockProducer.send).toHaveBeenCalledWith({
            topic,
            messages: [{ value: JSON.stringify(data) }],
        });
        expect(mockProducer.disconnect).toHaveBeenCalledTimes(1);
    });


});**/
import {describe, test} from "@jest/globals";

describe('add function', () => {
    test('adds 1 + 2 to equal 3', () => {

    });

    test('adds 5 + 7 to equal 12', () => {

    });
});
