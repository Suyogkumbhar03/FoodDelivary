export const requireAddressMiddleware = (req, res, next) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({
      success: false,
      error: 'AUTH_REQUIRED',
      message: 'AUTH_REQUIRED: Please log in to proceed.'
    });
  }

  const hasAddress = user.hasCompletedAddress || (user.addresses && user.addresses.length > 0);

  if (!hasAddress) {
    return res.status(403).json({
      success: false,
      error: 'ADDRESS_REQUIRED',
      message: 'ADDRESS_REQUIRED: Please enter your delivery address before proceeding to checkout.'
    });
  }

  next();
};
