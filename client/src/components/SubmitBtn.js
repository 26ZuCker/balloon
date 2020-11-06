const userInfo = {
  name: { title: '姓名', value: '' },
  stu_id: { title: '学号', value: '' },
  phone_number: { title: '手机号', value: '' },
};
export { userInfo };

export default {
  render(h) {
    return (
      <van-button custom-class='van-button--round van-button--large ma-3' type='primary' loading='isLoading' tap='submitChange'>
        {{ btnTitle }}
      </van-button>
    );
  },
};
