export default {
  /**
   * 相当于首屏渲染
   */
  pages: ['pages/cusInfo/cusInfo', 'pages/game/game', 'pages/open/open'],
  //pages: ['pages/game/game', 'pages/cusInfo/cusInfo', 'pages/open/open'],
  /**
   * 分包加载相当于预加载
   */
  subpackages: [
    {
      root: 'pages/info',
      pages: ['info'],
    },
    /*     {
      root: 'pages/game',
      pages: ['game'],
    }, */
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black',
  },
  cloud: true,
};
