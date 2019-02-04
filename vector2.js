"use strict";

const Vector2 = function (x, y) {
    this.x = x;
    this.y = y;
};

Vector2.random = function (xmin, xmax, ymin, ymax) {
    return new Vector2(
        xmin + Math.floor(Math.random() * (xmax - xmin)),
        ymin + Math.floor(Math.random() * (ymax - ymin))
    );
};

Vector2.up = new Vector2(0, 1);
Vector2.down = new Vector2(0, -1);
Vector2.right = new Vector2(1, 0);
Vector2.left = new Vector2(-1, 0);

Vector2.prototype.add = function (v) {
    return new Vector2(this.x + v.x, this.y + v.y);
};
Vector2.prototype.clone = function (v) {
    return new Vector2(this.x, this.y);
};
Vector2.prototype.equals = function (v) {
    return this.x === v.x && this.y === v.y;
};
Vector2.prototype.toString = function () {
    return 'Vector2(' + this.x + ', ' + this.y + ')';
};
Vector2.prototype.perpendicularTo = function (v) {
    return (this.x * v.x + this.y * v.y) === 0;
};