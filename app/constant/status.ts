export enum StatusCode {
  BAD_REQ = 400, // Bad Request 客户端请求的语法错误，服务器无法理解
  NOT_LOGGED = 401, // Unauthorized 请求要求用户的身份认证
  NOT_LOGGED_FOR_ADMIN = 4010, // 自定义：未登录（特指管理员）
  FORBIDDEN = 403, // Forbidden 服务器理解请求客户端的请求，但是拒绝执行此请求
  NOT_FOUND = 404, // Not Found 服务器无法根据客户端的请求找到资源（网页）
  SERVER_ERROR = 500, // Internal Server Error 服务器内部错误，无法完成请求
}
