

const _uniqueToken = async (timeStamp: string, secretKey: string ): Promise<string> => {

    const tokenUnprocessing: string = secretKey + timeStamp;
    const encoder = new TextEncoder();
    const data = encoder.encode(tokenUnprocessing);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
    .map(b => (b < 16 ? '0': '') + b.toString(16))
    .join('');

    return hashHex;
}


export default async function  generateAuthToken(secretKey: string, secretCode: string):Promise<string>{
    const timeStamp = Math.floor(Date.now()/1000).toString(16);
    const uniqueToken = await _uniqueToken(timeStamp, secretKey);
    const auth_token = `${secretCode};${timeStamp};${uniqueToken}`;
    return Buffer.from(auth_token, 'utf-8').toString('base64');
}


