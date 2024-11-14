import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    cartItems: [], // 购物车商品列表
  }),
  getters: {
    // 计算购物车总价
    totalPrice: (state) => {
      return state.cartItems.reduce((total, item) => {
        return total + item.price * item.quantity;
      }, 0).toFixed(2);
    },
    // 获取购物车中的商品数量
    totalQuantity: (state) => {
      return state.cartItems.reduce((total, item) => {
        return total + item.quantity;
      }, 0);
    },
  },
  actions: {
    // 添加商品到购物车
    addToCart(product) {
      const existingItem = this.cartItems.find(item => item.id === product.id);
      if (existingItem) {
        existingItem.quantity += product.quantity;
      } else {
        product.price = product.price.replace("$", "").replace("¥", "");
        product.price = parseFloat(product.price) ? parseFloat(product.price).toFixed(2) : 0;
        
        this.cartItems.push({
          ...product,
          quantity: product.quantity || 1,
        });
        console.log(this.cartItems);
      }
    },
    // 从购物车中删除商品
    removeFromCart(productId) {
      this.cartItems = this.cartItems.filter(item => item.id !== productId);
    },
    // 更新购物车商品数量
    updateQuantity(productId, newQuantity) {
      const item = this.cartItems.find(item => item.id === productId);
      if (item && newQuantity > 0) {
        item.quantity = newQuantity;
      }
    },
    // 清空购物车
    clearCart() {
      this.cartItems = [];
    },
  },
});
