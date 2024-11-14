<template>
  <scroll-view scroll-y style="height: 100vh;" @scrolltolower="loadMore" :scroll-with-animation="true">
    <view class="content" :scroll-top="scrollTop">
      <view style="width: 85%;">
        <uni-search-bar :focus="true" radius="5" placeholder="请输入要查询的内容" v-model="searchValue" clearButton="auto"
          cancelButton="none" @confirm="search" @clear="clear">
        </uni-search-bar>
      </view>
      <view class="list">
        <uni-list :class="{ 'uni-list--waterfall': waterfall }">
          <uni-list-item :border="!waterfall" class="uni-list-item--waterfall" title="自定义商品列表" v-for="item in lists"
            :key="item.id">
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
                    <text>{{ item.datetimeGen }}</text>
                  </view>
                  <view class="uni-note">
                    <button class="cart-button" @click="addToCart(item)">
                      <uni-icons type="cart" color="#fff" size="16"></uni-icons>
                      加入购物车
                    </button>
                  </view>
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
// import request from '@/utils/request'
import request from '@/utils/v-request'
import { useQueryStore } from '@/store/queryStore'
import { useCartStore } from '@/store/cartStore';

export default {
  data() {
    return {
      title: 'hello, wx',
      waterfall: false,
      loadStatus: 'loading', // 加载状态
      scrollTop: 0,
      currentIndex: 0,
      crtPage: 0,
      searchValue: '',
      lists: []
    }
  },
  onLoad() {
    // this.initPage();
  },
  mounted() {
    setTimeout(() => {
      this.loadQueryData();
    }, 300);
  },
  onPullDownRefresh(){
    this.fetchItems();
  },
  methods: {
    loadQueryData() {
      const queryStore = useQueryStore();
      this.searchValue = queryStore.getQueryParam('search');
      this.fetchItems();
    },
    fetchItems() {
      const fetchType = !this.searchValue || this.searchValue.trim() === '' ? 'getall' : 'search';
      const urlStr = `/api/items/${fetchType}/${this.crtPage}`;

      request({ url: urlStr, method: 'GET', data: { 'searchValue': this.searchValue } })
        .then(res => {
          if (this.crtPage == 0) {
            this.lists.length = 0;
          }
          res.data.content.forEach(item => {
            item.tags = item.itemTip.split(',');
            item.itemTip = item.tags.shift();
          });
          this.lists.push(...res.data.content);

          if (res.data.totalPages <= this.crtPage) {
            this.loadStatus = 'noMore';  // 没有更多数据
          } else {
            this.loadStatus = 'more';  // 还可以加载更多
            this.crtPage++;
          }
          
          uni.stopPullDownRefresh();
        }).catch(err => {
          console.error(err);
        });
    },
    loadMore() {
      if (this.loadStatus === 'loading' || this.loadStatus === 'noMore') return;
      this.loadStatus = 'loading';  // 设置为加载中状态
      this.fetchItems();
    },
    search(res) {
      const queryStr = res.value;
      if (!queryStr || queryStr.trim() === '') {
        uni.showToast({ title: '请输入要查询的内容', icon: 'none' })
        return;
      }
      uni.showToast({ title: '搜索：' + queryStr, icon: 'none' })
      this.crtPage = 0;
      this.fetchItems();
    },
    clear(res) {
      uni.showToast({
        title: 'clear事件，清除值为：' + res.value,
        icon: 'none'
      })
      this.crtPage = 0;
      this.fetchItems();
    },
  },

  setup() {
    const cartStore = useCartStore();

    // 方法：更新商品数量
    const addToCart = (item) => {
      item.quantity = 1;
      cartStore.addToCart(item);

      // 设置购物车图标上的角标数字
      uni.setTabBarBadge({
        index: 3,  // tabBar 中购物车图标的索引
        text: String(cartStore.totalQuantity)  // 角标文本，必须是字符串
      });
      uni.showToast({
        title: `添加成功，${item.id}`,
        icon: 'success'
      });
    };

    return {
      cartStore,
      addToCart,
    };
  }
}
</script>

<style lang="scss">
@import './list.scss';

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-bottom: 55px;
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
	@extend .uni-flex-row;
	justify-content: space-between;
  align-items: center;
  margin-top: 5px;
  font-size: $uni-font-size-sm;
  color: $uni-text-color-grey;
}

.shop-price-text {
  font-size: $uni-font-size-lg;
  color: #ff5a5f;
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
