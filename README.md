# ff14-ulk-weather

FF14 優雷卡豐水之地（Hydatos）天氣工具頁。

目前提供兩個靜態頁面：

- `index.html`
  顯示天氣列表，依序列出每個天氣視窗的本地時間、ET 時間與天氣名稱。
- `score.html`
  顯示評分區段列表，依 Hydatos 的 `Snow` 規則計分，並可跳到對應的天氣列表詳情。

## 檔案

- `index.html`：天氣列表頁
- `score.html`：評分頁
- `spec.md`：目前規格與交接筆記

## index.html

用途：

- 顯示 Hydatos 天氣視窗列表
- 支援從評分頁跳到指定起點

參數：

- `count` 或 `n`
  指定要顯示幾筆，預設 `20`
- `start`
  指定列表起點的 unix 秒

目前顯示：

- 左欄：GMT+8 本地時間
- 中欄：ET 時間，格式為 `ET 0800`
- 右欄：天氣名稱

備註：

- `Snow` 列有較明顯的高亮背景

## score.html

用途：

- 顯示評分區段
- 依 `Snow` 規則計算加總分數
- 可跳到對應的天氣列表詳情

區段規則：

- 每個區段從一個天氣視窗起點開始
- 起點依序為 `ET 0000 / ET 0800 / ET 1600`
- 每個區段長度為 `ET 3 天`
- 每段共有 `9` 個 ET 天氣區段
- 區段彼此可重疊

計分規則：

- `ET 0000` 或 `ET 1600` 的 `Snow`：`100` 分
- `ET 0800` 的 `Snow`：`10` 分
- 其他：`0` 分

參數：

- `days`
  向前推算涵蓋天數，預設 `30`，上限 `180`
- `low`
  最低顯示分數門檻，預設 `100`

目前表格欄位：

- 現實時間區段（GMT+8）
- 加總分數
- 雪（100分/10分 次數）
- 詳情

## 技術

- 純靜態 HTML
- 前端直接引用 [`eorzea-weather`](https://github.com/eorzea-weather/node-eorzea-weather)
- 時區使用 `Asia/Taipei`

## GitHub

倉庫：

- [kimklai/ff14-ulk-weather](https://github.com/kimklai/ff14-ulk-weather)
