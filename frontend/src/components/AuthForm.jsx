import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import { Link } from 'react-router-dom';
import { ColorButton } from './AuthStyles';
import GoogleAuthButton from './GoogleAuthButton';
import FormDivider from './FormDivider';

const AuthForm = ({
  title,
  formFields,
  buttonText,
  googleButtonText,
  isLoading,
  googleLoading,
  error,
  handleChange,
  handleSubmit,
  handleGoogleLogin,
  additionalLink,
  additionalContent,
}) => {
  return (
    <form className="flex flex-col gap-4 w-1/2 p-8" onSubmit={handleSubmit}>
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">{title}</h1>
      
      {formFields.map((field) => (
        <TextField
          key={field.name}
          id={`${title.toLowerCase()}-${field.name}`}
          label={field.label}
          variant="outlined"
          onChange={handleChange}
          type={field.type}
          name={field.name}
          value={field.value}
        />
      ))}
      
      {additionalLink && (
        <Link to={additionalLink.to} className="text-sm text-blue-500 hover:underline self-center">
          {additionalLink.text}
        </Link>
      )}
      
      {error && <p className="text-red-500 text-center">{error}</p>}
      
      <ColorButton variant="contained" size="large" type="submit" disabled={isLoading}>
        {isLoading ? `${buttonText}...` : buttonText}
      </ColorButton>
      
      <FormDivider />
      
      <GoogleAuthButton 
        onClick={handleGoogleLogin}
        isLoading={googleLoading}
        buttonText={googleButtonText}
      />
      
      {additionalContent}
    </form>
  );
};

AuthForm.propTypes = {
  title: PropTypes.string.isRequired,
  formFields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    })
  ).isRequired,
  buttonText: PropTypes.string.isRequired,
  googleButtonText: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
  googleLoading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleGoogleLogin: PropTypes.func.isRequired,
  additionalLink: PropTypes.shape({
    to: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired
  }),
  additionalContent: PropTypes.node
};

AuthForm.defaultProps = {
  error: null,
  additionalLink: null,
  additionalContent: null
};

export default AuthForm;