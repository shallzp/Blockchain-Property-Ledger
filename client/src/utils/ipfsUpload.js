import axios from 'axios';

// Environment variables loaded with Vite (starting with VITE_)
const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY;
const PINATA_SECRET_KEY = import.meta.env.VITE_PINATA_SECRET_KEY;

export const uploadToIPFS = async (file) => {
  try {
    if (!PINATA_API_KEY || !PINATA_SECRET_KEY) {
      throw new Error('Pinata API credentials are missing. Check your .env file.');
    }
    // Optionally, only allow PDFs
    if (file && file.type !== 'application/pdf') {
      throw new Error('Only PDF files are allowed.');
    }

    const formData = new FormData();
    formData.append('file', file);

    const pinataMetadata = JSON.stringify({
      name: `aadhar_${Date.now()}.pdf`,
      keyvalues: { type: 'aadhar_document', uploadedAt: new Date().toISOString() }
    });
    formData.append('pinataMetadata', pinataMetadata);

    const pinataOptions = JSON.stringify({ cidVersion: 0 });
    formData.append('pinataOptions', pinataOptions);

    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      formData,
      {
        maxBodyLength: Infinity,
        headers: {
          'Content-Type': 'multipart/form-data',
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET_KEY
        }
      }
    );

    if (response.data && response.data.IpfsHash) {
      console.log('IPFS Upload Success:', response.data);
      return response.data.IpfsHash;
    } else {
      throw new Error('Pinata did not return a valid IPFS hash');
    }
  } catch (error) {
    console.error('IPFS Upload Error:', error);
    throw new Error('Failed to upload to IPFS: ' + (error?.message || error));
  }
};
