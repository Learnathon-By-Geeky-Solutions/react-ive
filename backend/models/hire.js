import mongoose from 'mongoose';

const HireSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId, ref: "User", required: true
    },
    guardianId: {
        type: mongoose.Schema.Types.ObjectId, ref: "User", required: true
    }
}, {timestamps: true});

HireSchema.index({studentId: 1, guardianId: 1}, {unique: true});

export default mongoose.model("Hire", HireSchema);