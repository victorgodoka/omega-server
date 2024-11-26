import zlib from 'zlib';
import { Buffer } from 'buffer';

class InvalidMainSize extends Error {
  constructor(message) {
    super(message);
    this.name = 'InvalidMainSize';
  }
}

class InvalidSideSize extends Error {
  constructor(message) {
    super(message);
    this.name = 'InvalidSideSize';
  }
}

class SizeMismatch extends Error {
  constructor(message) {
    super(message);
    this.name = 'SizeMismatch';
  }
}

class InvalidDeckCode extends Error {
  constructor(message) {
    super(message);
    this.name = 'InvalidDeckCode';
  }
}

export const encode = (mainSize, sideSize, passwords, deckPassword = null) => {
  const sizeError = (type, start, end, error, plural) => {
    return `The ${type} deck must contain ${start} to ${end} cards, not ${error} card${plural}`;
  };

  if (mainSize < 40 || mainSize > 60) {
    throw new InvalidMainSize(
      sizeError('main', 40, 60, mainSize, mainSize !== 1 ? 's' : '')
    );
  }

  if (sideSize < 0 || sideSize > 15) {
    throw new InvalidSideSize(
      sizeError('side', 0, 15, sideSize, 's')
    );
  }

  if (mainSize + sideSize !== passwords.length) {
    throw new SizeMismatch(
      `The combined length of the main and side decks do not match that of the passwords, ${mainSize} + ${sideSize} ≠ ${passwords.length}`
    );
  }

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
    stream.push(Buffer.alloc(4).writeUInt32LE(password, 0));
  });

  const buffer = Buffer.concat(stream);

  // Compressing the data
  const deflate = zlib.createDeflateRaw({ level: 9 });
  const compressed = deflate.update(buffer);
  deflate.end();

  return compressed.toString('base64');
};

export const decode = (code) => {
  try {
    const decodedBuffer = Buffer.from(code, 'base64');
    const decompressedBuffer = zlib.inflateRawSync(decodedBuffer);

    const stream = Array.from(decompressedBuffer);
    const mainSize = stream.shift();
    const sideSize = stream.shift();

    const passwords = [];

    // Extracting the passwords
    for (let i = 0; i < (mainSize + sideSize); i++) {
      const password = stream.splice(0, 4).reduce((acc, byte, index) => acc + (byte << (index * 8)), 0);
      passwords.push(password);
    }

    // The last 4 bytes are the deck password
    const deckPassword = stream.splice(0, 4).reduce((acc, byte, index) => acc + (byte << (index * 8)), 0);

    return {
      mainSize,
      sideSize,
      passwords,
      deckPassword
    };
  } catch (error) {
    throw new InvalidDeckCode('Invalid Omega deck code');
  }
};
