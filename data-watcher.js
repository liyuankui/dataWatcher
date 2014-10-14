/*
 * @author kyle
 * This tool can be used to implement two-way binding.
 */
(function() {

  DataWatcher = function() {
    this.watch = function(DOMelement, propertyName) {
      var _watcher = this;
      $(DOMelement).on("change input propertyChange", function(e) {
        e.preventDefault();
        _watcher[propertyName] = DOMelement.val();
      });
    };

    //TODO support keypath
    var findValue = function(keypath) {

    };

    var callbackList = [];
    this.addCallback = function(propertyName, callback, context) {
      callbackList[propertyName] = callbackList[propertyName] || [];
      var list = callbackList[propertyName];
      list.push({cbk : callback, ctx : context});
      var obj = this;
      obj.__watchCallback(propertyName, list);
    };
  };

  Object.defineProperty(DataWatcher.prototype, "__watchCallback", {
    enumerable : false,
    configurable : true,
    writable : false,
    value : function(prop, handlers) {
      var val = this[prop], getter = function() {
        return val;
      }, setter = function(newval) {
        val = newval;
        for (var i = 0; i < handlers.length; i++) {
          handlers[i].cbk.call(handlers[i].ctx || this, prop, newval);
        }
        return newval;
      };
      if (delete this[prop]) {
        Object.defineProperty(this, prop, {
          get : getter,
          set : setter,
          enumerable : true,
          configurable : true
        });
      }
    }
  });
})();
