import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCraveStore } from '../store/useCraveStore';

export default function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalState,
    setAuthModalState,
    loginUser,
    registerUser,
    saveUserAddress,
    authLoading,
    authError
  } = useCraveStore();

  // Form State
  const [loginData, setLoginData] = useState({ email: '', password: '', rememberMe: true });
  const [signupData, setSignupData] = useState({ name: '', email: '', phone: '', password: '' });
  const [addressData, setAddressData] = useState({
    flat: '',
    street: '',
    area: '',
    city: 'Bengaluru',
    pincode: '',
    landmark: ''
  });

  // Validation Error States
  const [errors, setErrors] = useState({});

  if (!isAuthModalOpen) return null;

  // Validation functions
  const validateLogin = () => {
    const newErrors = {};
    if (!loginData.email || !/\S+@\S+\.\S+/.test(loginData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!loginData.password || loginData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSignup = () => {
    const newErrors = {};
    if (!signupData.name.trim()) newErrors.name = 'Full name is required.';
    if (!signupData.email || !/\S+@\S+\.\S+/.test(signupData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!signupData.phone || !/^[6-9]\d{9}$/.test(signupData.phone)) {
      newErrors.phone = 'Valid 10-digit Indian phone number required.';
    }
    if (!signupData.password || signupData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateAddress = () => {
    const newErrors = {};
    if (!addressData.flat.trim()) newErrors.flat = 'Door/Flat number is required.';
    if (!addressData.street.trim()) newErrors.street = 'Street/Building name is required.';
    if (!addressData.area.trim()) newErrors.area = 'Area/Locality is required.';
    if (!addressData.city.trim()) newErrors.city = 'City is required.';
    if (!addressData.pincode || !/^\d{6}$/.test(addressData.pincode)) {
      newErrors.pincode = 'Valid 6-digit Pincode is required.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Handlers
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!validateLogin()) return;
    await loginUser(loginData.email, loginData.password);
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (!validateSignup()) return;
    await registerUser(signupData.name, signupData.email, signupData.phone, signupData.password);
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    if (!validateAddress()) return;
    await saveUserAddress(addressData);
  };

  // Tab switchers
  const switchToSignup = () => {
    setErrors({});
    setAuthModalState('signup');
  };

  const switchToLogin = () => {
    setErrors({});
    setAuthModalState('login');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#211C18]/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="w-full max-w-lg bg-[#FDFBF7] rounded-3xl shadow-2xl border border-[#ECE7E1] overflow-hidden relative select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 pt-6 pb-4 border-b border-[#ECE7E1] bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E05326]/10 flex items-center justify-center text-[#E05326]">
              <span className="material-symbols-outlined text-[24px]">
                {authModalState === 'address' ? 'location_on' : 'account_circle'}
              </span>
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-[#211C18]">
                {authModalState === 'login' && 'Welcome Back to PetPooja'}
                {authModalState === 'signup' && 'Create Your PetPooja Account'}
                {authModalState === 'address' && 'Set Up Delivery Address'}
              </h2>
              <p className="font-body text-xs text-[#6E665E]">
                {authModalState === 'login' && 'Sign in to access your saved addresses & order history'}
                {authModalState === 'signup' && 'Pehle pet pooja, phir kaam dooja — Join in 30 seconds!'}
                {authModalState === 'address' && 'Mandatory delivery address for fresh food dispatch'}
              </p>
            </div>
          </div>

          {authModalState !== 'address' && (
            <button
              onClick={closeAuthModal}
              className="w-8 h-8 rounded-full bg-[#FDFBF7] hover:bg-[#ECE7E1] flex items-center justify-center text-[#211C18] border border-[#ECE7E1] transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>

        {/* Non-intrusive Error Banner */}
        {authError && (
          <div className="mx-6 mt-4 p-3 rounded-2xl bg-[#E05326]/10 border border-[#E05326]/30 flex items-start gap-2 text-xs text-[#E05326] font-body">
            <span className="material-symbols-outlined text-[18px] shrink-0">error</span>
            <div className="font-medium leading-relaxed">{authError}</div>
          </div>
        )}

        {/* Modal Body & Animated Tab Views */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            
            {/* STATE 1: LOGIN */}
            {authModalState === 'login' && (
              <motion.form
                key="login-form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleLoginSubmit}
                className="space-y-4"
              >
                {/* Email Field */}
                <div>
                  <label className="block font-body text-xs font-bold text-[#211C18] mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3.5 top-2.5 text-[#6E665E] text-[18px]">mail</span>
                    <input
                      type="email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      placeholder="priya@petpooja.com"
                      className={`w-full h-11 pl-10 pr-3 rounded-xl bg-white border font-body text-xs text-[#211C18] focus:outline-none focus:ring-2 focus:ring-[#E05326]/30 transition-all ${
                        errors.email ? 'border-[#E05326]' : 'border-[#ECE7E1]'
                      }`}
                    />
                  </div>
                  {errors.email && <p className="font-body text-[11px] text-[#E05326] mt-1">{errors.email}</p>}
                </div>

                {/* Password Field */}
                <div>
                  <label className="block font-body text-xs font-bold text-[#211C18] mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3.5 top-2.5 text-[#6E665E] text-[18px]">lock</span>
                    <input
                      type="password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      placeholder="••••••••"
                      className={`w-full h-11 pl-10 pr-3 rounded-xl bg-white border font-body text-xs text-[#211C18] focus:outline-none focus:ring-2 focus:ring-[#E05326]/30 transition-all ${
                        errors.password ? 'border-[#E05326]' : 'border-[#ECE7E1]'
                      }`}
                    />
                  </div>
                  {errors.password && <p className="font-body text-[11px] text-[#E05326] mt-1">{errors.password}</p>}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between font-body text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-[#6E665E]">
                    <input
                      type="checkbox"
                      checked={loginData.rememberMe}
                      onChange={(e) => setLoginData({ ...loginData, rememberMe: e.target.checked })}
                      className="w-4 h-4 text-[#E05326] rounded border-[#ECE7E1] focus:ring-[#E05326]"
                    />
                    <span>Remember me on this browser</span>
                  </label>
                  <button type="button" className="text-[#E05326] hover:underline font-bold">
                    Forgot password?
                  </button>
                </div>

                {/* Primary Kashmiri Saffron Button */}
                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full h-12 rounded-xl bg-[#E05326] hover:bg-[#CB3C14] text-white font-body text-sm font-bold shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  {authLoading ? (
                    <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                  ) : (
                    <>
                      <span>Sign In to PetPooja</span>
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </>
                  )}
                </button>

                {/* Switch to Signup Link */}
                <div className="text-center pt-2 font-body text-xs text-[#6E665E]">
                  New to PetPooja?{' '}
                  <button
                    type="button"
                    onClick={switchToSignup}
                    className="text-[#E05326] hover:underline font-bold"
                  >
                    Create an account
                  </button>
                </div>
              </motion.form>
            )}

            {/* STATE 2: SIGN-UP */}
            {authModalState === 'signup' && (
              <motion.form
                key="signup-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleSignupSubmit}
                className="space-y-3.5"
              >
                {/* Full Name */}
                <div>
                  <label className="block font-body text-xs font-bold text-[#211C18] mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3.5 top-2.5 text-[#6E665E] text-[18px]">person</span>
                    <input
                      type="text"
                      value={signupData.name}
                      onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                      placeholder="Priya Sharma"
                      className={`w-full h-11 pl-10 pr-3 rounded-xl bg-white border font-body text-xs text-[#211C18] focus:outline-none focus:ring-2 focus:ring-[#E05326]/30 transition-all ${
                        errors.name ? 'border-[#E05326]' : 'border-[#ECE7E1]'
                      }`}
                    />
                  </div>
                  {errors.name && <p className="font-body text-[11px] text-[#E05326] mt-1">{errors.name}</p>}
                </div>

                {/* Email Address */}
                <div>
                  <label className="block font-body text-xs font-bold text-[#211C18] mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3.5 top-2.5 text-[#6E665E] text-[18px]">mail</span>
                    <input
                      type="email"
                      value={signupData.email}
                      onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                      placeholder="priya@crave.com"
                      className={`w-full h-11 pl-10 pr-3 rounded-xl bg-white border font-body text-xs text-[#211C18] focus:outline-none focus:ring-2 focus:ring-[#E05326]/30 transition-all ${
                        errors.email ? 'border-[#E05326]' : 'border-[#ECE7E1]'
                      }`}
                    />
                  </div>
                  {errors.email && <p className="font-body text-[11px] text-[#E05326] mt-1">{errors.email}</p>}
                </div>

                {/* Indian Phone Number with fixed +91 prefix */}
                <div>
                  <label className="block font-body text-xs font-bold text-[#211C18] mb-1">
                    Mobile Number (10-Digit Indian)
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 font-mono text-xs font-bold text-[#211C18] bg-[#ECE7E1] px-2 py-1 rounded-md">
                      +91
                    </span>
                    <input
                      type="tel"
                      maxLength={10}
                      value={signupData.phone}
                      onChange={(e) => setSignupData({ ...signupData, phone: e.target.value.replace(/\D/g, '') })}
                      placeholder="9876543210"
                      className={`w-full h-11 pl-16 pr-3 rounded-xl bg-white border font-mono text-xs text-[#211C18] focus:outline-none focus:ring-2 focus:ring-[#E05326]/30 transition-all ${
                        errors.phone ? 'border-[#E05326]' : 'border-[#ECE7E1]'
                      }`}
                    />
                  </div>
                  {errors.phone && <p className="font-body text-[11px] text-[#E05326] mt-1">{errors.phone}</p>}
                </div>

                {/* Password */}
                <div>
                  <label className="block font-body text-xs font-bold text-[#211C18] mb-1">
                    Password (Min 6 characters)
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3.5 top-2.5 text-[#6E665E] text-[18px]">lock</span>
                    <input
                      type="password"
                      value={signupData.password}
                      onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                      placeholder="••••••••"
                      className={`w-full h-11 pl-10 pr-3 rounded-xl bg-white border font-body text-xs text-[#211C18] focus:outline-none focus:ring-2 focus:ring-[#E05326]/30 transition-all ${
                        errors.password ? 'border-[#E05326]' : 'border-[#ECE7E1]'
                      }`}
                    />
                  </div>
                  {errors.password && <p className="font-body text-[11px] text-[#E05326] mt-1">{errors.password}</p>}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full h-12 rounded-xl bg-[#E05326] hover:bg-[#CB3C14] text-white font-body text-sm font-bold shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  {authLoading ? (
                    <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                  ) : (
                    <>
                      <span>Register Passport & Continue</span>
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </>
                  )}
                </button>

                {/* Switch to Login Link */}
                <div className="text-center pt-1 font-body text-xs text-[#6E665E]">
                  Already have a PetPooja account?{' '}
                  <button
                    type="button"
                    onClick={switchToLogin}
                    className="text-[#E05326] hover:underline font-bold"
                  >
                    Sign in here
                  </button>
                </div>
              </motion.form>
            )}

            {/* STATE 3: MANDATORY DELIVERY ADDRESS SETUP */}
            {authModalState === 'address' && (
              <motion.form
                key="address-form"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleAddressSubmit}
                className="space-y-3.5"
              >
                <div className="p-3 rounded-xl bg-[#2E7D47]/10 border border-[#2E7D47]/30 text-xs text-[#2E7D47] font-body flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  <span className="font-semibold">Account Verified! Please enter your delivery address to start ordering.</span>
                </div>

                {/* Flat / Building */}
                <div>
                  <label className="block font-body text-xs font-bold text-[#211C18] mb-1">
                    Flat / House No. / Building Name
                  </label>
                  <input
                    type="text"
                    value={addressData.flat}
                    onChange={(e) => setAddressData({ ...addressData, flat: e.target.value })}
                    placeholder="Flat 402, Green Park Apartments"
                    className={`w-full h-11 px-3 rounded-xl bg-white border font-body text-xs text-[#211C18] focus:outline-none focus:ring-2 focus:ring-[#2E7D47]/30 transition-all ${
                      errors.flat ? 'border-[#E05326]' : 'border-[#ECE7E1]'
                    }`}
                  />
                  {errors.flat && <p className="font-body text-[11px] text-[#E05326] mt-1">{errors.flat}</p>}
                </div>

                {/* Street & Area */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-body text-xs font-bold text-[#211C18] mb-1">
                      Street / Road
                    </label>
                    <input
                      type="text"
                      value={addressData.street}
                      onChange={(e) => setAddressData({ ...addressData, street: e.target.value })}
                      placeholder="12th Main Road"
                      className={`w-full h-11 px-3 rounded-xl bg-white border font-body text-xs text-[#211C18] focus:outline-none focus:ring-2 focus:ring-[#2E7D47]/30 transition-all ${
                        errors.street ? 'border-[#E05326]' : 'border-[#ECE7E1]'
                      }`}
                    />
                    {errors.street && <p className="font-body text-[11px] text-[#E05326] mt-1">{errors.street}</p>}
                  </div>

                  <div>
                    <label className="block font-body text-xs font-bold text-[#211C18] mb-1">
                      Area / Locality
                    </label>
                    <input
                      type="text"
                      value={addressData.area}
                      onChange={(e) => setAddressData({ ...addressData, area: e.target.value })}
                      placeholder="Indiranagar"
                      className={`w-full h-11 px-3 rounded-xl bg-white border font-body text-xs text-[#211C18] focus:outline-none focus:ring-2 focus:ring-[#2E7D47]/30 transition-all ${
                        errors.area ? 'border-[#E05326]' : 'border-[#ECE7E1]'
                      }`}
                    />
                    {errors.area && <p className="font-body text-[11px] text-[#E05326] mt-1">{errors.area}</p>}
                  </div>
                </div>

                {/* City & Pincode */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-body text-xs font-bold text-[#211C18] mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={addressData.city}
                      onChange={(e) => setAddressData({ ...addressData, city: e.target.value })}
                      placeholder="Bengaluru"
                      className={`w-full h-11 px-3 rounded-xl bg-white border font-body text-xs text-[#211C18] focus:outline-none focus:ring-2 focus:ring-[#2E7D47]/30 transition-all ${
                        errors.city ? 'border-[#E05326]' : 'border-[#ECE7E1]'
                      }`}
                    />
                    {errors.city && <p className="font-body text-[11px] text-[#E05326] mt-1">{errors.city}</p>}
                  </div>

                  <div>
                    <label className="block font-body text-xs font-bold text-[#211C18] mb-1">
                      Pincode (6-Digit)
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={addressData.pincode}
                      onChange={(e) => setAddressData({ ...addressData, pincode: e.target.value.replace(/\D/g, '') })}
                      placeholder="560038"
                      className={`w-full h-11 px-3 rounded-xl bg-white border font-mono text-xs text-[#211C18] focus:outline-none focus:ring-2 focus:ring-[#2E7D47]/30 transition-all ${
                        errors.pincode ? 'border-[#E05326]' : 'border-[#ECE7E1]'
                      }`}
                    />
                    {errors.pincode && <p className="font-body text-[11px] text-[#E05326] mt-1">{errors.pincode}</p>}
                  </div>
                </div>

                {/* Landmark */}
                <div>
                  <label className="block font-body text-xs font-bold text-[#211C18] mb-1">
                    Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    value={addressData.landmark}
                    onChange={(e) => setAddressData({ ...addressData, landmark: e.target.value })}
                    placeholder="Opposite BDA Complex"
                    className="w-full h-11 px-3 rounded-xl bg-white border border-[#ECE7E1] font-body text-xs text-[#211C18] focus:outline-none focus:ring-2 focus:ring-[#2E7D47]/30 transition-all"
                  />
                </div>

                {/* Cardamom Green Action Button */}
                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full h-12 rounded-xl bg-[#2E7D47] hover:bg-[#256639] text-white font-body text-sm font-bold shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  {authLoading ? (
                    <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[20px]">check_circle</span>
                      <span>Save Address & Start Ordering</span>
                    </>
                  )}
                </button>
              </motion.form>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
