import { useState } from 'react';
import { TextField, Button } from '@mui/material';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { BACKEND_URL } from '../utils/servicesData';

const ResetPassword = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setNewPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${BACKEND_URL}/auth/resetPassword`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);
                setError('');
            } else {
                setError(data.message || 'Something went wrong');
                setMessage('');
            }
        } catch (err) {
            console.log(err.message);
            setError('Something went wrong. Please try again later.');
            setMessage('');
        }
    };

    return (
        <div className='flex justify-center items-center min-h-screen'>
            <form
                className='flex flex-col gap-4 glassStyle w-[20em] border-4 border-blue-500 rounded p-4'
                onSubmit={handleSubmit}
            >
                <h1 className='text-center text-blue-700 text-[28px]'>Reset Password</h1>
                <TextField
                    id='outlined-basic'
                    label='New Password'
                    variant='outlined'
                    onChange={handleChange}
                    type='password'
                    name='password'
                    value={newPassword}
                    required
                />
                {message && (
                    <div className="flex flex-col items-center">
                        <p className='text-green-500 text-center'>{message}</p>
                        <Button
                            variant='contained'
                            size='large'
                            onClick={() => navigate('/login')}
                            className='bg-blue-500 hover:bg-blue-700 text-white mt-2'
                        >
                            Go to Login
                        </Button>
                    </div>
                )}
                {error && <p className='text-red-500 text-center'>{error}</p>}
                {!message && (
                    <Button
                        variant='contained'
                        size='large'
                        type='submit'
                        className='bg-blue-500 hover:bg-blue-700 text-white'
                    >
                        Reset Password
                    </Button>
                )}
            </form>
        </div>
    );
};

export default ResetPassword;
