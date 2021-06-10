export class Timer {
    constructor(el, startTime=null) {
        this.millis = 0;
        this.secs = 0;
        this.mins = 0;
        this.hours = 0;
        this.el = el;
        this.startTime = startTime;
    }

    init = () => {
        this.startTime = this.startTime || Date.now();
        let id = setInterval( () => {
            let elapsedTime = Date.now() - this.startTime;
            this.millis = (elapsedTime % 1000)/10;
            elapsedTime = Math.floor(elapsedTime / 1000);
            this.secs = elapsedTime % 60;
            elapsedTime = Math.floor(elapsedTime / 60);
            this.mins = elapsedTime % 60;
            elapsedTime = Math.floor(elapsedTime / 60);
            this.hours = elapsedTime % 60;

            this.el.querySelector('.counter').innerHTML = this.getTime();
        }, 10);
        return id;
    }

    getTime = () => {
        let time = this.hours === 0 ? `` : `${this.formatNum(this.hours)}:`;
        time += `${this.formatNum(this.mins)}:${this.formatNum(this.secs)}.${this.formatNum(this.millis)}`;
        return time;
    }

    getStartTime =  () => {
        return this.startTime;
    }

    formatNum = (num) => {
        return String(Math.trunc(num)).padStart(2, '0');
    }
}