'use client';
import { useEffect, useState } from 'react';
import { getPref } from '@/pages/api/getPrefData';
import Plot, { plotOptions } from '@/components/plot';
import { PrefData as prefData } from '@/pages/api/getPrefData';

export default function Home() {
  const [prefectures, setPrefectures] = useState<prefData[]>();

  // ページ読み込み時に実行
  //? 都道府県データを取得してstateに格納
  useEffect(() => {
    getPref().then((data) => {
      setPrefectures(data);
    });
  }, []);

  // prefecturesが変更されたら実行
  useEffect(() => {
    addCheckbox();
  }, [prefectures]);

  // チェックボックスの状態を管理するための配列
  const [checkboxes, setCheckboxes] = useState<
    { id: number; name: string; checked: boolean }[]
  >([]);

  // チェックボックスを追加する関数
  const addCheckbox = () => {
    if (!prefectures) return;
    const allCheckboxes = prefectures.map((pref) => ({
      id: pref.prefCode,
      name: pref.prefName,
      checked: false,
    }));
    setCheckboxes(allCheckboxes);
  };

  // チェックボックスの状態を変更する関数
  const handleCheckboxChange = (id: number) => {
    setCheckboxes((prevState) =>
      prevState.map((checkbox) =>
        // 該当のidの状態を反転
        checkbox.id === id
          ? { ...checkbox, checked: !checkbox.checked }
          : checkbox,
      ),
    );
  };

  // チェックされている項目を取得する関数
  const getCheckedItems = () => {
    return checkboxes.filter((item) => item.checked).map((item) => item.id);
  };

  // 人口区分を変更するためのstate
  // 1: 総人口, 2: 年少人口, 3: 生産年齢人口, 4: 老年人口
  //? 意図しない動作防止のため初期値を1に設定
  const [plotType, setPlotType] = useState<number>(1);

  // 都道府県コードから都道府県名を取得する関数
  const getPrefName = (code: number) => {
    return prefectures?.find((pref) => pref.prefCode === code)?.prefName;
  };

  // プロットの設定を表すstate
  const [plotOptions, setPlotOptions] = useState<plotOptions>({
    prefCode: [],
    prefName: [],
    plotType: 1,
  });

  // チェックボックスの状態かplotTypeが変更されたら実行
  useEffect(() => {
    const checkedItems = getCheckedItems();
    setPlotOptions({
      prefCode: checkedItems,
      prefName: checkedItems.map((code) => getPrefName(code) || ''),
      plotType: plotType,
    });
  }, [checkboxes, plotType]);

  return (
    <div className="justify-center px-2 py-2">
      <div className="flex justify-center">
        <h1 className="font-bold text-black dark:text-white text-2xl px-2 py-2">
          都道府県
        </h1>
      </div>
      <div
        className="flex gap-2 px-2 py-2 select-none 
      grid grid-cols-4 grid-flow-row sm:grid-cols-4  md:grid-cols-4 lg:grid-cols-10"
      >
        {checkboxes.map((checkbox) => (
          <label
            key={checkbox.id}
            className="text-black dark:text-white text-xs sm:text-sm md:text-base lg:text-lg 
            bg-slate-200 dark:bg-slate-950 rounded-lg px-2 py-2"
          >
            <input
              type="checkbox"
              className="accent-lime-500 hover:accent-lime-500"
              checked={checkbox.checked}
              onChange={() => handleCheckboxChange(checkbox.id)}
            />
            <span className="ml-2">{checkbox.name}</span>
          </label>
        ))}
      </div>
      <div
        className="flex justify-center py-4 gap-4 
      grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 select-none"
      >
        <button
          className="bg-customOlive text-white font-bold py-2 px-4 rounded-lg"
          onClick={() => setPlotType(1)}
        >
          総人口
        </button>
        <button
          className="bg-customOlive text-white font-bold py-2 px-4 rounded-lg"
          onClick={() => setPlotType(2)}
        >
          年少人口
        </button>
        <button
          className="bg-customOlive text-white font-bold py-2 px-4 rounded-lg"
          onClick={() => setPlotType(3)}
        >
          生産年齢人口
        </button>
        <button
          className="bg-customOlive text-white font-bold py-2 px-4 rounded-lg"
          onClick={() => setPlotType(4)}
        >
          老年人口
        </button>
      </div>
      <Plot plotoptions={plotOptions} />
    </div>
  );
}
