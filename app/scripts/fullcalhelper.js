/**
 * Event
 *  Abstract of calendar cell event - column in event row
 *  $tr,$idx - constructor takes both jQuery object of event row and
 *  column index of event (same as day index of week)
 */
var FCevent = function($tr,idx){
  this.$tr = $tr;
  this.idx = idx;
};
FCevent.prototype.getEvCol    = function(){  return this.$tr.find('td').eq(this.idx); };
FCevent.prototype.getContent  = function(){  return this.getEvCol().find('a');  };
FCevent.prototype.getTime     = function(){  return this.getContent().data('time'); };
FCevent.prototype.setTime     = function(time){ this.getContent().data('time',time); };
FCevent.prototype.pushContent = function($ev){
  var isJqObj = ($ev && ($ev instanceof jQuery || $ev.constructor.prototype.jquery));
  if(!isJqObj && typeof $ev === 'object') $ev = this.makeContent($ev);
  this.getEvCol().append($ev);
};
FCevent.prototype.makeContent = function(ev){
  var $el = $('<a class="fc-day-grid-event fc-h-event fc-event fc-start fc-end"></a>').data('time',ev.start);
  return $el.append('<div class="fc-content"><span class="fc-time"></span><span class="fc-title">'+ev.title+'</span></div>');
};
FCevent.prototype.popContent = function(){
  var $ev = this.getContent();
  this.getEvCol().empty();
  return $ev;
};

/**
 * Row
 *  Abstract of calendar Cell event row
 */
var Row = function($tr){
  this.$row = (typeof $tr !== 'undefined') ?  $tr :  $('<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>');
};
Row.prototype.get      = function(){ return this.$row; };
Row.prototype.getEvent = function(idx){
  console.log(idx);
  return new FCevent(this.get(),idx);
};

/**
 * Day
 *  full Day Cell abstract on calendar
 *  $dayCell - takes jQuery object as arg
 */
var Day = function($daycell){
  this.cell    = $daycell;
  this.evTBody = this.cell.parents('.fc-week').find('.fc-content-skeleton tbody');
  this.colIdx  = this.cell.index();
  this.evRows  = [];
};
Day.prototype.getRows   = function(){ return this.evTBody.find('tr');};
Day.prototype.buildRows = function(){
  var _this = this;
  _this.getRows().each(function(){
    _this.evRows.push(new Row($(this)));
  });
};
Day.prototype.addNewEvent = function(ev){
  if(!this.hasEvents()) return this.addEvent(this.evRows[0],ev);
  var isBeforeIndex = this.checkIsNewEvBeforeOthers(ev);

  if(!isBeforeIndex){
    var last = this.checkGetLastRow();
    return this.addEvent(last,ev);
  }
  var row = new Row();
  this.evRows.splice(isBeforeIndex, 0, row);
  return this.addEvent(row,ev);
};
Day.prototype.checkIsNewEvBeforeOthers = function(ev){
  var isBefore = false;
  var _this = this;
  $.each(_this.evRows, function(i,row){
    if(_this.isEvBefore(row,ev.start)){
      var before = i;
      return before;
    }
  });
  return isBefore;
};
Day.prototype.checkGetLastRow = function(){
  var last = this.evRows.slice(-1)[0];
  last = (typeof last === 'undefined') ? this.evRows.slice(-1)[0] : last;
  var lastEvContent = last.getEvent(this.index).getContent();
  //last row cell is not initialized
  if(lastEvContent.length !== 0){
      last = new Row();
      this.rows.push(last);
  }
  return last;
};
Day.prototype.shouldMakeNewRow = function(last,newEv){
  return (this.isEvBefore(last,newEv)) ? false:true;
};
Day.prototype.isEvBefore = function(row1,row2){
  var t1 = this.getRowTime(row1);
  var t2 = this.getRowTime(row2);
  return t1.isBefore(t2);
};
Day.prototype.sortTimes = function(){
  return this.evRows.sort(function (r1, r2)  {
    var t1 = this.getRowTime(r1);
    var t2 = this.getRowTime(r2);
    return t1 > t2 ? 1 : t1 < t2 ? -1 : 0;
  });
};
Day.prototype.getRowTime = function(r){
  var time = (typeof r === 'object') ? r.getEvent(this.index).getTime() : r;
  return moment(time);
};
Day.prototype.hasEvents  = function(){
  console.log(this.evRows);
  if(!this.hasRows()) this.buildRows();
  var ev = this.evRows[0].getEvent(this.colIdx).getEvCol();//.getEventCol() : [];
  console.log(ev);
  return (ev.length > 0) ? true : false;
};
Day.prototype.hasRows = function(){
  return (typeof this.evRows[0] === 'undefined') ? false : true;
};
Day.prototype.addEvent = function(row,ev){
  console.log(this.colIdx);
    var evnt = row.getEvent(this.colIdx);
    console.log(evnt);
    evnt.pushContent(ev);
    evnt.setTime(ev.start);
};
