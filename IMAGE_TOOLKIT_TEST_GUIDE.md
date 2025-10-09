# 图片工具包 Demo 测试指南

## 🚀 启动应用

1. **安装依赖**（如果还没有安装）：
```bash
pnpm install
```

2. **启动开发服务器**：
```bash
pnpm dev
```

3. **访问应用**：
打开浏览器访问：`http://localhost:5173`

## 🔐 登录流程

1. 应用会自动跳转到登录页面
2. 使用 Okta 账户登录
3. 登录成功后会跳转到主应用界面

## 📸 图片工具包测试入口

### 方式一：通过侧边栏导航
1. 登录后，在左侧侧边栏找到 **"Image Toolkit"** 菜单项（摄像头图标）
2. 点击进入图片工具包页面

### 方式二：直接访问 URL
在浏览器地址栏输入：`http://localhost:5173/image-toolkit`

## 🧪 完整功能测试流程

### 1. Gallery（图片画廊）标签页
- **初始状态**：显示"No images yet"提示
- **功能测试**：
  - 查看已保存的图片列表
  - 批量选择图片
  - 删除选中的图片
  - 清空所有图片

### 2. Screenshot（截图工具）标签页
- **全屏截图测试**：
  1. 点击 "Capture Full Screen" 按钮
  2. 选择图片格式（PNG/JPEG/WebP）
  3. 调整质量设置（仅对 JPEG/WebP 有效）
  4. 点击截图按钮
  5. 查看预览图片
  6. 可以下载或复制到剪贴板

- **元素截图测试**：
  1. 在"Element Selector"输入框中输入 CSS 选择器，如：
     - `body` - 截取整个页面
     - `.sidebar` - 截取侧边栏
     - `#header` - 截取头部
  2. 点击"Capture Element"按钮
  3. 查看预览和操作

### 3. Upload（图片上传）标签页
- **拖拽上传测试**：
  1. 将图片文件拖拽到上传区域
  2. 或点击"Select Files"按钮选择文件
  3. 支持多文件上传
  4. 上传完成后图片会自动保存到本地存储

- **支持的格式**：JPG, PNG, GIF, WebP 等

### 4. Clipboard（剪贴板）标签页
- **粘贴图片测试**：
  1. 在其他应用中复制一张图片（如截图、浏览器中的图片）
  2. 回到此页面，点击"Paste from Clipboard"按钮
  3. 如果剪贴板中有图片，会显示预览
  4. 点击"Save Image"保存到本地

- **文本编辑器集成测试**：
  1. 在文本编辑器中输入一些文字
  2. 粘贴图片到编辑器中
  3. 图片会以 `[IMAGE:图片ID]` 的形式插入到文本中
  4. 点击"Save Content"保存内容

## 🔄 完整闭环测试流程

### 完整的业务闭环：
1. **起点**：`/src/index.tsx` - 应用启动入口
2. **路由系统**：`/src/components/AppRoutes/index.tsx` - 路由配置
3. **布局框架**：`/src/components/AppLayout/index.tsx` - 应用布局
4. **侧边栏导航**：`/src/components/AppAsider/index.tsx` - 导航菜单
5. **功能入口**：`/src/modules/image-toolkit-demo/index.tsx` - Demo 页面
6. **核心组件**：`/src/modules/image-toolkit/index.tsx` - 主要功能组件

### 数据流转：
```
用户操作 → 组件事件 → Hook 处理 → Utils 执行 → 本地存储 → 状态更新 → UI 刷新
```

### 存储机制：
- **本地存储**：使用 `localStorage` 持久化图片数据
- **数据结构**：每张图片包含 ID、名称、URL、大小、类型、来源、创建时间等信息
- **存储键值**：`image-toolkit-images`

## 🛠️ 技术架构说明

### 核心技术栈：
- **React 18** + **TypeScript**
- **Vite** 构建工具
- **Tailwind CSS** + **shadcn/ui** 组件库
- **html2canvas** 截图功能
- **Web Clipboard API** 剪贴板操作

### 文件结构：
```
/src/modules/image-toolkit/
├── types/index.ts              # 类型定义
├── utils/                      # 工具函数
│   ├── screenshot.ts          # 截图功能
│   ├── clipboard.ts           # 剪贴板操作
│   ├── image-processing.ts    # 图片处理
│   └── storage.ts            # 本地存储
├── hooks/                     # React Hooks
│   ├── use-screenshot.ts      # 截图 Hook
│   ├── use-clipboard.ts       # 剪贴板 Hook
│   ├── use-image-viewer.ts    # 图片查看器 Hook
│   └── use-image-storage.ts   # 存储管理 Hook
├── components/                # UI 组件
│   ├── screenshot-tool.tsx    # 截图工具
│   ├── clipboard-handler.tsx  # 剪贴板处理
│   ├── image-gallery.tsx      # 图片画廊
│   ├── image-upload.tsx       # 图片上传
│   ├── image-editor.tsx       # 图片编辑器
│   └── image-viewer.tsx       # 图片查看器
└── index.tsx                  # 主入口组件
```

## 🐛 常见问题

### 1. 截图功能不工作
- **原因**：浏览器安全策略限制
- **解决**：确保在 HTTPS 环境下测试，或在本地开发环境中使用

### 2. 剪贴板功能失效
- **原因**：浏览器不支持 Clipboard API 或权限不足
- **解决**：使用现代浏览器（Chrome 76+, Firefox 63+）并确保页面有焦点

### 3. 图片无法保存
- **原因**：localStorage 存储限制或浏览器隐私模式
- **解决**：检查浏览器设置，确保允许本地存储

### 4. 上传的图片过大
- **原因**：图片文件超过默认大小限制（10MB）
- **解决**：压缩图片或调整代码中的 `maxSize` 配置

## 📱 浏览器兼容性

### 推荐浏览器：
- **Chrome 76+**（完全支持）
- **Firefox 63+**（完全支持）
- **Safari 13.1+**（基本支持，部分功能可能受限）
- **Edge 79+**（完全支持）

### 功能支持：
- ✅ 图片上传：所有现代浏览器
- ✅ 图片查看：所有现代浏览器
- ✅ 本地存储：所有现代浏览器
- ⚠️ 截图功能：需要支持 html2canvas
- ⚠️ 剪贴板：需要支持 Clipboard API

## 🎯 测试重点

1. **功能完整性**：确保所有四个标签页功能正常
2. **数据持久性**：刷新页面后图片数据应该保留
3. **交互体验**：拖拽、点击、快捷键等操作流畅
4. **错误处理**：测试各种异常情况的处理
5. **性能表现**：大量图片时的加载和渲染性能

这个 Demo 展示了一个完整的前端图片处理工具包，涵盖了现代 Web 应用中常见的图片操作需求。
