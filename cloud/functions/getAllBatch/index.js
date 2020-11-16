// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const MAX_LIMIT = 100

// 云函数入口函数
exports.main = async (event, context) => {
  //获取所有的数据
  try {
    const wxContext = cloud.getWXContext()
    const countResult = await db.collection('settings').count()
    const total = countResult.total
    const batchTimes = Math.ceil(total / 100)

    const tasks = []
    for (let i = 0; i < batchTimes; i++) {
      const promise = db.collection('settings').skip(i * MAX_LIMIT).limit(MAX_LIMIT)
        .get()
      tasks.push(promise)
    }
    // 等待所有
    let data = (await Promise.all(tasks)).reduce((acc, cur) => {
      return {
        data: acc.data.concat(cur.data),
        errMsg: acc.errMsg,
      }
    }).data

    let used_list = Array()
    data.forEach(v => {
      used_list.push(v.batch)
    })

    return {
      code: "100",
      message: "success",
      data: used_list
    }
  } catch (e) {
    return {
      code: "101",
      message: e,
    }
  }



}