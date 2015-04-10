window.addEventListener('load', function() {
  function toInnerText(dom) { return function(text) { dom.innerText = text; } }
  function toInnerTextById(id) { return toInnerText(document.getElementById(id)); }

  var clickStream = Rx.Observable.fromEvent(window, 'touchstart')
    .merge(Rx.Observable.fromEvent(window, 'mousedown'));

  // Click Count
  var clickCountStream = clickStream
    .select(function(_) { return 1; })
    .scan(function(total, one) { return total + one; });
  clickCountStream.subscribe(toInnerTextById('result-count'));

  // Current TPS / Max TPS
  var tpsStream = clickStream
    .timeInterval()
    .skip(1)
    .pluck('interval')
    .windowWithCount(10, 3)
    .selectMany(function(intervals) { return intervals.average(); })
    .map(function(interval) { return 1000 / interval; })
    .map(function(interval) { return Math.floor(interval * 100) / 100; });
  tpsStream.subscribe(toInnerTextById('result-tps-current'));
  tpsStream.scan(Math.max).subscribe(toInnerTextById('result-tps-max'));

  // Total TPS
  var tpsCountStream = tpsStream
    .select(function(_) { return 1; })
    .scan(function(total, one) { return total + one; });
  var tpsTotalStream = tpsStream
    .zip(tpsCountStream, function(tps, count) { return { tps: tps, count: count }; })
    .scan(0, function(average, x) { return (average * (x.count - 1) + x.tps) / x.count; })
    .map(function(v) { return Math.floor(v * 100) / 100; });
  tpsTotalStream.subscribe(toInnerTextById('result-tps-total'));
});
