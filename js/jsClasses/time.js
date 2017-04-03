/*Doc: */
/*class Time
variables: minutes, hours, days
minutes should be always from 0 - 60; hours should be always from 0 - 24 and days should be any number - days represent day change if for example if we substract 1 hour from new Time(00:00) we'll get 23:00 and days = -1
function:
    constructor(_time = "00:00")        - constructor don't check if time is valid. Ww can add number of days by
                                        adding "-<numberOfDays>" after time - for example "00:00-1"
    ============================================================
    getTime(_plus = false)      - returns time      - if _plus is set to true return days as well
    getHours(all = false)       - returns hours
    getMinutes(all = false)     - returns minutes
    getDays(all = false)        - returns days
    ============================================================
    addToTime(_minutes = 0, _hours = 0, _days = 0)      - add value to Time and also check if date is valid and
                                                        if not it fixes it.
    subFromTime(_minutes = 0, _hours = 0, _days = 0)    - substract value from Time and also check if date is
                                                        valid and if not it fixes it.

    addTimeToTime(_time)                                - add value of recieved Time to this Time and also check
                                                        if date is valid and if not it fixesit.
    subTimeFromTime(_time)                              - substract value of recieved Time from this Time and
                                                        also check if date is valid and if not it fixes it.
    static compareTimes(_time1, _time2, days = false)   - compare _time1 to _time2.
                                                        If _time1 > _time2 returns 1.
                                                        If _time1 < _time2 returns 2.
                                                        If _time1 = _time2 returns 0.
                                                        if days is set to true it'll also compare day difference
*/
class Time {
    constructor(_time = "00:00") {
        this.days = ~_time.indexOf("-") ? _time.substr(_time.indexOf("-") + 1) : 0;
        this.hours = _time.substring(0, _time.indexOf(":"));
        this.minutes = _time.substring(_time.indexOf(":")+1, (_time.indexOf("-") == -1 ? _time.length : _time.indexOf("-")));
    }
    getMinutes(hours = false, days = false) {
        return this.minutes;
    }
    getHours(days = false) {
        return this.hours;
    }
    getDays() {
        return this.days;
    }
    getTime(_plus = false) {
        return (this.hours.toString().length == 1 ? "0" + this.hours : this.hours) + ":" + (this.minutes.toString().length == 1 ? "0" + this.minutes : this.minutes) + (_plus ? "-" + this.days : "");
    }
    addToTime(_minutes = 0, _hours = 0, _days = 0) {
        this.minutes += _minutes;
        while (this.minutes >= 60) {
            this.minutes -= 60;
            this.hours++;
        }
        this.hours += _hours;
        while (this.hours >= 24) {
            this.hours -= 24;
            this.days++;
        }
        this.days += _days;
    }
    subFromTime(_minutes = 0, _hours = 0, _days = 0) {
        this.minutes -= _minutes;
        while (this.minutes < 0) {
            this.minutes += 60;
            this.hours--;
        }
        this.hours -= _hours;
        while (this.hours < 0) {
            this.hours += 24;
            this.days--;
        }
        this.days -= _days;
    }
    addTimeToTime(_time) {
        this.minutes += _time.minutes;
        while (this.minutes >= 60) {
            this.minutes -= 60;
            this.hours++;
        }
        this.hours += _time.hours;
        while (this.hours >= 24) {
            this.hours -= 24;
            this.days++;
        }
        this.days += _time.days;
    }
    subTimeFromTime(_time) {
        this.minutes -= _time.minutes;
        while (this.minutes < 0) {
            this.minutes += 60;
            this.hours--;
        }
        this.hours -= _time.hours;
        while (this.hours < 0) {
            this.hours += 24;
            this.days--;
        }
        this.days -= _time.days;
    }
    static compareTimes(_time1, _time2, days = false) {
        if (days) {
            if (_time1.days > _time2.days) {
                return 1;
            }
            else if (_time1.days < _time2.days) {
                return 2;
            }
        }
        if (_time1.hours > _time2.hours) {
            return 1;
        }
        else if (_time1.hours < _time2.hours) {
            return 2;
        }
        if (_time1.minutes > _time2.minutes) {
            return 1;
        }
        else if (_time1.minutes < _time2.minutes) {
            return 2;
        }
        return 0;
    }
}
