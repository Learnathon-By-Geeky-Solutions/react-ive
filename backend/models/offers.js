import mongoose from 'mongoose';

const OfferSchema = mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId, ref: "User"
    },
    guardianId:{
        type: mongoose.Schema.Types.ObjectId, ref: "User"
    },
    applicationId: {
        type: mongoose.Schema.Types.ObjectId, ref: "Application"
    },
    status: {
        type: String, 
        enum: ['PENDING', 'ACCEPTED', 'Rejected'], default: 'PENDING'
    },
     offerLetterPath: String,
});

export default mongoose.model("Offer", OfferSchema);