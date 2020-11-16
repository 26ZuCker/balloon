// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()


// 云函数入口函数
exports.main = async (event, context) => {

  try {
    let batch = event.batch
    const wxContext = cloud.getWXContext()
    const _ = db.command

    let data = await db.collection('game_data').where({
      batch: batch,
      open_id: wxContext.OPENID
    }).get()

    // return data.data.length
    if (data.data.length == 0) {
      await db.collection('game_data').add({
        data: {
          batch: batch,
          alipay: event.alipay,
          group: Number(event.group),
          name: event.name,
          phone_number: event.phone_number,
          school_number: event.school_number,
          open_id: wxContext.OPENID,
          game_data: {
            personal: [],
            team: []
          }
        }
      })
    }

    if (event.type == 0) {
      await db.collection('game_data').where({
        batch: batch,
        open_id: wxContext.OPENID
      }).update({
        data: {
          'game_data.personal': _.push(event.submit_data)
        },
        success: function (res) {
          console.log(res.data)
        }
      })
    } else {
      await db.collection('game_data').where({
        batch: batch,
        open_id: wxContext.OPENID
      }).update({
        data: {
          'game_data.team': _.push(event.submit_data)
        },
        success: function (res) {
          console.log(res.data)
        }
      })
    }
    return {
      code: "100",
      message: "succcess!"
    }
  } catch (e) {
    return {
      code: "101",
      message: "fail!"
    }
  }





}