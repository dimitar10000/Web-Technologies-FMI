export class TimeTracker {
    elapsedTime;
    startTime;
    endTime;
    bufferingHappened;
    bufferingTime;
    bufferingStart;
    bufferingFinish;

    constructor() {
        this.elapsedTime = 0;
        this.bufferingHappened = false;
        this.bufferingTime = 0;
    }

    start() {
        this.startTime = Date.now();
        this.bufferingFinish = this.startTime;
    }

    addBufferingTime() {
        this.bufferingTime += (this.bufferingFinish - this.bufferingStart) / 1000;
    }

    stop() {
        this.bufferingHappened = false;
        this.bufferingTime = 0;
        this.elapsedTime = 0;
    }

    trackBuffering() {
        this.bufferingHappened = true;
        this.bufferingStart = Date.now();
    }

    calculateTime() {
        this.endTime = Date.now();
        this.elapsedTime += (this.endTime - this.startTime) / 1000;

        if (this.bufferingHappened && this.elapsedTime - this.bufferingTime > 0) {
            this.elapsedTime -= this.bufferingTime;
        }

        return this.elapsedTime;
    }
}