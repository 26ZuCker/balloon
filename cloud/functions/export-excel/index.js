// 云函数入口文件
const cloud = require('wx-server-sdk');
const nodeExcel = require('excel-export');
const path = require('path');
cloud.init();
// 云函数入口函数
exports.main = async (event, context) => {
  var tableMap = {
    styleXmlFile: path.join(__dirname, 'styles.xml'),
    name: Date.now() + '-export',
    cols: [],
    rows: [],
  };
  var tableHead = ['编号', '名称', '生日', '年龄'];
  //添加表头
  for (var i = 0; i < tableHead.length; i++) {
    tableMap.cols[tableMap.cols.length] = {
      caption: tableHead[i],
      type: 'string',
    };
  }

  //添加每一行数据
  for (var i = 0; i < tableList.length; i++) {
    tableMap.rows[tableMap.rows.length] = [tableList[i].编号, tableList[i].名称, tableList[i].生日, tableList[i].年龄];
  }

  //保存excelResult到相应位置
  var excelResult = nodeExcel.execute(tableMap);
  var filePath = 'outputExcels';
  var fileName = cloud.getWXContext().OPENID + '-' + Date.now() / 1000;
  //图片上传到云存储
  return await cloud
    .uploadFile({
      cloudPath: path.join(filePath, fileName),
    })
    .then((res) => {
      console.log(res.fileID);
      return res;
    })
    .catch((err) => {});
};
