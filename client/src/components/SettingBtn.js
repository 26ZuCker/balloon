const setting = {
  type: { title: '实验类别', value: '' },
  limit_time: { title: '本次实验限制时间', value: 0 },
  round_time: { title: '批次', value: 0 },
  group_num: { title: '组次', value: 0 },
};
/**
 * 提交更改配置
 */
const submit_setting = async () => {
  this.isLoading = true;
  Taro.navigateTo({
    url: '../open/open',
  });
  /*       try {
              const { code, data } = (await submit_userInfo()).data
              if (code !== this.cusResCode.ERROR) {
                //this.userInfo = data.userInfo
                this.isLoading = false
                return Promise.resolve()
              } else {
                this.isLoading = false
                return Promise.reject('http fail')
              }
            } catch (error) {
              this.isLoading = false
              return Promise.reject(error)
            } */
};
export { setting, submit_setting };

export default {
  render(h) {
    return <div></div>;
  },
};
