
Js.Dash.form = function (container) {
  var elements = container.querySelectorAll('input');

  Array.prototype.forEach.call(elements, function (el, i) {
    el.addEventListener('focus', function (){
      Js._addClass(el.parentNode, 'has-focus');
    });

    el.addEventListener('blur', function (){
      Js._removeClass(el.parentNode, 'has-focus');
    });
  });

  setInterval(function(){
    Array.prototype.forEach.call(elements, function(el, i){
      if(el.value) {
        Js._addClass(el.parentNode, 'has-content');
      } else {
        Js._removeClass(el.parentNode, 'has-content');
      }
    });
  }, 100);
};
