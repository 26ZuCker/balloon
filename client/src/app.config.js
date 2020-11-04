export default {
  //pages: ['pages/cusInfo/cusInfo', 'pages/game/game'],
  pages: ['pages/game/game', 'pages/cusInfo/cusInfo'],
  //pages/open/open
  subpackages: [
    {
      root: 'pages/open',
      pages: ['open'],
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
