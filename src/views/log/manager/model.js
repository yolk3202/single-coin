export const initTableRow = [
  { label: "ID", prop: "id", minWidth: 120 },
  { label: "用户ID", prop: "user_id", minWidth: 100 },
  { label: "用户名", prop: "user_name", minWidth: 100 },
  { label: "操作类型", prop: "action_type", minWidth: 120 },
  { label: "操作描述", prop: "description", minWidth: 120 },
  { label: "详情", prop: "detail", minWidth: 150 },
  { label: "创建时间", prop: "created_at",  minWidth: 120 },
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