import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    name: { type: String, required: true },
    position: { type: String, required: true },
    salary: { type: Number, required: true },
    experience: { type: Number, required: true },
    location: { type: String, required: true },
    deadline: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    skills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }], // References the Skill collection
    applications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Apply' }]
}, { timestamps: true });

const post = mongoose.model('Post', postSchema);
export default post;
