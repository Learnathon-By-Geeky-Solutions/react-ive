import Subjects from "../models/subjects.js";

export const getSubjects = async (req, res) => {
    try {
      const subjects = await Subjects.find();
      res.status(200).json(subjects);
    } catch (error) {
      console.error('Error fetching subjects:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  