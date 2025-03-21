import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { 
  XCircle, 
  Briefcase, 
  DollarSign, 
  Clock, 
  MapPin, 
  Building,
  Code,
  Calendar,
  Check,
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
          Your job post has been created and is now live. Would you like to view your posts?
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
    position: "",
    salary: "",
    experience: "",
    location: "",
    name: "",
    description: "",
    deadline: "",
    skills: [],
  });

  const [skillInput, setSkillInput] = useState("");
  const [allSkills, setAllSkills] = useState([]);
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isLoadingSkills, setIsLoadingSkills] = useState(false);
  const suggestionsRef = useRef(null);
  const navigate = useNavigate();

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch all skills once when component mounts
  useEffect(() => {
    const fetchAllSkills = async () => {
      try {
        setIsLoadingSkills(true);
        const response = await fetch("http://localhost:3500/post/getSkills");

        if (response.ok) {
          const data = await response.json();
          setAllSkills(data);
        }
      } catch (error) {
        console.error("Error fetching skills:", error);
      } finally {
        setIsLoadingSkills(false);
      }
    };

    fetchAllSkills();
  }, []);

  // Filter skills based on input
  useEffect(() => {
    if (skillInput.trim().length < 2) {
      setFilteredSkills([]);
      setShowSuggestions(false);
      return;
    }

    const lowerCaseInput = skillInput.trim().toLowerCase();
    const filtered = allSkills.filter(
      skill => 
        skill.name.toLowerCase().includes(lowerCaseInput) && 
        !formData.skills.includes(skill.name)
    );
    
    setFilteredSkills(filtered);
    setShowSuggestions(filtered.length > 0);
  }, [skillInput, allSkills, formData.skills]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSkillAdd = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData((prevData) => ({
        ...prevData,
        skills: [...prevData.skills, skillInput.trim()],
      }));
      setSkillInput("");
      setShowSuggestions(false);
    }
  };

  const handleSelectSkill = (skillName) => {
    if (!formData.skills.includes(skillName)) {
      setFormData((prevData) => ({
        ...prevData,
        skills: [...prevData.skills, skillName],
      }));
    }
    setSkillInput("");
    setShowSuggestions(false);
  };

  const handleSkillDelete = (skillToDelete) => {
    setFormData((prevData) => ({
      ...prevData,
      skills: prevData.skills.filter((skill) => skill !== skillToDelete),
    }));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSkillAdd();
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    } else if (e.key === "ArrowDown" && showSuggestions && filteredSkills.length > 0) {
      // Allow keyboard navigation in the future
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

  // Highlight matching text in suggestions
  const highlightMatch = (text, query) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query.trim()})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? 
        <span key={index} className="bg-yellow-200 font-medium">{part}</span> : 
        part
    );
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
          <h1 className="text-3xl font-bold tracking-wide">Create a New Job Post</h1>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Company Name */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Building className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="name"
                placeholder="Post Name *"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                required
              />
            </div>
            
            {/* Position */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Briefcase className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="position"
                placeholder="Position *"
                value={formData.position}
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
                placeholder="Salary *"
                value={formData.salary}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                required
              />
            </div>
            
            {/* Experience */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Clock className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="number"
                name="experience"
                placeholder="Experience (years) *"
                value={formData.experience}
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

            <div className="relative">
              <label htmlFor="deadline" className="absolute -top-2 left-3 px-1 text-xs font-medium text-purple-600 bg-white">
                Deadline
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
            
            {/* Skills */}
            <div className="space-y-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <Code className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Add Skill"
                  value={skillInput}
                  onChange={(e) => {
                    setSkillInput(e.target.value);
                    if (e.target.value.trim().length >= 2) {
                      setShowSuggestions(true);
                    }
                  }}
                  onFocus={() => {
                    if (skillInput.trim().length >= 2 && filteredSkills.length > 0) {
                      setShowSuggestions(true);
                    }
                  }}
                  onKeyDown={handleKeyDown}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                />
                
                {/* Suggestions dropdown */}
                {showSuggestions && (
                  <div 
                    ref={suggestionsRef}
                    className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto"
                  >
                    {isLoadingSkills && allSkills.length === 0 ? (
                      <div className="p-2 text-center text-gray-500">Loading skills...</div>
                    ) : filteredSkills.length > 0 ? (
                      <ul>
                        {filteredSkills.map((skill) => (
                          <li 
                            key={skill.id || skill.name} 
                            className="px-4 py-2 hover:bg-indigo-50 cursor-pointer transition-colors flex items-center gap-2"
                            onClick={() => handleSelectSkill(skill.name)}
                          >
                            <Code className="w-4 h-4 text-indigo-500" />
                            <span>{highlightMatch(skill.name, skillInput)}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="p-2 text-center text-gray-500">No matching skills found</div>
                    )}
                  </div>
                )}
              </div>
              
              <button
                type="button"
                onClick={handleSkillAdd}
                className="bg-indigo-500 text-white rounded-full py-2 px-6 shadow-md hover:bg-indigo-600 transition-all duration-300"
              >
                Add Skill
              </button>
              
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.skills.map((skill, index) => (
                  <div 
                    key={index} 
                    className="bg-gradient-to-r from-indigo-400 to-purple-500 text-white px-3 py-1 rounded-full flex items-center gap-1"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleSkillDelete(skill)}
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
              {loading ? "Creating..." : "Create Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;