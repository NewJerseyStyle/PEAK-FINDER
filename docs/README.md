# Peak Finder 尋峰者

一個將優化算法視覺化的教育遊戲，玩家通過跳躍探索地形來找到目標高度區間。

## 特點

- 🏔️ **200 個關卡**，從 1D 到 3D 空間
- 🤖 **6 種優化器**：SGD、Momentum、RMSprop、Adam
- 📊 **4 種調度器**：固定步長、步長衰減、Cosine Annealing、Warmup
- 🌍 **多語言支援**：中文/英文
- 💾 **進度保存**：使用 localStorage
- 🤖 **TensorFlow.js**：展示真實優化器路徑
- 📚 **教學系統**：每個關卡變化都有詳細說明

## 如何運行

### 方法 1：直接打開 HTML 檔案

直接用瀏覽器打開 `index.html` 即可開始遊戲。

### 方法 2：使用本地伺服器（推薦）

```bash
# Python 3
python -m http.server 8000

# Node.js
npx http-server

# PHP
php -S localhost:8000
```

然後訪問 `http://localhost:8000`

## 遊戲玩法

1. **控制角色**：使用方向鍵或畫面上的按鈕
2. **調整步長**：使用滑桿控制跳躍距離（5-100%）
3. **目標**：找到目標高度區間（例如 75.5）
4. **限制**：在最大步數內完成，步數越少得分越高

## 遊戲機制

### 三個核心變數

1. **維度 (Dimension)**：
   - 1D：在一條直線上跳躍
   - 2D：上下左右四個方向
   - 3D：三個維度同時管理

2. **優化器 (Optimizer)**：
   - SGD：基礎版本，穩定但較慢
   - Momentum：加入加速度，更快但可能衝過頭
   - RMSprop：適應性步長，適合窄谷
   - Adam：綜合 Momentum 和 RMSprop

3. **調度器 (Scheduler)**：
   - Fixed：固定步長
   - Step Decay：逐步減小步長
   - Cosine Annealing：Cosine 曲線衰減
   - Warmup：漸進式增加步長

## 教學系統

每當關卡變數改變時，會顯示：
- 新變數的詳細說明
- 遊戲中的應用方式
- 比較練習關卡建議

## 技術實現

- **前端**：HTML5 Canvas
- **後端**：JavaScript
- **AI 庫**：TensorFlow.js (CDN)
- **資料保存**：localStorage
- **響應式設計**：支援手機和桌面

## 關卡結構

- **1D 空間**：關卡 1-45（基本優化器練習）
- **2D 空間**：關卡 46-100（導航和組合技巧）
- **3D 空間**：關卡 101-110（高維挑戰）

## 授權

MIT License

