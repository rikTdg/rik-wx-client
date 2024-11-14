<template>
  <scroll-view enable-back-to-top scroll-y style="height: 100vh;" @scrolltolower="loadMore"
    :scroll-with-animation="true" :scroll-top="scrollTop">
    <view class="content">
      <view class="logo">
        <swiper :autoplay="true" indicator-dots="true" :interval="3000" duration="500" :circular="true"
          @change="onSwiperChange" :current="currentIndex" style="height: 420rpx;">
          <swiper-item v-for="(img, index) in imageList" class="swiper-img" :key="index">
            <image :src="`../../static/logos/` + img" class="swiper-img"></image>
          </swiper-item>
        </swiper>
      </view>
      <view class="text-box" scroll-y="true">
        <view>
          <uni-tag text="前端" type="primary" /><text>uni-app、uni-ui、Pinia、Vite</text>
        </view>
        <view>
          <uni-tag text="后端" type="primary" /><text>Spring Boot、Spring JPA、Scrapy</text>
        </view>
        <view>
          <uni-tag text="数据库" type="primary" /><text>MySQL</text>
        </view>
        <view>
          <uni-tag text="环境" type="primary" /><text>AWS、Linux、Docker</text>
        </view>
      </view>
      <view style="width: 85%;">
        <uni-search-bar radius="5" placeholder="请输入要查询的内容" clearButton="auto" cancelButton="none" @confirm="search"
          @clear="clear">
        </uni-search-bar>
      </view>
      <!-- <view>
      <uni-tag text="标签"></uni-tag>
      <uni-tag text="标签" type="error" :circle="true"></uni-tag>
      <uni-tag text="标签" @click="bindClick"></uni-tag>
    </view> -->
      <view class="list">
        <uni-tabs :tabs="tabs" :current="currentTab" @change="handleTabChange">
          <template v-slot:home>
            <view>首页内容</view>
          </template>
          <template v-slot:category>
            <view>分类内容</view>
          </template>
          <template v-slot:cart>
            <view>购物车内容</view>
          </template>
          <template v-slot:profile>
            <view>个人中心内容</view>
          </template>
        </uni-tabs>

        <uni-list :class="{ 'uni-list--waterfall': waterfall }">
          <uni-list-item :border="!waterfall" class="uni-list-item--waterfall" title="自定义商品列表"
            v-for="item in currentList" :key="item._id">
            <template v-slot:header>
              <view class="uni-thumb shop-picture" :class="{ 'shop-picture-column': waterfall }">
                <image :src="item.imgUrl" mode="aspectFill"></image>
              </view>
            </template>
            <template v-slot:body>

              <view slot="body" class="shop">
                <view>
                  <view class="uni-title">
                    <text class="uni-ellipsis-2">{{ item.title }}</text>
                  </view>
                  <view>
                    <text class="uni-tag hot-tag">{{ item.itemTip }}</text>
                    <text v-for="tag in item.tags" :key="tag" class="uni-tag">{{ tag }}</text>
                  </view>
                </view>
                <view>
                  <view class="shop-price">
                    <text class="shop-price-text">{{ item.price }}</text>
                  </view>
                  <view class="uni-note">{{ item.datetimeGen }}</view>
                  <!-- <view class="uni-note">{{ item.comment_count }}条评论 月销量 {{ item.month_sell_count }}</view>
              <view class="uni-note ellipsis">
                <text class="uni-ellipsis-1">{{ item.shop_name }}</text>
                <text class="uni-link">进店 ></text>
              </view> -->
                </view>
              </view>

            </template>
          </uni-list-item>
        </uni-list>
        <uni-load-more :status="loadStatus" />
      </view>
    </view>
  </scroll-view>
</template>

<script>
import request from '@/utils/v-request'
import { mapActions } from 'pinia';
import { useQueryStore } from '@/store/queryStore'
import UniTabs from '../../components/uni-tabs/uni-tabs.vue';

export default {
  components: {
    UniTabs
  },
  data() {
    return {
      title: 'hello, wx',
      logoImgStyle: 'height: 100%;',
      waterfall: false,
      loadStatus: 'loading', // 加载状态
      scrollTop: 0,
      currentIndex: 0,
      crtPage: 0,
      currentTab: 0,
      domainParams: [
        { keywords: "amazon", crtPage: 0 },
        { keywords: "dangdang", crtPage: 0 }
      ],
      tabs: [
        { title: "商城AMZ" },
        { title: "书城DD" }
      ],
      imageList: ['uniapp.png', 'vite.svg', 'springboot.png', 'docker.png', 'scrapy.png', 'mysql.png', 'aws.png', 'linux.png'],
      lists: [],
      currentList: []
    }
  },
  onLoad() {
  },
  mounted() {
    // this.fetchItems();
  },
  onPullDownRefresh() {
    this.pullDownRefresh();
  },
  methods: {
    ...mapActions(useQueryStore, ['setQueryParam', 'removeQueryParam', 'clearQueryParams']),

    handleTabChange(index) {
      this.currentTab = index;
      // console.log(this.currentTab, this.domainParams);

      this.currentList = this.lists[this.currentTab];
      if (!this.currentList) {
        this.currentList = [];
        this.loadStatus = 'loading';  // 设置为加载中状态
        this.fetchItems();
      }
    },
    fetchItems() {
      const crtDomainParam = this.domainParams[this.currentTab];

      const urlStr = `/api/items/getdomain/${crtDomainParam.keywords}/${crtDomainParam.crtPage}`;
      request({ url: urlStr, method: 'GET', data: {} })
        .then(res => {
          res.data.content.forEach(item => {
            item.tags = item.itemTip.split(',');
            item.itemTip = item.tags.shift();
          });
          this.currentList.push(...res.data.content);
          this.lists[this.currentTab] = this.currentList;

          if (res.data.totalPages <= crtDomainParam.crtPage) {
            this.loadStatus = 'noMore';  // 没有更多数据
          } else {
            this.loadStatus = 'more';  // 还可以加载更多
            crtDomainParam.crtPage++;
          }
          uni.stopPullDownRefresh();
        }).catch(err => {
          console.error(err);

          uni.showToast({
            title: '糟糕~网络问题，下拉刷新。。。',
            icon: 'none',
            duration: 3000
          })
        });
    },
    loadMore() {
      if (this.loadStatus === 'loading' || this.loadStatus === 'noMore') return;
      this.loadStatus = 'loading';  // 设置为加载中状态
      this.fetchItems();
    },
    pullDownRefresh() {
      // console.log('onPullDownRefresh...')
      this.fetchItems();
    },
    onSwiperChange(event) {
      this.currentIndex = event.detail.current;

    },
    search(res) {
      const queryStr = res.value;
      if (!queryStr || queryStr.trim() === '') {
        uni.showToast({ title: '请输入要查询的内容', icon: 'none' })
        return;
      }
      this.setQueryParam('search', res.value);

      uni.switchTab({ url: '/pages/list/list' });
    },
    clear(res) {
      this.removeQueryParam('search');
      uni.showToast({
        title: 'clear事件，清除值为：' + useQueryStore().getQueryParam('search'),
        icon: 'none'
      })
    },
  },
}
</script>

<style lang="scss">
@import './index.scss';

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-bottom: 55px;
}

.text-box {
  margin: 10rpx 0;
  // padding: 20rpx 0;
  display: flex;
  min-height: 200rpx;
  font-size: 26rpx;
  color: #353535;
  line-height: 2;
  flex-direction: column;
}

.text-box text {
  font-weight: bold;
}

.logo {
  width: 92%;
  margin: 10rpx 0;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}

.swiper-img {
  height: 100%;
  width: 100%;
  border-radius: 10px;
  /* 确保圆角效果生效 */
  object-fit: cover;
}

page {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  background-color: #efeff4;
  min-height: 100%;
  height: auto;
}

.tips {
  color: #67c23a;
  font-size: 14px;
  line-height: 40px;
  text-align: center;
  background-color: #f0f9eb;
  height: 0;
  opacity: 0;
  transform: translateY(-100%);
  transition: all 0.3s;
}

.tips-ani {
  transform: translateY(0);
  height: 40px;
  opacity: 1;
}

.shop {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.shop-picture {
  width: 110px;
  height: 110px;
}

.shop-picture-column {
  width: 100%;
  height: 170px;
  margin-bottom: 10px;
}

.shop-price {
  margin-top: 5px;
  font-size: 12px;
  color: #ff5a5f;
}

.shop-price-text {
  font-size: 16px;
}

.hot-tag {
  background: #ff5a5f;
  border: none;
  color: #fff;
}

.button-box {
  height: 30px;
  line-height: 30px;
  font-size: 12px;
  background: #007AFF;
  color: #fff;
}

.uni-link {
  flex-shrink: 0;
}

.ellipsis {
  display: flex;
  overflow: hidden;
}

.uni-ellipsis-1 {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.uni-ellipsis-2 {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
