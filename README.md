# UniApp + Vite 微信小程序

基于 **UniApp** 和 **Vite** 开发的微信小程序，主要用于展示和搜索数据、实现购物车功能，并提供 AI 聊天支持（后续版本）。该项目旨在个人学习与交流中使用。

---

## 🌟 功能特性

1. **数据列表展示与搜索**：
   - 支持动态数据加载和筛选。
   - 提供快速搜索功能。

2. **自动数据加载**：
   - 自动抓取公开真实数据并进行展示。
   - 可在小程序中控制并查看抓取结果。
   - 包含 **云函数调用**，需开通云服务。

3. **购物车效果**：
   - 商品选择与数量调整。
   - 滑动删除与收藏功能。
   - 模拟结算流程。

4. **AI 聊天（后续版本）**：
   - 与 AI 聊天功能集成，提供智能互动。

---

## 🛠️ 技术栈

- **开发框架**：UniApp
- **构建工具**：Vite
- **小程序平台**：微信小程序
- **数据来源**：公开数据接口

---

## 📦 安装与运行

1. **克隆仓库到本地**：
   ```bash
   git clone <仓库地址>
   cd <项目目录>
   
2. **安装依赖**：
   ```bash
   pnpm install
   # 或
   npm install

3. **启动项目**：
   ```bash
   pnpm dev
   # 或
   npm run dev

4. **配置云服务**：
   - 开通微信小程序云开发服务。
   - 部署所需的云函数。

5. 使用微信开发者工具导入生成的 dist 文件夹，查看效果。

## 📚 使用指南

1. 数据展示页面：
   - 浏览所有加载的数据。
   - 通过搜索框进行关键词查询。

2. 数据抓取功能：
   - 云函数调用抓取数据。
   - 在小程序中实时查看抓取结果。

3. 购物车页面：
   - 添加商品到购物车。
   - 选择数量并完成模拟结算。

## 🤝 贡献

欢迎对本项目提出建议或贡献代码！请通过以下步骤参与：

1. Fork 本项目。
2. 提交 Pull Request。
3. 请确保代码符合项目规范，并附带详细说明。

## 🛡️ 许可证

该项目仅供学习与交流使用，禁止用于商业目的。
