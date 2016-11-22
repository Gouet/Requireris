/**
 * Created by Victor on 13/11/16.
 */

const crypto = require('crypto');
const base32 = require('thirty-two');

function dynamicTruncate(HS) {
    let byte = HS[19];

    let offset = byte & 0xf;

    if (offset < 0 || offset > 19) {
        return (null);
    }
    let buffer = new Buffer(4);

    buffer[0] = HS[offset];
    buffer[1] = HS[offset + 1];
    buffer[2] = HS[offset + 2];
    buffer[3] = HS[offset + 3];

    let bin_code = (buffer[0] & 0x7f) << 24 | (buffer[1] & 0xff) << 16 | (buffer[2] & 0xff) <<  8 | (buffer[3] & 0xff);
    return (bin_code);
}

function hotp(counterOffSet, secret, length, algohash) {
    let counter = Buffer.alloc(8);
    counter.writeUIntBE(counterOffSet, 0, 8);

    secret = base32.decode(secret);
    const cryptoHmac = crypto.createHmac(algohash, secret);

    cryptoHmac.update(counter);
    let HS = cryptoHmac.digest();
    let Sbits = dynamicTruncate(Buffer.from(HS));
    if (Sbits) {
        let string = Sbits.toString();
        string = string.substr(string.length - length);
        return (string);
    }
    return (null);
}

function totp(secret, timestep, timestart, length, algohash) {
    const secondsFromEpoch = Date.now() / 1000;
    counterOffSet = Math.floor(secondsFromEpoch - timestart) / timestep;
    return [hotp(counterOffSet, secret, length, algohash), counterOffSet];
}

exports.totp = totp;
exports.hotp = hotp;