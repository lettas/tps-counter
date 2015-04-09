window.addEventListener('load', function() {
  var clickStream = Rx.Observable.fromEvent(window, 'mousedown');

  var tpsResult = document.getElementById('tps-result');
  var tpsStream = clickStream
    .timeInterval()
    .skip(1)
    .pluck('interval')
    .windowWithCount(10, 3)
    .selectMany(function(intervals) { return intervals.average(); })
    .map(function(interval) { return Math.floor(1000 * 100 / interval) / 100; });
  tpsStream.subscribe(function(tps) { tpsResult.innerText = tps; });

  var countResult = document.getElementById('count-result');
  var countStream = clickStream
    .select(function(_) { return 1; })
    .scan(function(total, one) { return total + one; });
  countStream.subscribe(function(count) { countResult.innerText = count; });
});
