if (!globalThis.fetch) {
  try {
    const nodeFetch = require('node-fetch');
    globalThis.fetch = nodeFetch;
  } catch (err) {
    console.warn(
      'node-fetch module not installed and global fetch is not available.',
    );
    // ダミーの fetch を設定し、getPrefData が期待するレスポンスを返す
    globalThis.fetch = function () {
      return Promise.resolve({
        json: () =>
          Promise.resolve({
            result: [{ prefCode: 1, prefName: 'TestPref' }],
          }),
      });
    };
  }
}
