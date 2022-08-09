module.exports = {
  env: {
    BACKEND_ENDPOINT:
      process.env.BACKEND_ENDPOINT || "http://localhost:9000/api",
    FRONTEND_ENDPOINT: process.env.FRONTEND_ENDPOINT || "http://localhost:3000",
    MICROSOFT_CLIENT_ID: process.env.MICROSOFT_CLIENT_ID || "",
    MICROSOFT_REDIRECT_URL: `https://login.live.com/oauth20_authorize.srf?client_id=${process.env.MICROSOFT_CLIENT_ID}&scope=XboxLive.signin%20offline_access&redirect_uri=${process.env.FRONTEND_ENDPOINT}/login&response_type=code`,
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
