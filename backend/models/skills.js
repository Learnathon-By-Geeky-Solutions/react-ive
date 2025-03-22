import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
    name: { type: String, unique: true, required: true }, 
});

const Skill = mongoose.model('Skill', skillSchema);
export default Skill;