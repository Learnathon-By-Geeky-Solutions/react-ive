import User from "../models/users.js";
import Subjects from "../models/subjects.js";

export const updateProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      name,
      email,
      password,
      userType,
      gender,
      session,
      department,
      studyingSubject,
      subjects // array of subject names
    } = req.body;

    // Find the user first
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Prepare update object dynamically
    const updateData = {};

    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) updateData.password = password;
    if (userType) updateData.userType = userType;
    if (gender) updateData.gender = gender;
    if (session) updateData.session = session;
    if (department) updateData.department = department;
    if (studyingSubject) updateData.studyingSubject = studyingSubject;

    // Handle subjects array update
    if (subjects && Array.isArray(subjects)) {
      const subjectIds = await Promise.all(
        subjects.map(async (subjName) => {
          let subj = await Subjects.findOne({ name: subjName });
          if (!subj) {
            subj = await Subjects.create({ name: subjName });
          }
          return subj._id;
        })
      );
      updateData.subjects = subjectIds;
    }

    // Update the user
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

    res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
