<template>
	<view class="uni-tabs">
		<!-- tabs bar -->
		<scroll-view scroll-x class="uni-tabs-bar">
			<view v-for="(tab, index) in tabs" :key="index" :class="['uni-tab-item', current === index ? 'active' : '']"
				@click="changeTab(index)">
				<view class="uni-tab-title">{{ tab.title }}</view>
			</view>
			<view class="underline" :style="underlineStyle"></view>
		</scroll-view>
	</view>
</template>

<script>
export default {
	name: "UniTabs",
	props: {
		tabs: {
			type: Array,
			default: () => []
		},
		current: {
			type: Number,
			default: 0
		}
	},
	computed: {
		underlineStyle() {
			return {
				transform: `translateX(${this.current * 100}%)`
			};
		}
	},
	methods: {
		changeTab(index) {
			this.$emit("change", index);
		},
	}
};
</script>

<style scoped>
.uni-tabs {
	width: 100%;
	background-color: #f8f8f8;
}

.uni-tabs-bar {
	position: relative;
	display: flex;
	white-space: nowrap;
	background-color: white;
	/* border-bottom: 1px solid #eee; */
}

.uni-tab-item {
	display: inline-flex;
	justify-content: center;
	align-items: center;
	padding: 12px 0;
	width: 25%;
	font-size: 14px;
	color: #666;
	cursor: pointer;
	position: relative;
}

.uni-tab-item.active {
	color: #007aff;
	font-weight: bold;
}

.uni-tab-title {
	transition: color 0.3s ease;
}

/* Underline for the active tab */
.underline {
	position: absolute;
	top: 41px;
	height: 2px;
	background-color: #007aff;
	transition: transform 0.3s ease;
	width: 25%;
	/* 假设有 4 个 tab */
}
</style>