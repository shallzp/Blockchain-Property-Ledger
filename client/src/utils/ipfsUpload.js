import axios from 'axios';

const PINATA_JWT = import.meta.env.VITE_PINATA_JWT;
const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY;
const PINATA_SECRET_KEY = import.meta.env.VITE_PINATA_SECRET_KEY;

const PINATA_FILE_ENDPOINT = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

const isPdfFile = (file) => {
  const mimeType = typeof file?.type === 'string' ? file.type.toLowerCase() : '';
  const fileName = typeof file?.name === 'string' ? file.name.toLowerCase() : '';

  return mimeType === 'application/pdf' || fileName.endsWith('.pdf');
};

const sanitizeFileName = (name) => {
  const baseName = (name || 'document.pdf').replace(/[^a-zA-Z0-9._-]/g, '_');
  return baseName.endsWith('.pdf') ? baseName : `${baseName}.pdf`;
};

const getAuthHeaders = () => {
  if (PINATA_JWT) {
    return {
      Authorization: `Bearer ${PINATA_JWT}`,
    };
  }

  if (PINATA_API_KEY && PINATA_SECRET_KEY) {
    return {
      pinata_api_key: PINATA_API_KEY,
      pinata_secret_api_key: PINATA_SECRET_KEY,
    };
  }

  throw new Error(
    'Pinata credentials are missing. Set VITE_PINATA_JWT or VITE_PINATA_API_KEY/VITE_PINATA_SECRET_KEY.'
  );
};

const getPinataErrorMessage = (error) => {
  const responseData = error?.response?.data;

  if (typeof responseData === 'string' && responseData.trim()) {
    return responseData;
  }

  if (responseData?.error?.reason) {
    return responseData.error.reason;
  }

  if (responseData?.error?.details) {
    return responseData.error.details;
  }

  if (responseData?.message) {
    return responseData.message;
  }

  if (error?.message) {
    return error.message;
  }

  return 'Unknown upload failure';
};

export const uploadToIPFS = async (file) => {
  if (!file) {
    throw new Error('A PDF file is required for IPFS upload.');
  }

  if (!isPdfFile(file)) {
    throw new Error('Only PDF files are allowed.');
  }

  if (typeof file.size === 'number' && file.size <= 0) {
    throw new Error('The selected PDF is empty.');
  }

  if (typeof file.size === 'number' && file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error('The PDF exceeds the 10 MB upload limit.');
  }

  const formData = new FormData();
  formData.append('file', file, sanitizeFileName(file.name));
  formData.append(
    'pinataMetadata',
    JSON.stringify({
      name: sanitizeFileName(file.name),
      keyvalues: {
        documentType: 'aadhaar_document',
        uploadedAt: new Date().toISOString(),
      },
    })
  );
  formData.append('pinataOptions', JSON.stringify({ cidVersion: 1 }));

  try {
    const response = await axios.post(PINATA_FILE_ENDPOINT, formData, {
      maxBodyLength: Infinity,
      timeout: 30000,
      headers: getAuthHeaders(),
    });

    const ipfsHash = response?.data?.IpfsHash;

    if (!ipfsHash) {
      throw new Error('Pinata did not return an IPFS hash.');
    }

    return ipfsHash;
  } catch (error) {
    throw new Error(`Failed to upload PDF to IPFS: ${getPinataErrorMessage(error)}`);
  }
};
