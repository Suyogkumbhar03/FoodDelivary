import { sendError } from '../utils/apiResponse.js';

/**
 * Global Error Handling Middleware
 */
export const errorHandler = (err, req, res, next) => {
  console.error(`[Express Error] ${req.method} ${req.url} -`, err);

  const statusCode = err.statusCode || res.statusCode === 200 ? 500 : res.statusCode;
  const message = err.message || 'Internal Server Error';
  const errors = process.env.NODE_ENV === 'development' ? err.stack : null;

  return sendError(res, statusCode, message, errors);
};

export default errorHandler;
