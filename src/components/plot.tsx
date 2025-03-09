import React, { useEffect } from 'react';
import { useRef } from 'react';
import { useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official'; //?
import 'highcharts/css/highcharts.css';
import { getPopulation, PopulationData } from '@/pages/api/getPrefData';
import { HighchartsReactRefObject } from 'highcharts-react-official';

/**
 * プロットの設定を表す型定義
 *
 * @property {number} plotType - 表示するグラフの種類を示す数値
 *   - 1: 都道府県別の総人口推移グラフ
 *   - 2: 都道府県別の年少人口推移グラフ
 *   - 3: 都道府県別の生産年齢人口推移グラフ
 *   - 4: 都道府県別の老年人口推移グラフ
 * @property {number[]} prefCode - プロット対象となる都道府県コードの配列
 * @property {string[]} prefName - プロット対象となる都道府県名の配列
 */
export type plotOptions = {
  plotType: number;
  prefCode: number[];
  prefName: string[];
};

export default function Plot({ plotoptions }: { plotoptions?: plotOptions }) {
  // 都道府県別の人口データを格納するState
  const [population, setPopulation] = useState<PopulationData[]>([]);

  // plotoptionsが変更されたら実行
  useEffect(() => {
    // plotoptionsが存在しない場合は処理を中断
    if (!plotoptions) return;

    // Populationのリセットと新しいデータの一括取得
    //? isActiveを用いて非同期処理のキャンセルを行う
    setPopulation([]);
    let isActive = true;
    Promise.all(plotoptions.prefCode.map((code) => getPopulation(code))).then(
      (datas) => {
        if (isActive) {
          setPopulation(datas);
        }
      },
    );
    return () => {
      isActive = false;
    };
  }, [plotoptions]);

  // プロットのタイトルを取得する関数
  //? デフォルトはUnknown
  const getPlotTitle = (plotType: number) => {
    switch (plotType) {
      case 1:
        return '都道府県別の総人口推移';
      case 2:
        return '都道府県別の年少人口推移';
      case 3:
        return '都道府県別の生産年齢人口推移';
      case 4:
        return '都道府県別の老年人口推移';
      default:
        return 'Unknown';
    }
  };

  // Highchartsの参照を取得するためのRef
  const chartComponentRef = useRef<HighchartsReactRefObject>(null);

  // plotoptionsが存在しない場合は処理を中断
  if (plotoptions == undefined) {
    return;
  }

  // x軸に用いるカテゴリを設定
  const categories = population.length
    ? population[0].data[0].data.map((item) => item.year.toString())
    : [];

  // y軸に用いるデータを設定
  const seriesData = population.map((pop, idx) => ({
    type: 'line' as const,
    name: plotoptions?.prefName[idx],
    data: pop.data[plotoptions.plotType - 1].data.map((item) => item.value),
  }));

  // Highchartsのオプションを設定
  const options: Highcharts.Options = {
    chart: {
      styledMode: true, // プロットエリアのダークモード対応用
    },
    title: {
      text: `${getPlotTitle(plotoptions.plotType || 1)}`,
    },

    xAxis: {
      title: {
        text: '年',
      },
      categories,
    },
    yAxis: {
      title: {
        text: '人口数',
      },
    },
    series: seriesData,
  };

  return (
    <div>
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        ref={chartComponentRef}
      />
    </div>
  );
}
