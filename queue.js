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
}

queue.prototype.addQueueSlot = function(slot) {
    this.queueArray.push(slot);
}

queue.prototype.getNumberInQueue = function() {
    return this.queueArray.length;
}

module.exports = queue;