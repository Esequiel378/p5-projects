function cell(x, y, w, h) {

  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  
  this.alive = true;
  
  this.show = function() {
    if (this.alive) {
      //fill(126, 150, 200);
      fill(255);
    } else {
      // debug mode
      fill(50);
      //fill (120)
    }
    rect(this.x, this.y, this.w, this.w);
  }
  
  this.onClick = function(x, y) {
    if (x > this.x && x < this.x + this.w) {
      if (y > this.y && y < this.y + this.h) {
        return true;
      }
    }  
    return false;
  }
  
  this.kill = function () {
    this.alive = false;
  }
  
  this.born = function() {
    this.alive = true;
  }
  
  this.neighbors = function(other) {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (this.onClick(other.x + this.w * j + 1, other.y + this.h * i + 1)) {
          return true;
        }
      }
    }
    return false;
  }
}