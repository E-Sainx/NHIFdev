// scripts/upload-to-ipfs.js
require('dotenv').config();
const axios = require('axios');
const FormData = require('form-data');

async function uploadToIPFS(content) {
  const formData = new FormData();
  formData.append('file', content);

  const projectId = process.env.INFURA_PROJECT_ID;
  const projectSecret = process.env.INFURA_PROJECT_SECRET;
  const auth = Buffer.from(`${projectId}:${projectSecret}`).toString('base64');

  try {
    const response = await axios.post('https://ipfs.infura.io:5001/api/v0/add', formData, {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    const ipfsHash = response.data.Hash;
    console.log(`IPFS Hash: ${ipfsHash}`);
    return ipfsHash;
  } catch (error) {
    console.error('Error uploading to IPFS:', error.response ? error.response.data : error.message);
    throw error;
  }
}

module.exports = { uploadToIPFS };
