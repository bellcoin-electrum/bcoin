'use strict';

const util = require('../lib/utils/util');
const consensus = require('../lib/protocol/consensus');
const encoding = require('../lib/utils/encoding');
const TX = require('../lib/primitives/tx');
const Block = require('../lib/primitives/block');
const Script = require('../lib/script/script');

function createGenesisBlock(options) {
  let flags = options.flags;
  let key = options.key;
  let reward = options.reward;

  if (!flags) {
    flags = Buffer.from(
      'ESPN F1 15/Aug/2018 Alonso to retire from F1 at the end of the season',
      'ascii');
  }

  if (!reward)
    reward = 50 * consensus.COIN;

  const tx = new TX({
    version: 1,
    inputs: [{
      prevout: {
        hash: encoding.NULL_HASH,
        index: 0xffffffff
      },
      script: Script()
        .pushInt(0)
        .pushPush(Buffer.from([0xe7, 0x03]))
        .pushData(flags)
        .compile(),
      sequence: 0xffffffff
    }],
    outputs: [{
      value: reward,
      script: key ? Script.fromPubkey(key) : new Script()
    }],
    locktime: 0
  });

  const block = new Block({
    version: options.version,
    prevBlock: encoding.NULL_HASH,
    merkleRoot: tx.hash('hex'),
    time: options.time,
    bits: options.bits,
    nonce: options.nonce,
    height: 0
  });

  block.txs.push(tx);

  return block;
}

const main = createGenesisBlock({
  version: 1,
  time: 1534543066,
  bits: 0x1e3fffff,
  nonce: 96906
});

const testnet = createGenesisBlock({
  version: 1,
  time: 1534543067,
  bits: 0x1e3fffff,
  nonce: 149086
});

const regtest = createGenesisBlock({
  version: 1,
  time: 1296688602,
  bits: 545259519,
  nonce: 2
});

util.log(main);
util.log('');
util.log(testnet);
util.log('');
util.log(regtest);
util.log('');
util.log('');
util.log('main hash: %s', main.hash('hex'));
util.log('main merkle: %s', main.merkleRoot);
util.log('main raw: %s', main.toRaw().toString('hex'));
util.log('');
util.log('testnet hash: %s', testnet.hash('hex'));
util.log('testnet merkle: %s', testnet.merkleRoot);
util.log('testnet raw: %s', testnet.toRaw().toString('hex'));
util.log('');
util.log('regtest hash: %s', regtest.hash('hex'));
util.log('regtest merkle: %s', regtest.merkleRoot);
util.log('regtest raw: %s', regtest.toRaw().toString('hex'));
util.log('');
