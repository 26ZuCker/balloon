// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  let data = await db
    .collection('settings')
    .where({
      batch: event.batch,
    })
    .get();
  if (data.data.length == 0) {
    try {
      await db.collection('settings').add({
        data: {
          batch: event.batch,
          money: event.money,
          round: event.round,
          round_tips: event.round_tips,
          blast_point: event.blast_point,
          practice_tips: event.practice_tips,
          game_tips: event.game_tips,
          end_time: event.end_time,
          blast_point_distribution: event.blast_point_distribution,
          is_update: event.is_update,
          game_mode: event.game_mode,
        },
      });
      return {
        code: '100',
        message: 'success',
      };
    } catch (e) {
      return {
        code: '101',
        message: e,
      };
    }
  } else {
    try {
      await db
        .collection('settings')
        .where({
          batch: event.batch,
        })
        .update({
          data: {
            money: event.money,
            round: event.round,
            round_tips: event.round_tips,
            blast_point: event.blast_point,
            practice_tips: event.practice_tips,
            game_tips: event.game_tips,
            end_time: event.end_time,
            blast_point_distribution: event.blast_point_distribution,
            is_update: event.is_update,
            game_mode: event.game_mode,
          },
        });

      return {
        code: '100',
        message: 'success',
      };
    } catch (e) {
      return {
        code: '101',
        message: e,
      };
    }
  }
};
