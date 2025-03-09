import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Plot from '../src/components/plot';

// モック: getPopulationをダミーデータで上書き
jest.mock('@/pages/api/getPrefData', () => ({
  ...jest.requireActual('@/pages/api/getPrefData'),
  getPopulation: jest.fn().mockResolvedValue({
    data: [
      {
        data: [
          { year: 2000, value: 100 },
          { year: 2001, value: 110 },
        ],
      },
      {
        data: [
          { year: 2000, value: 200 },
          { year: 2001, value: 210 },
        ],
      },
      {
        data: [
          { year: 2000, value: 300 },
          { year: 2001, value: 310 },
        ],
      },
      {
        data: [
          { year: 2000, value: 400 },
          { year: 2001, value: 410 },
        ],
      },
    ],
  }),
}));

describe('Plot component', () => {
  test('プロットが正しくレンダリングされる', async () => {
    render(
      <Plot
        plotoptions={{
          plotType: 1,
          prefCode: [1],
          prefName: ['テスト'],
        }}
      />,
    );
    await waitFor(() =>
      expect(screen.getByText('都道府県別の総人口推移')).toBeInTheDocument(),
    );
  });
});
