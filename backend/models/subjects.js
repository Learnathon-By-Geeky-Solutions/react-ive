import mongoose from 'mongoose';

const subjectsSchema = new mongoose.Schema({
    name: { type: String, unique: true, required: true }, 
});

const Subjects = mongoose.model('Subjects', subjectsSchema);
export default Subjects;