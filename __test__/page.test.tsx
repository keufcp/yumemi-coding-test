import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from '../src/app/page';
import * as api from '@/pages/api/getPrefData';

// モック: Plot コンポーネントをダミーコンポーネントに置換
jest.mock('@/components/plot', () => ({
  __esModule: true,
  default: () => <div data-testid="plot-mock" />,
}));

jest.mock('@/pages/api/getPrefData', () => ({
  getPref: jest.fn(),
  // 変更: getPopulation が期待する構造の dummy データを返すように
  getPopulation: jest.fn().mockResolvedValue([
    {
      data: [{ data: [{ year: 2020 }, { year: 2021 }] }],
    },
  ]),
}));

// モックデータ
const mockPrefData = [
  { prefCode: 1, prefName: '北海道' },
  { prefCode: 2, prefName: '青森県' },
];

// 修正: 戻り値を直接配列に変更
(api.getPref as jest.Mock).mockResolvedValue(mockPrefData);

describe('Home component', () => {
  test('都道府県データを取得しチェックボックスを生成する', async () => {
    render(<Home />);
    // API呼び出し後、チェックボックスが表示されることを確認
    await waitFor(() => {
      expect(screen.getByLabelText('北海道')).toBeInTheDocument();
      expect(screen.getByLabelText('青森県')).toBeInTheDocument();
    });
  });

  test('チェックボックスの状態が変更される', async () => {
    render(<Home />);
    await waitFor(() => screen.getByLabelText('北海道'));
    const checkboxHokkaido = screen.getByLabelText('北海道');
    // 初期は未チェック
    expect(checkboxHokkaido).not.toBeChecked();
    // クリックで状態が反転する
    await userEvent.click(checkboxHokkaido);
    await waitFor(() => expect(checkboxHokkaido).toBeChecked());
    await userEvent.click(checkboxHokkaido);
    await waitFor(() => expect(checkboxHokkaido).not.toBeChecked());
  });

  test('プロット種別ボタンのクリックでplotOptionsが更新される', async () => {
    render(<Home />);
    await waitFor(() => screen.getByLabelText('北海道'));
    // ボタンをクリックしてプロット種別を変更
    const buttonPopulation = screen.getByRole('button', { name: '総人口' });
    const buttonYouth = screen.getByRole('button', { name: '年少人口' });
    await userEvent.click(buttonYouth);
    // ダミーの Plot コンポーネントがレンダリングされていることを確認
    await waitFor(() =>
      expect(screen.getByTestId('plot-mock')).toBeInTheDocument(),
    );
  });
});
