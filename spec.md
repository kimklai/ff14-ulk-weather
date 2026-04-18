# FF Launcher 專案交接筆記

## 目前檔案
- [index.html](E:/FF%20Launcher/index.html)
- [score.html](E:/FF%20Launcher/score.html)

## 功能概覽
### `index.html`
用途：
- 顯示 Hydatos 天氣列表
- 可從 `score.html` 的每一列「詳情」連過來，定位到對應起點時間
- 以頁面上的下拉選單切換列表參數

目前行為：
- 左欄：GMT+8 本地時間
- 中欄：ET 時間，格式為 `ET 0800`
- 右欄：天氣名稱，例如 `雪（Snow）`
- `Snow` 那一列有淡藍高亮背景，但不加粗
- 頁面上有 `列表起點` 與 `顯示筆數` 兩個下拉選單
- 下拉選單變更後會同步更新網址 query string 並重新載入頁面
- `列表起點` 會顯示目前選取區段前後的鄰近天氣視窗，不是自由輸入

支援參數：
- `?count=50` 或 `?n=50`
- `?start=unix秒`

目前預設：
- `count` 預設 20

重要實作：
- 若 URL 有 `start`，就用該 unix 秒當列表起點
- 若沒有 `start`，就從「目前所在的天氣視窗起點」開始
- `Snow` 列會加上 `snow` class 做高亮

### `score.html`
用途：
- 顯示 Hydatos 的評分區段表
- 每列可跳到對應起點的天氣列表詳情
- 以頁面上的下拉選單切換查詢參數

目前評分區段規則：
- 每個區段從一個天氣視窗起點開始
- 起點依序是 `ET 0000 / ET 0800 / ET 1600`
- 每個評分區段長度為 `ET 3 天`
- 每段總共涵蓋 `9 個 ET 天氣區段`
- 區段彼此可重疊
- 預設只顯示 `ET 1600` 起點的區段
- 帶 `?all` 時才顯示所有 ET 起點

計分規則：
- 僅 `Snow` 計分
- 視窗起點之 `ET 0000` 或 `ET 1600`：`100` 分
- 視窗起點之 `ET 0800`：`10` 分
- 其餘：`0` 分

顯示規則：
- 預設只顯示 `>= 100` 分的區段
- 可用 `low` 參數調整門檻
- 可用 `all` 顯示所有 ET 起點區段
- `200` 分以上分數字色會明顯提亮
- 背景固定純深色，不用漸層
- 頁面上有 `涵蓋天數`、`最低顯示分數`、`起點篩選` 三個下拉選單
- 下拉選單變更後會同步更新網址 query string 並重新載入頁面
- `最低顯示分數` 下拉選單目前提供 `0 / 10 / 100 / 200 / 300 / 400 / 500`

支援參數：
- `?days=30`
- `?low=100`
- `?all`

目前預設：
- `days` 預設 30
- `days` 上限 180
- `low` 預設 100
- `low=0` 可顯示全部
- 未指定 `all` 時只顯示 `ET 1600` 起點區段

時間格式：
- 預設模式同一天：`2026/03/30 11:56 -> 14:56`
- `?all` 模式同一天：`2026/03/30 11:56 -> 14:56（起點 ET 16:00）`
- 跨天時後半段會保留完整日期時間

表格欄位：
- `現實時間區段（GMT+8）`
- `加總分數`
- `雪（100分/10分 次數）`
- `詳情`

詳情連結行為：
- 連到 `index.html`
- 會帶 `start=<該列起點unix秒>`
- 會帶 `count=10`

## 檔名與導覽
- 原本的 `rates.html` 已改名為 `score.html`
- `index.html` 已改成連到 `score.html`

## 目前視覺狀態
### `index.html`
- 深色主題
- `Snow` 列有淡藍高亮背景
- 不加粗

### `score.html`
- 深色主題
- 高分數字有亮度提升
- `hot` 標記已移除
- 背景為純深色，不是漸層

## 若下一個 agent 要改，優先注意
- `score.html` 的區段長度現在不是現實 3 小時，而是 `9 個 weather periods`
- `score.html` 的詳情連結目前固定 `count=10`，不是 9
- `index.html` 的 ET 顯示格式目前是 `ET 0800`，沒有 `:`
- `score.html` 的計數欄只顯示 `100分/10分`，已移除 `0分` 計數
- `score.html` 預設會先過濾成只剩 `ET 1600` 起點；`?all` 才會看到 `ET 0000 / 0800`
- 目前網站主要參數都已改成頁面內下拉選單操作，但仍保留 query string 相容性

## 常見需求對應位置
- 改天氣列表顯示格式：`index.html` 的 `formatEorzeaTime()` / `formatLine()`
- 改列表起點邏輯：`index.html` 的 `getStartFromQuery()`
- 改 Snow 高亮樣式：`index.html` 的 `li.snow`
- 改評分區段長度：`score.html` 的 `SEGMENT_PERIODS`
- 改評分門檻：`score.html` 的 `getLowThreshold()`
- 改詳情連結筆數：`score.html` 的 `weatherListHref()`
- 改時間區段文字格式：`score.html` 的 `segmentLabel()`
