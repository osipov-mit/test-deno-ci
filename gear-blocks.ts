import { assert } from 'https://deno.land/std@0.168.0/testing/asserts.ts';
import { ApiPromise, WsProvider } from 'npm:@polkadot/api';
import { u32 } from 'npm:@polkadot/types-codec';

const provider = new WsProvider(Deno.args.at(0));

const api = await ApiPromise.create({
  provider,
  rpc: {
    chainSpec: {
      unstable_chainName: { params: [], description: '', type: '' },
      unstable_genesisHash: { params: [], description: '', type: '' },
      unstable_properties: { params: [], description: '', type: '' },
    },
    gear: {
      calculateHandleGas: { params: [], description: '', type: '' },
      calculateInitCreateGas: { params: [], description: '', type: '' },
      calculateInitUploadGas: { params: [], description: '', type: '' },
      calculateReplyGas: { params: [], description: '', type: '' },
      readMetahash: { params: [], description: '', type: '' },
      readState: { params: [], description: '', type: '' },
      readStateUsingWasm: { params: [], description: '', type: '' },
    },
    transaction: {
      unstable_submitAndWatch: { params: [], description: '', type: '' },
      unstable_unwatch: { params: [], description: '', type: '' },
    },
  },
  runtime: {
    GearApi: [
      {
        methods: {},
        version: 1,
      },
    ],
  },
});

let blockNumber = (await api.query.gear.blockNumber()) as u32;

setTimeout(() => {
  api.rpc.chain.subscribeNewHeads(async () => {
    const bn = (await api.query.gear.blockNumber()) as u32;
    assert(bn.gt(blockNumber), 'Gear blocks stopped');
    blockNumber = bn;
  });
}, 2000);
