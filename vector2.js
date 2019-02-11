"use strict";

const Vector2 = function (x, y) {
    this.x = x;
    this.y = y;
};

Vector2.prototype.toRowVector = function () {
    return [[this.x, this.y]];
}
Vector2.prototype.toColumnVector = function () {
    return [[this.x], [this.y]];
}

Vector2.fromRowVector = function (v) {
    return new Vector2(v[0][0], v[0][1]);
}
Vector2.fromColumnVector = function (v) {
    return new Vector2(v[0][0], v[1][0]);
}

Vector2.random = function (xmin, xmax, ymin, ymax) {
    return new Vector2(
        randomMinMax(xmin, xmax),
        randomMinMax(ymin, ymax)
    );
};

Vector2.up = new Vector2(0, 1);
Vector2.down = new Vector2(0, -1);
Vector2.right = new Vector2(1, 0);
Vector2.left = new Vector2(-1, 0);

Vector2.prototype.floor = function () {
    return new Vector2(Math.floor(this.x), Math.floor(this.y));
};
Vector2.prototype.add = function (v) {
    return new Vector2(this.x + v.x, this.y + v.y);
};
Vector2.prototype.substract = function(v){
    return new Vector2(this.x - v.x, this.y - v.y);
}
Vector2.prototype.dot = function (v) {
    return this.x * v.x + this.y * v.y;
}
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
Vector2.prototype.rotate = function (angle) {
    return Vector2.fromColumnVector(multiply(rotationMatrix2d(angle), this.toColumnVector()));
};
Vector2.prototype.hash = function () {
    return this.x + 73856093 * this.y;
};