const BASE_URL = 'https://riktdg.top'
// const BASE_URL = 'http://localhost:9527'
//http://ec2-3-27-228-186.ap-southeast-2.compute.amazonaws.com/



function request(options) {
    
    return new Promise((resolve, reject) => {
      uni.request({
        url: BASE_URL + options.url, // 服务器url
        method: options.method || 'GET', // 请求方法，默认为GET
        data: options.data || {}, // 请求参数
        header: options.header || { 'Content-Type': 'application/json' }, // 设置请求的 header
        success: (res) => {
          // 请求成功
          if (res.statusCode === 200) {
            resolve(res);
          } else {
            // 可以根据项目要求修改错误处理
            reject(res);
          }
        },
        fail: (err) => {
          // 请求失败处理
          reject(err);
        },
      });
    });
  }
 
export default request;