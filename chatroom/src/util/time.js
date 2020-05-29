export default {
  isToday (time1, time2) {
    return (time1.getFullYear() === time2.getFullYear() &&
      time1.getMonth() === time2.getMonth() &&
      time1.getDate() === time2.getDate())
  },
  isYesterday (time1, nowTime) {
    const prevTime = new Date(nowTime)
    prevTime.setDate(nowTime.getDate() - 1)
    return (time1.getFullYear === prevTime.getFullYear &&
    time1.getMonth() === prevTime.getMonth() &&
    time1.getDate() === prevTime.getDate())
  },
  getHourMinute (time) {
    const hours = time.getHours()
    const minutes = time.getMinutes()
    return `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}`
  },
  getMonthDay (time) {
    return `${time.getMonth() + 1}/${time.getDate()}`
  },
  getExactTime (time1, nowTime) {
    if (this.isToday(time1, nowTime)) return this.getHourMinute(time1)
    else if (this.isYesterday(time1, nowTime)) return '昨天'
    else return this.getMonthDay(time1)
  }
}
