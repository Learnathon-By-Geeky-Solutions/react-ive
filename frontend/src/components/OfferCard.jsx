import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import useConversation from '../zustand/useConversation';
import { useState } from 'react';
import { 
  Download, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Building, 
  User, 
  FileText 
} from 'lucide-react';

const OfferCard = ({ offer, newStatus }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [status, setStatus] = useState(offer.status);
  const cvPath = offer.offerLetterPath.split("/").pop();
  console.log(offer)
  const handleStatusChange = async (newStatus) => {
    try {
      // First, update the status of the offer
      const res = await fetch(`http://localhost:3500/offer/updateStatus/${offer.offerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        setStatus(newStatus);

        // If status is "Accepted", call the hire API to create a hiring record
        if (newStatus === 'Accepted') {
          const hireRes = await fetch('http://localhost:3500/hiring/hire', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              jobSeekerId: offer.jobSeekerId, // assuming `user.id` is the job seeker ID
              companyId: offer.companyId, // assuming `offer.company.id` is the company ID
            }),
          });

          if (!hireRes.ok) {
            console.error("Failed to create hiring record");
          }
        }
      }
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const getStatusDetails = (currentStatus) => {
    switch (currentStatus) {
      case 'Pending':
        return {
          icon: <Clock className="w-5 h-5 text-amber-500" />,
          bgColor: 'bg-amber-50',
          textColor: 'text-amber-600'
        };
      case 'Accepted':
        return {
          icon: <CheckCircle className="w-5 h-5 text-emerald-500" />,
          bgColor: 'bg-emerald-50',
          textColor: 'text-emerald-600'
        };
      case 'Rejected':
        return {
          icon: <XCircle className="w-5 h-5 text-rose-500" />,
          bgColor: 'bg-rose-50',
          textColor: 'text-rose-600'
        };
      default:
        return {
          icon: null,
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-600'
        };
    }
  };

  const statusDetails = getStatusDetails(status);

  return (
    <div className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-100 to-indigo-100 text-gray-800 p-6">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-4">
            <Building className="w-8 h-8 text-violet-500" />
            <div>
              <h4 className="text-2xl font-bold mb-1 tracking-wide">{offer.company.name}</h4>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>{offer.application.jobPost.position}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {statusDetails.icon}
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusDetails.bgColor} ${statusDetails.textColor}`}>
              {status}
            </span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
          {/* Download Offer Letter Button */}
          <a
            href={`http://localhost:3500/apply/download/${cvPath}`}
            download
            className="
              w-full sm:w-auto flex items-center justify-center 
              px-6 py-3 
              bg-violet-100 
              text-violet-700 
              rounded-full 
              hover:bg-violet-200 
              transition duration-300 
              space-x-2 
              group
            "
          >
            <FileText className="w-5 h-5" />
            <span>Download Offer Letter</span>
          </a>

          {/* Status Change Dropdown for Job Seeker */}
          {user.userType === 'JobSeeker' && (
            <select
              className="
                w-full sm:w-auto
                px-6 py-3 
                bg-violet-100 
                text-violet-700 
                rounded-full 
                focus:outline-none 
                focus:ring-2 
                focus:ring-offset-2 
                focus:ring-violet-300
              "
              value={status}
              onChange={(e) => handleStatusChange(e.target.value)}
            >
              <option value="Pending">Pending</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
            </select>
          )}
        </div>
      </div>
    </div>
  );
};

export default OfferCard;
