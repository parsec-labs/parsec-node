const { Tx } = require('leap-core');

const checkEpochLength = require('./checkEpochLengthV2');

const getInitialState = () => ({
  epoch: {
    epoch: 0,
    epochLength: null,
  },
});

describe('checkEpochLengthV2', () => {
  test('wrong type', () => {
    let tx = Tx.transfer([], []);
    expect(() => checkEpochLength({}, tx)).toThrow(
      'epochLength tx V2 expected'
    );

    tx = Tx.epochLengthV1(4);
    expect(() => checkEpochLength({}, tx)).toThrow(
      'epochLength tx V2 expected'
    );
  });

  test('successful tx', () => {
    const state = getInitialState();
    const epochLength = Tx.epochLength(4, 2);

    checkEpochLength(state, epochLength, {
      epochLengths: [[4, 2]],
    });

    expect(state.epoch.epochLength).toBe(4);
  });

  test('series of txs', () => {
    const state = getInitialState();

    const epochLength1 = Tx.epochLength(4, 2);
    checkEpochLength(state, epochLength1, {
      epochLengths: [[4, 2]],
    });

    const epochLength2 = Tx.epochLength(3, 5);
    const bridgeState = {
      epochLength: 4,
      epochLengths: [[1, 2], [4, 2], [3, 5]],
    };
    checkEpochLength(state, epochLength2, bridgeState);

    expect(state.epoch.epochLength).toBe(3);
  });

  test('epoch length mismatch', () => {
    const state = getInitialState();
    const epochLength = Tx.epochLength(4, 2);

    expect(() => {
      checkEpochLength(state, epochLength, {
        epochLengths: [[5, 2]],
      });
    }).toThrow('Wrong epoch length');

    expect(() => {
      checkEpochLength(state, epochLength, {
        epochLengths: [[4, 1]],
      });
    }).toThrow('Wrong epoch length');
  });
});
