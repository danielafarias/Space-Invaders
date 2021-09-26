function start() {
  $("#start").hide();

  $("#background").append("<div id='player' class='anima1'></div>");
  $("#background").append("<div id='alien1' class='anima2'></div>");
  $("#background").append("<div id='alien2' class='anima2'></div>");
  $("#background").append("<div id='satellite'></div>");
  $("#background").append("<div id='score'></div>");
  $("#background").append("<div id='energy'></div>");

  var canShot = true;
  var gameover = false;
  var points = 0;
  var saved = 0;
  var losted = 0;
  var actualEnergy = 3;
  var game = {};

  var speed = 5;
  var positionY = parseInt(Math.random() * 334);

  var KEY = {
    W: 87,
    S: 83,
    D: 68,
  };

  game.press = [];

  var sfxShot = document.getElementById("sfxShot");
  var sfxExplosion = document.getElementById("sfxExplosion");
  var sfx = document.getElementById("sfx");
  var sfxGameover = document.getElementById("sfxGameover");
  var sfxSaved = document.getElementById("sfxSaved");

  sfx.addEventListener(
    "ended",
    function () {
      sfx.currentTime = 0;
      sfx.play();
    },
    false
  );
  sfx.play();

  $(document).keydown(function (e) {
    game.press[e.which] = true;
  });

  $(document).keyup(function (e) {
    game.press[e.which] = false;
  });

  game.timer = setInterval(loop, 30);

  function loop() {
    moveBackground();
    movePlayer();
    moveAlien1();
    moveAlien2();
    moveSatellite();
    collisionFunction();
    score();
    energy();
  }

  function moveBackground() {
    left = parseInt($("#background").css("background-position"));
    $("#background").css("background-position", left - 1);
  }

  function movePlayer() {
    if (game.press[KEY.W]) {
      var top = parseInt($("#player").css("top"));
      $("#player").css("top", top - 10);

      if (top <= 10) {
        $("#player").css("top", top + 10);
      }
    }

    if (game.press[KEY.S]) {
      var top = parseInt($("#player").css("top"));
      $("#player").css("top", top + 10);

      if (top >= 430) {
        $("#player").css("top", top - 10);
      }
    }

    if (game.press[KEY.D]) {
      shot();
    }
  }

  function shot() {
    sfxShot.play();
    if (canShot == true) {
      canShot = false;

      positionY = parseInt($("#player").css("top"));
      positionX = parseInt($("#player").css("left"));
      shotX = positionX + 170;
      topShot = positionY + 31;
      console.log(topShot);
      console.log(shotX);
      $("#background").append("<div id='shot'></div");
      $("#shot").css("top", topShot);
      $("#shot").css("left", shotX);

      var timeShot = window.setInterval(shotExecute, 30);
    }

    function shotExecute() {
      positionX = parseInt($("#shot").css("left"));
      $("#shot").css("left", positionX + 15);

      if (positionX > 900) {
        window.clearInterval(timeShot);
        timeShot = null;
        $("#shot").remove();
        canShot = true;
      }
    }
  }

  function moveAlien1() {
    positionX = parseInt($("#alien1").css("left"));
    $("#alien1").css("left", positionX - speed);
    $("#alien1").css("top", positionY);

    if (positionX <= 0) {
      positionY = parseInt(Math.random() * 334);
      $("#alien1").css("left", 694);
      $("#alien1").css("top", positionY);
    }
  }

  function moveAlien2() {
    positionX = parseInt($("#alien2").css("left"));
    $("#alien2").css("left", positionX - 3);

    if (positionX <= 0) {
      $("#alien2").css("left", 775);
    }
  }

  function moveSatellite() {
    positionX = parseInt($("#satellite").css("left"));
    $("#satellite").css("left", positionX + 3);

    if (positionX > 890) {
      $("#satellite").css("left", 0);
    }
  }

  function collisionFunction() {
    var collision1 = $("#player").collision($("#alien1"));
    var collision2 = $("#player").collision($("#alien2"));
    var collision3 = $("#shot").collision($("#alien1"));
    var collision4 = $("#shot").collision($("#alien2"));
    var collision5 = $("#player").collision($("#satellite"));
    var collision6 = $("#alien2").collision($("#satellite"));

    if (collision1.length > 0) {
      actualEnergy--;
      sfxExplosion.play();
      alien1X = parseInt($("#alien1").css("left"));
      alien1Y = parseInt($("#alien1").css("top"));
      explosion1(alien1X, alien1Y);

      positionY = parseInt(Math.random() * 200);
      $("#alien1").css("left", 694);
      $("#alien1").css("top", positionY);
    }

    if (collision2.length > 0) {
      actualEnergy--;
      sfxExplosion.play();
      alien2X = parseInt($("#alien2").css("left"));
      alien2Y = parseInt($("#alien2").css("top"));
      explosion2(alien2X, alien2Y);

      $("#alien2").remove();

      repoAlien2();
    }

    if (collision3.length > 0) {
      speed = speed + 0.3;
      points = points + 100;
      sfxExplosion.play();
      alien1X = parseInt($("#alien1").css("left"));
      alien1Y = parseInt($("#alien1").css("top"));

      explosion1(alien1X, alien1Y);
      $("#shot").css("left", 950);

      positionY = parseInt(Math.random() * 334);
      $("#alien1").css("left", 694);
      $("#alien1").css("top", positionY);
    }

    if (collision4.length > 0) {
      points = points + 50;
      sfxExplosion.play();
      alien2X = parseInt($("#alien2").css("left"));
      alien2Y = parseInt($("#alien2").css("top"));
      $("#alien2").remove();

      explosion2(alien2X, alien2Y);
      $("#shot").css("left", 950);

      repoAlien2();
    }

    if (collision5.length > 0) {
      saved++;
      points = points + 100;
      sfxSaved.play();
      repoSatellite();
      $("#satellite").remove();
    }

    if (collision6.length > 0) {
      points = points - 100;
      losted++;
      sfxExplosion.play();
      satelliteX = parseInt($("#satellite").css("left"));
      satelliteY = parseInt($("#satellite").css("top"));
      explosion3(satelliteX, satelliteY);
      $("#satellite").remove();

      repoSatellite();
    }
  }

  function explosion1(alien1X, alien1Y) {
    $("#background").append("<div id='explosion1'></div");
    $("#explosion1").css("background-image", "url(img/explosion.png)");
    var div = $("#explosion1");
    div.css("top", alien1Y);
    div.css("left", alien1X);
    div.animate({ width: 200, opacity: 0 }, "slow");

    var timeExplosion = window.setInterval(removeExplosion, 1000);

    function removeExplosion() {
      div.remove();
      window.clearInterval(timeExplosion);
      timeExplosion = null;
    }
  }

  function repoAlien2() {
    var timeCollision4 = window.setInterval(repo4, 5000);

    function repo4() {
      window.clearInterval(timeCollision4);
      timeCollision4 = null;

      if (gameover == false) {
        $("#background").append("<div id='alien2'></div");
      }
    }
  }

  function explosion2(alien2X, alien2Y) {
    $("#background").append("<div id='explosion2'></div");
    $("#explosion2").css("background-image", "url(img/explosion.png)");
    var div = $("#explosion2");
    div.css("top", alien1Y);
    div.css("left", alien1X);
    div.animate({ width: 200, opacity: 0 }, "slow");

    var timeExplosion = window.setInterval(removeExplosion, 1000);

    function removeExplosion() {
      div.remove();
      window.clearInterval(timeExplosion);
      timeExplosion = null;
    }
  }

  function repoSatellite() {
    var timeSatellite = window.setInterval(repo6, 6000);

    function repo6() {
      window.clearInterval(timeSatellite);
      timeSatellite = null;

      if (gameover == false) {
        $("#background").append("<div id='satellite'></div>");
      }
    }
  }

  function explosion3(satelliteX, satelliteY) {
    $("#background").append("<div id='explosion3'></div");
    $("#explosion3").css("background-image", "url(img/explosion.png)");
    var div = $("#explosion3");
    div.css("top", satelliteY);
    div.css("left", satelliteX);
    div.animate({ width: 200, opacity: 0 }, "slow");

    var timeExplosion = window.setInterval(removeExplosion, 1000);

    function removeExplosion() {
      div.remove();
      window.clearInterval(timeExplosion);
      timeExplosion = null;
    }
  }

  function score() {
    $("#score").html(
      "<h3> Score: " +
        points +
        " Salvos: " +
        saved +
        " Perdidos: " +
        losted +
        "</h3>"
    );
  }

  function energy() {
    if (actualEnergy == 3) {
      $("#energy").css("background-image", "url(img/energy3.png)");
    }

    if (actualEnergy == 2) {
      $("#energy").css("background-image", "url(img/energy2.png)");
    }

    if (actualEnergy == 1) {
      $("#energy").css("background-image", "url(img/energy1.png)");
    }

    if (actualEnergy == 0) {
      $("#energy").css("background-image", "url(img/energy0.png)");

      gameOver();
    }
  }

  function gameOver() {
    gameover = true;
    sfx.pause();
    sfxGameover.play();

    window.clearInterval(game.timer);
    game.timer = null;

    $("#player").remove();
    $("#alien1").remove();
    $("#alien2").remove();
    $("#satellite").remove();

    $("#background").append("<div id='end'></div>");

    $("#end").html(
      "<h1> Game Over </h1><p>Sua pontuação foi: " +
        points +
        "</p>" +
        "<div id='restart' onClick=restartGame()><button id='button'>Jogar Novamente</button></div>"
    );
  }
}

function restartGame() {
  sfxGameover.pause();
  $("#end").remove();
  start();
}
