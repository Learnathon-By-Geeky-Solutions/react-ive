import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { 
  Filter, 
  Search, 
  RefreshCw, 
  CheckCircle, 
  Clock, 
  XCircle,
  X
} from "lucide-react";
import OfferCard from "../components/OfferCard";
import Navbar from "../components/Navbar";

const JobOffers = () => {
  const [offers, setOffers] = useState([]);
  const [filteredOffers, setFilteredOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const { user } = useAuth();

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true);
        setError(null);
        const userId = user?.userId;
        if (!userId) throw new Error("User ID is not available");
        const response = await fetch(`http://localhost:3500/offer/getOffer/${userId}`);
        const data = await response.json();
        const offs = data || [];
        setOffers(offs);
        setFilteredOffers(offs);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (user?.userId) {
      fetchOffers();
    }
  }, [user]);

  useEffect(() => {
    const filterOffers = () => {
      let filtered = offers;
      // Filter by Status
      if (filterStatus !== "All") {
        filtered = filtered.filter((offer) => offer.status === filterStatus);
      }
      // Search by userName
      if (searchQuery.trim() !== "") {
        filtered = filtered.filter((offer) =>
          offer.company.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      setFilteredOffers(filtered);
    };
    filterOffers();
  }, [filterStatus, searchQuery, offers]);

  const statusIcons = {
    Pending: <Clock className="text-amber-400" />,
    Accepted: <CheckCircle className="text-emerald-400" />,
    Rejected: <XCircle className="text-rose-400" />
  };

  const resetFilters = () => {
    setSearchQuery("");
    setFilterStatus("All");
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
        {/* Header - Matching the Applications page style */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold tracking-wide">My Job Offers</h1>
            <button
              onClick={resetFilters}
              className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-all duration-300"
            >
              <RefreshCw className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Filters - Matching the Applications page style */}
        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Status Filters */}
            <div className="flex space-x-4 overflow-x-auto w-full md:w-auto">
              {["All", "Pending", "Accepted", "Rejected"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`
                    px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                    ${filterStatus === status 
                      ? 'bg-indigo-500 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
                  `}
                >
                  {status === "All" ? (
                    <span className="flex items-center gap-2">
                      <Filter className="w-4 h-4" /> {status}
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      {statusIcons[status]} {status}
                    </span>
                  )}
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
                placeholder="Search offers by company"
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

        {/* Offers Grid */}
        <div className="p-6 pt-0">
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOffers.length > 0 ? (
              filteredOffers.map((offer, idx) => (
                <OfferCard offer={offer} newStatus={offer.status} key={idx} />
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-gray-500">
                <Filter className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-xl">No offers found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobOffers;