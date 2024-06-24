export function getUserRedisKey(user) {
  return `user:${user.id}:${user.userId}`
}
