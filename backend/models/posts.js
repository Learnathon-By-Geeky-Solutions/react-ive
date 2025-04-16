import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    name: { type: String, required: true },
    medium: { type: String, enum: ['BANGLA', 'ENGLISH'], required: true },
    salary: { type: Number, required: true },
    experience: { type: Number, required: true },
    location: { type: String, required: true },
    deadline: { type: Date, default: null },
    class: {type: String, required: true},
    days: {type: Number, required: true},
    subject: {type: mongoose.Schema.Types.ObjectId, ref: 'Subjects' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    applications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Apply' }]
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);
export default Post;
