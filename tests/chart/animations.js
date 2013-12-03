
(function() {
    var dataviz = kendo.dataviz,
        Box2D = dataviz.Box2D,
        Point2D = dataviz.Point2D;

    var SIZE = 100,
        anim,
        rect;

    function createAnim(options) {
        rect = {
            points: [
                new Point2D(0, 0),
                new Point2D(10, 0),
                new Point2D(10, 10),
                new Point2D(0, 10)
            ],
            options: {
                id: "id",
                vertical: true
            },
            refresh: function() {
            },
            clone: function() {
                return this;
            },
            destroy: function() {}
        };
        anim = new dataviz.ExpandAnimation(
            rect,
            $.extend({ size: SIZE, duration: 50 }, options)
        );
    }

    // ------------------------------------------------------------
    module("ExpandAnimation", {
        setup: function() {
            createAnim();
        }
    });

    test("setup shrinks rectangle", function() {
        anim.setup();
        deepEqual([rect.points[1].x, rect.points[2].x], [0, 0]);
    });

    asyncTest("expands rectangle right", function() {
        anim.setup();
        anim.play();

        setTimeout(function() {
            equal(rect.points[1].x, SIZE);
            equal(rect.points[2].x, SIZE);
            start();
        }, 100);
    });

    asyncTest("refreshes DOM element", function() {
        var success = false;

        rect.refresh = function() { success = true; };
        anim.setup();
        anim.play();

        setTimeout(function() {
            ok(success);
            start();
        }, 100);
    });

    asyncTest("executes destroy when complete", 2, function() {
        anim.setup();
        anim.play();

        var destroyed = false;
        anim.destroy = function() { destroyed = true; };

        ok(!destroyed);
        setTimeout(function() {
            ok(destroyed);
            start();
        }, 100);
    });

})();

(function() {
    var dataviz = kendo.dataviz,
        Box2D = dataviz.Box2D,
        Point2D = dataviz.Point2D;

    var view,
        rect,
        decorator;

    // ------------------------------------------------------------
    module("BarAnimationDecorator", {
        setup: function() {
            view = new dataviz.SVGView({ transitions: true });
            rect = new dataviz.SVGPath({
                animation: {
                    type: "bar"
                },
                options: {
                    id: "id"
                },
                aboveAxis: true
            });
            decorator = new dataviz.BarAnimationDecorator(view);
        }
    });

    test("registers bar animation", function() {
        decorator.decorate(rect);
        ok(view.animations[0] instanceof dataviz.BarAnimation);
    });

    test("does not decorate when view.options.transitions is false", function() {
        view.options.transitions = false;
        decorator.decorate(rect);
        equal(view.animations.length, 0);
    });

})();

(function() {
    var dataviz = kendo.dataviz,
        Box2D = dataviz.Box2D,
        Point2D = dataviz.Point2D;

    var SIZE = 100,
        anim,
        rect;

    function createAnim(rectOptions) {
        rect = {
            points: [
                new Point2D(0, 0),
                new Point2D(10, 0),
                new Point2D(10, 10),
                new Point2D(0, 10)
            ],
            options: $.extend({
                id: "id",
                vertical: true,
                aboveAxis: true
            }, rectOptions),
            refresh: function() {
            },
            clone: function() {
                return this;
            }
        };
        anim = new dataviz.BarAnimation(rect, { duration: 50 });
    }

    // ------------------------------------------------------------
    module("BarAnimation", {
        setup: function() {
            createAnim();
        }
    });

    test("setup collapses rect onto stackBase (vertical bars)", function() {
        createAnim({ stackBase: 10 });
        anim.setup();

        equal(rect.points[0].y, 10);
        equal(rect.points[1].y, 10);
        equal(rect.points[2].y, 10);
        equal(rect.points[3].y, 10);
    });

    test("setup collapses rect onto stackBase (horizontal bars)", function() {
        createAnim({ stackBase: 10, vertical: false });
        anim.setup();

        equal(rect.points[0].x, 10);
        equal(rect.points[1].x, 10);
        equal(rect.points[2].x, 10);
        equal(rect.points[3].x, 10);
    });

    test("setup shrinks rect onto base (horizontal bars above axis)", function() {
        createAnim({ vertical: false });
        anim.setup();

        equal(rect.points[1].x, 0);
        equal(rect.points[2].x, 0);
    });

    test("setup shrinks rect onto base (horizontal bars below axis)", function() {
        createAnim({ vertical: false, aboveAxis: false });
        anim.setup();

        equal(rect.points[0].x, 10);
        equal(rect.points[3].x, 10);
    });

    test("setup shrinks rect onto base (vertical bars above axis)", function() {
        createAnim();
        anim.setup();

        equal(rect.points[0].y, 10);
        equal(rect.points[1].y, 10);
    });

    test("setup shrinks rect onto base (vertical bars below axis)", function() {
        createAnim({ aboveAxis: false });
        anim.setup();

        equal(rect.points[2].y, 0);
        equal(rect.points[3].y, 0);
    });

    asyncTest("animates top edge to final position", function() {
        createAnim();
        anim.setup();
        anim.play();

        setTimeout(function() {
            equal(rect.points[0].y, 0);
            equal(rect.points[1].y, 0);

            start();
        }, 100);
    });

    asyncTest("animates right edge to final position", function() {
        createAnim({ vertical: false });
        anim.setup();
        anim.play();

        setTimeout(function() {
            equal(rect.points[1].x, 10);
            equal(rect.points[2].x, 10);

            start();
        }, 100);
    });

    asyncTest("animates bottom edge to final position", function() {
        createAnim({ aboveAxis: false });
        anim.setup();
        anim.play();

        setTimeout(function() {
            equal(rect.points[2].y, 10);
            equal(rect.points[3].y, 10);

            start();
        }, 100);
    });

    asyncTest("animates left edge to final position", function() {
        createAnim({ vertical: false, aboveAxis: false });
        anim.setup();
        anim.play();

        setTimeout(function() {
            equal(rect.points[0].x, 0);
            equal(rect.points[3].x, 0);

            start();
        }, 100);
    });

})();

(function() {
    var dataviz = kendo.dataviz,
        Box2D = dataviz.Box2D,
        Point2D = dataviz.Point2D;

    var view,
        sector,
        decorator;

    // ------------------------------------------------------------
    module("PieAnimationDecorator", {
        setup: function() {
            view = new dataviz.SVGView({ transitions: true });
            sector = {
                options: $.extend({
                    id: "id",
                    aboveAxis: true,
                    animation: {
                        type: "pie"
                    }
                }),
                refresh: function() {
                },
                clone: function() {
                    return this;
                }
            };
            decorator = new dataviz.PieAnimationDecorator(view);
        }
    });

    test("registers pie animation", function() {
        decorator.decorate(sector);
        ok(view.animations[0] instanceof dataviz.PieAnimation);
    });

    test("deos not registers pie animation when transitions are disabled", function() {
        view.options.transitions = false;
        decorator.decorate(sector);
        equal(view.animations.length, 0);
    });

})();

(function() {
    var dataviz = kendo.dataviz,
        Box2D = dataviz.Box2D,
        Point2D = dataviz.Point2D;

    var SIZE = 100,
        anim,
        sector;

    function createAnim() {
        sector = {
            config: {
                r: SIZE
            },
            options: {
                id: "id",
                aboveAxis: true
            },
            refresh: function() {
            },
            clone: function() {
                return this;
            }
        };
        anim = new dataviz.PieAnimation(sector, { duration: 50 });
    }

    // ------------------------------------------------------------
    module("PieAnimation", {
        setup: function() {
            createAnim();
        }
    });

    test("setup sets radius 0", function() {
        anim.setup();
        equal(sector.config.r, 0);
    });

    asyncTest("animates radius to final size", function() {
        anim.setup();
        anim.play();

        setTimeout(function() {
            equal(sector.config.r, SIZE);

            start();
        }, 100);
    });

})();

(function() {
    var dataviz = kendo.dataviz,
        Box2D = dataviz.Box2D,
        Point2D = dataviz.Point2D;

    var view,
        rect,
        decorator;

    // ------------------------------------------------------------
    module("FadeAnimationDecorator", {
        setup: function() {
            view = new dataviz.SVGView({ transitions: true });
            rect = {
                options: {
                    id: "id",
                    animation: {
                        type: "fadeIn"
                    }
                },
                refresh: function() {
                },
                clone: function() {
                    return this;
                }
            };
            decorator = new dataviz.FadeAnimationDecorator(view);
        }
    });

    test("registers fade animation", function() {
        decorator.decorate(rect);
        ok(view.animations[0] instanceof dataviz.FadeAnimation);
    });

    test("deos not registers fade animation when transitions are disabled", function() {
        view.options.transitions = false;
        decorator.decorate(rect);
        equal(view.animations.length, 0);
    });

})();

(function() {
    var dataviz = kendo.dataviz,
        Box2D = dataviz.Box2D,
        Point2D = dataviz.Point2D;

    var SIZE = 100,
        OPACITY = 0.5,
        anim,
        rect;

    function createAnim() {
        rect = {
            options: {
                id: "id",
                animation: {
                    type: "fadeIn"
                },
                fillOpacity: OPACITY,
                strokeOpacity: OPACITY
            },
            refresh: function() {
            },
            clone: function() {
                return this;
            }
        };
        anim = new dataviz.FadeAnimation(rect, { duration: 50 });
    }

    // ------------------------------------------------------------
    module("FadeAnimation", {
        setup: function() {
            createAnim();
        }
    });

    test("setup sets fillOpacity to 0", function() {
        anim.setup();
        equal(rect.options.fillOpacity, 0);
    });

    test("setup sets strokeOpacity to 0", function() {
        anim.setup();
        equal(rect.options.strokeOpacity, 0);
    });

    asyncTest("animates fillOpacity", function() {
        anim.setup();
        anim.play();

        setTimeout(function() {
            equal(rect.options.fillOpacity, OPACITY);

            start();
        }, 100);
    });

    asyncTest("animates strokeOpacity", function() {
        anim.setup();
        anim.play();

        setTimeout(function() {
            equal(rect.options.strokeOpacity, OPACITY);

            start();
        }, 100);
    });

})();
