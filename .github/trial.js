(function () {
  var lastTime = 0;
  var vendors = ["ms", "moz", "webkit", "o"];
  for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + "RequestAnimationFrame"];
    window.cancelAnimationFrame =
      window[vendors[x] + "CancelAnimationFrame"] ||
      window[vendors[x] + "CancelRequestAnimationFrame"];
  }
  if (!window.requestAnimationFrame)
    window.requestAnimationFrame = function (callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function () {
        callback(currTime + timeToCall);
      }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  if (!window.cancelAnimationFrame)
    window.cancelAnimationFrame = function (id) {
      clearTimeout(id);
    };
})();
var Game = new (function () {
  var boards = [];
  // Game Initialization
  this.initialize = function (canvasElementId, sprite_data, callback) {
    this.canvas = document.getElementById(canvasElementId);
    this.playerOffset = 10;
    this.canvasMultiplier = 1;
    this.setupMobile();
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.ctx = this.canvas.getContext && this.canvas.getContext("2d");
    if (!this.ctx) {
      return alert("Please upgrade your browser to play");
    }
    this.setupInput();
    this.loop();
    if (this.mobile) {
      this.setBoard(4, new TouchControls());
    }
    SpriteSheet.load(sprite_data, callback);
  };
  // Handle Input
  var KEY_CODES = { 37: "left", 39: "right", 32: "fire" };
  this.keys = {};
  this.setupInput = function () {
    window.addEventListener(
      "keydown",
      function (e) {
        if (KEY_CODES[e.keyCode]) {
          Game.keys[KEY_CODES[e.keyCode]] = true;
          e.preventDefault();
        }
      },
      false
    );
    window.addEventListener(
      "keyup",
      function (e) {
        if (KEY_CODES[e.keyCode]) {
          Game.keys[KEY_CODES[e.keyCode]] = false;
          e.preventDefault();
        }
      },
      false
    );
  };
  var lastTime = new Date().getTime();
  var maxTime = 1 / 30;
  // Game Loop
  this.loop = function () {
    var curTime = new Date().getTime();
    requestAnimationFrame(Game.loop);
    var dt = (curTime - lastTime) / 1000;
    if (dt > maxTime) {
      dt = maxTime;
    }
    for (var i = 0, len = boards.length; i < len; i++) {
      if (boards[i]) {
        boards[i].step(dt);
        boards[i].draw(Game.ctx);
      }
    }
    lastTime = curTime;
  };
  // Change an active game board
  this.setBoard = function (num, board) {
    boards[num] = board;
  };
  this.setupMobile = function () {
    var container = document.getElementById("container"),
      hasTouch = !!("ontouchstart" in window),
      w = window.innerWidth,
      h = window.innerHeight;
    if (hasTouch) {
      this.mobile = true;
    }
    if (screen.width >= 1280 || !hasTouch) {
      return false;
    }
    if (w > h) {
      alert("Please rotate the device and then click OK");
      w = window.innerWidth;
      h = window.innerHeight;
    }
    container.style.height = h * 2 + "px";
    window.scrollTo(0, 1);
    h = window.innerHeight + 2;
    container.style.height = h + "px";
    container.style.width = w + "px";
    container.style.padding = 0;
    if (h >= this.canvas.height * 1.75 || w >= this.canvas.height * 1.75) {
      this.canvasMultiplier = 2;
      this.canvas.width = w / 2;
      this.canvas.height = h / 2;
      this.canvas.style.width = w + "px";
      this.canvas.style.height = h + "px";
    } else {
      this.canvas.width = w;
      this.canvas.height = h;
    }
    this.canvas.style.position = "absolute";
    this.canvas.style.left = "0px";
    this.canvas.style.top = "0px";
  };
})();
var SpriteSheet = new (function () {
  this.map = {};
  this.load = function (spriteData, callback) {
    this.map = spriteData;
    this.image = new Image();
    this.image.onload = callback;
    this.image.src = "images/sprites.png";
  };
  this.draw = function (ctx, sprite, x, y, frame) {
    var s = this.map[sprite];
    if (!frame) frame = 0;
    ctx.drawImage(
      this.image,
      s.sx + frame * s.w,
      s.sy,
      s.w,
      s.h,
      Math.floor(x),
      Math.floor(y),
      s.w,
      s.h
    );
  };
  return this;
})();
var TitleScreen = function TitleScreen(title, subtitle, callback) {
  var up = false;
  this.step = function (dt) {
    if (!Game.keys["fire"]) up = true;
    if (up && Game.keys["fire"] && callback) callback();
  };

  this.draw = function (ctx) {
    ctx.fillStyle = "#FFFFFF";
    ctx.fillStyle = "#00FF00";

    ctx.font = "bold 40px bangers";
    var measure = ctx.measureText(title);
@@ -480,7 +480,7 @@ var GamePoints = function () {
  this.draw = function (ctx) {
    ctx.save();
    ctx.font = "bold 18px arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillStyle = "#00FF00";

    var txt = "" + Game.points;
    var i = pointsLength - txt.length,
  2 changes: 1 addition & 1 deletion2  
game.js
Original file line number	Diff line number	Diff line change
@@ -125,7 +125,7 @@ var Starfield = function (speed, opacity, numStars, clear) {
  // If the clear option is set,
  // make the background black instead of transparent
  if (clear) {
    starCtx.fillStyle = "#000";
    starCtx.fillStyle = "#0F0";
    starCtx.fillRect(0, 0, stars.width, stars.height);
  }


 
 You’re receiving notifications because you’re watching this repository.
Footer
© 2024 GitHub, Inc.
Footer navigation
Terms
Privacy
Security
Status
Doc
