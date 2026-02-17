/**
 * Shared helper utilities for service layer
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const extractErrorMessage = (error: any, defaultMessage: string): string => {
  const errorData = error.response?.data;
  
  if (errorData?.error) {
    if (errorData.error.details) {
      if (typeof errorData.error.details === "string") return errorData.error.details;
      return JSON.stringify(errorData.error.details);
    }
    if (errorData.error.message) {
      return errorData.error.message;
    }
  }
  
  if (error.message) {
    return error.message;
  }
  
  return defaultMessage;
};
