var Js = window.Js || {};
Js.Dash = {};

// Ready function
Js.Ready = function(fn) {
  if (document.readyState != 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

// Loops through the data-behavior creates a instance of a function based the values it finds
Js.Init = function (context) {
  if (!context) {
    context = document;
  }

  // Elements Loop
  var elements = context.querySelectorAll('[class*="js-"]');
  if(elements.length != 0) {
    for(i=0; i<elements.length; i++) {
      var element = elements[i];
      var behaviors = element.getAttribute('class').split(' ');
      for(j=0; j<behaviors.length; j++) {
        var behavior = behaviors[j];
        if(behavior.startsWith("js-")) {
          behavior = behavior.substring("js-".length);

          if(!element[behavior]) {
            try {
              if(Js.Dash[behavior]) {
                element[behavior] = new Js.Dash[behavior](element);
              }
            } catch (e) {
              console.log(e.stack);
            }
          }
        }
      }
    }
  }
}

// Render content
Js._render = function(view, d){
  var range = document.createRange();
  var frag = range.createContextualFragment(d);
  Js.Init(frag);

  if(view.hasChildNodes())
    view.innerHTML = "";

  view.appendChild(frag);
}

// HTTP Request
Js._request = function(type, url, cb) {
  var request = new XMLHttpRequest();
  request.open(type, url, true);

  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      if( typeof cb === 'function' ) {
        cb(request.responseText);
      }
    } else {
      console.log(request);
    }
  };

  request.onerror = function(errorMsg) {
    console.log(errorMsg);
  };

  request.send();
}

// Check if has a class
Js._hasClass = function(el, className) {
  if (el.classList)
    return el.classList.contains(className)
  else
    return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
}

// Add a class
Js._addClass = function(el, className) {
  if (el.classList)
    el.classList.add(className)
  else if (!hasClass(el, className)) el.className += " " + className
}

// Remove a class
Js._removeClass = function(el, className) {
  if (el.classList)
    el.classList.remove(className)
  else if (hasClass(el, className)) {
    var reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
    el.className=el.className.replace(reg, ' ')
  }
}

// Find Closest Element
Js._closest = function(el, selector) {
    var matchesFn;

    // find vendor prefix
    ['matches','webkitMatchesSelector','mozMatchesSelector','msMatchesSelector','oMatchesSelector'].some(function(fn) {
        if (typeof document.body[fn] == 'function') {
            matchesFn = fn;
            return true;
        }
        return false;
    })

    var parent;

    // traverse parents
    while (el) {
        parent = el.parentElement;
        if (parent && parent[matchesFn](selector)) {
            return parent;
        }
        el = parent;
    }

    return null;
}


// Runs Init after DOM Ready
Js.Ready(function(){
  var start = +new Date();
  Js.Init();
  var end =  +new Date();  // log end timestamp
  var diff = end - start;
  console.log("Scripts executed in " + diff/1000 + " seconds.");
});
