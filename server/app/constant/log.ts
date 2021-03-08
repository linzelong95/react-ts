export enum LogEvent {
  RAW_LOG = 'raw-log', // 普通日志
  CLIENT_REQUEST = 'client-request', // 接收客户端请求
  CLIENT_RESPONSE = 'client-response', // 响应客户端请求
  NODE_REQUEST = 'node-request', // node向后端（第三方）发起请求
  ALARM_SUCCESS = 'alarm-success', // 发送告警成功
  ALARM_FAIL = 'alarm-fail', // 发送告警错误
}
