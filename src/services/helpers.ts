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

/**
 * Normalise a date string to a full ISO format (YYYY-MM-DDTHH:mm:ss).
 * Ensures the backend receives a consistent date string, regardless of
 * whether the input came from a `datetime-local` input (no seconds) or a
 * plain date string (no time component at all).
 */
export const formatMatchDate = (dateValue: string): string => {
  if (dateValue.includes("T")) {
    const [datePart, timePart] = dateValue.split("T");
    const timeWithSeconds =
      timePart.split(":").length === 2 ? `${timePart}:00` : timePart;
    return `${datePart}T${timeWithSeconds}`;
  }
  return `${dateValue}T00:00:00`;
};
