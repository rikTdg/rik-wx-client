import { createSSRApp } from "vue";
import { createPinia } from "pinia";  // 引入 Pinia
import App from "./App.vue";

// 初始化云环境
uniCloud.init({
	provider: 'tencent',
	spaceId: 'rik-wxcloud-9gayiv7gafa43840', // 这里填入你在微信公众平台获取的环境ID
});
if (typeof wx !== 'undefined' && wx.cloud) {
	wx.cloud.init({
	  env: 'rik-wxcloud-9gayiv7gafa43840',
	  traceUser: true
	});
  }

export function createApp() {
	const app = createSSRApp(App);
	const pinia = createPinia();  // 创建 Pinia 实例

	app.use(pinia);  // 将 Pinia 注入到 Vue 应用中

	return {
		app,
	};
}
