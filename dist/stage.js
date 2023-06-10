var dt = Object.defineProperty;
var vt = (t, i, e) => i in t ? dt(t, i, { enumerable: !0, configurable: !0, writable: !0, value: e }) : t[i] = e;
var p = (t, i, e) => (vt(t, typeof i != "symbol" ? i + "" : i, e), e);
const P = {
  create: 0,
  tick: 0,
  node: 0,
  draw: 0,
  fps: 0
};
class j {
  constructor(i, e, s, n, r, h) {
    this.reset(i, e, s, n, r, h);
  }
  toString() {
    return "[" + this.a + ", " + this.b + ", " + this.c + ", " + this.d + ", " + this.e + ", " + this.f + "]";
  }
  clone() {
    return new j(this.a, this.b, this.c, this.d, this.e, this.f);
  }
  reset(i, e, s, n, r, h) {
    return this._dirty = !0, typeof i == "object" ? (this.a = i.a, this.d = i.d, this.b = i.b, this.c = i.c, this.e = i.e, this.f = i.f) : (this.a = i || 1, this.d = n || 1, this.b = e || 0, this.c = s || 0, this.e = r || 0, this.f = h || 0), this;
  }
  identity() {
    return this._dirty = !0, this.a = 1, this.b = 0, this.c = 0, this.d = 1, this.e = 0, this.f = 0, this;
  }
  rotate(i) {
    if (!i)
      return this;
    this._dirty = !0;
    var e = i ? Math.cos(i) : 1, s = i ? Math.sin(i) : 0, n = e * this.a - s * this.b, r = e * this.b + s * this.a, h = e * this.c - s * this.d, _ = e * this.d + s * this.c, o = e * this.e - s * this.f, l = e * this.f + s * this.e;
    return this.a = n, this.b = r, this.c = h, this.d = _, this.e = o, this.f = l, this;
  }
  translate(i, e) {
    return !i && !e ? this : (this._dirty = !0, this.e += i, this.f += e, this);
  }
  scale(i, e) {
    return !(i - 1) && !(e - 1) ? this : (this._dirty = !0, this.a *= i, this.b *= e, this.c *= i, this.d *= e, this.e *= i, this.f *= e, this);
  }
  skew(i, e) {
    if (!i && !e)
      return this;
    this._dirty = !0;
    var s = this.a + this.b * i, n = this.b + this.a * e, r = this.c + this.d * i, h = this.d + this.c * e, _ = this.e + this.f * i, o = this.f + this.e * e;
    return this.a = s, this.b = n, this.c = r, this.d = h, this.e = _, this.f = o, this;
  }
  concat(i) {
    this._dirty = !0;
    var e = this, s = e.a * i.a + e.b * i.c, n = e.b * i.d + e.a * i.b, r = e.c * i.a + e.d * i.c, h = e.d * i.d + e.c * i.b, _ = e.e * i.a + i.e + e.f * i.c, o = e.f * i.d + i.f + e.e * i.b;
    return this.a = s, this.b = n, this.c = r, this.d = h, this.e = _, this.f = o, this;
  }
  inverse() {
    if (this._dirty) {
      this._dirty = !1, this.inverted = this.inverted || new j();
      var i = this.a * this.d - this.b * this.c;
      this.inverted.a = this.d / i, this.inverted.b = -this.b / i, this.inverted.c = -this.c / i, this.inverted.d = this.a / i, this.inverted.e = (this.c * this.f - this.e * this.d) / i, this.inverted.f = (this.e * this.b - this.a * this.f) / i;
    }
    return this.inverted;
  }
  map(i, e) {
    return e = e || {}, e.x = this.a * i.x + this.c * i.y + this.e, e.y = this.b * i.x + this.d * i.y + this.f, e;
  }
  mapX(i, e) {
    return typeof i == "object" && (e = i.y, i = i.x), this.a * i + this.c * e + this.e;
  }
  mapY(i, e) {
    return typeof i == "object" && (e = i.y, i = i.x), this.b * i + this.d * e + this.f;
  }
}
var d = 0;
function X(t) {
  this._owner = t, this._parent = null, this._relativeMatrix = new j(), this._absoluteMatrix = new j(), this.reset();
}
X.prototype.reset = function() {
  this._textureAlpha = 1, this._alpha = 1, this._width = 0, this._height = 0, this._scaleX = 1, this._scaleY = 1, this._skewX = 0, this._skewY = 0, this._rotation = 0, this._pivoted = !1, this._pivotX = null, this._pivotY = null, this._handled = !1, this._handleX = 0, this._handleY = 0, this._aligned = !1, this._alignX = 0, this._alignY = 0, this._offsetX = 0, this._offsetY = 0, this._boxX = 0, this._boxY = 0, this._boxWidth = this._width, this._boxHeight = this._height, this._ts_translate = ++d, this._ts_transform = ++d, this._ts_matrix = ++d;
};
X.prototype._update = function() {
  return this._parent = this._owner._parent && this._owner._parent._pin, this._handled && this._mo_handle != this._ts_transform && (this._mo_handle = this._ts_transform, this._ts_translate = ++d), this._aligned && this._parent && this._mo_align != this._parent._ts_transform && (this._mo_align = this._parent._ts_transform, this._ts_translate = ++d), this;
};
X.prototype.toString = function() {
  return this._owner + " (" + (this._parent ? this._parent._owner : null) + ")";
};
X.prototype.absoluteMatrix = function() {
  this._update();
  var t = Math.max(
    this._ts_transform,
    this._ts_translate,
    this._parent ? this._parent._ts_matrix : 0
  );
  if (this._mo_abs == t)
    return this._absoluteMatrix;
  this._mo_abs = t;
  var i = this._absoluteMatrix;
  return i.reset(this.relativeMatrix()), this._parent && i.concat(this._parent._absoluteMatrix), this._ts_matrix = ++d, i;
};
X.prototype.relativeMatrix = function() {
  this._update();
  var t = Math.max(
    this._ts_transform,
    this._ts_translate,
    this._parent ? this._parent._ts_transform : 0
  );
  if (this._mo_rel == t)
    return this._relativeMatrix;
  this._mo_rel = t;
  var i = this._relativeMatrix;
  if (i.identity(), this._pivoted && i.translate(-this._pivotX * this._width, -this._pivotY * this._height), i.scale(this._scaleX, this._scaleY), i.skew(this._skewX, this._skewY), i.rotate(this._rotation), this._pivoted && i.translate(this._pivotX * this._width, this._pivotY * this._height), this._pivoted)
    this._boxX = 0, this._boxY = 0, this._boxWidth = this._width, this._boxHeight = this._height;
  else {
    var e, s;
    i.a > 0 && i.c > 0 || i.a < 0 && i.c < 0 ? (e = 0, s = i.a * this._width + i.c * this._height) : (e = i.a * this._width, s = i.c * this._height), e > s ? (this._boxX = s, this._boxWidth = e - s) : (this._boxX = e, this._boxWidth = s - e), i.b > 0 && i.d > 0 || i.b < 0 && i.d < 0 ? (e = 0, s = i.b * this._width + i.d * this._height) : (e = i.b * this._width, s = i.d * this._height), e > s ? (this._boxY = s, this._boxHeight = e - s) : (this._boxY = e, this._boxHeight = s - e);
  }
  return this._x = this._offsetX, this._y = this._offsetY, this._x -= this._boxX + this._handleX * this._boxWidth, this._y -= this._boxY + this._handleY * this._boxHeight, this._aligned && this._parent && (this._parent.relativeMatrix(), this._x += this._alignX * this._parent._width, this._y += this._alignY * this._parent._height), i.translate(this._x, this._y), this._relativeMatrix;
};
X.prototype.get = function(t) {
  if (typeof nt[t] == "function")
    return nt[t](this);
};
X.prototype.set = function(t, i) {
  if (typeof t == "string")
    typeof V[t] == "function" && typeof i < "u" && V[t](this, i);
  else if (typeof t == "object")
    for (i in t)
      typeof V[i] == "function" && typeof t[i] < "u" && V[i](this, t[i], t);
  return this._owner && (this._owner._ts_pin = ++d, this._owner.touch()), this;
};
var nt = {
  alpha: function(t) {
    return t._alpha;
  },
  textureAlpha: function(t) {
    return t._textureAlpha;
  },
  width: function(t) {
    return t._width;
  },
  height: function(t) {
    return t._height;
  },
  boxWidth: function(t) {
    return t._boxWidth;
  },
  boxHeight: function(t) {
    return t._boxHeight;
  },
  // scale : function(pin) {
  // },
  scaleX: function(t) {
    return t._scaleX;
  },
  scaleY: function(t) {
    return t._scaleY;
  },
  // skew : function(pin) {
  // },
  skewX: function(t) {
    return t._skewX;
  },
  skewY: function(t) {
    return t._skewY;
  },
  rotation: function(t) {
    return t._rotation;
  },
  // pivot : function(pin) {
  // },
  pivotX: function(t) {
    return t._pivotX;
  },
  pivotY: function(t) {
    return t._pivotY;
  },
  // offset : function(pin) {
  // },
  offsetX: function(t) {
    return t._offsetX;
  },
  offsetY: function(t) {
    return t._offsetY;
  },
  // align : function(pin) {
  // },
  alignX: function(t) {
    return t._alignX;
  },
  alignY: function(t) {
    return t._alignY;
  },
  // handle : function(pin) {
  // },
  handleX: function(t) {
    return t._handleX;
  },
  handleY: function(t) {
    return t._handleY;
  }
}, V = {
  alpha: function(t, i) {
    t._alpha = i;
  },
  textureAlpha: function(t, i) {
    t._textureAlpha = i;
  },
  width: function(t, i) {
    t._width_ = i, t._width = i, t._ts_transform = ++d;
  },
  height: function(t, i) {
    t._height_ = i, t._height = i, t._ts_transform = ++d;
  },
  scale: function(t, i) {
    t._scaleX = i, t._scaleY = i, t._ts_transform = ++d;
  },
  scaleX: function(t, i) {
    t._scaleX = i, t._ts_transform = ++d;
  },
  scaleY: function(t, i) {
    t._scaleY = i, t._ts_transform = ++d;
  },
  skew: function(t, i) {
    t._skewX = i, t._skewY = i, t._ts_transform = ++d;
  },
  skewX: function(t, i) {
    t._skewX = i, t._ts_transform = ++d;
  },
  skewY: function(t, i) {
    t._skewY = i, t._ts_transform = ++d;
  },
  rotation: function(t, i) {
    t._rotation = i, t._ts_transform = ++d;
  },
  pivot: function(t, i) {
    t._pivotX = i, t._pivotY = i, t._pivoted = !0, t._ts_transform = ++d;
  },
  pivotX: function(t, i) {
    t._pivotX = i, t._pivoted = !0, t._ts_transform = ++d;
  },
  pivotY: function(t, i) {
    t._pivotY = i, t._pivoted = !0, t._ts_transform = ++d;
  },
  offset: function(t, i) {
    t._offsetX = i, t._offsetY = i, t._ts_translate = ++d;
  },
  offsetX: function(t, i) {
    t._offsetX = i, t._ts_translate = ++d;
  },
  offsetY: function(t, i) {
    t._offsetY = i, t._ts_translate = ++d;
  },
  align: function(t, i) {
    this.alignX(t, i), this.alignY(t, i);
  },
  alignX: function(t, i) {
    t._alignX = i, t._aligned = !0, t._ts_translate = ++d, this.handleX(t, i);
  },
  alignY: function(t, i) {
    t._alignY = i, t._aligned = !0, t._ts_translate = ++d, this.handleY(t, i);
  },
  handle: function(t, i) {
    this.handleX(t, i), this.handleY(t, i);
  },
  handleX: function(t, i) {
    t._handleX = i, t._handled = !0, t._ts_translate = ++d;
  },
  handleY: function(t, i) {
    t._handleY = i, t._handled = !0, t._ts_translate = ++d;
  },
  resizeMode: function(t, i, e) {
    e && (i == "in" ? i = "in-pad" : i == "out" && (i = "out-crop"), H(t, e.resizeWidth, e.resizeHeight, i));
  },
  resizeWidth: function(t, i, e) {
    (!e || !e.resizeMode) && H(t, i, null);
  },
  resizeHeight: function(t, i, e) {
    (!e || !e.resizeMode) && H(t, null, i);
  },
  scaleMode: function(t, i, e) {
    e && H(t, e.scaleWidth, e.scaleHeight, i);
  },
  scaleWidth: function(t, i, e) {
    (!e || !e.scaleMode) && H(t, i, null);
  },
  scaleHeight: function(t, i, e) {
    (!e || !e.scaleMode) && H(t, null, i);
  },
  matrix: function(t, i) {
    this.scaleX(t, i.a), this.skewX(t, i.c / i.d), this.skewY(t, i.b / i.a), this.scaleY(t, i.d), this.offsetX(t, i.e), this.offsetY(t, i.f), this.rotation(t, 0);
  }
};
X.prototype.scaleTo = function(t, i, e) {
  H(this, t, i, e);
};
function H(t, i, e, s) {
  var n = typeof i == "number", r = typeof e == "number", h = typeof s == "string";
  t._ts_transform = ++d, n && (t._scaleX = i / t._width_, t._width = t._width_), r && (t._scaleY = e / t._height_, t._height = t._height_), n && r && h && (s == "out" || s == "out-crop" ? t._scaleX = t._scaleY = Math.max(t._scaleX, t._scaleY) : (s == "in" || s == "in-pad") && (t._scaleX = t._scaleY = Math.min(t._scaleX, t._scaleY)), (s == "out-crop" || s == "in-pad") && (t._width = i / t._scaleX, t._height = e / t._scaleY));
}
X._add_shortcuts = function(t) {
  t.size = function(i, e) {
    return this.pin("width", i), this.pin("height", e), this;
  }, t.width = function(i) {
    return typeof i > "u" ? this.pin("width") : (this.pin("width", i), this);
  }, t.height = function(i) {
    return typeof i > "u" ? this.pin("height") : (this.pin("height", i), this);
  }, t.offset = function(i, e) {
    return typeof i == "object" && (e = i.y, i = i.x), this.pin("offsetX", i), this.pin("offsetY", e), this;
  }, t.rotate = function(i) {
    return this.pin("rotation", i), this;
  }, t.skew = function(i, e) {
    return typeof i == "object" ? (e = i.y, i = i.x) : typeof e > "u" && (e = i), this.pin("skewX", i), this.pin("skewY", e), this;
  }, t.scale = function(i, e) {
    return typeof i == "object" ? (e = i.y, i = i.x) : typeof e > "u" && (e = i), this.pin("scaleX", i), this.pin("scaleY", e), this;
  }, t.alpha = function(i, e) {
    return this.pin("alpha", i), typeof e < "u" && this.pin("textureAlpha", e), this;
  };
};
var A = 0;
P.create = 0;
function E(t) {
  if (t && t instanceof f)
    return t;
  throw "Invalid node: " + t;
}
const N = function() {
  return new f();
};
function f() {
  P.create++, this._pin = new X(this);
}
f.prototype.matrix = function(t) {
  return t === !0 ? this._pin.relativeMatrix() : this._pin.absoluteMatrix();
};
f.prototype.pin = function(t, i) {
  if (typeof t == "object")
    return this._pin.set(t), this;
  if (typeof t == "string")
    return typeof i > "u" ? this._pin.get(t) : (this._pin.set(t, i), this);
  if (typeof t > "u")
    return this._pin;
};
f.prototype.scaleTo = function(t, i, e) {
  return typeof t == "object" && (e = i, i = t.y, t = t.x), this._pin.scaleTo(t, i, e), this;
};
X._add_shortcuts(f.prototype);
f.prototype._label = "";
f.prototype._visible = !0;
f.prototype._parent = null;
f.prototype._next = null;
f.prototype._prev = null;
f.prototype._first = null;
f.prototype._last = null;
f.prototype._attrs = null;
f.prototype._flags = null;
f.prototype.toString = function() {
  return "[" + this._label + "]";
};
f.prototype.id = function(t) {
  return this.label(t);
};
f.prototype.label = function(t) {
  return typeof t > "u" ? this._label : (this._label = t, this);
};
f.prototype.attr = function(t, i) {
  return typeof i > "u" ? this._attrs !== null ? this._attrs[t] : void 0 : ((this._attrs !== null ? this._attrs : this._attrs = {})[t] = i, this);
};
f.prototype.visible = function(t) {
  return typeof t > "u" ? this._visible : (this._visible = t, this._parent && (this._parent._ts_children = ++A), this._ts_pin = ++A, this.touch(), this);
};
f.prototype.hide = function() {
  return this.visible(!1);
};
f.prototype.show = function() {
  return this.visible(!0);
};
f.prototype.parent = function() {
  return this._parent;
};
f.prototype.next = function(t) {
  for (var i = this._next; i && t && !i._visible; )
    i = i._next;
  return i;
};
f.prototype.prev = function(t) {
  for (var i = this._prev; i && t && !i._visible; )
    i = i._prev;
  return i;
};
f.prototype.first = function(t) {
  for (var i = this._first; i && t && !i._visible; )
    i = i._next;
  return i;
};
f.prototype.last = function(t) {
  for (var i = this._last; i && t && !i._visible; )
    i = i._prev;
  return i;
};
f.prototype.visit = function(t, i) {
  var e = t.reverse, s = t.visible;
  if (!(t.start && t.start(this, i))) {
    for (var n, r = e ? this.last(s) : this.first(s); n = r; )
      if (r = e ? n.prev(s) : n.next(s), n.visit(t, i))
        return !0;
    return t.end && t.end(this, i);
  }
};
f.prototype.append = function(t, i) {
  if (Array.isArray(t))
    for (var e = 0; e < t.length; e++)
      U(this, t[e]);
  else if (typeof i < "u")
    for (var e = 0; e < arguments.length; e++)
      U(this, arguments[e]);
  else
    typeof t < "u" && U(this, t);
  return this;
};
f.prototype.prepend = function(t, i) {
  if (Array.isArray(t))
    for (var e = t.length - 1; e >= 0; e--)
      G(this, t[e]);
  else if (typeof i < "u")
    for (var e = arguments.length - 1; e >= 0; e--)
      G(this, arguments[e]);
  else
    typeof t < "u" && G(this, t);
  return this;
};
f.prototype.appendTo = function(t) {
  return U(t, this), this;
};
f.prototype.prependTo = function(t) {
  return G(t, this), this;
};
f.prototype.insertNext = function(t, i) {
  if (Array.isArray(t))
    for (var e = 0; e < t.length; e++)
      J(t[e], this);
  else if (typeof i < "u")
    for (var e = 0; e < arguments.length; e++)
      J(arguments[e], this);
  else
    typeof t < "u" && J(t, this);
  return this;
};
f.prototype.insertPrev = function(t, i) {
  if (Array.isArray(t))
    for (var e = t.length - 1; e >= 0; e--)
      K(t[e], this);
  else if (typeof i < "u")
    for (var e = arguments.length - 1; e >= 0; e--)
      K(arguments[e], this);
  else
    typeof t < "u" && K(t, this);
  return this;
};
f.prototype.insertAfter = function(t) {
  return J(this, t), this;
};
f.prototype.insertBefore = function(t) {
  return K(this, t), this;
};
function U(t, i) {
  E(i), E(t), i.remove(), t._last && (t._last._next = i, i._prev = t._last), i._parent = t, t._last = i, t._first || (t._first = i), i._parent._flag(i, !0), i._ts_parent = ++A, t._ts_children = ++A, t.touch();
}
function G(t, i) {
  E(i), E(t), i.remove(), t._first && (t._first._prev = i, i._next = t._first), i._parent = t, t._first = i, t._last || (t._last = i), i._parent._flag(i, !0), i._ts_parent = ++A, t._ts_children = ++A, t.touch();
}
function K(t, i) {
  E(t), E(i), t.remove();
  var e = i._parent, s = i._prev;
  i._prev = t, s && (s._next = t) || e && (e._first = t), t._parent = e, t._prev = s, t._next = i, t._parent._flag(t, !0), t._ts_parent = ++A, t.touch();
}
function J(t, i) {
  E(t), E(i), t.remove();
  var e = i._parent, s = i._next;
  i._next = t, s && (s._prev = t) || e && (e._last = t), t._parent = e, t._prev = i, t._next = s, t._parent._flag(t, !0), t._ts_parent = ++A, t.touch();
}
f.prototype.remove = function(t, i) {
  if (typeof t < "u") {
    if (Array.isArray(t))
      for (var e = 0; e < t.length; e++)
        E(t[e]).remove();
    else if (typeof i < "u")
      for (var e = 0; e < arguments.length; e++)
        E(arguments[e]).remove();
    else
      E(t).remove();
    return this;
  }
  return this._prev && (this._prev._next = this._next), this._next && (this._next._prev = this._prev), this._parent && (this._parent._first === this && (this._parent._first = this._next), this._parent._last === this && (this._parent._last = this._prev), this._parent._flag(this, !1), this._parent._ts_children = ++A, this._parent.touch()), this._prev = this._next = this._parent = null, this._ts_parent = ++A, this;
};
f.prototype.empty = function() {
  for (var t, i = this._first; t = i; )
    i = t._next, t._prev = t._next = t._parent = null, this._flag(t, !1);
  return this._first = this._last = null, this._ts_children = ++A, this.touch(), this;
};
f.prototype.touch = function() {
  return this._ts_touch = ++A, this._parent && this._parent.touch(), this;
};
f.prototype._flag = function(t, i) {
  if (typeof i > "u")
    return this._flags !== null && this._flags[t] || 0;
  if (typeof t == "string" && (i ? (this._flags = this._flags || {}, !this._flags[t] && this._parent && this._parent._flag(t, !0), this._flags[t] = (this._flags[t] || 0) + 1) : this._flags && this._flags[t] > 0 && (this._flags[t] == 1 && this._parent && this._parent._flag(t, !1), this._flags[t] = this._flags[t] - 1)), typeof t == "object" && t._flags)
    for (var e in t._flags)
      t._flags[e] > 0 && this._flag(e, i);
  return this;
};
f.prototype.hitTest = function(t) {
  var i = this._pin._width, e = this._pin._height;
  return t.x >= 0 && t.x <= i && t.y >= 0 && t.y <= e;
};
f.prototype._textures = null;
f.prototype._alpha = 1;
f.prototype.render = function(t) {
  if (this._visible) {
    P.node++;
    var i = this.matrix();
    t.setTransform(i.a, i.b, i.c, i.d, i.e, i.f), this._alpha = this._pin._alpha * (this._parent ? this._parent._alpha : 1);
    var e = this._pin._textureAlpha * this._alpha;
    if (t.globalAlpha != e && (t.globalAlpha = e), this._textures !== null)
      for (var s = 0, n = this._textures.length; s < n; s++)
        this._textures[s].draw(t);
    t.globalAlpha != this._alpha && (t.globalAlpha = this._alpha);
    for (var r, h = this._first; r = h; )
      h = r._next, r.render(t);
  }
};
f.prototype._tickBefore = null;
f.prototype._tickAfter = null;
f.prototype.MAX_ELAPSE = 1 / 0;
f.prototype._tick = function(t, i, e) {
  if (this._visible) {
    t > this.MAX_ELAPSE && (t = this.MAX_ELAPSE);
    var s = !1;
    if (this._tickBefore !== null)
      for (var n = 0; n < this._tickBefore.length; n++) {
        P.tick++;
        var r = this._tickBefore[n];
        s = r.call(this, t, i, e) === !0 || s;
      }
    for (var h, _ = this._first; h = _; )
      _ = h._next, h._flag("_tick") && (s = h._tick(t, i, e) === !0 ? !0 : s);
    if (this._tickAfter !== null)
      for (var n = 0; n < this._tickAfter.length; n++) {
        P.tick++;
        var r = this._tickAfter[n];
        s = r.call(this, t, i, e) === !0 || s;
      }
    return s;
  }
};
f.prototype.tick = function(t, i) {
  typeof t == "function" && (i ? (this._tickBefore === null && (this._tickBefore = []), this._tickBefore.push(t)) : (this._tickAfter === null && (this._tickAfter = []), this._tickAfter.push(t)), this._flag("_tick", this._tickAfter !== null && this._tickAfter.length > 0 || this._tickBefore !== null && this._tickBefore.length > 0));
};
f.prototype.untick = function(t) {
  if (typeof t == "function") {
    var i;
    this._tickBefore !== null && (i = this._tickBefore.indexOf(t)) >= 0 && this._tickBefore.splice(i, 1), this._tickAfter !== null && (i = this._tickAfter.indexOf(t)) >= 0 && this._tickAfter.splice(i, 1);
  }
};
f.prototype.timeout = function(t, i) {
  this.setTimeout(t, i);
};
f.prototype.setTimeout = function(t, i) {
  function e(s) {
    if ((i -= s) < 0)
      this.untick(e), t.call(this);
    else
      return !0;
  }
  return this.tick(e), e;
};
f.prototype.clearTimeout = function(t) {
  this.untick(t);
};
f.prototype._listeners = null;
f.prototype._event_callback = function(t, i) {
  this._flag(t, i);
};
f.prototype.on = function(t, i) {
  if (!t || !t.length || typeof i != "function")
    return this;
  this._listeners === null && (this._listeners = {});
  var e = typeof t != "string" && typeof t.join == "function";
  if (t = (e ? t.join(" ") : t).match(/\S+/g))
    for (var s = 0; s < t.length; s++) {
      var n = t[s];
      this._listeners[n] = this._listeners[n] || [], this._listeners[n].push(i), typeof this._event_callback == "function" && this._event_callback(n, !0);
    }
  return this;
};
f.prototype.off = function(t, i) {
  if (!t || !t.length || typeof i != "function")
    return this;
  if (this._listeners === null)
    return this;
  var e = typeof t != "string" && typeof t.join == "function";
  if (t = (e ? t.join(" ") : t).match(/\S+/g))
    for (var s = 0; s < t.length; s++) {
      var n = t[s], r = this._listeners[n], h;
      r && (h = r.indexOf(i)) >= 0 && (r.splice(h, 1), r.length || delete this._listeners[n], typeof this._event_callback == "function" && this._event_callback(n, !1));
    }
  return this;
};
f.prototype.listeners = function(t) {
  return this._listeners && this._listeners[t];
};
f.prototype.publish = function(t, i) {
  var e = this.listeners(t);
  if (!e || !e.length)
    return 0;
  for (var s = 0; s < e.length; s++)
    e[s].apply(this, i);
  return e.length;
};
f.prototype.trigger = function(t, i) {
  return this.publish(t, i), this;
};
var ft = Math;
const L = Object.create(Math);
L.random = function(t, i) {
  return typeof t > "u" ? (i = 1, t = 0) : typeof i > "u" && (i = t, t = 0), t == i ? t : ft.random() * (i - t) + t;
};
L.mod = function(t, i, e) {
  return typeof i > "u" ? (e = 1, i = 0) : typeof e > "u" && (e = i, i = 0), e > i ? (t = (t - i) % (e - i), t + (t < 0 ? e : i)) : (t = (t - e) % (i - e), t + (t <= 0 ? i : e));
};
L.clamp = function(t, i, e) {
  return t < i ? i : t > e ? e : t;
};
L.length = function(t, i) {
  return ft.sqrt(t * t + i * i);
};
const O = function(t) {
  var i = Object.prototype.toString.call(t);
  return i === "[object Function]" || i === "[object GeneratorFunction]" || i === "[object AsyncFunction]";
}, tt = function(t) {
  return Object.prototype.toString.call(t) === "[object Object]" && t.constructor === Object;
};
class z {
  constructor(i, e) {
    typeof i == "object" && this.src(i, e);
  }
  pipe() {
    return new z(this);
  }
  /**
   * Signatures: (texture), (x, y, w, h), (w, h)
   */
  src(i, e, s, n) {
    if (typeof i == "object") {
      var r = i, h = e || 1;
      this._image = r, this._sx = this._dx = 0, this._sy = this._dy = 0, this._sw = this._dw = r.width / h, this._sh = this._dh = r.height / h, this.width = r.width / h, this.height = r.height / h, this.ratio = h;
    } else
      typeof s > "u" ? (s = i, n = e) : (this._sx = i, this._sy = e), this._sw = this._dw = s, this._sh = this._dh = n, this.width = s, this.height = n;
    return this;
  }
  /**
   * Signatures: (x, y, w, h), (x, y)
   */
  dest(i, e, s, n) {
    return this._dx = i, this._dy = e, this._dx = i, this._dy = e, typeof s < "u" && (this._dw = s, this._dh = n, this.width = s, this.height = n), this;
  }
  draw(i, e, s, n, r, h, _, o, l) {
    var u = this._image;
    if (!(u === null || typeof u != "object")) {
      var a = this._sx, c = this._sy, v = this._sw, g = this._sh, m = this._dx, k = this._dy, Y = this._dw, y = this._dh;
      typeof h < "u" ? (e = L.clamp(e, 0, this._sw), n = L.clamp(n, 0, this._sw - e), s = L.clamp(s, 0, this._sh), r = L.clamp(r, 0, this._sh - s), a += e, c += s, v = n, g = r, m = h, k = _, Y = o, y = l) : typeof n < "u" ? (m = e, k = s, Y = n, y = r) : typeof e < "u" && (Y = e, y = s);
      var C = this.ratio || 1;
      a *= C, c *= C, v *= C, g *= C;
      try {
        typeof u.draw == "function" ? u.draw(i, a, c, v, g, m, k, Y, y) : (P.draw++, i.drawImage(u, a, c, v, g, m, k, Y, y));
      } catch (x) {
        u._draw_failed || (console.log("Unable to draw: ", u), console.log(x), u._draw_failed = !0);
      }
    }
  }
}
var ut = new class extends z {
  constructor() {
    super();
    p(this, "pipe", function() {
      return this;
    });
    p(this, "src", function() {
      return this;
    });
    p(this, "dest", function() {
      return this;
    });
    p(this, "draw", function() {
    });
    this.x = this.y = this.width = this.height = 0;
  }
}(), gt = new Q(ut);
function mt(t) {
  return console.log("Loading image: " + t), new Promise(function(i, e) {
    const s = new Image();
    s.onload = function() {
      i(s);
    }, s.onerror = function(n) {
      e(n);
    }, s.src = t;
  });
}
var it = {}, et = [];
const yt = async function(t) {
  var i = O(t.draw) ? t : new _t(t);
  t.name && (it[t.name] = i), et.push(i), I(t, "imagePath"), I(t, "imageRatio");
  var e = t.imagePath, s = t.imageRatio || 1;
  if (typeof t.image == "string" ? e = t.image : ("src" in t.image || "url" in t.image) && (e = t.image.src || t.image.url, s = t.image.ratio || s), e) {
    const n = await mt(e);
    i.src(n, s);
  }
  return i;
};
class _t extends z {
  constructor(i) {
    super();
    var e = this;
    I(i, "filter"), I(i, "cutouts"), I(i, "sprites"), I(i, "factory");
    var s = i.map || i.filter, n = i.ppu || i.ratio || 1, r = i.trim || 0, h = i.textures, _ = i.factory, o = i.cutouts || i.sprites;
    function l(a) {
      if (!a || O(a.draw))
        return a;
      a = Object.assign({}, a), O(s) && (a = s(a)), n != 1 && (a.x *= n, a.y *= n, a.width *= n, a.height *= n, a.top *= n, a.bottom *= n, a.left *= n, a.right *= n), r != 0 && (a.x += r, a.y += r, a.width -= 2 * r, a.height -= 2 * r, a.top -= r, a.bottom -= r, a.left -= r, a.right -= r);
      var c = e.pipe();
      return c.top = a.top, c.bottom = a.bottom, c.left = a.left, c.right = a.right, c.src(a.x, a.y, a.width, a.height), c;
    }
    function u(a) {
      if (h) {
        if (O(h))
          return h(a);
        if (tt(h))
          return h[a];
      }
      if (o) {
        for (var c = null, v = 0, g = 0; g < o.length; g++)
          string.startsWith(o[g].name, a) && (v === 0 ? c = o[g] : v === 1 ? c = [c, o[g]] : c.push(o[g]), v++);
        return v === 0 && O(_) && (c = function(m) {
          return _(a + (m || ""));
        }), c;
      }
    }
    this.select = function(a) {
      if (!a)
        return new Q(this.pipe());
      var c = u(a);
      if (c)
        return new Q(c, u, l);
    };
  }
}
function Q(t, i, e) {
  function s(n, r) {
    if (n) {
      if (O(n.draw))
        return n;
      if (tt(n) && typeof n.width == "number" && typeof n.height == "number" && O(e))
        return e(n);
      if (tt(n) && typeof r < "u")
        return s(n[r]);
      if (O(n))
        return s(n(r));
      if (Array.isArray(n))
        return s(n[0]);
      if (typeof n == "string" && O(i))
        return s(i(n));
    } else
      return ut;
  }
  this.one = function(n) {
    return s(t, n);
  }, this.array = function(n) {
    var r = Array.isArray(n) ? n : [];
    if (Array.isArray(t))
      for (var h = 0; h < t.length; h++)
        r[h] = s(t[h]);
    else
      r[0] = s(t);
    return r;
  };
}
const Z = function(t) {
  if (typeof t != "string")
    return new Q(t);
  var i = null, e, s;
  for ((s = t.indexOf(":")) > 0 && t.length > s + 1 && (e = it[t.slice(0, s)], i = e && e.select(t.slice(s + 1))), !i && (e = it[t]) && (i = e.select()), s = 0; !i && s < et.length; s++)
    i = et[s].select(t);
  return i || (console.error("Texture not found: " + t), i = gt), i;
};
function I(t, i, e) {
  i in t && console.log(e ? e.replace("%name", i) : "'" + i + "' field of texture atlas is deprecated.");
}
const wt = function(t, i, e) {
  typeof t == "string" ? typeof i == "object" || (typeof i == "function" && (e = i), i = {}) : (typeof t == "function" && (e = t), i = {}, t = "2d");
  var s = document.createElement("canvas"), n = s.getContext(t, i), r = new z(s);
  return r.context = function() {
    return n;
  }, r.size = function(h, _, o) {
    return o = o || 1, s.width = h * o, s.height = _ * o, this.src(s, o), this;
  }, typeof e == "function" && e.call(r, n), r;
};
class W {
  constructor() {
    p(this, "x", 0);
    p(this, "y", 0);
    p(this, "ratio", 1);
    p(this, "stage");
    p(this, "elem");
    p(this, "clicklist", []);
    p(this, "cancellist", []);
    p(this, "handleStart", (i) => {
      i.preventDefault(), this.locate(i), this.publish(i.type, i), this.lookup("click", this.clicklist), this.lookup("mousecancel", this.cancellist);
    });
    p(this, "handleMove", (i) => {
      i.preventDefault(), this.locate(i), this.publish(i.type, i);
    });
    p(this, "handleEnd", (i) => {
      i.preventDefault(), this.publish(i.type, i), this.clicklist.length && this.publish("click", i, this.clicklist), this.cancellist.length = 0;
    });
    p(this, "handleCancel", (i) => {
      this.cancellist.length && this.publish("mousecancel", i, this.cancellist), this.clicklist.length = 0;
    });
    p(this, "toString", function() {
      return (this.x | 0) + "x" + (this.y | 0);
    });
    p(this, "locate", function(i) {
      const e = this.elem;
      let s, n;
      i.touches && i.touches.length ? (s = i.touches[0].clientX, n = i.touches[0].clientY) : (s = i.clientX, n = i.clientY);
      var r = e.getBoundingClientRect();
      s -= r.left, n -= r.top, s -= e.clientLeft | 0, n -= e.clientTop | 0, this.x = s * this.ratio, this.y = n * this.ratio;
    });
    p(this, "lookup", function(i, e) {
      this.type = i, this.root = this.stage, this.event = null, e.length = 0, this.collect = e, this.root.visit({
        reverse: !0,
        visible: !0,
        start: this.visitStart,
        end: this.visitEnd
      }, this);
    });
    p(this, "publish", function(i, e, s) {
      if (this.type = i, this.root = this.stage, this.event = e, this.collect = !1, this.timeStamp = Date.now(), i !== "mousemove" && i !== "touchmove" && console.log(this.type + " " + this), s) {
        for (; s.length && !this.visitEnd(s.shift()); )
          ;
        s.length = 0;
      } else
        this.root.visit({
          reverse: !0,
          visible: !0,
          start: this.visitStart,
          end: this.visitEnd
        }, this);
    });
    p(this, "visitStart", (i) => !i._flag(this.type));
    p(this, "visitEnd", (i) => {
      M.raw = this.event, M.type = this.type, M.timeStamp = this.timeStamp, M.abs.x = this.x, M.abs.y = this.y;
      var e = i.listeners(this.type);
      if (e && (i.matrix().inverse().map(this, M), !!(i === this.root || i.attr("spy") || i.hitTest(M)) && (this.collect && this.collect.push(i), this.event))) {
        for (var s = !1, n = 0; n < e.length; n++)
          s = e[n].call(i, M) ? !0 : s;
        return s;
      }
    });
  }
  mount(i, e) {
    return this.stage = i, this.elem = e, this.ratio = i.viewport().ratio || 1, i.on("viewport", (s) => {
      this.ratio = s.ratio ?? this.ratio;
    }), e.addEventListener("touchstart", this.handleStart), e.addEventListener("touchend", this.handleEnd), e.addEventListener("touchmove", this.handleMove), e.addEventListener("touchcancel", this.handleCancel), e.addEventListener("mousedown", this.handleStart), e.addEventListener("mouseup", this.handleEnd), e.addEventListener("mousemove", this.handleMove), document.addEventListener("mouseup", this.handleCancel), window.addEventListener("blur", this.handleCancel), this;
  }
  unmount() {
    const i = this.elem;
    return i.removeEventListener("touchstart", this.handleStart), i.removeEventListener("touchend", this.handleEnd), i.removeEventListener("touchmove", this.handleMove), i.removeEventListener("touchcancel", this.handleCancel), i.removeEventListener("mousedown", this.handleStart), i.removeEventListener("mouseup", this.handleEnd), i.removeEventListener("mousemove", this.handleMove), document.removeEventListener("mouseup", this.handleCancel), window.removeEventListener("blur", this.handleCancel), this;
  }
}
p(W, "CLICK", "click"), p(W, "START", "touchstart mousedown"), p(W, "MOVE", "touchmove mousemove"), p(W, "END", "touchend mouseup"), p(W, "CANCEL", "touchcancel mousecancel");
var M = {}, st = {};
D(M, "clone", function(t) {
  return t = t || {}, t.x = this.x, t.y = this.y, t;
});
D(M, "toString", function() {
  return (this.x | 0) + "x" + (this.y | 0) + " (" + this.abs + ")";
});
D(M, "abs", st);
D(st, "clone", function(t) {
  return t = t || {}, t.x = this.x, t.y = this.y, t;
});
D(st, "toString", function() {
  return (this.x | 0) + "x" + (this.y | 0);
});
function D(t, i, e) {
  Object.defineProperty(t, i, {
    value: e
  });
}
function xt(t) {
  return t;
}
var rt = {}, ht = {}, ot = {};
class w {
  static get(i, e = xt) {
    if (typeof i == "function")
      return i;
    if (typeof i != "string")
      return e;
    var s = rt[i];
    if (s)
      return s;
    var n = /^(\w+)(-(in|out|in-out|out-in))?(\((.*)\))?$/i.exec(i);
    if (!n || !n.length)
      return e;
    var r = ot[n[1]], h = ht[n[3]], _ = n[5];
    return r && r.fn ? s = r.fn : r && r.fc ? s = r.fc.apply(r.fc, _ && _.replace(/\s+/, "").split(",")) : s = e, h && (s = h.fn(s)), rt[i] = s, s;
  }
  static add(i) {
    for (var e = (i.name || i.mode).split(/\s+/), s = 0; s < e.length; s++) {
      var n = e[s];
      n && ((i.name ? ot : ht)[n] = i);
    }
  }
}
w.add({
  mode: "in",
  fn: function(t) {
    return t;
  }
});
w.add({
  mode: "out",
  fn: function(t) {
    return function(i) {
      return 1 - t(1 - i);
    };
  }
});
w.add({
  mode: "in-out",
  fn: function(t) {
    return function(i) {
      return i < 0.5 ? t(2 * i) / 2 : 1 - t(2 * (1 - i)) / 2;
    };
  }
});
w.add({
  mode: "out-in",
  fn: function(t) {
    return function(i) {
      return i < 0.5 ? 1 - t(2 * (1 - i)) / 2 : t(2 * i) / 2;
    };
  }
});
w.add({
  name: "linear",
  fn: function(t) {
    return t;
  }
});
w.add({
  name: "quad",
  fn: function(t) {
    return t * t;
  }
});
w.add({
  name: "cubic",
  fn: function(t) {
    return t * t * t;
  }
});
w.add({
  name: "quart",
  fn: function(t) {
    return t * t * t * t;
  }
});
w.add({
  name: "quint",
  fn: function(t) {
    return t * t * t * t * t;
  }
});
w.add({
  name: "sin sine",
  fn: function(t) {
    return 1 - Math.cos(t * Math.PI / 2);
  }
});
w.add({
  name: "exp expo",
  fn: function(t) {
    return t == 0 ? 0 : Math.pow(2, 10 * (t - 1));
  }
});
w.add({
  name: "circle circ",
  fn: function(t) {
    return 1 - Math.sqrt(1 - t * t);
  }
});
w.add({
  name: "bounce",
  fn: function(t) {
    return t < 1 / 2.75 ? 7.5625 * t * t : t < 2 / 2.75 ? 7.5625 * (t -= 1.5 / 2.75) * t + 0.75 : t < 2.5 / 2.75 ? 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375 : 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
  }
});
w.add({
  name: "poly",
  fc: function(t) {
    return function(i) {
      return Math.pow(i, t);
    };
  }
});
w.add({
  name: "elastic",
  fc: function(t, i) {
    i = i || 0.45, t = t || 1;
    var e = i / (2 * Math.PI) * Math.asin(1 / t);
    return function(s) {
      return 1 + t * Math.pow(2, -10 * s) * Math.sin((s - e) * (2 * Math.PI) / i);
    };
  }
});
w.add({
  name: "back",
  fc: function(t) {
    return t = typeof t < "u" ? t : 1.70158, function(i) {
      return i * i * ((t + 1) * i - t);
    };
  }
});
f.prototype.tween = function(t, i, e) {
  if (typeof t != "number" ? (e = t, i = 0, t = 0) : typeof i != "number" && (e = i, i = 0), !this._tweens) {
    this._tweens = [];
    var s = 0;
    this.tick(function(r, h, _) {
      if (this._tweens.length) {
        var o = s != _;
        if (s = h, o)
          return !0;
        var l = this._tweens[0], u = l.tick(this, r, h, _);
        if (u && l === this._tweens[0] && this._tweens.shift(), Array.isArray(u))
          for (var a = 0; a < u.length; a++)
            try {
              u[a].call(this);
            } catch (c) {
              console.log(c);
            }
        else
          typeof u == "object" && this._tweens.unshift(u);
        return !0;
      }
    }, !0);
  }
  this.touch(), e || (this._tweens.length = 0);
  var n = new $(this, t, i);
  return this._tweens.push(n), n;
};
class $ {
  constructor(i, e, s) {
    this._end = {}, this._duration = e || 400, this._delay = s || 0, this._owner = i, this._time = 0;
  }
  tick(i, e, s, n) {
    if (this._time += e, !(this._time < this._delay)) {
      var r = this._time - this._delay;
      if (!this._start) {
        this._start = {};
        for (var h in this._end)
          this._start[h] = this._owner.pin(h);
      }
      var _, o;
      r < this._duration ? (_ = r / this._duration, o = !1) : (_ = 1, o = !0), typeof this._easing == "function" && (_ = this._easing(_));
      var l = 1 - _;
      for (var h in this._end)
        this._owner.pin(h, this._start[h] * l + this._end[h] * _);
      if (o) {
        var u = [this._hide, this._remove, this._done];
        return u = u.filter(function(a) {
          return typeof a == "function";
        }), this._next || u;
      }
    }
  }
  tween(i, e) {
    return this._next = new $(this._owner, i, e);
  }
  duration(i) {
    return this._duration = i, this;
  }
  delay(i) {
    return this._delay = i, this;
  }
  ease(i) {
    return this._easing = w.get(i), this;
  }
  done(i) {
    return this._done = i, this;
  }
  hide() {
    return this._hide = function() {
      this.hide();
    }, this;
  }
  remove() {
    return this._remove = function() {
      this.remove();
    }, this;
  }
  pin(i, e) {
    if (typeof i == "object")
      for (var s in i)
        at(this._owner, this._end, s, i[s]);
    else
      typeof e < "u" && at(this._owner, this._end, i, e);
    return this;
  }
  /**
   * @deprecated Use .done(fn) instead.
   */
  then(i) {
    return this.done(i), this;
  }
  /**
   * @deprecated NOOP
   */
  clear(i) {
    return this;
  }
}
function at(t, i, e, s) {
  typeof t.pin(e) == "number" ? i[e] = s : typeof t.pin(e + "X") == "number" && typeof t.pin(e + "Y") == "number" && (i[e + "X"] = s, i[e + "Y"] = s);
}
X._add_shortcuts($.prototype);
var F = [];
const bt = function() {
  for (var t = F.length - 1; t >= 0; t--)
    F[t].pause();
}, kt = function() {
  for (var t = F.length - 1; t >= 0; t--)
    F[t].resume();
}, Xt = function(t = {}) {
  var i = new R();
  return i.mount(t), i.mouse = new W().mount(i, i.dom), i;
};
R._super = f;
R.prototype = Object.create(R._super.prototype);
function R() {
  R._super.call(this), this.label("Root");
}
R.prototype.mount = function(t = {}) {
  var i, e = null, s = !1, n = 0, r = 0, h = 1, _ = !1, o = !0;
  if (typeof t.canvas == "string" && (i = document.getElementById(t.canvas)), i || (i = document.getElementById("cutjs") || document.getElementById("stage")), !i) {
    s = !0, console.log("Creating Canvas..."), i = document.createElement("canvas"), i.style.position = "absolute", i.style.top = "0", i.style.left = "0";
    var l = document.body;
    l.insertBefore(i, l.firstChild);
  }
  this.dom = i, e = i.getContext("2d");
  var u = window.devicePixelRatio || 1, a = e.webkitBackingStorePixelRatio || e.mozBackingStorePixelRatio || e.msBackingStorePixelRatio || e.oBackingStorePixelRatio || e.backingStorePixelRatio || 1;
  h = u / a;
  var c = window.requestAnimationFrame || window.msRequestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.oRequestAnimationFrame || function(x) {
    return window.setTimeout(x, 1e3 / 60);
  }, v = 0, g = (x) => {
    if (!(!_ || o)) {
      var T = v || x, q = x - T;
      v = x;
      var pt = this._tick(q, x, T);
      this._mo_touch != this._ts_touch ? (this._mo_touch = this._ts_touch, m(), c(g)) : pt ? c(g) : o = !0, P.fps = q ? 1e3 / q : 0;
    }
  }, m = () => {
    n > 0 && r > 0 && (e.setTransform(1, 0, 0, 1, 0, 0), e.clearRect(0, 0, n, r), this.render(e));
  }, k = -1, Y = -1, y = () => {
    if (_) {
      var x, T;
      s ? (x = window.innerWidth > 0 ? window.innerWidth : screen.width, T = window.innerHeight > 0 ? window.innerHeight : screen.height) : (x = i.clientWidth, T = i.clientHeight), (k !== x || Y !== T) && (k = x, Y = T, C()), c(y);
    }
  }, C = () => {
    s ? (n = window.innerWidth > 0 ? window.innerWidth : screen.width, r = window.innerHeight > 0 ? window.innerHeight : screen.height, i.style.width = n + "px", i.style.height = r + "px") : (n = i.clientWidth, r = i.clientHeight), n *= h, r *= h, !(i.width === n && i.height === r) && (i.width = n, i.height = r, console.log("Resize: " + n + " x " + r + " / " + h), this.viewport(n, r, h), m());
  };
  this.resume = function() {
    return o && (this.publish("resume"), o = !1, c(g)), this;
  }, this.pause = function() {
    return o || this.publish("pause"), o = !0, this;
  }, this.touch_root = this.touch, this.touch = function() {
    return this.resume(), this.touch_root();
  }, this.unmount = function() {
    var T;
    _ = !1;
    var x = F.indexOf(this);
    return x >= 0 && F.splice(x, 1), (T = this.mouse) == null || T.unmount(), this;
  }, _ = !0, F.push(this), y(), c(g);
};
R.prototype.background = function(t) {
  return this.dom.style.backgroundColor = t, this;
};
R.prototype.viewport = function(t, i, e) {
  if (typeof t > "u")
    return Object.assign({}, this._viewport);
  this._viewport = {
    width: t,
    height: i,
    ratio: e || 1
  }, this.viewbox();
  var s = Object.assign({}, this._viewport);
  return this.visit({
    start: function(n) {
      if (!n._flag("viewport"))
        return !0;
      n.publish("viewport", [s]);
    }
  }), this;
};
R.prototype.viewbox = function(t, i, e) {
  typeof t == "number" && typeof i == "number" && (this._viewbox = {
    width: t,
    height: i,
    mode: /^(in|out|in-pad|out-crop)$/.test(e) ? e : "in-pad"
  });
  var s = this._viewbox, n = this._viewport;
  return n && s ? (this.pin({
    width: s.width,
    height: s.height
  }), this.scaleTo(n.width, n.height, s.mode)) : n && this.pin({
    width: n.width,
    height: n.height
  }), this;
};
const ct = function(t) {
  var i = new S();
  return t && i.image(t), i;
};
S._super = f;
S.prototype = Object.create(S._super.prototype);
function S() {
  S._super.call(this), this.label("Sprite"), this._textures = [], this._image = null;
}
S.prototype.image = function(t) {
  return this._image = Z(t).one(), this.pin("width", this._image ? this._image.width : 0), this.pin("height", this._image ? this._image.height : 0), this._textures[0] = this._image.pipe(), this._textures.length = 1, this;
};
S.prototype.tile = function(t) {
  return this._repeat(!1, t), this;
};
S.prototype.stretch = function(t) {
  return this._repeat(!0, t), this;
};
S.prototype._repeat = function(t, i) {
  var e = this;
  this.untick(this._repeatTicker), this.tick(this._repeatTicker = function() {
    if (this._mo_stretch != this._pin._ts_transform) {
      this._mo_stretch = this._pin._ts_transform;
      var n = this.pin("width"), r = this.pin("height");
      this._textures.length = Yt(this._image, n, r, t, i, s);
    }
  });
  function s(n, r, h, _, o, l, u, a, c) {
    var v = e._textures.length > n ? e._textures[n] : e._textures[n] = e._image.pipe();
    v.src(r, h, _, o), v.dest(l, u, a, c);
  }
};
function Yt(t, i, e, s, n, r) {
  var h = t.width, _ = t.height, o = t.left, l = t.right, u = t.top, a = t.bottom;
  o = typeof o == "number" && o === o ? o : 0, l = typeof l == "number" && l === l ? l : 0, u = typeof u == "number" && u === u ? u : 0, a = typeof a == "number" && a === a ? a : 0, h = h - o - l, _ = _ - u - a, n || (i = Math.max(i - o - l, 0), e = Math.max(e - u - a, 0));
  var c = 0;
  if (u > 0 && o > 0 && r(c++, 0, 0, o, u, 0, 0, o, u), a > 0 && o > 0 && r(c++, 0, _ + u, o, a, 0, e + u, o, a), u > 0 && l > 0 && r(c++, h + o, 0, l, u, i + o, 0, l, u), a > 0 && l > 0 && r(
    c++,
    h + o,
    _ + u,
    l,
    a,
    i + o,
    e + u,
    l,
    a
  ), s)
    u > 0 && r(c++, o, 0, h, u, o, 0, i, u), a > 0 && r(
      c++,
      o,
      _ + u,
      h,
      a,
      o,
      e + u,
      i,
      a
    ), o > 0 && r(c++, 0, u, o, _, 0, u, o, e), l > 0 && r(
      c++,
      h + o,
      u,
      l,
      _,
      i + o,
      u,
      l,
      e
    ), r(c++, o, u, h, _, o, u, i, e);
  else
    for (var v = o, g = i, m; g > 0; ) {
      m = Math.min(h, g), g -= h;
      for (var k = u, Y = e, y; Y > 0; )
        y = Math.min(_, Y), Y -= _, r(c++, o, u, m, y, v, k, m, y), g <= 0 && (o && r(c++, 0, u, o, y, 0, k, o, y), l && r(c++, h + o, u, l, y, v + m, k, l, y)), k += y;
      u && r(c++, o, 0, m, u, v, 0, m, u), a && r(c++, o, _ + u, m, a, v, k, m, a), v += m;
    }
  return c;
}
const At = ct, Mt = S, Et = function(t, i) {
  var e = new b();
  return e.frames(t).gotoFrame(0), i && e.fps(i), e;
};
b._super = f;
b.prototype = Object.create(b._super.prototype);
const lt = 15;
function b() {
  b._super.call(this), this.label("Anim"), this._textures = [], this._fps = lt, this._ft = 1e3 / this._fps, this._time = -1, this._repeat = 0, this._index = 0, this._frames = [];
  var t = 0;
  this.tick(function(i, e, s) {
    if (!(this._time < 0 || this._frames.length <= 1)) {
      var n = t != s;
      if (t = e, n || (this._time += i, this._time < this._ft))
        return !0;
      var r = this._time / this._ft | 0;
      return this._time -= r * this._ft, this.moveFrame(r), this._repeat > 0 && (this._repeat -= r) <= 0 ? (this.stop(), this._callback && this._callback(), !1) : !0;
    }
  }, !1);
}
b.prototype.fps = function(t) {
  return typeof t > "u" ? this._fps : (this._fps = t > 0 ? t : lt, this._ft = 1e3 / this._fps, this);
};
b.prototype.setFrames = function(t, i, e) {
  return this.frames(t, i, e);
};
b.prototype.frames = function(t) {
  return this._index = 0, this._frames = Z(t).array(), this.touch(), this;
};
b.prototype.length = function() {
  return this._frames ? this._frames.length : 0;
};
b.prototype.gotoFrame = function(t, i) {
  return this._index = L.mod(t, this._frames.length) | 0, i = i || !this._textures[0], this._textures[0] = this._frames[this._index], i && (this.pin("width", this._textures[0].width), this.pin("height", this._textures[0].height)), this.touch(), this;
};
b.prototype.moveFrame = function(t) {
  return this.gotoFrame(this._index + t);
};
b.prototype.repeat = function(t, i) {
  return this._repeat = t * this._frames.length - 1, this._callback = i, this.play(), this;
};
b.prototype.play = function(t) {
  return typeof t < "u" ? (this.gotoFrame(t), this._time = 0) : this._time < 0 && (this._time = 0), this.touch(), this;
};
b.prototype.stop = function(t) {
  return this._time = -1, typeof t < "u" && this.gotoFrame(t), this;
};
const St = function(t) {
  return new B().frames(t);
};
B._super = f;
B.prototype = Object.create(B._super.prototype);
function B() {
  B._super.call(this), this.label("String"), this._textures = [];
}
B.prototype.setFont = function(t, i, e) {
  return this.frames(t, i, e);
};
B.prototype.frames = function(t) {
  return this._textures = [], typeof t == "string" ? (t = Z(t), this._item = function(i) {
    return t.one(i);
  }) : typeof t == "object" ? this._item = function(i) {
    return t[i];
  } : typeof t == "function" && (this._item = t), this;
};
B.prototype.setValue = function(t, i, e) {
  return this.value(t, i, e);
};
B.prototype.value = function(t) {
  if (typeof t > "u")
    return this._value;
  if (this._value === t)
    return this;
  this._value = t, t === null ? t = "" : typeof t != "string" && !Array.isArray(t) && (t = t.toString()), this._spacing = this._spacing || 0;
  for (var i = 0, e = 0, s = 0; s < t.length; s++) {
    var n = this._textures[s] = this._item(t[s]);
    i += s > 0 ? this._spacing : 0, n.dest(i, 0), i = i + n.width, e = Math.max(e, n.height);
  }
  return this.pin("width", i), this.pin("height", e), this._textures.length = t.length, this;
};
const Tt = function(t) {
  return N().row(t).label("Row");
};
f.prototype.row = function(t) {
  return this.align("row", t), this;
};
const Lt = function(t) {
  return N().column(t).label("Row");
};
f.prototype.column = function(t) {
  return this.align("column", t), this;
};
f.prototype.align = function(t, i) {
  return this._padding = this._padding || 0, this._spacing = this._spacing || 0, this.untick(this._layoutTiker), this.tick(this._layoutTiker = function() {
    if (this._mo_seq != this._ts_touch) {
      this._mo_seq = this._ts_touch;
      var e = this._mo_seqAlign != this._ts_children;
      this._mo_seqAlign = this._ts_children;
      for (var s = 0, n = 0, r, h = this.first(!0), _ = !0; r = h; ) {
        h = r.next(!0), r.matrix(!0);
        var o = r.pin("boxWidth"), l = r.pin("boxHeight");
        t == "column" ? (!_ && (n += this._spacing), r.pin("offsetY") != n && r.pin("offsetY", n), s = Math.max(s, o), n = n + l, e && r.pin("alignX", i)) : t == "row" && (!_ && (s += this._spacing), r.pin("offsetX") != s && r.pin("offsetX", s), s = s + o, n = Math.max(n, l), e && r.pin("alignY", i)), _ = !1;
      }
      s += 2 * this._padding, n += 2 * this._padding, this.pin("width") != s && this.pin("width", s), this.pin("height") != n && this.pin("height", n);
    }
  }), this;
};
const Rt = function() {
  return N().box().label("Box");
};
f.prototype.box = function() {
  return this._padding = this._padding || 0, this.untick(this._layoutTiker), this.tick(this._layoutTiker = function() {
    if (this._mo_box != this._ts_touch) {
      this._mo_box = this._ts_touch;
      for (var t = 0, i = 0, e, s = this.first(!0); e = s; ) {
        s = e.next(!0), e.matrix(!0);
        var n = e.pin("boxWidth"), r = e.pin("boxHeight");
        t = Math.max(t, n), i = Math.max(i, r);
      }
      t += 2 * this._padding, i += 2 * this._padding, this.pin("width") != t && this.pin("width", t), this.pin("height") != i && this.pin("height", i);
    }
  }), this;
};
const Bt = function() {
  return N().layer().label("Layer");
};
f.prototype.layer = function() {
  return this.untick(this._layoutTiker), this.tick(this._layoutTiker = function() {
    var t = this.parent();
    if (t) {
      var i = t.pin("width");
      this.pin("width") != i && this.pin("width", i);
      var e = t.pin("height");
      this.pin("height") != e && this.pin("height", e);
    }
  }, !0), this;
};
f.prototype.padding = function(t) {
  return this._padding = t, this;
};
f.prototype.spacing = function(t) {
  return this._spacing = t, this;
};
const Ht = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Anim: b,
  Atlas: _t,
  Image: Mt,
  Matrix: j,
  Mouse: W,
  Node: f,
  Pin: X,
  Root: R,
  Sprite: S,
  Str: B,
  Texture: z,
  Tween: $,
  anim: Et,
  atlas: yt,
  box: Rt,
  canvas: wt,
  column: Lt,
  create: N,
  image: At,
  layer: Bt,
  math: L,
  mount: Xt,
  pause: bt,
  resume: kt,
  row: Tt,
  sprite: ct,
  string: St,
  texture: Z
}, Symbol.toStringTag, { value: "Module" }));
export {
  b as Anim,
  _t as Atlas,
  Mt as Image,
  j as Matrix,
  W as Mouse,
  f as Node,
  X as Pin,
  R as Root,
  S as Sprite,
  B as Str,
  z as Texture,
  $ as Tween,
  Et as anim,
  yt as atlas,
  Rt as box,
  wt as canvas,
  Lt as column,
  N as create,
  Ht as default,
  At as image,
  Bt as layer,
  L as math,
  Xt as mount,
  bt as pause,
  kt as resume,
  Tt as row,
  ct as sprite,
  St as string,
  Z as texture
};
