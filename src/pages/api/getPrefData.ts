'use server';
import dotenv from 'dotenv';
import path from 'path';

// 環境変数を読み込む
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// 環境変数から URL と KEY を取得
const url = process.env.API_ENDPOINT!;
const key = process.env.X_API_KEY!;

// エラーチェック
if (!url || !key) {
  throw new Error('URL or Key is missing in .env file');
}

// 都道府県リストを取得
export const getPref = async () => {
  try {
    const response = await fetch(`${url}/api/v1/prefectures`, {
      headers: {
        'X-API-KEY': key,
      },
    });
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error('Error fetching prefectures data:', error);
    throw new Error('Failed to fetch prefectures data');
  }
};

/**
 * 都道府県データを表す型定義
 * @property {number} prefCode - 都道府県コード
 * @property {string} prefName - 都道府県名
 */
export type PrefData = {
  prefCode: number;
  prefName: string;
};

// 都道府県別の総人口推移等を取得
export const getPopulation = async (prefCode: number) => {
  try {
    const response = await fetch(
      `${url}/api/v1/population/composition/perYear?prefCode=${prefCode}`,
      {
        headers: {
          'X-API-KEY': key,
        },
      },
    );
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error('Error fetching population data:', error);
    throw new Error('Failed to fetch population data');
  }
};

/**
 * 人口データを表す型定義
 * @property {number} boundaryYear - データ取得年(用途不明？)
 * @property {object[]} data - 人口データ
 *   @property {string} label - データのラベル
 *   @property {object[]} data - 人口データ
 *    @property {number} year - 年
 *    @property {number} value - 人口
 */
export type PopulationData = {
  boundaryYear: number;
  data: [
    {
      label: string;
      data: [{ year: number; value: number }];
    },
  ];
};
