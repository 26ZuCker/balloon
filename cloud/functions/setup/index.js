// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {

  try {
    let data = await db.collection('settings').where({
      batch: event.batch
    }).get()
    if (data.data.length == 0) {
      await db.collection("settings").add({
        data: {
          batch: event.batch,
          money: event.money,
          round_tips: {
            team: event.team_tips,
            personal: event.personal_tips
          },
          practice_tips: event.practice_tips,
          game_tips: event.game_tips,
          end_time: event.end_time,
          blast_point_distribution: event.blast_point_distribution,
          is_update: event.is_update,
          game_mode: event.game_mode,
        },
      })
      return {
        code: "100",
        message: "success"
      }

    } else {
      await db.collection('settings').where({
          batch: event.batch
        })
        .update({
          data: {
            batch: event.batch,
            money: event.money,
            round_tips: {
              team: event.team_tips,
              personal: event.personal_tips
            },
            practice_tips: event.practice_tips,
            game_tips: event.game_tips,
            end_time: event.end_time,
            blast_point_distribution: event.blast_point_distribution,
            is_update: event.is_update,
            game_mode: event.game_mode,
          }
        })
      return {
        code: "100",
        message: "success"
      }
    }
  } catch (e) {
    return {
      code: "101",
      message: e
    }
  }

}