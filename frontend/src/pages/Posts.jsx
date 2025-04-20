import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "../context/AuthContext";
import PostCard from "../components/PostCard";
import Navbar from "../components/Navbar";
import {
  Search,
  RefreshCw,
  MapPin,
  DollarSign,
  Clock,
  CalendarDays,
  Pencil,
  BookOpen,
  Users,
  X,
} from "lucide-react";

// Subcomponent for filter inputs
const FilterInputs = ({ filters, setFilters }) => {
  const handleChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClear = (key) => {
    setFilters((prev) => ({ ...prev, [key]: "" }));
  };

  const filterFields = [
    {
      key: "search",
      placeholder: "Search for tuition title...",
      icon: <Search className="w-5 h-5 text-gray-400" />,
      type: "text",
    },
    {
      key: "salary",
      placeholder: "Minimum Salary",
      icon: <DollarSign className="w-5 h-5 text-gray-400" />,
      type: "text",
    },
    {
      key: "experience",
      placeholder: "Experience (years)",
      icon: <Clock className="w-5 h-5 text-gray-400" />,
      type: "number",
    },
    {
      key: "location",
      placeholder: "Location",
      icon: <MapPin className="w-5 h-5 text-gray-400" />,
      type: "text",
    },
    {
      key: "subject",
      placeholder: "Subject",
      icon: <Pencil className="w-5 h-5 text-gray-400" />,
      type: "text",
    },
    {
      key: "classType",
      placeholder: "Class Type (Online/Offline)",
      icon: <CalendarDays className="w-5 h-5 text-gray-400" />,
      type: "text",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {filterFields.map(({ key, placeholder, icon, type }) => (
        <div key={key} className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center">{icon}</div>
          <input
            type={type}
            placeholder={placeholder}
            value={filters[key]}
            onChange={(e) => handleChange(key, e.target.value)}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
          />
          {filters[key] && (
            <button
              onClick={() => handleClear(key)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
      ))}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
          <BookOpen className="w-5 h-5 text-gray-400" />
        </div>
        <select
          value={filters.medium}
          onChange={(e) => handleChange("medium", e.target.value)}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
        >
          <option value="">Select Medium</option>
          <option value="BANGLA">Bangla</option>
          <option value="ENGLISH">English</option>
        </select>
        {filters.medium && (
          <button
            onClick={() => handleClear("medium")}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
          <Users className="w-5 h-5 text-gray-400" />
        </div>
        <select
          value={filters.gender}
          onChange={(e) => handleChange("gender", e.target.value)}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
        >
          <option value="">Select Gender Preference</option>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
          <option value="OTHERS">Others</option>
        </select>
        {filters.gender && (
          <button
            onClick={() => handleClear("gender")}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>
    </div>
  );
};

// Subcomponent for rendering posts
const PostList = ({ loading, filteredPosts, resetFilters }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (filteredPosts.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        <p className="text-xl">No tuition postings found matching your criteria.</p>
        <button
          onClick={resetFilters}
          className="mt-4 bg-indigo-500 text-white px-6 py-2 rounded-full hover:bg-indigo-600 transition-all duration-300"
        >
          View All Tuitions
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredPosts.map((post) => (
        <PostCard
          key={post._id}
          jobDetails={{
            title: post.name,
            location: post.location,
            medium: post.medium,
            salaryRange: `${post.salary}`,
            experience: `${post.experience} years`,
            classType: post.classtype,
            studentNum: post.studentNum,
            subjects:
              post.subject && post.subject.length > 0
                ? post.subject.map((sub) => sub.name).join(", ")
                : "No subjects listed",
            gender: post.gender,
            deadline: post.deadline,
            jobPostId: post._id,
          }}
          schedule={{
            days: post.days,
            time: post.time,
            duration: `${post.duration} hour(s)`,
          }}
          userInfo={{
            guardianName: post.userId.name,
            userId: post.userId._id,
          }}
        />
      ))}
    </div>
  );
};

// PropTypes for FilterInputs
FilterInputs.propTypes = {
  filters: PropTypes.shape({
    search: PropTypes.string,
    salary: PropTypes.string,
    location: PropTypes.string,
    experience: PropTypes.string,
    medium: PropTypes.string,
    subject: PropTypes.string,
    classType: PropTypes.string,
    gender: PropTypes.string,
  }).isRequired,
  setFilters: PropTypes.func.isRequired,
  resetFilters: PropTypes.func.isRequired,
};

// PropTypes for PostList
PostList.propTypes = {
  loading: PropTypes.bool.isRequired,
  filteredPosts: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string,
      location: PropTypes.string,
      userId: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string,
      }),
      medium: PropTypes.string,
      salary: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      experience: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      subject: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string,
        })
      ),
      classtype: PropTypes.string,
      days: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      duration: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      studentNum: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      gender: PropTypes.string,
      deadline: PropTypes.string,
      time: PropTypes.string,
    })
  ).isRequired,
  resetFilters: PropTypes.func.isRequired,
};

const Posts = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    salary: "",
    location: "",
    experience: "",
    medium: "",
    subject: "",
    classType: "",
    gender: "",
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchAllPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:3500/post/getAllPosts");
      const data = await res.json();
      setAllPosts(data);
      setFilteredPosts(data);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.userId) {
      fetchAllPosts();
    }
  }, [user]);

  useEffect(() => {
    const applyFilters = () => {
      let filtered = [...allPosts];

      if (filters.search.trim()) {
        const searchLower = filters.search.toLowerCase();
        filtered = filtered.filter(
          (post) =>
            post.name?.toLowerCase().includes(searchLower) ||
            post.userId?.name?.toLowerCase().includes(searchLower)
        );
      }

      if (filters.salary.trim()) {
        const salaryValue = parseFloat(filters.salary);
        if (!isNaN(salaryValue)) {
          filtered = filtered.filter(
            (post) => post.salary && parseFloat(post.salary) >= salaryValue
          );
        }
      }

      if (filters.location.trim()) {
        const locationLower = filters.location.toLowerCase();
        filtered = filtered.filter((post) =>
          post.location?.toLowerCase().includes(locationLower)
        );
      }

      if (filters.experience.trim()) {
        const expValue = parseFloat(filters.experience);
        if (!isNaN(expValue)) {
          filtered = filtered.filter(
            (post) => post.experience && parseFloat(post.experience) <= expValue
          );
        }
      }

      if (filters.medium.trim()) {
        const mediumUpper = filters.medium.toUpperCase();
        filtered = filtered.filter((post) => post.medium === mediumUpper);
      }

      if (filters.subject.trim()) {
        const subjectLower = filters.subject.toLowerCase();
        filtered = filtered.filter((post) =>
          post.subject?.some((sub) => sub.name?.toLowerCase().includes(subjectLower))
        );
      }

      if (filters.classType.trim()) {
        const classTypeLower = filters.classType.toLowerCase();
        filtered = filtered.filter((post) =>
          post.classtype?.toLowerCase().includes(classTypeLower)
        );
      }

      if (filters.gender.trim()) {
        const genderUpper = filters.gender.toUpperCase();
        filtered = filtered.filter((post) => post.gender === genderUpper);
      }

      setFilteredPosts(filtered);
    };

    applyFilters();
  }, [filters, allPosts]);

  const resetFilters = () => {
    setFilters({
      search: "",
      salary: "",
      location: "",
      experience: "",
      medium: "",
      subject: "",
      classType: "",
      gender: "",
    });
    setFilteredPosts(allPosts);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <Navbar />
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden mt-16">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold tracking-wide">Tuition Posts</h1>
            {user && (
              <button
                className="bg-white text-purple-600 rounded-full px-6 py-3 shadow-md transition-all hover:bg-gray-100"
                onClick={() => navigate("/create-post")}
              >
                Create New Post
              </button>
            )}
            <button
              onClick={resetFilters}
              className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-all duration-300"
            >
              <RefreshCw className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Search Filters */}
        <div className="p-6">
          <FilterInputs filters={filters} setFilters={setFilters} resetFilters={resetFilters} />
        </div>

        {/* Tuition Posts */}
        <div className="p-6 pt-0">
          <h2 className="text-2xl font-semibold mb-4">
            {loading ? "Loading tuition posts..." : "Latest Tuition Posts"}
          </h2>
          <PostList loading={loading} filteredPosts={filteredPosts} resetFilters={resetFilters} />
        </div>
      </div>
    </div>
  );
};

export default Posts;