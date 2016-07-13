var World;

module.exports.World = World = function(callback) {
  var Calc;
  Calc = require('../../models/calc');
  this.calc = new Calc;
  this.clearCalculator = function() {
    this.calc.clearCalculator();
  };
  this.add = function(arg) {
    this.calc.add(Number(arg));
  };
  this.substract = function(arg) {
    this.calc.substract(Number(arg));
  };
  this.result = function() {
    return this.calc.result();
  };
  this.doBeforeScenario = function() {
    console.log('Before scenario prep code');
    debugger;
  };
  this.doAfterScenario = function() {
    console.log('After scenario cleanup code');
    debugger;
  };
  callback && callback();
};