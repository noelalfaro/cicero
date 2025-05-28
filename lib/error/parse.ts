// lib/error/parse.ts
// For client and server
export const parseError = (error: unknown): string => {
  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  // You could add more specific checks here if needed
  // e.g., for Axios errors, Zod errors, etc.
  // if (axios.isAxiosError(error) && error.response?.data?.message) {
  //   return error.response.data.message;
  // }

  return 'An unexpected error occurred. Please try again.'; // More user-friendly default
};
