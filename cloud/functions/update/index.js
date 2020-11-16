// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const MAX_LIMIT = 100

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    //获取所有的数据
    const countResult = await db.collection('game_data').where({
      batch: event.batch,
      group: event.group
    }).count()
    const total = countResult.total

    const batchTimes = Math.ceil(total / 100)

    const tasks = []
    for (let i = 0; i < batchTimes; i++) {
      const promise = db.collection('game_data').where({
          batch: event.batch,
          group: event.group
        }).skip(i * MAX_LIMIT).limit(MAX_LIMIT)
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

    let total_income = 0
    let total_people = 0
    data.forEach(v => {
      v.game_data.team.forEach(vv => {
        total_income += vv.income
      })
      total_people += 1
    })
    let average_income = parseInt(total_income / total_people)

    return {
      code: '100',
      message: 'success!',
      data: {
        average_income: average_income
      }
    }


  } catch (e) {
    return {
      code:'101',
      message:'fail!'
    }
  }
}