export const getErrorMessage = (err) => {
  return err?.response?.data?.message || "Something went wrong";
};