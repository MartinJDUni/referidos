const nextConfig = {
  reactStrictMode: true,
};

module.exports = {
  ...nextConfig,
  async rewrites() {
    return [
      {
        source: '/Employee/cometarios/:id*',
        destination: '/Employee/cometarios/[id]',
      },
    ];
  },
};
