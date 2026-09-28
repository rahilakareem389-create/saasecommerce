const sendEmail = async (options) => {
  // Email logic has been moved to the frontend (Browser) to bypass Cloudflare and Railway blocks.
  console.log('Backend email skipped. Frontend will handle Web3Forms submission.');
  return true;
};

module.exports = sendEmail;
