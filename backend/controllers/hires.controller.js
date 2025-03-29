import Hire from '../models/hire.js';

export const hire = async (req, res) => {
    try {
        const { studentId, guardianId } = req.body;

        // Check if the hire record already exists
        const existingHire = await Hire.findOne({ studentId, guardianId });

        if (existingHire) {
            return res.status(400).json({ message: "This job seeker is already hired by this company." });
        }

        // Create a new hire record
        const newHire = await Hire.create({ studentId, guardianId });

        res.status(201).json(newHire);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while hiring." });
    }
};


export const getHires = async (req, res) => {
    try {
        const { guardianId } = req.params;

        const hires = await Hire.find({ guardianId })
            .populate({
                path: 'studentId',
                model: 'User',
                select: 'name email',  // Select job seeker details
                populate: {
                    path: 'applications',
                    model: 'Application',
                    populate: {
                        path: 'post',
                        model: 'Post' // Populate job post details
                    }
                }
            })
            .populate({
                path: 'guardianId',
                model: 'User',  // Populate company details
                select: 'name email' 
            });

        // If no hires are found
        if (!hires.length) {
            return res.status(404).json({ message: "No hires found for this company." });
        }

        res.status(200).json(hires);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while fetching the hires." });
    }
};
