class DateTimeHelper {
    minutesToSeconds(minutes) {
        return minutes * 60
    }
    hoursToSeconds(hours) {
        return this.minutesToSeconds(hours * 60)
    }

    daysToSeconds(days) {
        return this.hoursToSeconds(days * 24)
    }

    weeksToSeconds(weeks) {
        return this.daysToSeconds(weeks * 7)
    }

    monthsToSeconds(months) {
        return this.daysToSeconds(months * 30)
    }

    yearsToSeconds(years) {
        return this.daysToSeconds(years * 365)
    }
}

module.exports = new DateTimeHelper()