export default {
  pages: ['pages/cusInfo/cusInfo', 'pages/game/game'],
  //pages: ['pages/game/game', 'pages/cusInfo/cusInfo'],
  subpackages: [
    {
      root: 'pages/open',
      pages: ['open'],
    },
    {
      root: 'pages/infor',
      pages: ['infor'],
    },
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black',
  },
  cloud: true,
};
