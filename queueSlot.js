var queueSlot = function (navn, fag, bordnummer) {
    this.navn = navn;
    this.fag = fag;
    this.bordnummer = bordnummer;
    this.id = -1;

};

queueSlot.prototype.getName = function () {
    return this.navn;
};

queueSlot.prototype.getFag = function () {
    return this.fag;
};

queueSlot.prototype.getBordNummer = function () {
    return this.bordnummer;
};

queueSlot.prototype.equals = function (otherQueueSlot) {
    return otherQueueSlot.getName() === this.getName() &&
        otherQueueSlot.getFag() === this.getFag() &&
        otherQueueSlot.getBordNummer() === this.getBordNummer();
};


module.exports = queueSlot;