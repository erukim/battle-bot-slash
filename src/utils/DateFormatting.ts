import Day from 'dayjs'
import 'dayjs/locale/ko'
import relativeTime from 'dayjs/plugin/relativeTime'
import localizedFormat from 'dayjs/plugin/localizedFormat'

class DateFormatting {
  static _format(date: number | string | Date, style?: string) {
    return (
      `<t:${Math.floor(Number(date) / 1000)}` + (style ? `:${style}` : '') + '>'
    )
  }

  static relative(date: number | string | Date) {
    return this._format(date, 'R')
  }

  static date(date: number | string | Date) {
    const dates = new Date(date)
    const year = dates.getFullYear().toString().slice(-2)
    const month = ('0' + (dates.getMonth() + 1)).slice(-2)
    const day = ('0' + dates.getDate()).slice(-2)
    const hour = ('0' + dates.getHours()).slice(-2)
    const minute = ('0' + dates.getMinutes()).slice(-2)
    return year + '.' + month + '.' + day + '. ' + hour + ':' + minute
  }
}
export default DateFormatting

Day.extend(relativeTime)
Day.extend(localizedFormat)
Day.locale('ko')
export { Day }
