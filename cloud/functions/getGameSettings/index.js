// 云函数入口文件
const cloud = require('wx-server-sdk');
cloud.init();

const db = cloud.database();

// 爆破点生成函数
function generate_blast_point_list(type) {
  // 生成数组
  if (type == 0) {
    var list_length = 20;
    var blast_point_list = [];
    for (var i = 1; i <= list_length; i++) {
      blast_point_list.push(i);
    }

    // 打乱顺序
    for (var i = 1; i <= list_length * 2; i++) {
      var l = parseInt(Math.random() * list_length, 10);
      var r = parseInt(Math.random() * list_length, 10);
      var temp = blast_point_list[l];
      blast_point_list[l] = blast_point_list[r];
      blast_point_list[r] = temp;
    }
    return blast_point_list;
  } else {
    throw new Error('parameter not supported');
  }
}

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    let batch = Number(event.batch);
    const wxContext = cloud.getWXContext();
    let setting_data = await db
      .collection('settings')
      .where({
        batch: batch,
      })
      .get();

    if (setting_data.data.length == 0) {
      return {
        code: '105',
        message: 'The batch does not exist!',
      };
    }

    let game_settings = setting_data.data[0];
    game_settings.group = event.group;

    // 判断游戏是否结束
    if (game_settings.end_time <= Date.parse(new Date()) / 1000) {
      return {
        code: '102',
        message: 'The experiment is over!',
      };
    }

    // 判断是否参加过实验
    let game_data = await db
      .collection('game_data')
      .where({
        batch: batch,
        open_id: wxContext.OPENID,
      })
      .get();
    if (game_data.data.length != 0) {
      return {
        code: '104',
        message: 'Already participated in the game',
      };
    }
    // 生成爆破点
    try {
      var blast_point_list_team = generate_blast_point_list(game_settings.blast_point_distribution);
      var blast_point_list_personal = generate_blast_point_list(
        game_settings.blast_point_distribution
      );
    } catch (e) {
      return {
        code: '103',
        message: 'Illegal blasting point parameter in setting!',
      };
    }
    blast_point = {
      team: blast_point_list_team,
      personal: blast_point_list_personal,
    };
    game_settings.blast_point = blast_point;

    // 更新游戏模式
    let new_game_mode = 0;
    if (game_settings.game_mode == 1) {
      new_game_mode = 0;
    } else {
      new_game_mode = 1;
    }

    await db
      .collection('settings')
      .where({
        batch: batch,
      })
      .update({
        data: {
          game_mode: new_game_mode,
        },
      });

    return {
      code: '100',
      message: 'success',
      data: game_settings,
    };
  } catch (e) {
    return {
      code: '101',
      message: e,
    };
  }
};
