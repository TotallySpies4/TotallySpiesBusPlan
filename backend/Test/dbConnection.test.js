
import mongoose from 'mongoose';
import TestItem from './DBTestItem/testItem.js';
import {beforeAll, afterAll, describe, test, expect} from "@jest/globals";


// You can replace this with your own connection string if needed
const mongoDB = 'mongodb://localhost:27017/TotallySpiesBusPlan';

beforeAll(async () => {
    await mongoose.connect(mongoDB, {
        serverSelectionTimeoutMS: 60000
    });
}, 100000);

afterAll(async () => {
    await mongoose.connection.close();
}, 100000);

describe('Database Connection and CRUD Operations', () => {

    test('should save a new TestItem', async () => {
        const testItem = new TestItem({
            name: 'TestName',
            value: 123,
        });

        const savedItem = await testItem.save();
        expect(savedItem.name).toBe('TestName');
        expect(savedItem.value).toBe(123);
    });

    test('should retrieve the saved TestItem', async () => {
        const foundItem = await TestItem.findOne({ name: 'TestName' });
        expect(foundItem.name).toBe('TestName');
        expect(foundItem.value).toBe(123);
    });

    test('should delete the saved TestItem', async () => {
        expect(await TestItem.countDocuments()).toBe(1);
        await TestItem.deleteOne({ name: 'TestName' });
        const foundItem = await TestItem.findOne({ name: 'TestName' });
        expect(foundItem).toBeNull();
    });
});
