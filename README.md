# ぬこぬこじゅうななほ

*Waltz on The Edge / The Transparent 17 Steps*

十七歩 × 鷲巣麻雀を、猫たちと打つ一人用のブラウザゲームです。血のかわりに、カリカリ（猫用ごはん）を賭けます。

- 遊ぶ: https://nukonuko17.endowz1975.workers.dev （3D版）／ `/2d.html`（軽い2D版）
- 24匹の猫（二つ名つき）が相手です。難易度は対局を押したときに選びます。
- ロン・見送り、倍プッシュ（青天井）、前回の続きから再開、に対応しています。
- インストール不要。スマホ・PCのブラウザで動き、ホーム画面に追加すればオフラインでも遊べます。

## 作り方（開発者向け）

- ロジック本体は `index.html`（2D版）。3D版は `node build3d.js` で `index.html` + `src3d.js` + `lib/three.min.js` から `index3d.html` を生成します（`index3d.html` は手で編集しない）。
- ルールのテスト: `node test.js`　強さの測定: `node tools/arena.js 80 smart`
- 公開用フォルダの作成: `node build3d.js && node tools/pack.js` → `app/`（3D版が `index.html`、2D版が `2d.html`）
- 公開（Cloudflare）: `npx wrangler deploy`（`app/` を配信。`sw.js` のバージョンは中身から自動で決まります）

## ライセンス・クレジット

- コード: MIT License（`LICENSE`）
- 画像（`cat/`・`tiles/`・アイコン）: All rights reserved。遊ぶのは自由ですが、転用・再配布はご遠慮ください。猫のイラストは ChatGPT（OpenAI）で作成しました。
- コードは Claude（Anthropic）の助けを借りて書きました。
- Three.js r149（MIT）、Yusei Magic（SIL OFL 1.1、倍プッシュの文字）を同梱しています。
- 福本伸行先生の作品に着想を得た、個人による非公式のパロディ・ファン作品です。作者・出版社・権利者とは関係ありません。
