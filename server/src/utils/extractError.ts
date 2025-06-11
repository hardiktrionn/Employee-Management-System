export interface ValidationError {
  path: string;
  msg: string;
}

// seperate the all express-validation error with they path name
const extractError = (error: ValidationError[]): Record<string, string> => {
  const formattedErrors: Record<string, string> = {};

  error.forEach((err) => {
    if (!formattedErrors[err.path]) {
      formattedErrors[err.path] = err.msg;
    }
  });

  return formattedErrors;
};

export default extractError;
