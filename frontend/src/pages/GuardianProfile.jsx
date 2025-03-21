import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const CompanyProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTech, setNewTech] = useState("");
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    website: "",
    techStack: [],
    description: "",
    userType: ""
  });
  
  const { user } = useAuth();
  const userId = user?.userId;
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
  };

  const handleTechChange = (index, value) => {
    const updatedTechStack = [...profileData.techStack];
    updatedTechStack[index] = value;
    setProfileData({
      ...profileData,
      techStack: updatedTechStack
    });
  };

  const handleAddTech = () => {
    if (newTech.trim() !== "") {
      setProfileData({
        ...profileData,
        techStack: [...profileData.techStack, newTech.trim()]
      });
      setNewTech("");
    }
  };

  const handleRemoveTech = (index) => {
    const updatedTechStack = [...profileData.techStack];
    updatedTechStack.splice(index, 1);
    setProfileData({
      ...profileData,
      techStack: updatedTechStack
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const formattedData = {
        ...profileData,
        techStack: profileData.techStack.join(", ") // Convert array to comma-separated string
      };
      const response = await fetch(`http://localhost:3500/user/updateCompany/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      if (response.ok) {
        const data = await response.json();
        setIsEditing(false); // Switch back to view mode
        console.log("Company profile updated successfully");
      } else {
        console.error("Failed to update company data");
      }
    } catch (error) {
      console.error("Error updating company data:", error);
    }
  };

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        setLoading(true);
        const userId = user?.userId;
        console.log(userId)
        const response = await fetch(`http://localhost:3500/user/getUser/${userId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userType: user?.userType,
          })
        });
        
        if (response.ok) {
          const data = await response.json();
          const updatedData = {
            ...data,
            techStack: data.techStack ? data.techStack.split(',').map(item => item.trim()) : []
          };
          console.log(updatedData)
          setProfileData(updatedData);
        } else {
          console.error("Failed to fetch company data");
        }
      } catch (error) {
        console.error("Error fetching company data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (user?.userId) {
      fetchCompanyDetails();
    }
  }, [user]);

  if (loading) return (
    <div>Loading...</div>
  );
  
  return (
    <div className="bg-slate-100 text-slate-900 relative min-h-screen">
      {/* Background gradient */}
      <div className="absolute top-0 left-0 right-0 h-80 bg-gradient-to-r from-blue-500 to-cyan-500 z-0"></div>
      
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
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all flex items-center gap-2"
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
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-8 text-white text-center relative">
              <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
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
                    placeholder="Company Name"
                  />
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    className="p-2 rounded-lg text-slate-800 text-center"
                    placeholder="Company Email"
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
                Actively Hiring
              </div>
              
              {/* Decorative shape */}
              <div className="absolute -top-5 -right-5 w-20 h-20 bg-cyan-400 rounded-md rotate-45 opacity-50 z-0"></div>
            </div>
            
            <div className="p-8 relative">
              <div className="mb-6">
                <div className="text-sm text-slate-500 mb-2 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                  </svg>
                  Website
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    name="website"
                    value={profileData.website}
                    onChange={handleInputChange}
                    className="p-2 rounded-lg border border-slate-300 text-slate-800 w-full ml-6"
                    placeholder="Company Website"
                  />
                ) : (
                  <div className="text-base font-medium text-blue-600 pl-6">
                    <a href={profileData.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {profileData.website}
                    </a>
                  </div>
                )}
              </div>
              
              {/* <div className="flex items-center gap-4 mt-6 bg-slate-50 p-4 rounded-xl">
                <div className="flex justify-center items-center w-12 h-12 bg-white rounded-xl text-blue-600 shadow-sm">
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
                      placeholder="Company Location"
                    />
                  ) : (
                    <p className="text-sm text-slate-500">{profileData.location}</p>
                  )}
                </div>
              </div> */}
              
              <button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-3 mt-8 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/30 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                Contact Us
              </button>
              
              {/* Decorative shape */}
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-cyan-400 rounded-full opacity-30 z-0"></div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex flex-col gap-8 lg:col-span-2">
            {/* Floating Stats */}
            <div className="bg-white rounded-xl shadow-lg p-6 flex justify-around items-center relative z-10 hover:-translate-y-2 hover:shadow-lg transition-all">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {profileData.techStack.length}
                </div>
                <div className="text-sm text-slate-500">Technologies</div>
              </div>
            </div>
            
            {/* Company Description Card */}
            <div className="bg-white rounded-2xl p-8 shadow-md hover:-translate-y-2 hover:shadow-lg transition-all">
              <div className="mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                  </div>
                  <div className="text-xl font-semibold text-slate-900">Company Description</div>
                </div>
              </div>
              
              <div className="bg-slate-50 p-6 rounded-xl">
                {isEditing ? (
                  <textarea
                    name="description"
                    value={profileData.description}
                    onChange={handleInputChange}
                    className="p-4 rounded-lg border border-slate-300 text-slate-800 w-full h-48"
                    placeholder="Write about your company, mission, values, and what you're looking for in potential candidates"
                  />
                ) : (
                  <div className="text-slate-700">{profileData.description}</div>
                )}
              </div>
            </div>
            
            {/* Tech Stack Card */}
            <div className="bg-white rounded-2xl p-8 shadow-md hover:-translate-y-2 hover:shadow-lg transition-all">
              <div className="mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 18l6-6-6-6"></path>
                      <path d="M8 6l-6 6 6 6"></path>
                      <line x1="12" y1="2" x2="12" y2="22"></line>
                    </svg>
                  </div>
                  <div className="text-xl font-semibold text-slate-900">Tech Stack</div>
                </div>
              </div>
              
              {/* Add Tech Form (visible only in edit mode) */}
              {isEditing && (
                <div className="mb-6 bg-slate-50 p-4 rounded-xl">
                  <div className="text-base font-medium mb-2">Add Technology</div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTech}
                      onChange={(e) => setNewTech(e.target.value)}
                      className="flex-1 p-2 rounded-lg border border-slate-300 text-slate-800"
                      placeholder="Enter a technology"
                    />
                    <button
                      onClick={handleAddTech}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all flex items-center gap-2"
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
                {profileData.techStack.map((tech, index) => (
                  <div key={index} className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl hover:-translate-y-2 hover:shadow-md hover:bg-white transition-all">
                    <div className="w-10 h-10 bg-blue-400 rounded-xl flex items-center justify-center text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 10h-4V6"></path>
                        <path d="M14 10l7-7"></path>
                        <path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"></path>
                      </svg>
                    </div>
                    {isEditing ? (
                      <div className="flex-1 flex items-center gap-2">
                        <input
                          type="text"
                          value={tech}
                          onChange={(e) => handleTechChange(index, e.target.value)}
                          className="flex-1 p-2 rounded-lg border border-slate-300 text-slate-800"
                        />
                        <button 
                          onClick={() => handleRemoveTech(index)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 6h18"></path>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <div className="font-medium text-sm">{tech}</div>
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

export default CompanyProfile;