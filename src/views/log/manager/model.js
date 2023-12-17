export const initTableRow = [
  { label: "ID", prop: "id", width: 100 },
  { label: "用户ID", prop: "user_id", width: 100 },
  { label: "用户名", prop: "user_name", width: 120 },
  { label: "操作类型", prop: "action_type", width: 120 },
  { label: "操作描述", prop: "description", width: 100 },
  { label: "详情", prop: "detail", minWidth: 240 },
  { label: "创建时间", prop: "created_at",  width: 180 },
  {
    label: "操作",
    prop: "action",
    fixed: "right",
    width: 100,
    slot: "action",
  }
];


export const detailInfo = [
  { label: "ID", prop: "id",type:'text' },
  { label: "用户ID", prop: "user_id",type:'text' },
  { label: "用户名", prop: "user_name",type:'text' },
  { label: "操作类型", prop: "action_type",type:'text' },
  { label: "操作描述", prop: "description",type:'text' },
  { label: "详情", prop: "detail",type:'text' },
  { label: "创建时间", prop: "created_at",type:'text' },
];