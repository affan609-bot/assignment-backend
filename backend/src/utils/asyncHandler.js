/**
 * Async controller functions ko wrap karta hai.
 * Agar controller ke andar koi error aaye to wo automatic
 * next(error) se centralized error handler tak chala jayega.
 *
 * Usage:
 *   router.get('/', asyncHandler(async (req, res) => { ... }));
 */
const asyncHandler = (handler) => {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
};

export default asyncHandler;
