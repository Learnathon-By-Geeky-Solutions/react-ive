import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { 
  Download, 
  MessageCircle, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Calendar,
  MapPin,
  User,
  Briefcase
} from 'lucide-react';

const ApplicationCard = ({ app, onStatusChange }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [status, setStatus] = useState(app.status);
  const [modalState, setModalState] = useState({
    statusChangeModal: false,
    confirmationModal: false,
    selectedStatus: null
  });
  const cvPath = app.cvPath.split("/").pop();

  const handleChat = async (receiverId) => {

    try {

      const senderId = user.userId;

      const res = await fetch("http://localhost:3500/conversation/createConversation", {

        method: "POST",

        body: JSON.stringify({ senderId, receiverId }),

        headers: { "Content-Type": "application/json" }

      });

      if (!res.ok) {

        throw new Error(`HTTP error! status: ${res.status}`);

      }



      const res2 = await fetch(`http://localhost:3500/conversation/getCOnversations/${senderId}`);

      const data = await res2.json();

      const selectedConv = data.users.find((conv)=> conv.id===receiverId);

      setSelectedConversation(selectedConv);



    } catch (error) {

      console.error(error.message);

    }
    navigate('/chats');

  };

  const handleStatusChange = async (newStatus) => {
    try {
      const res = await fetch(`http://localhost:3500/apply/updateStatus/${app.applicationId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setStatus(newStatus);
        onStatusChange(app.applicationId, newStatus);
        
        // Reset modal state
        setModalState({
          statusChangeModal: false,
          confirmationModal: false,
          selectedStatus: null
        });

        if (newStatus === "Accepted") {
          const offerRes = await fetch(`http://localhost:3500/offer/sendOffer`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              jobSeekerId: app.userId,
              companyId: user.userId,
              status: "Pending",
              applicationId: app.applicationId,
            }),
          });
          const offerData = await offerRes.json();
          if (!offerRes.ok) {
            console.error("Failed to send offer letter:", offerData.message);
          } else {
            console.log("Offer letter sent successfully", offerData);
          }
        }
      }
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const getStatusStyle = (currentStatus) => {
    const statusStyles = {
      'PENDING': {
        icon: <Clock className="inline-block mr-2 text-sky-500" />,
        bgColor: 'bg-sky-50',
        textColor: 'text-sky-800'
      },
      'ACCEPTED': {
        icon: <CheckCircle className="inline-block mr-2 text-emerald-500" />,
        bgColor: 'bg-emerald-50',
        textColor: 'text-emerald-800'
      },
      'UNDER-REVIEW': {
        icon: <Calendar className="inline-block mr-2 text-amber-500" />,
        bgColor: 'bg-amber-50',
        textColor: 'text-amber-800'
      },
      'REJECTED': {
        icon: <XCircle className="inline-block mr-2 text-rose-500" />,
        bgColor: 'bg-rose-50',
        textColor: 'text-rose-800'
      }
    };
    return statusStyles[currentStatus];
  };

  const statusStyle = getStatusStyle(status);

  // Status Change Modal Component
  const StatusChangeModal = () => {
    if (!modalState.statusChangeModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 -mx-6 -mt-6 mb-4 rounded-t-3xl">
            <h2 className="text-xl font-bold text-center">Change Application Status</h2>
          </div>
          
          <div className="flex flex-col space-y-4">
            <button 
              onClick={() => {
                handleStatusChange('Interview');
              }}
              className="w-full px-6 py-3 rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition-all duration-300 flex items-center justify-center"
            >
              <Calendar className="mr-2" /> Schedule Interview
            </button>
            <button 
              onClick={() => setModalState({
                statusChangeModal: false,
                confirmationModal: true,
                selectedStatus: 'Accepted'
              })}
              className="w-full px-6 py-3 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-all duration-300 flex items-center justify-center"
            >
              <CheckCircle className="mr-2" /> Accept Application
            </button>
            <button 
              onClick={() => setModalState({
                statusChangeModal: false,
                confirmationModal: true,
                selectedStatus: 'Rejected'
              })}
              className="w-full px-6 py-3 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all duration-300 flex items-center justify-center"
            >
              <XCircle className="mr-2" /> Reject Application
            </button>
            <button 
              onClick={() => setModalState({
                statusChangeModal: false,
                confirmationModal: false,
                selectedStatus: null
              })}
              className="w-full px-6 py-3 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Confirmation Modal Component
  const ConfirmationModal = () => {
    if (!modalState.confirmationModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 -mx-6 -mt-6 mb-4 rounded-t-3xl">
            <h2 className="text-xl font-bold text-center">Confirm Status Change</h2>
          </div>
          
          <p className="text-center text-gray-600 mb-6">
            Are you sure you want to mark this application as <span className="font-bold text-indigo-600">{modalState.selectedStatus}</span>?
          </p>
          
          <div className="flex justify-center space-x-4">
            <button 
              onClick={() => setModalState({
                statusChangeModal: true,
                confirmationModal: false,
                selectedStatus: null
              })}
              className="px-6 py-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-all duration-300"
            >
              Cancel
            </button>
            <button 
              onClick={() => handleStatusChange(modalState.selectedStatus)}
              className={`
                px-6 py-2 rounded-full text-white transition-all duration-300
                ${modalState.selectedStatus === 'Accepted' 
                  ? 'bg-green-500 hover:bg-green-600' 
                  : 'bg-red-500 hover:bg-red-600'}
              `}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <StatusChangeModal />
      <ConfirmationModal />
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-100 to-purple-100 p-5 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <User className="mr-3 text-indigo-500" size={24} />
              <div>
                <h4 className="text-xl font-semibold text-gray-800 tracking-wide">
                  {app.postId.userId.name}
                  </h4>
                <p className="text-sm text-gray-600">{app.postId.position}</p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle.bgColor} ${statusStyle.textColor}`}>
              {statusStyle.icon}
              {status}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="p-5">
          {/* Location */}
          <div className="flex items-center mb-4 text-gray-600">
            <MapPin className="mr-2 text-violet-500" size={20} />
            <span className="text-sm">{app.postId.location}</span>
          </div>

          {/* Action Buttons */}
          <div className={`flex ${user.userType === 'JobSeeker' ? "justify-center" : "justify-between"} space-x-2`}>
            <a 
              href={`http://localhost:3500/apply/download/${cvPath}`} 
              download 
              className="flex items-center justify-center px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-400 to-purple-500 text-white hover:opacity-90 transition-all duration-300"
            >
              <Download className="mr-2" />
              View CV
            </a>

            {user.userType === 'guardian' && (status === 'PENDING' || status === 'UNDER-REVIEW') && (
              <button
                onClick={() => setModalState({
                  statusChangeModal: true,
                  confirmationModal: false,
                  selectedStatus: null
                })}
                className="flex items-center justify-center px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-400 to-purple-500 text-white hover:opacity-90 transition-all duration-300"
              >
                Change Status
              </button>
            )}

            {user.userType === 'guardian' && (
              <button
                onClick={() => handleChat(app.userId)}
                className="flex items-center justify-center px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-400 to-purple-500 text-white hover:opacity-90 transition-all duration-300"
              >
                <MessageCircle className="mr-2" />
                Chat
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ApplicationCard;