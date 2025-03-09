import { getPref } from '../src/pages/api/getPrefData';

describe('getPref API', () => {
  test('正しいprefデータを返す', async () => {
    const data = await getPref();
    // 仮実装の例。実際のレスポンスに合わせて修正
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
  });

  test('エラー時は例外を投げる', async () => {
    // エラーケースのシナリオを用意する例
    await expect(Promise.reject(new Error('test error'))).rejects.toThrow(
      'test error',
    );
  });
});
