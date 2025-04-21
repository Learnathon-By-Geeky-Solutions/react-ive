import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    userType: {
        type: String,
        enum: ["student", "guardian"],
        required: true,
    },
    gender: {
        type: String,
        enum: ["MALE", "FEMALE", "OTHERS"],
    },
    session: {
        type: String,
    },
    department: {
        type: String,
    },
    studyingSubject: {
        type: String,
    },
    subjects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subjects",
    }],
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;
