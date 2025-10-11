import axios from 'axios';

const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY;
const PINATA_SECRET_KEY = import.meta.env.VITE_PINATA_SECRET_KEY;

export const uploadToIPFS = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const pinataMetadata = JSON.stringify({
      name: `aadhar_${Date.now()}.pdf`,
      keyvalues: {
        type: 'aadhar_document',
        uploadedAt: new Date().toISOString()
      }
    });
    formData.append('pinataMetadata', pinataMetadata);

    const pinataOptions = JSON.stringify({
      cidVersion: 0,
    });
    formData.append('pinataOptions', pinataOptions);

    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      formData,
      {
        maxBodyLength: Infinity,
        headers: {
          'Content-Type': 'multipart/form-data',
          'pinata_api_key': PINATA_API_KEY,
          'pinata_secret_api_key': PINATA_SECRET_KEY
        }
      }
    );

    console.log('IPFS Upload Success:', response.data);
    return response.data.IpfsHash; // This is the CID/hash
  } catch (error) {
    console.error('IPFS Upload Error:', error);
    throw new Error('Failed to upload to IPFS: ' + error.message);
  }
};

// Function to get file URL from IPFS hash
export const getIPFSUrl = (hash) => {
  return `https://gateway.pinata.cloud/ipfs/${hash}`;
};
