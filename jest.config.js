// Sync object
/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  verbose: true,
  reporters  : [
    "default",
    "github-actions",
  ],
};

module.exports = config;
