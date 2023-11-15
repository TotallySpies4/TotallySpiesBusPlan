import mongoose, {Schema} from "mongoose";

const fileSchema = new Schema({
    filename: String,
    file_data: Buffer,
});

const File = mongoose.model('File', fileSchema);

export { File };