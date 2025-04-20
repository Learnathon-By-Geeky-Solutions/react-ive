import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { 
  Download, 
  MessageCircle, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Calendar,
  MapPin,
  User,
} from 'lucide-react';

// Modal Components defined outside
const StatusChangeModal = ({ isOpen, onClose, onStatusSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 -mx-6 -mt-6 mb-4 rounded-t-3xl">
          <h2 className="text-xl font-bold text-center">Change Application Status</h2>
        </div>
        
        <div className="flex flex-col space-y-4">
          <button 
            onClick={() => onStatusSelect('UNDER_REVIEW')}
            className="w-full px-6 py-3 rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition-all duration-300 flex items-center justify-center"
          >
            <Calendar className="mr-2" /> Schedule Interview
          </button>
          <button 
            onClick={() => onStatusSelect('ACCEPTED')}
            className="w-full px-6 py-3 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-all duration-300 flex items-center justify-center"
          >
            <CheckCircle className="mr-2" /> Accept Application
          </button>
          <button 
            onClick={() => onStatusSelect('REJECTED')}
            className="w-full px-6 py-3 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all duration-300 flex items-center justify-center"
          >
            <XCircle className="mr-2" /> Reject Application
          </button>
          <button 
            onClick={onClose}
            className="w-full px-6 py-3 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all duration-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

StatusChangeModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onStatusSelect: PropTypes.func.isRequired,
};

const ConfirmationModal = ({ isOpen, onClose, onConfirm, status }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 -mx-6 -mt-6 mb-4 rounded-t-3xl">
          <h2 className="text-xl font-bold text-center">Confirm Status Change</h2>
        </div>
        
        <p className="text-center text-gray-600 mb-6">
          Are you sure you want to mark this application as <span className="font-bold text-indigo-600">{status}</span>?
        </p>
        
        <div className="flex justify-center space-x-4">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-all duration-300"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className={`
              px-6 py-2 rounded-full text-white transition-all duration-300
              ${status === 'ACCEPTED' 
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

ConfirmationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  status: PropTypes.oneOf(['ACCEPTED', 'REJECTED', 'UNDER_REVIEW']).isRequired,
};

const SuccessModal = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 -mx-6 -mt-6 mb-4 rounded-t-3xl">
          <h2 className="text-xl font-bold text-center">Success</h2>
        </div>
        
        <p className="text-center text-gray-600 mb-6">{message}</p>
        
        <div className="flex justify-center">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all duration-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

SuccessModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
};

const ErrorModal = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6">
        <div className="bg-gradient-to-r from-red-500 to-rose-600 text-white p-4 -mx-6 -mt-6 mb-4 rounded-t-3xl">
          <h2 className="text-xl font-bold text-center">Error</h2>
        </div>
        
        <p className="text-center text-gray-600 mb-6">{message}</p>
        
        <div className="flex justify-center">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

ErrorModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
};

const ApplicationCard = ({ app, onStatusChange }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [status, setStatus] = useState(app.status);
  const [modalState, setModalState] = useState({
    statusChangeModal: false,
    confirmationModal: false,
    successModal: false,
    errorModal: false,
    selectedStatus: null,
    errorMessage: '',
    successMessage: '',
  });
  const cvPath = app.cvPath.split('/').pop();

  const handleChat = async (receiverId) => {
    try {
      const senderId = user.userId;
      const res = await fetch('http://localhost:3500/conversation/createConversation', {
        method: 'POST',
        body: JSON.stringify({ senderId, receiverId }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) throw new Error('Failed to create conversation');

      const res2 = await fetch(`http://localhost:3500/conversation/getConversations/${senderId}`);
      const data = await res2.json();
      const selectedConv = data.users.find((conv) => conv.id === receiverId);

      navigate('/chats', { state: { selectedConversation: selectedConv } });
    } catch (error) {
      console.error(error.message);
      setModalState((prev) => ({
        ...prev,
        errorModal: true,
        errorMessage: 'Failed to start conversation',
      }));
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const res = await fetch(`http://localhost:3500/apply/updateStatus/${app._id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!res.ok) throw new Error('Failed to update application status');

      setStatus(newStatus);
      onStatusChange?.(app._id, newStatus);
      
      if (newStatus === 'ACCEPTED') {
        const offerRes = await fetch(`http://localhost:3500/offer/sendOffer`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            jobSeekerId: app.userId,
            companyId: user.userId,
            status: 'PENDING',
            applicationId: app._id,
          }),
        });

        if (!offerRes.ok) throw new Error('Failed to send offer letter');
      }

      setModalState({
        statusChangeModal: false,
        confirmationModal: false,
        successModal: true,
        errorModal: false,
        selectedStatus: null,
        successMessage: `Application status updated to ${newStatus}`,
        errorMessage: '',
      });
    } catch (error) {
      setModalState((prev) => ({
        ...prev,
        confirmationModal: false,
        errorModal: true,
        errorMessage: error.message,
      }));
    }
  };

  const getStatusStyle = (currentStatus) => {
    const statusStyles = {
      PENDING: {
        icon: <Clock className="inline-block mr-2 text-sky-500" />,
        bgColor: 'bg-sky-50',
        textColor: 'text-sky-800',
      },
      ACCEPTED: {
        icon: <CheckCircle className="inline-block mr-2 text-emerald-500" />,
        bgColor: 'bg-emerald-50',
        textColor: 'text-emerald-800',
      },
      UNDER_REVIEW: {
        icon: <Calendar className="inline-block mr-2 text-amber-500" />,
        bgColor: 'bg-amber-50',
        textColor: 'text-amber-800',
      },
      REJECTED: {
        icon: <XCircle className="inline-block mr-2 text-rose-500" />,
        bgColor: 'bg-rose-50',
        textColor: 'text-rose-800',
      },
    };
    return statusStyles[currentStatus] || statusStyles.PENDING;
  };

  const statusStyle = getStatusStyle(status);

  return (
    <>
      <StatusChangeModal 
        isOpen={modalState.statusChangeModal}
        onClose={() => setModalState((prev) => ({ ...prev, statusChangeModal: false }))}
        onStatusSelect={(status) => setModalState((prev) => ({
          ...prev,
          statusChangeModal: false,
          confirmationModal: true,
          selectedStatus: status,
        }))}
      />
      <ConfirmationModal 
        isOpen={modalState.confirmationModal}
        onClose={() => setModalState((prev) => ({
          ...prev,
          confirmationModal: false,
          statusChangeModal: true,
          selectedStatus: null,
        }))}
        onConfirm={() => handleStatusChange(modalState.selectedStatus)}
        status={modalState.selectedStatus}
      />
      <SuccessModal 
        isOpen={modalState.successModal}
        onClose={() => setModalState((prev) => ({ ...prev, successModal: false }))}
        message={modalState.successMessage}
      />
      <ErrorModal 
        isOpen={modalState.errorModal}
        onClose={() => setModalState((prev) => ({ ...prev, errorModal: false }))}
        message={modalState.errorMessage}
      />

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
        <div className="bg-gradient-to-r from-indigo-100 to-purple-100 p-5 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <User className="mr-3 text-indigo-500" size={24} />
              <div>
                <h4 className="text-xl font-semibold text-gray-800 tracking-wide">
                  {app.userName || app.postId?.userId?.name || 'Unknown Applicant'}
                </h4>
                <p className="text-sm text-gray-600">{app.postId?.position || 'Unknown Position'}</p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle.bgColor} ${statusStyle.textColor}`}>
              {statusStyle.icon}
              {status}
            </span>
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-center mb-4 text-gray-600">
            <MapPin className="mr-2 text-violet-500" size={20} />
            <span className="text-sm">{app.postId?.location || 'Unknown Location'}</span>
          </div>

          <div className="flex items-center mb-4 text-gray-600">
            <Calendar className="mr-2 text-violet-500" size={20} />
            <span className="text-sm">Applied: {new Date(app.createdAt).toLocaleDateString()}</span>
          </div>

          {app.statusUpdatedAt && app.statusUpdatedAt !== app.createdAt && (
            <div className="flex items-center mb-4 text-gray-600">
              <Clock className="mr-2 text-violet-500" size={20} />
              <span className="text-sm">Status updated: {new Date(app.statusUpdatedAt).toLocaleDateString()}</span>
            </div>
          )}

          <div className="flex justify-between space-x-2">
            <a 
              href={`http://localhost:3500/apply/downloadCV/${cvPath}`} 
              download 
              className="flex items-center justify-center px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-400 to-purple-500 text-white hover:opacity-90 transition-all duration-300"
            >
              <Download className="mr-2" />
              View CV
            </a>

            {(status === 'PENDING' || status === 'UNDER_REVIEW') && 
            app.postId?.userId?._id === user.userId && (
              <button
                onClick={() => setModalState((prev) => ({
                  ...prev,
                  statusChangeModal: true,
                }))}
                className="flex items-center justify-center px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-400 to-purple-500 text-white hover:opacity-90 transition-all duration-300"
              >
                Change Status
              </button>
            )}
            {app.userId !== user?.userId && (
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

ApplicationCard.propTypes = {
  app: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
    userName: PropTypes.string,
    cvPath: PropTypes.string.isRequired,
    status: PropTypes.oneOf(['PENDING', 'ACCEPTED', 'UNDER_REVIEW', 'REJECTED']).isRequired,
    createdAt: PropTypes.string.isRequired,
    statusUpdatedAt: PropTypes.string,
    postId: PropTypes.shape({
      position: PropTypes.string,
      location: PropTypes.string,
      userId: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
          _id: PropTypes.string.isRequired,
          name: PropTypes.string,
        }),
      ]),
    }).isRequired,
  }).isRequired,
  onStatusChange: PropTypes.func,
};

export default ApplicationCard;