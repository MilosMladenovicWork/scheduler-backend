export const getAllowedCorsOrigins = () => {
  if (process.env.NODE_ENV === 'dev') {
    return ['http://localhost:3001'];
  }
};
