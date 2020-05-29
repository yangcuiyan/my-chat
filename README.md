## 建表
Friend表
* relationId：将两个用户id拼接
* from：好友申请来自的用户
* to：好友申请发送给某个用户
* createTime：好友申请创建时间
* status：0：未操作，1：同意，2：拒绝

User表
* username：账号
* password：密码
* avatar：头像
* createTime：用户注册时间
* lastLoginTime：最后一次登录时间
* salt：加密盐

Group表
* name：群账号
* avatar：群头像
* creator：群创建者
* createTime：群组创建时间
* members：群组成员
* announcement：群公告
* isDefault：是否为默认群组

Message表
* from：消息发送者
* to：消息接收者，发送给群时为群_id, 发送给个人时为_id
* style：消息类型，默认是文本
* content：消息内容
* createTime：消息发送时间
* filename
* fileWidth
* fileHeight

## 登录

* 账号密码登录
* token登录

