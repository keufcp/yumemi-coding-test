jest.mock('@/pages/api/getPrefData', () => ({
  getPref: async () => {
    return Array.from({ length: 47 }, (_, i) => ({
      prefCode: i + 1,
      prefName: `Prefecture ${i + 1}`,
    }));
  },
  // 必要に応じて PrefData 型もエクスポート
  PrefData: {},
}));

import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Suspense } from 'react';
import Home from '../src/app/page';

test('ページ内にチェックボックスが47個存在することを確認する', async () => {
  render(
    <Suspense fallback={<div>Loading...</div>}>
      <Home />
    </Suspense>,
  );
  await waitFor(
    () => {
      expect(screen.getAllByRole('checkbox')).toHaveLength(47);
    },
    { timeout: 5000 },
  );
});
