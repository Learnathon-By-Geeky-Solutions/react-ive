import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { 
  XCircle, 
  Briefcase, 
  DollarSign, 
  Clock, 
  MapPin, 
  BookOpen,
  Code,
  Calendar,
  Check,
  Users,
  User,
  Clock3,
  Calendar as CalendarIcon,
  FileText
} from 'lucide-react';

// Success Modal Component
const SuccessModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-t-2xl -mx-6 -mt-6 mb-4">
          <h2 className="text-2xl font-bold tracking-wide flex items-center gap-2">
            <Check className="w-7 h-7" /> Post Created Successfully
          </h2>
        </div>
        <p className="text-gray-700 mb-6 text-center">
          Your tuition post has been created and is now live. Would you like to view your posts?
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onConfirm}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full py-2 px-6 hover:from-indigo-600 hover:to-purple-700 transition-all duration-300"
          >
            View Posts
          </button>
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-700 rounded-full py-2 px-6 hover:bg-gray-300 transition-all duration-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Main CreatePost Component
const CreatePost = () => {
  const [formData, setFormData] = useState({
    name: "",
    medium: "",
    class: "",
    studentGender: "",
    preferredTutor: "",
    days: "",
    tutoringTime: "",
    tutoringDuration: "",
    numberOfStudents: 1,
    subjects: [],
    salary: "",
    location: "",
    otherRequirements: "",
    deadline: "",
  });

  const mediumOptions = ["Bangla Medium", "English Medium", "English Version"];
  const genderOptions = ["Male", "Female", "Other"];
  
  const getClassOptions = (medium) => {
    const baseOptions = ["Pre-School", "KG"];
    const commonClasses = ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10"];
    
    if (medium === "English Medium") {
      return [...baseOptions, ...commonClasses, "O Level", "A Level"];
    } else {
      // For Bangla Medium and English Version
      return [...baseOptions, ...commonClasses, "SSC", "HSC"];
    }
  };

  const [subjectInput, setSubjectInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prevData => {
      // If medium changes, reset class selection
      if (name === "medium" && prevData.medium !== value) {
        return { ...prevData, [name]: value, class: "" };
      }
      return { ...prevData, [name]: value };
    });
  };

  const handleSubjectAdd = () => {
    if (subjectInput.trim() && !formData.subjects.includes(subjectInput.trim())) {
      setFormData((prevData) => ({
        ...prevData,
        subjects: [...prevData.subjects, subjectInput.trim()],
      }));
      setSubjectInput("");
    }
  };

  const handleSubjectDelete = (subjectToDelete) => {
    setFormData((prevData) => ({
      ...prevData,
      subjects: prevData.subjects.filter((subject) => subject !== subjectToDelete),
    }));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubjectAdd();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if(!token) {
        alert("You need to be logged in to create a post!");
        return;
      }
      
      const response = await fetch("http://localhost:3500/post/createPost", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowModal(true);
      } else {
        alert("Error creating post!");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleViewPosts = () => {
    navigate("/posts");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <Navbar />
      
      <SuccessModal 
        isOpen={showModal} 
        onClose={handleCloseModal} 
        onConfirm={handleViewPosts} 
      />
      
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden mt-16 mb-16">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6">
          <h1 className="text-3xl font-bold tracking-wide">Create a New Tuition Post</h1>
          <p className="mt-2 text-indigo-100">Fill in the details to find the perfect tutor for your needs</p>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Post Name */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Briefcase className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="name"
                placeholder="Post Title *"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                required
              />
            </div>
            
            {/* Medium */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <BookOpen className="w-5 h-5 text-gray-400" />
              </div>
              <select
                name="medium"
                value={formData.medium}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 appearance-none bg-white"
                required
              >
                <option value="" disabled>Select Medium *</option>
                {mediumOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            
            {/* Class */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <BookOpen className="w-5 h-5 text-gray-400" />
              </div>
              <select
                name="class"
                value={formData.class}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 appearance-none bg-white"
                required
                disabled={!formData.medium}
              >
                <option value="" disabled>Select Class *</option>
                {formData.medium && getClassOptions(formData.medium).map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            
            {/* Student Gender */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <User className="w-5 h-5 text-gray-400" />
              </div>
              <select
                name="studentGender"
                value={formData.studentGender}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 appearance-none bg-white"
                required
              >
                <option value="" disabled>Student Gender *</option>
                {genderOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            
            {/* Preferred Tutor */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <User className="w-5 h-5 text-gray-400" />
              </div>
              <select
                name="preferredTutor"
                value={formData.preferredTutor}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 appearance-none bg-white"
                required
              >
                <option value="" disabled>Preferred Tutor Gender *</option>
                {genderOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            
            {/* Tutoring Days */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <CalendarIcon className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="number"
                name="days"
                placeholder="Days Per Week *"
                min="1"
                max="7"
                value={formData.days}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                required
              />
            </div>
            
            {/* Tutoring Time */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Clock className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="tutoringTime"
                placeholder="Tutoring Time (e.g. '5:00 PM' or 'Negotiable') *"
                value={formData.tutoringTime}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                required
              />
            </div>
            
            {/* Tutoring Duration */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Clock3 className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="tutoringDuration"
                placeholder="Tutoring Duration (e.g. '1.5 hours' or '2 hours') *"
                value={formData.tutoringDuration}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                required
              />
            </div>
            
            {/* Number of Students */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Users className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="number"
                name="numberOfStudents"
                placeholder="Number of Students *"
                min="1"
                value={formData.numberOfStudents}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                required
              />
            </div>
            
            {/* Salary */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <DollarSign className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="number"
                name="salary"
                placeholder="Monthly Salary (in Taka) *"
                value={formData.salary}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                required
              />
            </div>
            
            {/* Location */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <MapPin className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="location"
                placeholder="Location *"
                value={formData.location}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                required
              />
            </div>

            {/* Deadline */}
            <div className="relative">
              <label htmlFor="deadline" className="absolute -top-2 left-3 px-1 text-xs font-medium text-purple-600 bg-white">
                Application Deadline
              </label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Calendar className="w-5 h-5 text-gray-400" />
              </div>
              <input
                id="deadline"
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 pt-3"
                required
              />
            </div>
            
            {/* Other Requirements */}
            <div className="relative">
              <div className="absolute top-3 left-3">
                <FileText className="w-5 h-5 text-gray-400" />
              </div>
              <textarea
                name="otherRequirements"
                placeholder="Other Requirements (optional)"
                value={formData.otherRequirements}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 min-h-24"
              />
            </div>
            
            {/* Subjects */}
            <div className="space-y-3">
              <h3 className="font-medium text-gray-700">Subjects Required *</h3>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <Code className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Add Subject"
                  value={subjectInput}
                  onChange={(e) => setSubjectInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                />
              </div>
              
              <button
                type="button"
                onClick={handleSubjectAdd}
                className="bg-indigo-500 text-white rounded-full py-2 px-6 shadow-md hover:bg-indigo-600 transition-all duration-300"
              >
                Add Subject
              </button>
              
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.subjects.map((subject, index) => (
                  <div 
                    key={index} 
                    className="bg-gradient-to-r from-indigo-400 to-purple-500 text-white px-3 py-1 rounded-full flex items-center gap-1"
                  >
                    <span>{subject}</span>
                    <button
                      type="button"
                      onClick={() => handleSubjectDelete(subject)}
                      className="focus:outline-none"
                    >
                      <XCircle className="w-4 h-4 hover:text-red-200 transition-colors" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="mt-8">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full py-3 font-semibold text-lg shadow-md hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-70"
            >
              {loading ? "Creating..." : "Create Tuition Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;