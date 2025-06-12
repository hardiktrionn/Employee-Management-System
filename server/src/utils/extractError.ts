export interface ValidationError {
  path: string;
  msg: string;
}

/**
 * Function Name: extractError
 *
 * Description:
 * The function extract error and set with key and value.
 *
 * Parameters:
 * - `error:the type is array.
 *
 * Returns:
 * - The return a object.
 * *
 * Example Usage:
 * ```
 *   const response =  extractError(errors);
 *   console.log(response); // {name:"Name is Required"}
 * ```
 */
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
