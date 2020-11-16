// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const xlsx = require('node-xlsx')
const MAX_LIMIT = 100
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  let batch = Number(event.batch)
  try {
    const wxContext = cloud.getWXContext()
    let excel_name = '第' + batch + '批次数据.xlsx'
    let all_data = [];
    let head = ['姓名', '学号', '支付宝账号', '电话', '场次', '组次', 
      '未爆气球被吹的平均次数(为集体)',
      '未爆气球被吹的平均次数(为自己)',
      '吹爆气球的个数(为集体)',
      '吹爆气球的个数(为自己)', 
      '面临正反馈时的未爆气球被吹的平均次数(集体)', 
      '正反馈下未爆气球个数(集体)',  
      '面临正反馈时的未爆气球被吹的平均次数(自己)',
      '正反馈下未爆气球个数(自己)',
      '面临负反馈时的未爆气球被吹的平均次数(集体)',
      '负反馈下未爆气球个数(集体)',
      '面临负反馈时的未爆气球被吹的平均次数(自己)',
      '负反馈下未爆气球个数(自己)',
      '为集体赢的钱数',
      '为自己赢的收益'
    ]
    all_data.push(head);

    const countResult = await db.collection('game_data').where({
      batch: batch,
    }).count()
    const total = countResult.total

    const batchTimes = Math.ceil(total / 100)

    const tasks = []
    for (let i = 0; i < batchTimes; i++) {
      const promise = db.collection('game_data').where({
          batch: batch,
          group: event.group
        }).skip(i * MAX_LIMIT).limit(MAX_LIMIT)
        .get()
      tasks.push(promise)
    }
    // 等待所有
    let all_game_data = (await Promise.all(tasks)).reduce((acc, cur) => {
      return {
        data: acc.data.concat(cur.data),
        errMsg: acc.errMsg,
      }
    }).data

    all_game_data.forEach(agd => {
      temp_array = []
      temp_array.push(agd.name)
      temp_array.push(agd.school_number)
      temp_array.push(agd.alipay)
      temp_array.push(agd.phone_number)
      temp_array.push(agd.batch)
      temp_array.push(agd.group)
      if (agd.game_data.personal.length != 30 || agd.game_data.team.length != 30) {
        all_data.push(temp_array)
        return true
      }

      // team
      let total_income_team = 0
      let unexploded_balloons_sum_team = 0
      let unexploded_balloons_blown_team = 0
      let exploded_balloons_sum_team = 0
      let positive_feedback_unexploded_balloons_sum_team = 0
      let positive_feedback_unexploded_balloons_blown_team = 0
      let negative_feedback_unexploded_balloons_sum_team = 0
      let negative_feedback_unexploded_balloons_blown_team = 0

      // personal
      let total_income_personal = 0
      let unexploded_balloons_sum_personal = 0
      let unexploded_balloons_blown_persoanl = 0
      let exploded_balloons_sum_personal = 0
      let positive_feedback_unexploded_balloons_sum_personal = 0
      let positive_feedback_unexploded_balloons_blown_personal = 0
      let negative_feedback_unexploded_balloons_sum_personal = 0
      let negative_feedback_unexploded_balloons_blown_personal = 0


      for (var i = 0; i < 30; i++) {
        let once_data = agd.game_data.team[i]
        total_income_team += once_data.income
        if (once_data.is_blast == false) {

          // team
          unexploded_balloons_sum_team += 1
          unexploded_balloons_blown_team += once_data.hit_count

          // 面临正反馈未爆气球被吹的平均次数(team)
          if (i != 0 && agd.game_data.team[i - 1].is_blast == false && once_data.is_blast == false) {
            positive_feedback_unexploded_balloons_sum_team += 1;
            positive_feedback_unexploded_balloons_blown_team += once_data.hit_count
          }

          // 面临负反馈未爆气球被吹的平均次数(team)
          if (i != 0 && agd.game_data.team[i - 1].is_blast == true && once_data.is_blast == false) {
            negative_feedback_unexploded_balloons_sum_team += 1;
            negative_feedback_unexploded_balloons_blown_team += once_data.hit_count
          }
        } else {
          exploded_balloons_sum_team += 1
        }
      }

      for (var j = 0; j < 30; j++) {
        let once_data = agd.game_data.personal[j]
        total_income_personal += once_data.income
        // personal
        unexploded_balloons_sum_personal += 1
        unexploded_balloons_blown_persoanl += once_data.hit_count

        // 面临正反馈未爆气球被吹的平均次数(personal)
        if (j != 0 && agd.game_data.personal[j - 1].is_blast == false && once_data.is_blast == false) {
          positive_feedback_unexploded_balloons_sum_personal += 1;
          positive_feedback_unexploded_balloons_blown_personal += once_data.hit_count
        }

        // 面临负反馈未爆气球被吹的平均次数(personal)
        if (j != 0 && agd.game_data.personal[j - 1].is_blast == true && once_data.is_blast == false) {
          negative_feedback_unexploded_balloons_sum_personal += 1;
          negative_feedback_unexploded_balloons_blown_personal += once_data.hit_count
        }
      }

      // team
      temp_array[6] = unexploded_balloons_blown_team / unexploded_balloons_sum_team
      temp_array[8] = exploded_balloons_sum_team
      temp_array[10] = positive_feedback_unexploded_balloons_blown_team / positive_feedback_unexploded_balloons_sum_team
      temp_array[11] = positive_feedback_unexploded_balloons_sum_team
      temp_array[14] = negative_feedback_unexploded_balloons_blown_team / negative_feedback_unexploded_balloons_sum_team
      temp_array[15] = negative_feedback_unexploded_balloons_sum_team
      temp_array[18] = total_income_team

      // personal
      temp_array[7] = unexploded_balloons_blown_persoanl / unexploded_balloons_sum_personal
      temp_array[9] = exploded_balloons_sum_personal
      temp_array[12] = positive_feedback_unexploded_balloons_blown_personal / positive_feedback_unexploded_balloons_sum_personal
      temp_array[13] = positive_feedback_unexploded_balloons_sum_personal
      temp_array[16] = negative_feedback_unexploded_balloons_blown_personal / negative_feedback_unexploded_balloons_sum_personal
      temp_array[17] = negative_feedback_unexploded_balloons_sum_personal
      temp_array[19] = total_income_personal


      all_data.push(temp_array)
    });

    var buffer = await xlsx.build([{
      name: "mySheetName",
      data: all_data
    }]);

    let file_id = await cloud.uploadFile({
      cloudPath: excel_name,
      fileContent: buffer,
    })
    
    let path = await cloud.getTempFileURL({
      fileList: [file_id.fileID],
    })

    return {
      code: 100,
      message: "success!",
      data:{
        path:path.fileList[0].tempFileURL
      }
    }

  } catch (e) {
    console.error(e)
    return {
      code: 101,
      message: e,
    }
  }





}