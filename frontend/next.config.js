module.exports = {
  env: {
    BACKEND_ENDPOINT:
      process.env.BACKEND_ENDPOINT || "http://localhost:9000/api",
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
