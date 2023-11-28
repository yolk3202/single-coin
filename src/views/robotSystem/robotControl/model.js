export const robotList = [
  {name: '近盘机器人', value: 'near_plate'},
  {name: '远盘机器人', value: 'far_plate'},
  {name: '划线机器人', value: 'draw_line'},
  {name: '大单机器人', value: 'big_order'},
]
export const robots = {
  'near_plate': {name: '近盘机器人', value: 'near_plate', status:false, loading:true },
  'far_plate': {name: '远盘机器人', value: 'far_plate', status:false, loading:true },
  'draw_line': {name: '划线机器人', value: 'draw_line', status:false, loading:true },
  'big_order': {name: '大单机器人', value: 'big_order', status:false, loading:true },
}
export const robotTypes = ['near_plate', 'far_plate', 'draw_line', 'big_order']

export default {
  robotList,
  robots,
  robotTypes
}