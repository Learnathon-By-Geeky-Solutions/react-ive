import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

const JobSeekerProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [loading, setLoading] = useState(false);
  const [allSubjects, setAllSubjects] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    gender: 'MALE',
    session: '',
    department: '',
    studyingSubject: '',
    subjects: [],
  });

  const { user } = useAuth();
  const userId = user?.userId;

  // Fetch all subjects
  useEffect(() => {
    const fetchAllSubjects = async () => {
      try {
        const response = await fetch('http://localhost:3500/subjects/getSubjects');
        if (response.ok) {
          const data = await response.json();
          setAllSubjects(data.map((subject) => subject.name));
        } else {
          console.error('Failed to fetch subjects');
        }
      } catch (error) {
        console.error('Error fetching subjects:', error);
      }
    };
    fetchAllSubjects();
  }, []);

  // Fetch user details
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`http://localhost:3500/profile/getUser/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          const userData = data.user;
          const formattedData = {
            name: userData.name || '',
            email: userData.email || '',
            gender: userData.gender || 'MALE',
            session: userData.session || '',
            department: userData.department || '',
            studyingSubject: userData.studyingSubject || '',
            subjects: Array.isArray(userData.subjects)
              ? userData.subjects.map((subj) => subj.name)
              : [],
          };
          setProfileData(formattedData);
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('An error occurred while fetching user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
  };

  const handleSubjectInputChange = (e) => {
    const value = e.target.value;
    setNewSubject(value);

    if (value.trim() !== '') {
      const filtered = allSubjects.filter((subject) =>
        subject.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSubjects(filtered);
    } else {
      setFilteredSubjects([]);
    }
  };

  const handleSelectSubject = (subject) => {
    if (subject && !profileData.subjects.includes(subject)) {
      setProfileData({
        ...profileData,
        subjects: [...profileData.subjects, subject],
      });
    }
    setNewSubject('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleAddSubject = () => {
    if (newSubject.trim() !== '' && !profileData.subjects.includes(newSubject.trim())) {
      setProfileData({
        ...profileData,
        subjects: [...profileData.subjects, newSubject.trim()],
      });
      setNewSubject('');
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleRemoveSubject = (index) => {
    const updatedSubjects = [...profileData.subjects];
    updatedSubjects.splice(index, 1);
    setProfileData({
      ...profileData,
      subjects: updatedSubjects,
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      const response = await fetch(`http://localhost:3500/profile/updateProfile/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        const data = await response.json();
        setProfileData({
          ...profileData,
          subjects: data.user.subjects.map((subj) => subj.name),
        });
        setIsEditing(false);
        console.log('User updated successfully');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to update user data');
      }
    } catch (error) {
      console.error('Error updating user data:', error);
      setError('An error occurred while updating user data');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

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
                className="bg-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-300 focus:ring-2 focus:ring-slate-400 transition-all flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M18 6L6 18M6 6l12 12"></path>
                </svg>
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 focus:ring-2 focus:ring-green-400 transition-all flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
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
              className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 focus:ring-2 focus:ring-indigo-400 transition-all flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
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
              {isEditing ? (
                <div className="flex flex-col gap-4 mb-6">
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleInputChange}
                    className="p-2 rounded-lg text-slate-800 text-center focus:ring-2 focus:ring-indigo-400"
                    placeholder="Your Name"
                  />
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    className="p-2 rounded-lg text-slate-800 text-center focus:ring-2 focus:ring-indigo-400"
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
                {profileData.email}
              </div>

              <div className="absolute -top-5 -right-5 w-20 h-20 bg-purple-400 rounded-md rotate-45 opacity-50 z-0"></div>
            </div>

            <div className="p-8 relative">
              {/* Gender Selection */}
              <div className="mb-6">
                <div className="text-sm text-slate-500 mb-2 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 8L12 16"></path>
                    <path d="M8 12L16 12"></path>
                  </svg>
                  Gender
                </div>
                {isEditing ? (
                  <select
                    name="gender"
                    value={profileData.gender}
                    onChange={handleInputChange}
                    className="p-2 rounded-lg border border-slate-300 text-slate-800 w-full ml-6 focus:ring-2 focus:ring-indigo-400"
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHERS">Others</option>
                  </select>
                ) : (
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-600 to-blue-500 text-white px-4 py-2 rounded-full font-medium text-sm mt-2 ml-6">
                    {profileData.gender}
                  </div>
                )}
              </div>

              {/* Session Field */}
              <div className="mb-6">
                <div className="text-sm text-slate-500 mb-2 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  Session
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    name="session"
                    value={profileData.session}
                    onChange={handleInputChange}
                    className="p-2 rounded-lg border border-slate-300 text-slate-800 w-full ml-6 focus:ring-2 focus:ring-indigo-400"
                    placeholder="Current Session"
                  />
                ) : (
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-600 to-blue-500 text-white px-4 py-2 rounded-full font-medium text-sm mt-2 ml-6">
                    {profileData.session || 'Not specified'}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 mt-6 bg-slate-50 p-4 rounded-xl">
                <div className="flex justify-center items-center w-12 h-12 bg-white rounded-xl text-purple-600 shadow-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold mb-1">Department</h3>
                  {isEditing ? (
                    <input
                      type="text"
                      name="department"
                      value={profileData.department}
                      onChange={handleInputChange}
                      className="p-2 rounded-lg border border-slate-300 text-slate-800 w-full focus:ring-2 focus:ring-indigo-400"
                      placeholder="Your Department"
                    />
                  ) : (
                    <p className="text-sm text-slate-500">{profileData.department || 'Not specified'}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 mt-4 bg-slate-50 p-4 rounded-xl">
                <div className="flex justify-center items-center w-12 h-12 bg-white rounded-xl text-purple-600 shadow-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold mb-1">Studying Subject</h3>
                  {isEditing ? (
                    <input
                      type="text"
                      name="studyingSubject"
                      value={profileData.studyingSubject}
                      onChange={handleInputChange}
                      className="p-2 rounded-lg border border-slate-300 text-slate-800 w-full focus:ring-2 focus:ring-indigo-400"
                      placeholder="Current Subject"
                    />
                  ) : (
                    <p className="text-sm text-slate-500">{profileData.studyingSubject || 'Not specified'}</p>
                  )}
                </div>
              </div>

              <button
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-3 mt-8 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/30 focus:ring-2 focus:ring-indigo-400 transition-all"
                aria-label="Contact me"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                Contact Me
              </button>

              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-400 rounded-full opacity-30 z-0"></div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex flex-col gap-8 lg:col-span-2">
            {/* Floating Stats */}
            <div className="bg-white rounded-xl shadow-lg p-6 flex justify-center items-center relative z-10 hover:-translate-y-2 hover:shadow-lg transition-all">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">{profileData.subjects.length}</div>
                <div className="text-sm text-slate-500">Subjects</div>
              </div>
            </div>

            {/* Subjects Card */}
            <div className="bg-white rounded-2xl p-8 shadow-md hover:-translate-y-2 hover:shadow-lg transition-all">
              <div className="mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-purple-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                    </svg>
                  </div>
                  <div className="text-xl font-semibold text-slate-900">Subjects</div>
                </div>
              </div>

              {/* Add Subject Form with Datalist (visible only in edit mode) */}
              {isEditing && (
                <div className="mb-6 bg-slate-50 p-4 rounded-xl">
                  <div className="text-base font-medium mb-2">Add New Subject</div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <input
                        type="text"
                        list="subjects-list"
                        value={newSubject}
                        onChange={handleSubjectInputChange}
                        className="w-full p-2 rounded-lg border border-slate-300 text-slate-800 focus:ring-2 focus:ring-indigo-400"
                        placeholder="Enter a new subject"
                        ref={inputRef}
                      />
                      <datalist id="subjects-list">
                        {filteredSubjects.map((subject) => (
                          <option key={subject} value={subject} />
                        ))}
                      </datalist>
                    </div>
                    <button
                      onClick={handleAddSubject}
                      className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 focus:ring-2 focus:ring-purple-400 transition-all flex items-center gap-2"
                      aria-label="Add subject"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                      Add
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
                {profileData.subjects.map((subject, index) => (
                  <div
                    key={subject}
                    className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl hover:-translate-y-2 hover:shadow-md hover:bg-white transition-all"
                  >
                    <div className="w-10 h-10 bg-purple-400 rounded-xl flex items-center justify-center text-white">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"></polygon>
                        <line x1="12" y1="22" x2="12" y2="15.5"></line>
                        <polyline points="22 8.5 12 15.5 2 8.5"></polyline>
                        <polyline points="2 15.5 12 8.5 22 15.5"></polyline>
                        <line x1="12" y1="2" x2="12" y2="8.5"></line>
                      </svg>
                    </div>
                    {isEditing ? (
                      <div className="flex-1 flex items-center gap-2">
                        <div className="flex-1 font-medium text-sm">{subject}</div>
                        <button
                          onClick={() => handleRemoveSubject(index)}
                          aria-label={`Remove ${subject} subject`}
                          className="text-red-500 hover:text-red-600 focus:ring-2 focus:ring-red-400"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <path d="M3 6h18"></path>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <div className="font-medium text-sm">{subject}</div>
                    )}
                  </div>
                ))}
                {profileData.subjects.length === 0 && (
                  <div className="col-span-3 text-center text-slate-500 py-8">
                    No subjects added yet.
                    {isEditing && <span className="block mt-2 text-sm">Add subjects using the form above.</span>}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSeekerProfile;