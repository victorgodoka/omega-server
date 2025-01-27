import zlib from 'zlib'

export const encode = (mainSize, sideSize, passwords, deckPassword = null) => {
  const stream = [];

  // Writing main and side deck sizes
  stream.push(Buffer.from([mainSize]));
  stream.push(Buffer.from([sideSize]));

  // Adding deck passwords
  if (deckPassword) {
    passwords.push(deckPassword);
  }

  // Adding each password (as 4-byte integers)
  passwords.forEach(password => {
    const buffer = Buffer.alloc(4);
    buffer.writeUInt32LE(password, 0);
    stream.push(buffer);
  });

  // Concatenate all buffers into a single buffer
  const buffer = Buffer.concat(stream);

  try {
    // Compressing the data using deflateRawSync
    const compressed = zlib.deflateRawSync(buffer, { level: 9 });

    // Log compressed buffer for debugging
    console.log('Compressed buffer:', compressed);

    // Return as Base64 string
    return compressed.toString('base64');
  } catch (error) {
    console.error('Compression error:', error);
    throw error; // Re-throw the error for further debugging
  }
};

export const decode = (code) => {
  try {
    const decodedBuffer = Buffer.from(code, 'base64');
    const decompressedBuffer = zlib.inflateRawSync(decodedBuffer);

    const stream = Array.from(decompressedBuffer);
    const mainSize = stream.shift();
    const sideSize = stream.shift();

    const passwords = [];

    for (let i = 0; i < (mainSize + sideSize); i++) {
      const password = stream.splice(0, 4).reduce((acc, byte, index) => acc + (byte << (index * 8)), 0);
      passwords.push(password);
    }

    return {
      mainSize,
      sideSize, 
      passwords,
    };
  } catch (error) {
    throw new InvalidDeckCode(error);
  }
};
