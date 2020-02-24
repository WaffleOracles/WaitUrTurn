
var queue = function() {
    this.queueArray = [];
}

queue.prototype.getFirstQueueSlot = function() {
    return this.queueArray[0];
};

queue.prototype.getSlot = function(index) {
    return this.queueArray[index];
};
queue.prototype.returnFirstSlot = function() {
    return this.queueArray.pop();
};

queue.prototype.addQueueSlot = function(slot) {
    this.queueArray.push(slot);
};

queue.prototype.getNumberInQueue = function() {
    return this.queueArray.length;
};

queue.prototype.get =function(queueSlot){
    for (let i = 0; i < this.queueArray.length; i++) {
        if (this.getSlot(i).is(queueSlot)) return i;
    }
    return -1;
};
queue.prototype.remove = function(slot) {
    for (let i = 0; i < this.queueArray.length; i++) {
        if (this.getSlot(i).is(slot)) this.queueArray.splice(i, 1);
    }
    return -1;
};


module.exports = queue;