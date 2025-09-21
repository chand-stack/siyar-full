import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import type { RootState } from '../../../Redux/store';
import { loginStart, loginSuccess, loginFailure, clearError } from '../../../Redux/slices/authSlice';
import { useLoginMutation } from '../../../Redux/api/authApi';
import { FaEye, FaEyeSlash } from 'react-icons/fa';


const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, error } = useSelector((state: RootState) => state.auth);
  
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Clear any existing errors when component mounts
    dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      dispatch(loginFailure('Please fill in all fields'));
      return;
    }

    try {
      dispatch(loginStart());
      const result = await login({ email, password }).unwrap();
      
      if (result.success) {
        dispatch(loginSuccess({
          user: result.data.user,
          accessToken: result.data.accessToken,
          refreshToken: result.data.refreshToken,
        }));
        navigate('/admin/dashboard');
      }
    } catch (err: unknown) {
      const errorMessage = (err as { data?: { message?: string } })?.data?.message || 'Login failed. Please try again.';
      dispatch(loginFailure(errorMessage));
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) dispatch(clearError());
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (error) dispatch(clearError());
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-secondary p-5">
      <div className="card w-full max-w-md bg-base-100 shadow-2xl">
        <div className="card-body text-center">
          <h1 className="card-title text-3xl font-bold text-primary mx-auto mb-2">Admin Login</h1>
          <p className="text-base-content/70 mb-6">Enter your credentials to access the admin dashboard</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="alert alert-error">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{error}</span>
              </div>
            )}

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Email</span>
              </label>
              <input
                type="email"
                className="input input-bordered w-full"
                value={email}
                onChange={handleEmailChange}
                placeholder="Enter your email"
                required
                disabled={isLoading || isLoginLoading}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input input-bordered w-full pr-12"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="Enter your password"
                  required
                  disabled={isLoading || isLoginLoading}
                />
                                 <button
                   type="button"
                   className="btn btn-ghost btn-sm absolute right-0 top-0 h-full px-3"
                   onClick={() => setShowPassword(!showPassword)}
                   disabled={isLoading || isLoginLoading}
                 >
                   {showPassword ?   <FaEye /> : <FaEyeSlash />}
                 </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full mt-6"
              disabled={isLoading || isLoginLoading || !email || !password}
            >
              {isLoading || isLoginLoading ? (
                <span className="loading loading-spinner loading-md"></span>
              ) : (
                'Login'
              )}
            </button>
          </form>

          <div className="divider">Protected Admin Area</div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
