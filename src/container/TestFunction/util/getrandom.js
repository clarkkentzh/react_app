import wordList from './arrayWords'
import converters from './converters'
import {SHA256_init,SHA256_write,SHA256_finalize} from './sha256util'
import curve25519 from './curve25519'
import {BigInteger} from './jsbn'

export function getMenWords(){
    var crypto = window.crypto || window.msCrypto;
    let values = '';
    if (crypto) {
    
        let bits = 128;
    
        var random = new Uint32Array(bits / 32);
    
        crypto.getRandomValues(random);
    
        var i = 0,
            l = random.length,
            n = 1626,
            words = [],
            x, w1, w2, w3;
    
        for (; i < l; i++) {
            x = random[i];
            w1 = x % n;
            w2 = (((x / n) >> 0) + w1) % n;
            w3 = (((((x / n) >> 0) / n) >> 0) + w2) % n;
    
            words.push(wordList[w1]);
            words.push(wordList[w2]);
            words.push(wordList[w3]);
        }
    
        values = words.join(" ");
    
        crypto.getRandomValues(random);
    
    }
    return values
}



export function getAccount(secretPhrase){
    if(secretPhrase){
        return getPublicKey(converters.stringToHexString(secretPhrase));
    }
}

export function getPrivateKey(secretPhrase) {
    SHA256_init();
    SHA256_write(converters.stringToByteArray(secretPhrase));
    return converters.shortArrayToHexString(curve25519_clamp(converters.byteArrayToShortArray(SHA256_finalize())));
};

export function getAccountId(secretPhrase) {
    return getAccountIdFromPublicKey(getPublicKey(converters.stringToHexString(secretPhrase)));
};

function getAccountIdFromPublicKey(publicKey) {
    var hex = converters.hexStringToByteArray(publicKey);

    _hash.init();
    _hash.update(hex);

    var account = _hash.getBytes();

    account = converters.byteArrayToHexString(account);

    var slice = (converters.hexStringToByteArray(account)).slice(0, 8);

    var accountId = byteArrayToBigInteger(slice).toString();

    return accountId;
};

var _hash = {
    init: SHA256_init,
    update: SHA256_write,
    getBytes: SHA256_finalize
};

function byteArrayToBigInteger(byteArray, startIndex) {
    var value = new BigInteger("0", 10);
    var temp1, temp2;
    for (var i = byteArray.length - 1; i >= 0; i--) {
        temp1 = value.multiply(new BigInteger("256", 10));
        temp2 = temp1.add(new BigInteger(byteArray[i].toString(10), 10));
        value = temp2;
    }

    return value;
}

function simpleHash(message) {
    _hash.init();
    _hash.update(message);
    return _hash.getBytes();
}

function curve25519_clamp(curve) {
    curve[0] &= 0xFFF8;
    curve[15] &= 0x7FFF;
    curve[15] |= 0x4000;
    return curve;
}
    
function getPublicKey(secretPhrase) {
    let secretPhraseBytes = converters.hexStringToByteArray(secretPhrase);
    let digest = simpleHash(secretPhraseBytes);
    return converters.byteArrayToHexString(curve25519.keygen(digest).p);
};