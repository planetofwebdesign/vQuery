(function (scope, isForgiven) {
    var version = '1.000';
    var doc = scope.document;
    var q;
    var vQuery = function (selector, context) {
        return q.query(selector, context);
    };

    vQuery.ready(function () {
        if ('jQuery' in scope) {
            q = QueryFacade.create(jQueryAdaptor, scope.jQuery, doc);
            vQuery.start();
        } else {
            throw new Error('Jquery is required for thsi library to work');
        }
    });


    vQuery.version = function () {
        return version;
    };

    vQuery.start = function () {};

    vQuery.ready = function (fun) {
        var last = scope.onload;
        var isReady = false;

        if (doc.addEventListener) {
            doc.addEventListener('DOMContentLoaded', function () {
                console.log('dom is loaded');
                isReady = true;
                fun();
            });
        }

        window.onload = function () {
            if (last) {
                last();
            }

            if (!isReady) {
                fun();
            }
        };
    };

    var QueryFacade = function (adapter) {
        var dom = function () {
                return adapter.context;
            },
            text = function (val) {
                return adapter.text(val)
            },
            query = function (selector, context) {
                return QueryFacade(adapter.query(selector, context));
            };

        return {
            dom: dom,
            query: query,
            text: text
        };
    };

    QueryFacade.create = function (adapter, lib, context) {
        return QueryFacade(new adapter(lib, context));
    };

    var jQueryAdaptor = function (lib, context) {
        this.lib = lib;
        this.context = context;
        this.target = lib(context);
    };

    jQueryAdaptor.prototype.query = function (selector, context) {
        context = context || doc;
        return new jQueryAdaptor(this.lib, this.lib(selector, context).get());
        // return this.lib(selector, context);
    };

    jQueryAdaptor.prototype.text = function (val) {
        return this.target.text(val);
    };


 


    if (!scope.vQuery) {
        scope.vQuery = vQuery;
    } else {
        if (isForgiven && scope.vQuery) {
            scope.vQuery = scope.vQuery.version() > version ? scope.vQuery : vQuery;
        } else {
            throw new Error('One bversion is already loaded');
        }
    }

}(window, true))