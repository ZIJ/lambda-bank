(function (Backbone) {
    var root = this,
        $ = root.jQuery,
        _ = root._;
    
    Backbone.Extended = {};

    var Application = Backbone.Extended.Application = (function () {
        // Class for counting number of requests performing
        var RequestsManager = function () {
            var self = this,
                count = 0,
                xhrPool = [],
                increase = function () {
                    if (++count === 1) {
                        self.trigger("started");
                    }
                },
                decrease = function () {
                    if (count > 0 && --count === 0) {
                        self.trigger("finished");
                    }
                },
                reset = function () {
                    count = 0;
                    self.trigger("finished");
                };
            
            this.getValue = function () {
                return count;
            };
            
            this.abortAll = function () {
                _.each(xhrPool, function (jqXHR) {
                    jqXHR.abort();
                });
                xhrPool = [];
                reset();
            };

            $(document).ajaxSend(function (e, jqXHR) {
                increase();
                xhrPool.push(jqXHR);
            });
            $(document).ajaxComplete(function (e, jqXHR) {
                decrease();
                var index = xhrPool.indexOf(jqXHR);
                if (index !== -1) {
                    xhrPool.splice(index, 1);
                }
            });
        };
        
        _.extend(RequestsManager.prototype, Backbone.Events, {});

        return function (options) {
            var app = this;

            app.rootDirectory = options.root;
            if (_.isFunction(options.start)) app.start = options.start;

            app.requestsManager = new RequestsManager(app);

            //copying all the additionals options passed as an app fields
            var tmp = _.extend({}, options);
            delete tmp.root;
            delete tmp.start;
            _.extend(app, tmp);
        };
    })();

    _.extend(Application.prototype, Backbone.Events, {});


    var bindingsManager = {
        bindTo: function (model, ev, callback) {
            model.on(ev, callback, this);
            this.bindings.push({ model: model, ev: ev, callback: callback });
        },
        unbindFromAll: function () {
            _.each(this.bindings, function (binding) {
                binding.model.off(binding.ev, binding.callback);
            });
            this.bindings = [];
        }
    };


    var ExtendedModel = Backbone.Extended.Model = function (attributes, options) {
        var model = this;
        model.bindings = [];
        Backbone.Model.apply(model, [attributes, options]);
    };

    _.extend(ExtendedModel.prototype, Backbone.Model.prototype, bindingsManager, {
        dispose: function () {
            var model = this;
            //disposing all the disposable attributes by their names stored in this.disposable
            if (model.disposable) {
                _.each(model.disposable, function (disposableAttributeName) {
                    if (model.get(disposableAttributeName)) model.get(disposableAttributeName).dispose();
                });
            }
            model.unbindFromAll(); // this will unbind all events that this model has bound to 
            model.unbind(); // this will unbind all listeners to events from this model. This is probably not necessary because this model will be garbage collected.            
        }
    });

    ExtendedModel.extend = function (protoProps, classProps) {
        var Model = this;

        Model = Backbone.Model.extend.apply(Model, [protoProps, classProps]);

        var load = Model.prototype.load;

        if (load) {
            Model.prototype.load = function (loadParams) {
                var model = this;
                return $.when(load.call(model, loadParams)).then(function (resolvedParams) {
                    model.trigger("loaded");
                });
            };
        }

        return Model;
    };


    var ExtendedViewModel = Backbone.Extended.ViewModel = function (attributes, options) {
        var viewModel = this;
        viewModel.bindings = [];
        Backbone.Model.apply(viewModel, [attributes, options]);
    };

    _.extend(ExtendedViewModel.prototype, Backbone.Model.prototype, bindingsManager, {
        dispose: function () {
            var viewModel = this,
                disposableAttributesNames = viewModel.disposable;
            //disposing all the sub-models by their names stored in this.disposable
            if (disposableAttributesNames) {
                _.each(disposableAttributesNames, function (disposableAttributeName) {
                    var disposableAttribute = viewModel.get(disposableAttributeName);
                    if (disposableAttribute) {
                        disposableAttribute.dispose();
                    }
                });
            }
            viewModel.trigger("disposeRequest");
            viewModel.unbindFromAll(); // this will unbind all events that this model has bound to 
            viewModel.unbind(); // this will unbind all listeners to events from this model. This is probably not necessary because this model will be garbage collected.            
        }
    });

    ExtendedViewModel.extend = function (protoProps, classProps) {
        var ViewModel = this;

        ViewModel = Backbone.Model.extend.apply(ViewModel, [protoProps, classProps]);

        var load = ViewModel.prototype.load,
            set = ViewModel.prototype.set;

        ViewModel.prototype._set = set; // saving link to Backbone.Model.prototype.set method

        ViewModel.prototype.set = function (params) {
            var viewModel = this;
            _.each(params, function (value, key) {
                var viewModelAttribute = viewModel.get(key);
                if (viewModelAttribute && viewModelAttribute.dispose) {
                    viewModelAttribute.dispose();
                }
            });
            set.call(this, params);
        };

        if (load) {
            ViewModel.prototype.load = function (loadParams) {
                var viewModel = this;
                return $.when(load.call(viewModel, loadParams)).then(function (resolvedParams) {
                    viewModel.trigger("loaded");
                });
            };
        }

        return ViewModel;
    };


    var ExtendedCollection = Backbone.Extended.Collection = function (models, options) {
        var collection = this;
        collection.bindings = [];
        Backbone.Collection.apply(collection, [models, options]);
    };

    _.extend(ExtendedCollection.prototype, Backbone.Collection.prototype, bindingsManager, {
        dispose: function () {
            var collection = this;
            collection.each(function (model) {
                if (model) {
                    model.dispose();
                }
            });
            collection.unbindFromAll(); // this will unbind all events that this collection has bound to 
            collection.unbind(); // this will unbind all listeners to events from this collection. This is probably not necessary because this collection will be garbage collected.            
        },
        _prepareModel: function (model, options) {
            options || (options = {});
            var collection = this;
            if (!((model instanceof Backbone.Model) || (model instanceof ExtendedModel) || (model instanceof ExtendedViewModel))) {
                var attrs = model;
                options.collection = collection;
                model = new collection.model(attrs, options);
                if (!model._validate(model.attributes, options)) model = false;
            } else if (!model.collection) {
                model.collection = collection;
            }
            return model;
        }
    });

    ExtendedCollection.extend = function (protoProps, classProps) {
        var Collection = this;

        Collection = Backbone.Model.extend.apply(Collection, [protoProps, classProps]);
        
        return Collection;
    };


    // Global cache for templates
    var JST = root.JST = root.JST || {};

    var ExtendedView = Backbone.Extended.View = function (options) {
        var view = this;
        view.bindings = [];
        Backbone.View.apply(view, [options]);
        //TODO: check if view.model passed
        view.bindTo(view.model, "loaded", function () {
            view.render();
        });
    };

    _.extend(ExtendedView.prototype, Backbone.View.prototype, bindingsManager, {
        setSubViews: function (params) {
            var view = this;
            _.each(params, function (value, key) {
                if (view[key]) {
                    view[key].dispose();
                }
                view[key] = value;
            });
        },
        dispose: function () {
            var view = this;
            //disposing all the sub-views (or sub-arrays of them) by their names stored in this.disposable
            if (view.disposable) {
                _.each(view.disposable, function (disposableElementName) {
                    var disposableElement = view[disposableElementName];
                    if (disposableElement) {
                        if (_.isArray(disposableElement)) {
                            _.each(disposableElement, function (value) {
                                value.dispose();
                            });
                        } else {
                            disposableElement.dispose();
                        }
                    }
                });
            }
            view.trigger("disposeRequest");
            view.unbindFromAll(); // this will unbind all events that this view has bound to 
            view.unbind(); // this will unbind all listeners to events from this view. This is probably not necessary because this view will be garbage collected.
            view.$el.remove(); // removes this.el from the DOM and removes DOM events.            
        },
        //NOTE: This function should be followed BY JQUERY.THEN 
        fetchTemplate: function () {
            var view = this,
                def = new $.Deferred(),
                app = view.app,
                path = view.template;

            // Instant synchronous way of getting the template, if it exists in the JST object.
            if (JST[path]) {
                return def.resolve(JST[path]);
            }

            // Fetch it asynchronously if not available from JST, ensure that
            // template requests are never cached and prevent global ajax event
            // handlers from firing.
            $.ajax({
                url: app.rootDirectory + path,
                type: "get",
                dataType: "text",
                cache: false,
                global: false,
                success: function (contents) {
                    JST[path] = _.template(contents);
                    def.resolve(JST[path]);
                },
                error: function () {
                    def.resolve();
                }
            });

            return def.promise();
        }
    });

    ExtendedView.extend = function (protoProps, classProps) {
        var View = Backbone.View.extend.apply(this, [protoProps, classProps]),
            render = View.prototype.render;

//        if (render) {
//            View.prototype.render = function () {
//                var view = this;
//                return $.when(render.call(view)).then(function () {
//                    view.$el.disableSelection();
//                });
//            };
//        }

        return View;
    };

})(Backbone);