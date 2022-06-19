module.exports = {
  env: {
    BACKEND_ENDPOINT:
      process.env.BACKEND_ENDPOINT || "http://localhost:9000/api",
    MICROSOFT_REDIRECT_URI:
      process.env.MICROSOFT_REDIRECT_URI || "http://localhost:3000/login",
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
