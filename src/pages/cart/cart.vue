<template>
  <view class="cart-page">
    <!-- 购物车标题 -->
    <view class="header">
      <uni-icons type="cart" size="30"></uni-icons>
      <text class="title">购物车</text>
    </view>

    <!-- 按商户分组展示商品 -->
    <view v-for="(merchant, index) in groupedCartItems" :key="index" class="merchant-section">
      <!-- 商户名称 -->
      <view class="merchant-header">
        <text class="merchant-name">{{ merchant.name }}</text>
      </view>

      <!-- 商品列表 -->
      <uni-swipe-action>
        <uni-swipe-action-item v-for="(item, i) in merchant.items" :key="item.id" :right-options="swipeOptions"
          @click="deleteItem(merchant.name, i)">
          <view class="cart-item">
            <!-- 商品图片插槽 -->
            <view class="cart-item-header">
              <image class="item-image" :src="item.imgUrl" mode="aspectFill"></image>
            </view>

            <view class="cart-item-body">
              <!-- 商品名称和价格 -->
              <!-- <view class="item-info">
                <text class="item-name">{{ item.name }}</text>
                <text class="item-price">￥{{ item.price }}</text>
              </view> -->
              <view>
                <view class="uni-title">
                  <text class="uni-ellipsis-2">{{ item.title }}</text>
                </view>
                <view>
                  <text class="uni-tag">{{ item.itemTip }}</text>
                </view>
              </view>
              <view class="shop-price">
                <view class="shop-price-text">
                  ￥<text class="item-price">{{ item.price }}</text>
                </view>
                <!-- 商品数量选择 -->
                <view>
                  <uni-number-box v-model="item.quantity" :min="1" @change="updateQuantity(item.id, item.quantity)">
                  </uni-number-box>
                </view>
              </view>
            </view>
          </view>
        </uni-swipe-action-item>
      </uni-swipe-action>

      <!-- 商户总价 -->
      <view class="merchant-total">
        <text>商户总价：￥{{ merchantTotalPrice(merchant.items) }}</text>
      </view>
    </view>

    <!-- 总价 -->
    <view class="total-price">
      <text>总数量：{{ cartStore.totalQuantity }}</text><br /><br />
      <text>购物车总价：￥{{ cartStore.totalPrice }}</text>
    </view>

    <!-- 结算按钮 -->
    <button type="primary" class="checkout-button" @click="checkout">去结算</button>

  </view>
</template>

<script>
import { useCartStore } from '@/store/cartStore';

export default {
  data() {
    return {
      cartItems: [
        { title: '商品1', price: 100, quantity: 1, merchant: '商户A', imgUrl: '/static/logos/vite.svg' },
        { title: '商品2', price: 200, quantity: 1, merchant: '商户A', image: '/static/logos/vite.svg' },
        { title: '商品3', price: 150, quantity: 1, merchant: '商户B', image: '/static/logos/vite.svg' },
        { title: '商品4', price: 250, quantity: 1, merchant: '商户B', image: '/static/logos/vite.svg' },
      ],
      swipeOptions: [
        {
          text: '比对',
          style: {
            backgroundColor: '#FFD700',
            color: '#fff',
            fontSize: '14px',
            fontWeight: 'bold'
          }
        },
        {
          text: '收藏',
          style: {
            backgroundColor: '#DAA520',
            color: '#fff',
            fontSize: '14px',
            fontWeight: 'bold'
          }
        },
        {
          text: '删除',
          style: {
            backgroundColor: '#ff4d4f',
            color: '#fff',
            fontSize: '14px',
            fontWeight: 'bold'
          }
        }
      ]
    };
  },
  computed: {
    // 按商户分组商品
    groupedCartItems() {
      const merchants = {};
      this.cartStore.cartItems.forEach(item => {
        if (!merchants[item.domain]) {
          merchants[item.domain] = {
            name: item.domain,
            items: []
          };
        }
        merchants[item.domain].items.push(item);
      });
      return Object.values(merchants);
    },

  },
  methods: {
    // 更新商品数量
    updateQuantity(merchantName, index, quantity) {
      const merchant = this.groupedCartItems.find(m => m.name === merchantName);
      merchant.items[index].quantity = quantity;
    },
    // 删除商品
    deleteItem(merchantName, index) {
      const merchant = this.groupedCartItems.find(m => m.name === merchantName);
      merchant.items.splice(index, 1);
    },
    // 计算每个商户的总价
    merchantTotalPrice(items) {
      return items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
    },
    checkout() {
      uni.showToast({
        title: `结算成功，总金额：￥${this.totalPrice}`,
        icon: 'success'
      });
    },

    // onClick(e) {
    // 	console.log('点击了' + (e.position === 'left' ? '左侧' : '右侧') + e.content.text + '按钮')
    // },
    // change(event) {
    // 	console.log('改变事件', event);
    // },
    // swipeChange(e, index) {
    // 	console.log('当前状态：' + e + '，下标：' + index)
    // }
  },

  setup() {
    const cartStore = useCartStore();

    // 方法：更新商品数量
    const updateQuantity = (id, quantity) => {
      cartStore.updateQuantity(id, quantity);
      // 设置购物车图标上的角标数字
      uni.setTabBarBadge({
        index: 3,  // tabBar 中购物车图标的索引
        text: String(cartStore.totalQuantity)  // 角标文本，必须是字符串
      });
      if (cartStore.totalQuantity < 0) {
        uni.removeTabBarBadge({
          index: 3
        });
      }
    };

    // 方法：从购物车中删除商品
    const removeFromCart = (id) => {
      cartStore.removeFromCart(id);
    };

    // 方法：清空购物车
    const clearCart = () => {
      cartStore.clearCart();
    };

    return {
      cartStore,
      updateQuantity,
      removeFromCart,
      clearCart,
    };
  }
};
</script>


<style lang="scss">
@import './cart.scss';
</style>
