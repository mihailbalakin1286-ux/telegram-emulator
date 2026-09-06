class SwipeHandler {
    constructor(element, callbacks) {
        this.element = element;
        this.callbacks = callbacks;
        this.startX = 0;
        this.startY = 0;
        this.startTime = 0;
        this.minDistance = 30;
        this.maxTime = 500;
        this.active = false;

        this._onTouchStart = this.onTouchStart.bind(this);
        this._onTouchEnd = this.onTouchEnd.bind(this);
        this._onMouseDown = this.onMouseDown.bind(this);
        this._onMouseUp = this.onMouseUp.bind(this);
        this._onMouseMove = this.onMouseMove.bind(this);

        element.addEventListener('touchstart', this._onTouchStart, { passive: true });
        element.addEventListener('touchend', this._onTouchEnd, { passive: true });
        element.addEventListener('mousedown', this._onMouseDown);
        element.addEventListener('mouseup', this._onMouseUp);
        element.addEventListener('mousemove', this._onMouseMove);
    }

    onTouchStart(e) {
        this.startX = e.touches[0].clientX;
        this.startY = e.touches[0].clientY;
        this.startTime = Date.now();
        this.active = true;
    }

    onTouchEnd(e) {
        if (!this.active) return;
        this.active = false;
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        this.processSwipe(endX, endY);
    }

    onMouseDown(e) {
        this.startX = e.clientX;
        this.startY = e.clientY;
        this.startTime = Date.now();
        this.active = true;
    }

    onMouseUp(e) {
        if (!this.active) return;
        this.active = false;
        this.processSwipe(e.clientX, e.clientY);
    }

    onMouseMove(e) {
        // prevent text selection during swipe
        if (this.active) {
            e.preventDefault();
        }
    }

    processSwipe(endX, endY) {
        const dx = endX - this.startX;
        const dy = endY - this.startY;
        const absDx = Math.abs(dx);
        const absDy = Math.abs(dy);
        const timeDiff = Date.now() - this.startTime;

        if (timeDiff > this.maxTime) return;

        if (absDx > this.minDistance || absDy > this.minDistance) {
            if (absDx > absDy) {
                if (dx > 0 && this.callbacks.swipeRight) {
                    this.callbacks.swipeRight({ dx, dy, startX: this.startX, startY: this.startY });
                } else if (dx < 0 && this.callbacks.swipeLeft) {
                    this.callbacks.swipeLeft({ dx, dy, startX: this.startX, startY: this.startY });
                }
            } else {
                if (dy > 0 && this.callbacks.swipeDown) {
                    this.callbacks.swipeDown({ dx, dy, startX: this.startX, startY: this.startY });
                } else if (dy < 0 && this.callbacks.swipeUp) {
                    this.callbacks.swipeUp({ dx, dy, startX: this.startX, startY: this.startY });
                }
            }
        } else if (absDx < 10 && absDy < 10 && timeDiff < 300) {
            if (this.callbacks.tap) {
                this.callbacks.tap({ x: endX, y: endY });
            }
        }
    }

    destroy() {
        this.element.removeEventListener('touchstart', this._onTouchStart);
        this.element.removeEventListener('touchend', this._onTouchEnd);
        this.element.removeEventListener('mousedown', this._onMouseDown);
        this.element.removeEventListener('mouseup', this._onMouseUp);
        this.element.removeEventListener('mousemove', this._onMouseMove);
    }
}
