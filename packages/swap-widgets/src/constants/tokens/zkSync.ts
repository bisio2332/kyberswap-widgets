const zkSyncTokens = [
  {
    chainId: 324,
    address: '0x42c1c56be243c250ab24d2ecdcc77f9ccaa59601',
    symbol: 'PERP',
    name: 'Perpetual',
    decimals: 18,
    marketCap: 0,
    logoURI: 'https://storage.googleapis.com/ks-setting-1d682dca/499378cf-23de-4820-b245-6e1a03bb6c99.png',
    isWhitelisted: true,
    isStable: false,
    domainSeparator: '0x81cbc2898010be52cf7de53dda5fa8f15543fa0eaa9e93132fad87635bc4240d',
  },
  {
    chainId: 324,
    address: '0xd0ea21ba66b67be636de1ec4bd9696eb8c61e9aa',
    symbol: 'OT',
    name: 'Onchain Trade',
    decimals: 18,
    marketCap: 18572300,
    logoURI: 'https://storage.googleapis.com/ks-setting-1d682dca/7b4f7e9f-8c50-49ec-bcdc-818a7a04f059.png',
    isWhitelisted: true,
    isStable: false,
  },
  {
    chainId: 324,
    address: '0x493257fd37edb34451f62edf8d2a0c418852ba4c',
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 6,
    marketCap: 8509229,
    logoURI: 'https://storage.googleapis.com/ks-setting-1d682dca/fc7ce9b5-505f-4f29-8883-e86510170110.png',
    isWhitelisted: true,
    isStable: true,
    domainSeparator: '0x830cbbcc61d018041f1c7a8c546f97040273927bb154e60e2e29a2335855c88f',
  },
  {
    chainId: 324,
    address: '0x2039bb4116b4efc145ec4f0e2ea75012d6c0f181',
    symbol: 'cBUSD',
    name: 'Celer Network BUSD',
    decimals: 18,
    marketCap: 4149843.8,
    logoURI: 'https://storage.googleapis.com/ks-setting-1d682dca/4cff4553-3d67-4ed2-b2b5-22395ccddc58.png',
    isWhitelisted: true,
    isStable: true,
  },
  {
    chainId: 324,
    address: '0x28a487240e4d45cff4a2980d334cc933b7483842',
    symbol: 'cMATIC',
    name: 'Celer Network MATIC',
    decimals: 18,
    marketCap: 94423.61325783927,
    logoURI: 'https://storage.googleapis.com/ks-setting-1d682dca/46319446-0b42-4a83-a3f8-a32bd1e71b14.png',
    isWhitelisted: true,
    isStable: false,
  },
  {
    chainId: 324,
    address: '0xd599da85f8fc4877e61f547dfacffe1238a7149e',
    symbol: 'Cheems',
    name: 'Cheems Token',
    decimals: 18,
    marketCap: 4205158.886248695,
    logoURI: 'https://storage.googleapis.com/ks-setting-1d682dca/b047ce83-e47b-4008-af2d-3e39a4c8ff5a.png',
    isWhitelisted: true,
    isStable: false,
  },
  {
    chainId: 324,
    address: '0x47260090ce5e83454d5f05a0abbb2c953835f777',
    symbol: 'SPACE',
    name: 'SPACE',
    decimals: 18,
    marketCap: 1411707.218944,
    logoURI: 'https://storage.googleapis.com/ks-setting-1d682dca/e862d3a4-c23d-44ba-895f-00d112649ff1.png',
    isWhitelisted: true,
    isStable: false,
  },
  {
    chainId: 324,
    address: '0x503234f203fc7eb888eec8513210612a43cf6115',
    symbol: 'LUSD',
    name: 'LUSD Stablecoin',
    decimals: 18,
    marketCap: 1174469.0840702192,
    logoURI: 'https://storage.googleapis.com/ks-setting-1d682dca/0590b6f0-ea78-4d6c-97be-2c60bbe8723d.png',
    isWhitelisted: true,
    isStable: false,
    domainSeparator: '0x05b1a995acbd0855b351774294476a86a40dca4c0afb4af29404840d9d76f546',
  },
  {
    chainId: 324,
    address: '0xbbeb516fb02a01611cbbe0453fe3c580d7281011',
    symbol: 'WBTC',
    name: 'Wrapped BTC',
    decimals: 8,
    marketCap: 2964628.941842585,
    logoURI: 'https://storage.googleapis.com/ks-setting-1d682dca/60ab839d-2e84-4a96-8fa6-3fad3f0e19ca.png',
    isWhitelisted: true,
    isStable: false,
    domainSeparator: '0x51b2483b94e2de6038509671367d5cbcf361a43e060bdd4e6e4c16c3cefd8a56',
  },
  {
    chainId: 324,
    address: '0xbe9f8c0d6f0fd7e46cdacca340747ea2f247991d',
    symbol: 'IBEX',
    name: 'Impermax',
    decimals: 18,
    marketCap: 108434.943831644,
    logoURI: 'https://storage.googleapis.com/ks-setting-1d682dca/2f498c90-2362-4d41-ba7e-c4ea94be69ee.png',
    isWhitelisted: true,
    isStable: false,
    domainSeparator: '0xec02d80e980bdfe27587b993222c98fc030d9e17d7307ca163441a14a9f61df8',
  },
  {
    chainId: 324,
    address: '0xbbd1ba24d589c319c86519646817f2f153c9b716',
    symbol: 'DVF',
    name: 'DeversiFi Token',
    decimals: 18,
    marketCap: 364295.45885600493,
    logoURI: 'https://storage.googleapis.com/ks-setting-1d682dca/4eb3ff0e-b6f1-43b8-aab3-aea9573cc936.png',
    isWhitelisted: true,
    isStable: false,
    domainSeparator: '0xeb2350171a78711269039b50311d08ba2eb2f9eaa1c5fe70750d6b81d7cfa654',
  },
  {
    chainId: 324,
    address: '0x7400793aad94c8ca801aa036357d10f5fd0ce08f',
    symbol: 'cBNB',
    name: 'Celer Network BNB',
    decimals: 18,
    marketCap: 42908.931409284945,
    logoURI: 'https://storage.googleapis.com/ks-setting-1d682dca/ea1e6c58-948c-4925-a71f-4f11047236a5.png',
    isWhitelisted: true,
    isStable: false,
  },
  {
    chainId: 324,
    address: '0x5aea5775959fbc2557cc8789bc1bf90a239d9a91',
    symbol: 'WETH',
    name: 'Wrapped Ether',
    decimals: 18,
    marketCap: 33687355.6608,
    logoURI: 'https://storage.googleapis.com/ks-setting-1d682dca/16b24a3e-dbd3-45cf-9ff4-d0c7c4f4fa21.png',
    isWhitelisted: true,
    isStable: false,
    domainSeparator: '0xa8f5be359d5418a641b1f93d80f0193fcb169b66be484b4500d0be81dcffe636',
  },
  {
    chainId: 324,
    address: '0x6a5279e99ca7786fb13f827fc1fb4f61684933d6',
    symbol: 'cAVAX',
    name: 'Celer Network AVAX',
    decimals: 18,
    marketCap: 81723.14146514701,
    logoURI: 'https://storage.googleapis.com/ks-setting-1d682dca/ef6b1750-55f5-4d6d-9b0b-99be85f72833.png',
    isWhitelisted: true,
    isStable: false,
  },
  {
    chainId: 324,
    address: '0x3355df6d4c9c3035724fd0e3914de96a5a83aaf4',
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    marketCap: 127481178.67579,
    logoURI: 'https://storage.googleapis.com/ks-setting-1d682dca/67c97b93-3dde-4fe2-a5ed-17eb169d4eb9.png',
    isWhitelisted: true,
    isStable: true,
    domainSeparator: '0xebeac0e130ad64ced1e6145e3c5218c9d9831fc603230994f7d8f5f9e8605e97',
  },
  {
    chainId: 324,
    address: '0x7bcd44c0b91be28827426f607424e1a8a02d4e69',
    symbol: 'anyETH',
    name: 'Multichain ETH',
    decimals: 18,
    marketCap: 18181.29649529304,
    logoURI: 'https://storage.googleapis.com/ks-setting-1d682dca/8a859fdd-a6a4-43d6-a47c-7f9d86f1202f.png',
    isWhitelisted: true,
    isStable: false,
  },
  {
    chainId: 324,
    address: '0xfc7e56298657b002b3e656400e746b7212912757',
    symbol: 'zkUSD',
    name: 'zkUSD Dollar',
    decimals: 6,
    marketCap: 2643569.9127841783,
    logoURI: 'https://storage.googleapis.com/ks-setting-1d682dca/665e69e3-03bf-468c-8969-be664503d4d3.png',
    isWhitelisted: true,
    isStable: false,
  },
  {
    chainId: 324,
    address: '0xc2b13bb90e33f1e191b8aa8f44ce11534d5698e3',
    symbol: 'COMBO',
    name: 'Furucombo',
    decimals: 18,
    marketCap: 2036.5403544653616,
    logoURI: 'https://storage.googleapis.com/ks-setting-1d682dca/e9ed8197-943a-4fd4-b16f-e07637e76573.webp',
    isWhitelisted: true,
    isStable: false,
    domainSeparator: '0x058f13819e1410e3777159ed31094c4778496680f911cff5c343f3cc633b3831',
  },
  {
    chainId: 324,
    address: '0x8e86e46278518efc1c5ced245cba2c7e3ef11557',
    symbol: 'USD+',
    name: 'USD+',
    decimals: 6,
    marketCap: 686803.0158171001,
    logoURI: 'https://storage.googleapis.com/ks-setting-1d682dca/dffb121f-5f4a-408a-a694-859f5730dd37.png',
    isWhitelisted: true,
    isStable: true,
  },
  {
    chainId: 324,
    address: '0x0e97c7a0f8b2c9885c8ac9fc6136e829cbc21d42',
    symbol: 'MUTE',
    name: 'Mute.io',
    decimals: 18,
    marketCap: 5334053.761972001,
    logoURI: 'https://storage.googleapis.com/ks-setting-1d682dca/9b6357d5-3235-4e80-a686-048b7778ebc0.png',
    isWhitelisted: true,
    isStable: false,
    domainSeparator: '0x691b85dbd87a6a44499a02fc5a9d5c992b482a84345fb75d70f5e32bb842470b',
  },
  {
    chainId: 324,
    address: '0x85d84c774cf8e9ff85342684b0e795df72a24908',
    symbol: 'VC',
    name: 'Velocore',
    decimals: 18,
    marketCap: 2076581.6038870001,
    logoURI: 'https://storage.googleapis.com/ks-setting-1d682dca/66a39c5e-7894-4300-81d1-d24e7d50de03.svg',
    isWhitelisted: true,
    isStable: false,
  },
  {
    chainId: 324,
    address: '0xd63ef5e9c628c8a0e8984cdfb7444aee44b09044',
    symbol: 'GOVI',
    name: 'GOVI',
    decimals: 18,
    marketCap: 553080.3652648781,
    logoURI: 'https://storage.googleapis.com/ks-setting-1d682dca/a92c9002-6b77-48aa-a22e-cde99532da11.webp',
    isWhitelisted: true,
    isStable: false,
    domainSeparator: '0x150d2c436b3859701a5685235d1cbff9d1ff4456d306abdab0b9747ffcadf945',
  },
  {
    chainId: 324,
    address: '0x32fd44bb869620c0ef993754c8a00be67c464806',
    symbol: 'rETH',
    name: 'Rocket Pool ETH',
    decimals: 18,
    marketCap: 653933.9128312399,
    logoURI: 'https://storage.googleapis.com/ks-setting-1d682dca/199a1b98-39c1-4fb3-8347-72c716d8df9e.png',
    isWhitelisted: true,
    isStable: false,
    domainSeparator: '0x0691012c48834d1f564244c86bdf5e23add1847af0f17e8bad8640b008ad44a2',
  },
  {
    chainId: 324,
    address: '0x43cd37cc4b9ec54833c8ac362dd55e58bfd62b86',
    symbol: 'crvUSD',
    name: 'Curve USD Stablecoin',
    decimals: 18,
    marketCap: 15400.423188063583,
    logoURI: 'https://storage.googleapis.com/ks-setting-1d682dca/ed42c844-6129-4bef-a765-ed2e96d08c7a.png',
    isWhitelisted: true,
    isStable: false,
    domainSeparator: '0xac3674592fa0e2f1235f8eaf996fda4d717abf103c6c073ef08d9a28baaea16f',
  },
  {
    chainId: 324,
    address: '0xcab3f741fa54e79e34753b95717b23018332b8ac',
    symbol: 'TES',
    name: 'Tiny Era Shard Token',
    decimals: 18,
    marketCap: 91737800,
    logoURI: 'https://storage.googleapis.com/ks-setting-1d682dca/02218675-10ee-473e-84d5-315c645f1c20.png',
    isWhitelisted: true,
    isStable: false,
  },
]

export default zkSyncTokens