const Web3 = require('web3');
const axios = require('axios');
const getRootGasPrice = require('./getRootGasPrice');

jest.mock('axios');

axios.get.mockResolvedValue({
  data: {
    fast: 200.0,
    fastest: 270.0,
    safeLow: 134.0,
    average: 180.0,
    block_time: 19.228571428571428,
    blockNum: 7269705,
    speed: 0.998286333650524,
    safeLowWait: 22.6,
    avgWait: 3.2,
    fastWait: 0.6,
    fastestWait: 0.6,
  },
});

describe('getRootGasPrice', () => {
  describe('mainnet', () => {
    const web3 = new Web3('https://mainnet.infura.io');

    test('Reads "fast" gas price by default from gas station API', async () => {
      const result = await getRootGasPrice(web3);
      expect(result).toBe(20000000000);
    });

    test('Reads specified gas price from gas station API', async () => {
      const result = await getRootGasPrice(web3, 'safeLow');
      expect(result).toBe(13400000000);
    });
  });

  test('Returns null for non-mainnet networks', async () => {
    const result = await getRootGasPrice(new Web3('https://rinkeby.infura.io'));
    expect(result).toBeNull();
  });
});
