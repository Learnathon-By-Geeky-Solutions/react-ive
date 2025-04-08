import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import {
  DollarSign,
  Briefcase,
  MapPin,
  Code,
  ArrowRight,
  CheckCircle,
  X,
  Upload,
  Trash2,
  AlertTriangle,
  Clock,
  XCircle,
  Building,
  UserCircle,
} from "lucide-react";

const PostCard = ({ title, location, companyName, position, salaryRange, experience, skills, jobPostId, deadline, onDelete, userId }) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [cv, setCv] = useState(null);
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isDeadlineSoon, setIsDeadlineSoon] = useState(false);
  const [isDeadlineExpired, setIsDeadlineExpired] = useState(false);
  const [daysRemaining, setDaysRemaining] = useState(null);

  useEffect(() => {
    // Check if deadline is within 3 days or expired
    const checkDeadline = () => {
      if (deadline) {
        const deadlineDate = new Date(deadline);
        const currentDate = new Date();

        // Calculate difference in milliseconds
        const diffTime = deadlineDate - currentDate;
        // Convert to days
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        setDaysRemaining(diffDays);
        setIsDeadlineSoon(diffDays <= 3 && diffDays > 0);
        setIsDeadlineExpired(diffDays <= 0);
      }
    };

    checkDeadline();
  }, [deadline]);

  useEffect(() => {
    const checkApplication = async () => {
      if (user?.userType === "student") {
        try {
          const response = await fetch("http://localhost:3500/apply/exists", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              postId: jobPostId,
              userId: user.userId,
            }),
          });

          const data = await response.json();
          if (data.message === "exists") setAlreadyApplied(true);
        } catch (error) {
          console.error(error);
        }
      }
    };
    checkApplication();
  }, [user, jobPostId]);

  const handleApply = async (e) => {
    e.preventDefault();

    // Don't allow applications if deadline has expired
    if (isDeadlineExpired) {
      toast.error("Application deadline has expired.");
      setOpen(false);
      return;
    }

    if (!cv) {
      toast.error("Please upload your CV.");
      return;
    }

    const formData = new FormData();
    formData.append("cv", cv);
    formData.append("name", user.name);
    formData.append("userId", user.userId);
    formData.append("status", "PENDING");
    formData.append("deadline", deadline); // Include deadline in the formData

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3500/apply/applyToPost/${jobPostId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
        setAlreadyApplied(true);
        setOpen(false);
      } else {
        toast.error(data.error || "Failed to apply.");
      }
    } catch (error) {
      toast.error("An error occurred while applying.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setCv(file);
  };

  // Updated delete function to prevent page refresh
  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      const response = await fetch(
        `http://localhost:3500/post/deletePost/${jobPostId}`,
        {
          method: "DELETE",
          // No token sent as requested
        }
      );

      const data = await response.json();
      if (response.ok) {
        toast.success(data.message || "Tuition post deleted successfully");
        // Instead of refreshing, set this card as deleted
        setIsDeleted(true);
        // If parent component provided an onDelete callback, call it
        if (typeof onDelete === "function") {
          onDelete(jobPostId);
        }
      } else {
        toast.error(data.error || "Failed to delete tuition post");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the tuition post");
      console.error(error);
    } finally {
      setDeleteLoading(false);
      setShowDeleteModal(false);
    }
  };

  // If the post is deleted, don't render anything
  if (isDeleted) {
    return null;
  }

  // Split and trim skills
  const skillsList = skills.split(",").map((skill) => skill.trim());

  // Determine border color based on deadline
  const getBorderClass = () => {
    if (isDeadlineExpired) {
      return "border-gray-400";
    }
    if (isDeadlineSoon) {
      return "border-red-500 hover:border-red-600";
    }
    return "border-indigo-500 hover:border-purple-500";
  };

  return (
    <>
      <div
        className={`flex flex-col h-full transform transition-all duration-300 ${
          !isDeadlineExpired ? "hover:scale-105" : ""
        } hover:shadow-lg bg-white border-2 ${getBorderClass()} rounded-lg p-6 shadow-lg ${
          isDeadlineExpired ? "opacity-75" : ""
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <div className="flex-grow">
            <h3 className="text-2xl font-bold text-gray-800 truncate">
              {title}
            </h3>
            <div className="flex flex-col gap-1 mt-1">
              <div className="flex items-center text-gray-600">
                <Building className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="text-sm font-medium truncate">
                  {companyName}
                </span>
              </div>
              <div className="flex items-center text-gray-500">
                <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="text-sm truncate">{location}</span>
              </div>
              <div className="flex items-center text-gray-500">
                <UserCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="text-sm truncate">{position}</span>
              </div>
            </div>
          </div>
          <div
            className={`${
              isDeadlineExpired ? "bg-gray-200" : "bg-purple-100"
            } rounded-full p-3 ml-2`}
          >
            <Briefcase
              className={`w-6 h-6 ${
                isDeadlineExpired ? "text-gray-500" : "text-purple-600"
              }`}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="flex items-center mb-1">
              <DollarSign className="w-4 h-4 text-green-600 mr-2" />
              <span className="text-xs font-semibold text-green-800">
                SALARY
              </span>
            </div>
            <div className="font-bold text-green-900 truncate">
              {salaryRange}
            </div>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center mb-1">
              <Briefcase className="w-4 h-4 text-blue-600 mr-2" />
              <span className="text-xs font-semibold text-blue-800">
                EXPERIENCE
              </span>
            </div>
            <div className="font-bold text-blue-900">{experience}</div>
          </div>

          <div className="bg-orange-50 p-3 rounded-lg">
            <div className="flex items-center mb-1">
              <Code className="w-4 h-4 text-orange-600 mr-2" />
              <span className="text-xs font-semibold text-orange-800">
                SKILLS
              </span>
            </div>
            <div className="h-[52px] overflow-y-auto">
              <div className="flex flex-wrap gap-1 items-center">
                {skillsList.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-orange-100 text-orange-900 text-[10px] px-2 py-0.5 rounded-full truncate"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mb-4">
          {isDeadlineExpired ? (
            <div className="flex items-center text-gray-500 mt-1">
              <XCircle className="w-4 h-4 mr-1 text-red-500" />
              <span className="text-xs font-semibold text-red-500">
                Deadline expired:{" "}
              </span>
              <span className="text-sm ml-1 text-gray-500">
                {new Date(deadline).toLocaleDateString()}
              </span>
            </div>
          ) : (
            <div
              className={`flex items-center ${
                isDeadlineSoon ? "text-red-600" : "text-gray-500"
              } mt-1`}
            >
              <Clock
                className={`w-4 h-4 mr-1 ${
                  isDeadlineSoon ? "text-red-600" : "text-gray-500"
                }`}
              />
              <span className="text-xs font-semibold">Deadline: </span>
              <span className="text-sm ml-1">
                {new Date(deadline).toLocaleDateString()}
              </span>
              {isDeadlineSoon && (
                <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
                  {daysRemaining === 1
                    ? "Last day!"
                    : `${daysRemaining} days left!`}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="mt-auto">
          {user && user.userId!==userId && (
            <>
              {isDeadlineExpired ? (
                <div className="w-full flex items-center justify-center bg-gray-300 text-gray-600 py-3 rounded-lg">
                  <XCircle className="mr-2 w-5 h-5" /> Deadline Expired
                </div>
              ) : !alreadyApplied ? (
                <button
                  onClick={() => setOpen(true)}
                  className={`w-full flex items-center justify-center ${
                    isDeadlineSoon
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-purple-600 hover:bg-purple-700"
                  } text-white py-3 rounded-lg transition-colors`}
                >
                  Apply Now <ArrowRight className="ml-2 w-5 h-5" />
                </button>
              ) : (
                <button
                  disabled
                  className="w-full flex items-center justify-center bg-green-500 text-white py-3 rounded-lg cursor-not-allowed opacity-75"
                >
                  <CheckCircle className="mr-2 w-5 h-5" /> Already Applied
                </button>
              )}
            </>
          )}

          {/* Updated Delete Button with custom modal trigger */}
          {user && user.userId===userId && (
            <button
              onClick={() => setShowDeleteModal(true)}
              className="w-full flex items-center justify-center bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors border border-gray-300"
            >
              <Trash2 className="mr-2 w-5 h-5 text-gray-600" /> Remove Tuition Post
            </button>
          )}
        </div>
      </div>

      {/* Apply Modal */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md mx-auto shadow-xl relative">
            <div className="p-6 border-b flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Apply for {title}</h2>
                <p className="text-gray-600 text-sm mt-1">at {companyName}</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-500 hover:bg-gray-100 rounded-full p-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleApply} className="p-6">
              <div className="mb-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    id="cv-upload"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".jpg,.jpeg,.png"
                  />
                  <label
                    htmlFor="cv-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Upload className="w-10 h-10 text-gray-400 mb-2" />
                    <p className="text-gray-600 mb-2">
                      {cv
                        ? `${cv.name} (${Math.round(cv.size / 1024)}KB)`
                        : "Upload your DU ID Card Image"}
                    </p>
                    <span className="text-xs text-gray-500">
                    JPG / JPEG / PNG
                    </span>
                  </label>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading || isDeadlineExpired}
                className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                {loading
                  ? "Submitting..."
                  : isDeadlineExpired
                  ? "Deadline Expired"
                  : "Submit Application"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal - similar to the one in the image */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md mx-auto shadow-xl relative">
            <div className="p-6 flex flex-col items-center">
              <div className="text-center mb-4">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-50 mb-2">
                  <AlertTriangle className="h-10 w-10 text-red-400" />
                </div>
                <h3 className="text-xl font-medium text-red-500">
                  Delete Post
                </h3>
              </div>

              <div className="text-center mb-6">
                <p className="text-gray-600 mb-4">
                  Warning: this cannot be undone.
                </p>
              </div>

              <div className="flex w-full space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors text-sm"
                >
                  CANCEL
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  className="flex-1 py-3 px-4 rounded-lg text-white text-sm font-medium transition-colors bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600"
                >
                  {deleteLoading ? "DELETING..." : "YES, DELETE POST"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PostCard;
