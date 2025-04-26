import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Divider from '@mui/material/Divider';
import PropTypes from 'prop-types';

// You can use this styled button or import your existing ColorButton
const ColorButton = styled(Button)(() => ({
  color: '#FFFFFF',
  backgroundColor: '#8D538D',
  '&:hover': {
    backgroundColor: '#514ACD',
  },
  borderRadius: '8px',
}));

// Standalone Registration Success Modal component
const RegistrationSuccessModal = ({ 
  open, 
  onClose, 
  userType = 'student' // Default value in case it's not provided
}) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      slotProps={{
        paper: {
          style: {
            borderRadius: '12px',
            padding: '16px',
            maxWidth: '450px'
          }
        }
      }}
    >
      <DialogTitle 
        sx={{ 
          textAlign: 'center', 
          fontWeight: 'bold',
          color: '#8D538D',
          fontSize: '1.5rem'
        }}
      >
        Registration Successful
      </DialogTitle>
      
      <Divider />
      
      <DialogContent sx={{ padding: '24px 16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <CheckCircleOutlineIcon 
            sx={{ 
              fontSize: 80, 
              color: '#8D538D', 
              marginBottom: '16px' 
            }} 
          />
          
          <DialogContentText 
            sx={{ 
              textAlign: 'center',
              fontSize: '1.1rem',
              color: '#333'
            }}
          >
            Your account has been successfully created! Please log in to start exploring opportunities.
          </DialogContentText>
          
          <DialogContentText 
            sx={{ 
              textAlign: 'center',
              fontSize: '0.9rem',
              color: '#666',
              marginTop: '8px'
            }}
          >
            {userType === 'student' 
              ? "You're now ready to find your dream job!" 
              : "You're now ready to find talented candidates!"}
          </DialogContentText>
        </div>
      </DialogContent>
      
      <DialogActions sx={{ padding: '0 16px 16px', justifyContent: 'center' }}>
        <ColorButton 
          onClick={onClose} 
          sx={{ 
            minWidth: '120px',
            fontWeight: 'bold',
            padding: '10px 24px'
          }}
        >
          Proceed to Login
        </ColorButton>
      </DialogActions>
    </Dialog>
  );
};

RegistrationSuccessModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  userType: PropTypes.string
};

export default RegistrationSuccessModal;