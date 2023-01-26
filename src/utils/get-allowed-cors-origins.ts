export const getAllowedCorsOrigins = () => {
  if (process.env.NODE_ENV === 'dev') {
    return ['http://localhost:3001'];
  }

  return [process.env.FRONTEND_BASE_URL as string];
};
