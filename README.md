# Recall

[English](#english) · [简体中文](#简体中文)

## English

Recall is a browser-based flashcard app for studying math, computer science, and statistics.

- Create decks and write cards with Markdown, LaTeX, and syntax-highlighted code.
- Flip cards and rate how well you remembered them. Recall uses an SM-2-inspired scheduler to update review intervals.
- Store cards and review progress in your browser with IndexedDB.
- Export and restore JSON backups in **Settings**. Recall can also import basic text fields from supported Anki `.apkg` files. Embedded media is not imported.

### Run locally

Install Node.js 22.12 or later. On macOS, open Terminal, type `cd ` with a trailing space, drag the project folder from Finder into Terminal, then press Return. Run these commands in order.

~~~bash
npm ci
npm run dev
~~~

Open the local address printed in Terminal. Press **Control+C** to stop the server. To build the production site, run `npm run build`. The build is written to `dist/`.

## 简体中文

Recall 是一款在浏览器中运行的闪卡应用，适合学习数学、计算机科学和统计学。

- 创建牌组，用 Markdown、LaTeX 和带语法高亮的代码编写卡片。
- 翻面后给自己的记忆程度打分。应用使用受 SM-2 启发的算法更新复习间隔。
- 卡片和复习进度通过 IndexedDB 保存在当前浏览器中。
- 在 **Settings（设置）** 中导出和恢复 JSON 备份。也可以从支持的 Anki `.apkg` 文件导入基础文本字段，图片和音频等嵌入媒体不会导入。

### 在本地运行

安装 Node.js 22.12 或更新版本。在 macOS 上，打开「终端」，输入 `cd ` 并保留末尾空格，将 Finder 中的项目文件夹拖到终端，再按回车。依次运行以下命令。

~~~bash
npm ci
npm run dev
~~~

打开终端显示的本地网址。按 **Control+C** 停止服务。要构建正式版，运行 `npm run build`，生成的文件会放在 `dist/` 中。
