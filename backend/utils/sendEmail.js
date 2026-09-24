const sendEmail = async (options) => {
  try {
    // Strip HTML tags for Web3Forms readability
    const plainText = options.html ? options.html.replace(/<[^>]*>?/gm, '\n').replace(/\n\s*\n/g, '\n').trim() : '';

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        access_key: '6d6e0418-bb66-48ed-81eb-aaf8f0a9486d',
        subject: options.subject || 'SaaSCommerce Notification',
        Message: plainText,
        from_name: 'SaaSCommerce System'
      })
    });

    const result = await response.json();
    console.log('Web3Forms Result:', result);
    
    if (!response.ok) {
      throw new Error(result.message || 'Web3Forms submission failed');
    }
    
    return result;
  } catch (error) {
    console.error('Error sending via Web3Forms:', error);
    throw error;
  }
};

module.exports = sendEmail;
