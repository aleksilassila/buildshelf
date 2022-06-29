module.exports = {
  env: {
    BACKEND_ENDPOINT:
      process.env.BACKEND_ENDPOINT || "http://localhost:9000/api",
    FRONTEND_ENDPOINT: process.env.FRONTEND_ENDPOINT || "http://localhost:3000",
  },
  async redirects() {
    return [
      {
        source: "/user",
        destination: "/",
        permanent: true,
      },
    ];
  },
};
