var Calc;

Calc = (function() {
  Calc.prototype._currentSum = 0;

  function Calc() {
    return;
  }

  Calc.prototype.clearCalculator = function() {
    this._currentSum = 0;
  };

  Calc.prototype.add = function(arg) {
    this._currentSum = this._currentSum + arg;
  };

  Calc.prototype.substract = function(arg) {
    this._currentSum = this._currentSum - arg;
  };

  Calc.prototype.result = function() {
    return this._currentSum;
  };

  return Calc;

})();

module.exports = Calc;