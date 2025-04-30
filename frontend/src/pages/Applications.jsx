import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import ApplicationCard from "../components/ApplicationCard";
import Navbar from "../components/Navbar";
import { 
  Search, 
  RefreshCw, 
  Filter, 
  X,
  UserIcon,
  Briefcase 
} from 'lucide-react';
import { BACKEND_URL } from "../utils/servicesData";

const JobApplications = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [viewMode, setViewMode] = useState("all"); // "all", "myApplications", "receivedApplications"
  const { user } = useAuth();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError(null);
        const userId = user?.userId;

        if (!userId) throw new Error("User ID is not available");

        // Get all applications related to the user (either as an applicant or job poster)
        const response = await fetch(`${BACKEND_URL}/apply/getApplicationsById/${userId}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch applications");
        }

        const data = await response.json();
        const apps = data.applications || [];
        
        // Add a property to distinguish the type of application
        const processedApps = apps.map(app => ({
          ...app,
          applicationType: app.userId === userId ? "myApplication" : "receivedApplication"
        }));
        
        setApplications(processedApps);
        setFilteredApplications(processedApps);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?.userId) {
      fetchApplications();
    }
  }, [user]);

  useEffect(() => {
    const filterApplications = () => {
      let filtered = applications;
  
      // First apply view mode filter
      if (viewMode === "myApplications") {
        filtered = filtered.filter(app => app.applicationType === "myApplication");
      } else if (viewMode === "receivedApplications") {
        filtered = filtered.filter(app => app.applicationType === "receivedApplication");
      }
      
      // Then apply status filter
      if (filterStatus !== "All") {
        filtered = filtered.filter((app) => app.status === filterStatus);
      }
  
      // Then apply search filter
      if (searchQuery.trim() !== "") {
        filtered = filtered.filter((app) => {
          // If it's my application, search in job poster name
          if (app.applicationType === "myApplication") {
            return app.jobPost?.user?.name?.toLowerCase().includes(searchQuery.toLowerCase());
          } 
          // If someone applied to my post, search in applicant name
          else if (app.applicationType === "receivedApplication") {
            return app.userName?.toLowerCase().includes(searchQuery.toLowerCase());
          }
          return false;
        });
      }
  
      setFilteredApplications(filtered);
    };
  
    filterApplications();
  }, [filterStatus, searchQuery, applications, viewMode]);

  const updateApplicationStatus = (applicationId, newStatus) => {
    setApplications((prevApps) =>
      prevApps.map((app) =>
        app.applicationId === applicationId ? { ...app, status: newStatus } : app
      )
    );
  };

  const getSearchPlaceholder = () => {
    if (viewMode === "myApplications") {
      return "Search by job poster name";
    } else if (viewMode === "receivedApplications") {
      return "Search by applicant name";
    } else {
      return "Search applications";
    }
  };

  const resetFilters = () => {
    setSearchQuery("");
    setFilterStatus("All");
    setViewMode("all");
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"></div>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center h-screen text-red-500">
      {error}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden mt-16">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#A6D8FF] to-[#3F7CAD] text-white p-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold tracking-wide">Applications</h1>
            <button
              onClick={resetFilters}
              className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-all duration-300"
            >
              <RefreshCw className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* View Mode Selector */}
        <div className="p-6 pb-0">
          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => setViewMode("all")}
              className={`
                flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                ${viewMode === "all" ? 'bg-[#3F7CAD] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
              `}
            >
              <Filter className="w-4 h-4 mr-2" />
              All Applications
            </button>
            <button
              onClick={() => setViewMode("myApplications")}
              className={`
                flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                ${viewMode === "myApplications" ? 'bg-[#3F7CAD] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
              `}
            >
              <UserIcon className="w-4 h-4 mr-2" />
              My Applications
            </button>
            <button
              onClick={() => setViewMode("receivedApplications")}
              className={`
                flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                ${viewMode === "receivedApplications" ? 'bg-[#3F7CAD] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
              `}
            >
              <Briefcase className="w-4 h-4 mr-2" />
              Received Applications
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Status Filters */}
            <div className="flex space-x-4 overflow-x-auto w-full md:w-auto">
              {["All", "PENDING", "ACCEPTED", "REJECTED", "UNDER-REVIEW"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`
                    px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                    ${filterStatus === status 
                      ? 'bg-[#3F7CAD] text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
                  `}
                >
                  {status}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="
                  w-full pl-10 pr-10 py-2 border border-gray-300 rounded-full 
                  focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                  transition-all duration-300
                "
                placeholder={getSearchPlaceholder()}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Applications Grid */}
        <div className="p-6 pt-0">
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredApplications.length > 0 ? (
              filteredApplications.map((app) => (
                <ApplicationCard
                  key={app._id}
                  app={app}
                  applicationType={app.applicationType}
                  onStatusChange={updateApplicationStatus}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-gray-500">
                <Filter className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-xl">No applications found</p>
                {viewMode !== "all" && (
                  <p className="mt-2 text-gray-400">
                    Try changing your view mode or removing filters
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobApplications;