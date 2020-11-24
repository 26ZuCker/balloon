export default {
  /**
   * 相当于首屏渲染
   */
  pages: ['pages/open/open', 'pages/cusInfo/cusInfo'],
  /**
   * 分包加载相当于预加载
   */
  subpackages: [
    {
      root: 'pages/info',
      pages: ['info'],
    },
    {
      root: 'pages/game',
      pages: ['game'],
    },
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '仿真气球实验',
    navigationBarTextStyle: 'black',
  },
  cloud: true,
};
