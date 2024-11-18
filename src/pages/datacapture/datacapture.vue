<template>
  <view class="content">
    <view class="header">
      数据加载
    </view>
    <uni-section class="section-box" title="item-amz" type="line">
      <uni-card title="刷新：1次/天" :extra="'上次：' + lastItems[0].datetimeGen">
        <view class="progress-control">
          <progress :percent="pgList[0]" show-info stroke-width="3" />
          <view class="capture-result">
            result: {{ loadResults[0] }}
          </view>
          <button type="primary" :loading="loadButtons[0]" :disabled="loadDisabled[0]" @click="start('amz', 0)">开始加载</button>
        </view>
      </uni-card>
    </uni-section>
    <uni-section class="section-box" title="item-dd" type="line">
      <uni-card title="刷新：1次/天" :extra="'上次：' + lastItems[1].datetimeGen">
        <view class="progress-control">
          <progress :percent="pgList[1]" show-info stroke-width="3" />
          <view class="capture-result">
            result: {{ loadResults[1] }}
          </view>
          <button type="primary" :loading="loadButtons[1]" :disabled="loadDisabled[1]" @click="start('dd', 1)">开始加载</button>
        </view>
      </uni-card>
    </uni-section>
  </view>
</template>

<script>
import request from '@/utils/v-request'
import { isSameDay } from '@/utils/dateUtiles';

export default {
  data() {
    return {
      title: 'hello, account',
      pgList: [0, 0],
      lastItems: [{}, {}],
      loadResults: ["", ""],
      loadDisabled: [true, true],
      loadButtons: [false, false]
    }
  },
  mounted() {
    this.pageInit();
  },
  methods: {
    start(n, index) {
      this.loadButtons[index] = true;
      this.loadDisabled[index] = true;
      this.pgList[index] = 0;
      this.startProgress(index);

      request({ url: `/api/capture/item/start/${n}`, method: 'GET', data: {} })
        .then(res => {
          // itemCnt
          if(res.data){
            this.loadResults[index] = `加载成功，共新增${res.data.itemCnt}条数据。`;
          }
          
          this.loadButtons[index] = false;
          this.pgList[index] = 100;
          this.pageInit();
        }).catch(err => {
          console.error(err);
        });
    },
    pageInit() {
      request({ url: '/api/items/getlatest', method: 'GET', data: {} })
        .then(res => {
          this.lastItems = res.data;
          if (this.lastItems && this.lastItems.length > 1) {            
            this.lastItems.forEach((item, i) => {
              this.loadDisabled[i] = isSameDay(new Date(), item.datetimeGen.replace(" ", "T"));
            });
          }
        }).catch(err => {
          console.error(err);
        });
    },
    // 进度条的加载过程
    startProgress(index) {
      // 每100毫秒增加进度
      const interval = setInterval(() => {
        if (this.pgList[index] >= 99) {
          clearInterval(interval); // 加载完成时清除定时器
        } else {
          this.pgList[index] += 1; // 每次增加5%的进度
        }
      }, 160);
    },

  },
}
</script>

<style lang="scss">
@import './datacapture.scss';

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.header {
  font-size: 40rpx;
  font-weight: bold;
  color: $uni-text-color;
  margin: 20px;
}

.progress-box {
  display: flex;
  height: 50rpx;
  margin-bottom: 60rpx;
}

.section-box {
  width: 100%;
}

.capture-result {
  margin: 10px 0;
}
</style>
