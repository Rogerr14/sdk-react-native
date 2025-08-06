

// const _uniqueToken = async (timeStamp: string, secretKey: string): Promise<string> => {
//     if (!secretKey || !timeStamp) {
//       throw new Error('secretKey and timeStamp are required');
//     }
  
//     const tokenUnprocessing: string = secretKey + timeStamp;
//     const encoder = new TextEncoder();
//     const data = encoder.encode(tokenUnprocessing);
//     const hashBuffer = await crypto.subtle.digest('SHA-256', data);
//     const hashArray = Array.from(new Uint8Array(hashBuffer));
//     const hashHex = hashArray
//       .map((b) => b.toString(16).padStart(2, '0')) // Asegura dos dígitos por byte
//       .join('');
  
//     return hashHex;
//   };
  
//   export default async function generateAuthToken(secretKey: string, secretCode: string): Promise<string> {
//     if (!secretKey || !secretCode) {
//       throw new Error('secretKey and secretCode are required');
//     }
  
//     const timeStamp = Math.floor(Date.now() / 1000).toString(); // Timestamp en base 10
//     const uniqueToken = await _uniqueToken(timeStamp, secretKey);
//     const authToken = `${secretCode};${timeStamp};${uniqueToken}`;
//     return Buffer.from(authToken, 'utf-8').toString('base64');
//   }
import SHA256 from 'crypto-js/sha256';
import encUtf8 from 'crypto-js/enc-utf8';
import encBase64 from 'crypto-js/enc-base64';

const _uniqueToken = async (timeStamp: string, secretKey: string): Promise<string> => {
  if (!secretKey || !timeStamp) {
    throw new Error('secretKey and timeStamp are required');
  }

  const tokenUnprocessing = secretKey + timeStamp;
  const hash = SHA256(tokenUnprocessing).toString(); // SHA-256 en hex
  return hash;
};

export default async function generateAuthToken(secretKey: string, secretCode: string): Promise<string> {
  if (!secretKey || !secretCode) {
    throw new Error('secretKey and secretCode are required');
  }

  const timeStamp = Math.floor(Date.now() / 1000).toString();
  const uniqueToken = await _uniqueToken(timeStamp, secretKey);
  const authToken = `${secretCode};${timeStamp};${uniqueToken}`;

  // Codifica en Base64 usando crypto-js
  const base64Token = encBase64.stringify(encUtf8.parse(authToken));
  return base64Token;
}
