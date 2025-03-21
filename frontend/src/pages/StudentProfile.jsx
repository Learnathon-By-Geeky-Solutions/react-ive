import { useEffect, useState } from 'react';
import {useAuth} from '../context/AuthContext'
const JobSeekerProfile = () => {
  
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    salaryExpectation: 0.0,
    location: "",
    experience: 0,
    skills: [],
    userType: ""
  });
  const {user} = useAuth();
  const userId = user?.userId;
  console.log(profileData)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'salaryExpectation') {
      setProfileData({
        ...profileData,
        [name]: parseFloat(value) || 0.0, // Ensure it's a valid float
      });
    } else if (name === 'experience') {
      setProfileData({
        ...profileData,
        [name]: parseInt(value) || 0, // Ensure it's a valid integer
      });
    } else {
      setProfileData({
        ...profileData,
        [name]: value,
      });
    }
  };
  

  const handleSkillChange = (index, value) => {
    const updatedSkills = [...profileData.skills];
    updatedSkills[index] = value;
    setProfileData({
      ...profileData,
      skills: updatedSkills
    });
  };

  const handleAddSkill = () => {
    if (newSkill.trim() !== "") {
      setProfileData({
        ...profileData,
        skills: [...profileData.skills, newSkill.trim()]
      });
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (index) => {
    const updatedSkills = [...profileData.skills];
    updatedSkills.splice(index, 1);
    setProfileData({
      ...profileData,
      skills: updatedSkills
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3500/user/update/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data)
        setIsEditing(false); // Switch back to view mode
        console.log("User updated successfully");
      } else {
        console.error("Failed to update user data");
      }
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true)
        const userId = user?.userId;
        const response = await fetch(`http://localhost:3500/user/getUser/${userId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            userType: user?.userType,
          })
        });

        if (response.ok) {
          const data = await response.json();
          setProfileData(data);
          // setUpdatedUser(data); // Pre-fill the form with the fetched data
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false)
      }
    };
    if(user?.userId)
    fetchUserDetails();
  }, [user]);

  if(loading) return (
    <div>Loading...</div>
  )
  return (
    <div className="bg-slate-100 text-slate-900 relative min-h-screen">
      {/* Background gradient */}
      <div className="absolute top-0 left-0 right-0 h-80 bg-gradient-to-r from-indigo-500 to-purple-500 z-0"></div>
      
      <div className="max-w-7xl mx-auto px-8 py-8 relative">
        {/* Edit Mode Toggle Button */}
        <div className="flex justify-end mb-4 relative z-10">
          {isEditing ? (
            <div className="flex gap-2">
              <button 
                onClick={() => setIsEditing(false)} 
                className="bg-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-300 transition-all flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18M6 6l12 12"></path>
                </svg>
                Cancel
              </button>
              <button 
                onClick={handleSave} 
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                  <polyline points="17 21 17 13 7 13 7 21"></polyline>
                  <polyline points="7 3 7 8 15 8"></polyline>
                </svg>
                Save Changes
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setIsEditing(true)} 
              className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-all flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              Edit Profile
            </button>
          )}
        </div>
        
        {/* Profile Container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8 pt-12">
          {/* Sidebar Card */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:-translate-y-2 hover:shadow-lg transition-all relative">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-8 text-white text-center relative">
              <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                {profileData.userType}
              </div>
              
              {isEditing ? (
                <div className="flex flex-col gap-4 mb-6">
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleInputChange}
                    className="p-2 rounded-lg text-slate-800 text-center"
                    placeholder="Your Name"
                  />
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    className="p-2 rounded-lg text-slate-800 text-center"
                    placeholder="Your Email"
                  />
                </div>
              ) : (
                <>
                  <div className="text-2xl font-semibold mb-2">{profileData.name}</div>
                  <div className="text-sm opacity-90 mb-6">{profileData.email}</div>
                </>
              )}
              
              <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-sm backdrop-blur-sm">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                Available for hire
              </div>
              
              {/* Decorative shape */}
              <div className="absolute -top-5 -right-5 w-20 h-20 bg-purple-400 rounded-md rotate-45 opacity-50 z-0"></div>
            </div>
            
            <div className="p-8 relative">
              
              
              <div className="mb-6">
                <div className="text-sm text-slate-500 mb-2 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="1" x2="12" y2="23"></line>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                  Salary Expectation
                </div>
                {isEditing ? (
                  <input
                    type="number"
                    name="salaryExpectation"
                    value={profileData.salaryExpectation}
                    onChange={handleInputChange}
                    className="p-2 rounded-lg border border-slate-300 text-slate-800 w-full ml-6"
                    placeholder="Salary Expectation"
                    step="0.01"  // Ensures float values with two decimal places
  min="0"
                  />
                ) : (
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-600 to-blue-500 text-white px-4 py-2 rounded-full font-medium text-sm mt-2 ml-6">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="1" x2="12" y2="23"></line>
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    </svg>
                    {profileData.salaryExpectation}
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-4 mt-6 bg-slate-50 p-4 rounded-xl">
                <div className="flex justify-center items-center w-12 h-12 bg-white rounded-xl text-purple-600 shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold mb-1">Location</h3>
                  {isEditing ? (
                    <input
                      type="text"
                      name="location"
                      value={profileData.location}
                      onChange={handleInputChange}
                      className="p-2 rounded-lg border border-slate-300 text-slate-800 w-full"
                      placeholder="Your Location"
                    />
                  ) : (
                    <p className="text-sm text-slate-500">{profileData.location}</p>
                  )}
                </div>
              </div>
              
              <button className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-3 mt-8 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/30 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                Contact Me
              </button>
              
              {/* Decorative shape */}
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-400 rounded-full opacity-30 z-0"></div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex flex-col gap-8 lg:col-span-2">
            {/* Floating Stats */}
            <div className="bg-white rounded-xl shadow-lg p-6 flex justify-around items-center relative z-10 hover:-translate-y-2 hover:shadow-lg transition-all">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {isEditing ? (
                    <input
                      type="number"
                      name="experience"
                      value={profileData.experience}
                      onChange={handleInputChange}
                      className="p-2 rounded-lg border border-slate-300 text-slate-800 w-16 text-center"
                      min="0"
                    />
                  ) : (
                    profileData.experience
                  )}
                </div>
                <div className="text-sm text-slate-500">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">{profileData.skills.length}</div>
                <div className="text-sm text-slate-500">Skills</div>
              </div>
            </div>
            
            
            {/* Skills Card */}
            <div className="bg-white rounded-2xl p-8 shadow-md hover:-translate-y-2 hover:shadow-lg transition-all">
              <div className="mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-purple-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                    </svg>
                  </div>
                  <div className="text-xl font-semibold text-slate-900">Skills</div>
                </div>
              </div>
              
              {/* Add Skill Form (visible only in edit mode) */}
              {isEditing && (
                <div className="mb-6 bg-slate-50 p-4 rounded-xl">
                  <div className="text-base font-medium mb-2">Add New Skill</div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      className="flex-1 p-2 rounded-lg border border-slate-300 text-slate-800"
                      placeholder="Enter a new skill"
                    />
                    <button
                      onClick={handleAddSkill}
                      className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-all flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                      Add
                    </button>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
                {profileData.skills.map((skill, index) => (
                  <div key={index} className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl hover:-translate-y-2 hover:shadow-md hover:bg-white transition-all">
                    <div className="w-10 h-10 bg-purple-400 rounded-xl flex items-center justify-center text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"></polygon>
                        <line x1="12" y1="22" x2="12" y2="15.5"></line>
                        <polyline points="22 8.5 12 15.5 2 8.5"></polyline>
                        <polyline points="2 15.5 12 8.5 22 15.5"></polyline>
                        <line x1="12" y1="2" x2="12" y2="8.5"></line>
                      </svg>
                    </div>
                    {isEditing ? (
                      <div className="flex-1 flex items-center gap-2">
                        <input
                          type="text"
                          value={skill}
                          onChange={(e) => handleSkillChange(index, e.target.value)}
                          className="flex-1 p-2 rounded-lg border border-slate-300 text-slate-800"
                        />
                        <button 
                          onClick={() => handleRemoveSkill(index)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 6h18"></path>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <div className="font-medium text-sm">{skill}</div>
                    )}
                  </div>
                ))} 
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSeekerProfile;


