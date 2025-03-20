import { useState } from "react";
import { CheckCircle, XCircle, Clock, User, FileText, X } from "lucide-react";

const HiresCard = ({ hire }) => {
  const [status, setStatus] = useState(hire.status);
  const [showModal, setShowModal] = useState(false);
  
  const getStatusDetails = (currentStatus) => {
    switch (currentStatus) {
      case "Hired":
        return {
          icon: <CheckCircle className="w-6 h-6 text-emerald-500 animate-pulse" />,
          bgColor: "bg-emerald-100",
          textColor: "text-emerald-800",
          borderColor: "border-emerald-300",
        };
      case "Pending":
        return {
          icon: <Clock className="w-6 h-6 text-amber-500 animate-bounce" />,
          bgColor: "bg-amber-100",
          textColor: "text-amber-800",
          borderColor: "border-amber-300",
        };
      case "Rejected":
        return {
          icon: <XCircle className="w-6 h-6 text-rose-500 animate-pulse" />,
          bgColor: "bg-rose-100",
          textColor: "text-rose-800",
          borderColor: "border-rose-300",
        };
      default:
        return {
          icon: <Clock className="w-6 h-6 text-gray-500" />,
          bgColor: "bg-gray-50",
          textColor: "text-gray-600",
          borderColor: "border-gray-300",
        };
    }
  };
  
  const statusDetails = getStatusDetails(status);
  
  const toggleModal = () => {
    setShowModal(!showModal);
  };
  
  return (
    <>
      <div className="bg-white rounded-3xl shadow-2xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden border-l-4 border-t-4 border-r-4 border-b-4 border-transparent hover:border-opacity-60">
        <div className="bg-gradient-to-r from-indigo-200 via-purple-200 to-violet-300 text-gray-800 p-6 rounded-t-3xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <User className="w-12 h-12 text-violet-500" />
              <div>
                <h4 className="text-3xl font-semibold mb-1 text-violet-800">{hire.jobSeeker.name}</h4>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>{hire.jobSeeker.email}</span>
                </div>
              </div>
            </div>
            {/* <div className="flex items-center space-x-2">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${statusDetails.bgColor} ${statusDetails.borderColor} p-1.5`}
              >
                {statusDetails.icon}
              </div>
              <span
                className={`px-4 py-1 rounded-full text-xs font-semibold ${statusDetails.textColor} ${statusDetails.bgColor}`}
              >
                {status}
              </span>
            </div> */}
          </div>
        </div>
        <div className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-gray-500" />
              <span className="font-medium text-lg">{hire.jobSeeker.applications[0].jobPost.name}</span>
            </div>
            <button
              className="px-6 py-2 text-white bg-violet-600 hover:bg-violet-700 rounded-full font-medium transition-all duration-300"
              onClick={toggleModal}
            >
              View Details
            </button>
          </div>
        </div>
      </div>
      
      {/* Details Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl transform transition-all">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-violet-800">Details</h3>
              <button 
                onClick={toggleModal}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="border-b pb-3">
                <h4 className="text-sm font-semibold text-gray-500 mb-1">Candidate</h4>
                <p className="text-lg font-medium">{hire.jobSeeker.name}</p>
              </div>
              
              <div className="border-b pb-3">
                <h4 className="text-sm font-semibold text-gray-500 mb-1">Email</h4>
                <p className="text-lg">{hire.jobSeeker.email}</p>
              </div>
              
              <div className="border-b pb-3">
                <h4 className="text-sm font-semibold text-gray-500 mb-1">Position</h4>
                <p className="text-lg">{hire.jobSeeker.applications[0].jobPost.name}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-gray-500 mb-1">Application Date</h4>
                <p className="text-lg">
                   {hire.jobSeeker.applications[0].dateCreated ? new Date(hire.jobSeeker.applications[0].dateCreated).toLocaleDateString() : "Not available"}
                </p>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={toggleModal}
                className="px-6 py-2 text-white bg-violet-600 hover:bg-violet-700 rounded-full font-medium transition-all duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HiresCard;