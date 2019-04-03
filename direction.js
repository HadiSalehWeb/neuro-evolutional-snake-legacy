'use strict';

//b1 && b2 => up
//!b1 && b2 => right
//b1 && !b2 => left
//!b1 && !b2 => down
const Direction = function (b1, b2) {
    this.b1 = b1;
    this.b2 = b2;
}

Direction.prototype.moveVector = function (vec, unit) {
    unit = unit || Vector2.one;
    return new Vector2(
        vec.x + (this.b1 === this.b2 ? (b1 ? 1 : -1) * unit.x : 0),
        vec.y + (this.b1 !== this.b2 ? (b2 ? 1 : -1) * unit.y : 0)
    );
}

Direction.prototype.clone = function () {
    return new Direction(this.b1, this.b2);
}

Direction.prototype.reverse = function(){
    return new Direction(!this.b1, !this.b2);
}

Direction.random = () => new Direction(Math.random() < .5, Math.random() < .5);

Direction.up = new Direction(true, true);
Direction.right = new Direction(false, true);
Direction.left = new Direction(true, false);
Direction.down = new Direction(false, false);