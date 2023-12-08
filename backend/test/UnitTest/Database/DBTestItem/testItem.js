import mongoose from 'mongoose';

const testItemSchema = new mongoose.Schema({
    name: String,
    value: Number,
});

const TestItem = mongoose.model('TestItem', testItemSchema);
export default TestItem;