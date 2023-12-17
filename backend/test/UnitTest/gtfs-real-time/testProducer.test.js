/*import {describe, expect, it, jest} from "@jest/globals";
import {createTopic} from "../../../src/gtfs-realtime/realtimeProducer.js";
import { Kafka } from 'kafkajs';
jest.mock('kafkajs', () => {
    const mockAdmin = () => ({
        connect: jest.fn().mockResolvedValue(),
        disconnect: jest.fn().mockResolvedValue(),
        listTopics: jest.fn().mockResolvedValue([]),
        createTopics: jest.fn().mockResolvedValue()
    });

    return { Kafka: jest.fn(() => ({ admin: mockAdmin })) };
});

describe('createTopic', () => {
    it('should create a topic if it does not exist', async () => {
        const admin = new Kafka().admin();
        admin.listTopics.mockResolvedValue(['existingTopic']);

        await createTopic('newTopic');

        expect(admin.connect).toHaveBeenCalled();
        expect(admin.listTopics).toHaveBeenCalled();
        expect(admin.createTopics).toHaveBeenCalledWith({
            topics: [{ topic: 'newTopic', numPartitions: 1 }]
        });
        expect(admin.disconnect).toHaveBeenCalled();
    });
});*/