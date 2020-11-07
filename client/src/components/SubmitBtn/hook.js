const userInfo = {
  name: { title: '姓名', value: '' },
  stu_id: { title: '学号', value: '' },
  phone_number: { title: '手机号', value: '' },
};
export { userInfo };

export default {
  render(h) {
    return (
      <van-button
        custom-class='van-button--round van-button--large ma-3'
        type='primary'
        loading='isLoading'
        tap='submitChange'
      >
        {{ btnTitle }}
      </van-button>
    );
  },
};
    /**
     * 提交更改配置
     */
 const submit_setting=   async function () {
      this.isLoading = true;
      const timer = setTimeout(() => {
        this.isLoading = false
        this.showOverlay = true
        this.QRCODE_URL = myQRCODE
      }, 1000)
    },
    /**
     * 进入历史记录页面
     */
 const    toInfo =function () {
      Taro.navigateTo({ url: '../info/info' })
    }
export { validateForm ,submit_setting,toInfo};
