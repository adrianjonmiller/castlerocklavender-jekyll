
Js.Dash.form = function (container) {
  var elements = container.querySelectorAll('input');
  console.log(elements);


  Array.prototype.forEach.call(elements, function (el, i) {
    var parent = Js._closest(el, 'fieldset');
    el.addEventListener('focus', function (){
      Js._addClass(parent, 'has-focus');
    });

    el.addEventListener('blur', function (){
      Js._removeClass(parent, 'has-focus');
    });
  })

  // setInterval(function(){
  //   Array.prototype.forEach.call(elements, function(el, i){
  //     var className = "has-content";
  //     Js._addClass(el, 'has-focus');
  //
  //     // if(el === ) {
  //     //   var parent = Js._clostest(el, 'fieldset');
  //     //   console.log(parent)
  //     // }
  //
  //     if(el.value) {
  //       if (el.classList)
  //         el.classList.add(className);
  //       else
  //         el.className += ' ' + className;
  //     } else {
  //       if (el.classList)
  //         el.classList.remove(className);
  //       else
  //         el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
  //     }
  //   });
  // }, 100);
}
