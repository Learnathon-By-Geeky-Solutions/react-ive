import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { RefreshCw, Search, X } from "lucide-react";
import HiresCard from "../components/HiresCard";
import Navbar from "../components/Navbar";

const HiresPage = () => {
  const [hires, setHires] = useState([]);
  const [filteredHires, setFilteredHires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const fetchHires = async () => {
      try {
        setLoading(true);
        setError(null);
        const userId = user?.userId;
        if (!userId) throw new Error("User ID is not available");
        const response = await fetch(`http://localhost:3500/hiring/getHires/${userId}`);
        const data = await response.json();
        const hireData = data || [];
        setHires(hireData);
        setFilteredHires(hireData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (user?.userId) {
      fetchHires();
    }
  }, [user]);

  useEffect(() => {
    const filterHires = () => {
      let filtered = hires;
      if (searchQuery.trim() !== "") {
        filtered = filtered.filter((hire) =>
          hire.jobSeeker.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      setFilteredHires(filtered);
    };
    filterHires();
  }, [searchQuery, hires]);

  const resetFilters = () => {
    setSearchQuery("");
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <Navbar />

      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden mt-16">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold tracking-wide">My Hires</h1>
            <button
              onClick={resetFilters}
              className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-all duration-300"
            >
              <RefreshCw className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        <div className="p-6">
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
              placeholder="Search hires by job seeker"
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

        <div className="p-6 pt-0">
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHires.length > 0 ? (
              filteredHires.map((hire, idx) => (
                <HiresCard hire={hire} key={idx} />
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-gray-500">
                <p className="text-xl">No hires found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HiresPage;