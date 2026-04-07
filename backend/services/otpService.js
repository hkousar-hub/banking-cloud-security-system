const otpStore = new Map();

// generate OTP
export const generateOTP = (email) => {
  const otp = Math.floor(100000 + Math.random() * 900000);

  otpStore.set(email, {
    otp,
    expires: Date.now() + 5 * 60 * 1000 // 5 min
  });

  console.log(`OTP for ${email}: ${otp}`); // 🔥 for testing

  return otp;
};

// verify OTP
export const verifyOTP = (email, enteredOtp) => {
  const record = otpStore.get(email);

  if (!record) return false;

  if (Date.now() > record.expires) {
    otpStore.delete(email);
    return false;
  }

  if (record.otp == enteredOtp) {
    otpStore.delete(email);
    return true;
  }

  return false;
};