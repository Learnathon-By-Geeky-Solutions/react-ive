import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

// Separate component for rendering posts
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
          userId={post.userId._id}
          title={post.name}
          location={post.location}
          guardianName={post.userId.name}
          medium={post.medium}
          salaryRange={`${post.salary}`}
          experience={`${post.experience} years`}
          subjects={
            post.subject && post.subject.length > 0
              ? post.subject.map((sub) => sub.name).join(", ")
              : "No subjects listed"
          }
          classType={post.classtype}
          days={post.days}
          duration={`${post.duration} hour(s)`}
          studentNum={post.studentNum}
          gender={post.gender}
          deadline={post.deadline}
          time={post.time}
          jobPostId={post._id}
        />
      ))}
    </div>
  );
};

const Posts = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [salary, setSalary] = useState("");
  const [location, setLocation] = useState("");
  const [experience, setExperience] = useState("");
  const [medium, setMedium] = useState("");
  const [subject, setSubject] = useState("");
  const [classType, setClassType] = useState("");
  const [gender, setGender] = useState("");
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
    applyFilters();
  }, [search, salary, location, experience, medium, subject, classType, gender]);

  useEffect(() => {
    if (user?.userId) {
      fetchAllPosts();
    }
  }, [user]);

  const applyFilters = () => {
    let filtered = [...allPosts];

    if (search.trim() !== "") {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.name?.toLowerCase().includes(searchLower) ||
          post.user?.name?.toLowerCase().includes(searchLower)
      );
    }

    if (salary.trim() !== "") {
      const salaryValue = parseFloat(salary);
      if (!isNaN(salaryValue)) {
        filtered = filtered.filter(
          (post) => post.salary && parseFloat(post.salary) >= salaryValue
        );
      }
    }

    if (location.trim() !== "") {
      const locationLower = location.toLowerCase();
      filtered = filtered.filter((post) =>
        post.location?.toLowerCase().includes(locationLower)
      );
    }

    if (experience.trim() !== "") {
      const expValue = parseFloat(experience);
      if (!isNaN(expValue)) {
        filtered = filtered.filter(
          (post) => post.experience && parseFloat(post.experience) <= expValue
        );
      }
    }

    if (medium.trim() !== "") {
      const mediumUpper = medium.toUpperCase();
      filtered = filtered.filter((post) => post.medium === mediumUpper);
    }

    if (subject.trim() !== "") {
      const subjectLower = subject.toLowerCase();
      filtered = filtered.filter((post) => {
        if (!post.subject || post.subject.length === 0) return false;
        return post.subject.some((sub) =>
          sub.name?.toLowerCase().includes(subjectLower)
        );
      });
    }

    if (classType.trim() !== "") {
      const classTypeLower = classType.toLowerCase();
      filtered = filtered.filter((post) =>
        post.classtype?.toLowerCase().includes(classTypeLower)
      );
    }

    if (gender.trim() !== "") {
      const genderUpper = gender.toUpperCase();
      filtered = filtered.filter((post) => post.gender === genderUpper);
    }

    setFilteredPosts(filtered);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      applyFilters();
    }
  };

  const resetFilters = () => {
    setSearch("");
    setSalary("");
    setExperience("");
    setLocation("");
    setMedium("");
    setSubject("");
    setClassType("");
    setGender("");
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search for tuition title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <DollarSign className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Minimum Salary"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
              />
              {salary && (
                <button
                  onClick={() => setSalary("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Clock className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="number"
                placeholder="Experience (years)"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
              />
              {experience && (
                <button
                  onClick={() => setExperience("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <MapPin className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
              />
              {location && (
                <button
                  onClick={() => setLocation("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <BookOpen className="w-5 h-5 text-gray-400" />
              </div>
              <select
                value={medium}
                onChange={(e) => setMedium(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
              >
                <option value="">Select Medium</option>
                <option value="BANGLA">Bangla</option>
                <option value="ENGLISH">English</option>
              </select>
              {medium && (
                <button
                  onClick={() => setMedium("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Pencil className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
              />
              {subject && (
                <button
                  onClick={() => setSubject("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <CalendarDays className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Class Type (Online/Offline)"
                value={classType}
                onChange={(e) => setClassType(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
              />
              {classType && (
                <button
                  onClick={() => setClassType("")}
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
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
              >
                <option value="">Select Gender Preference</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHERS">Others</option>
              </select>
              {gender && (
                <button
                  onClick={() => setGender("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tuition Posts */}
        <div className="p-6 pt-0">
          <h2 className="text-2xl font-semibold mb-4">
            {loading ? "Loading tuition posts..." : "Latest Tuition Posts"}
          </h2>
          <PostList
            loading={loading}
            filteredPosts={filteredPosts}
            resetFilters={resetFilters}
          />
        </div>
      </div>
    </div>
  );
};

export default Posts;