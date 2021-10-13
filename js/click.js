var initialPosition = {
  wrap_lena: {
    left: "80%",
    top: "10%",
    "font-size":4,
    "scale":1,
    "max-width": "12vw"
  },

  wrap_jasper: {
    left: "50%",
    top: "30%",
    "font-size": 4,
    "scale":1,
    "max-width": "12vw"
  },

  wrap_luci: {
    left: "11%",
    top: "28%",
    "font-size": 4,
    "scale":1,
    "max-width": "12vw"
  },

  wrap_luca: {
    left: "41%",
    top: "64%",
    "font-size": 4,
    "scale":1,
    "max-width": "12vw"
  },

  wrap_amelie: {
    left: "71%",
    top: "42%",
    "font-size": 4,
    "scale":1,
    "max-width": "16vw"
  },

  wrap_clara: {
    left: "31%",
    top: "5%",
    "font-size": 4,
    "scale":1,
    "max-width": "13vw"
  }
}

var getAttribute = function(id, attr) {
  return initialPosition[id][attr];
}

var setAttribute = function (id, attr, value) {
  return initialPosition[id][attr] = value;
}


var hasClass = function (elem, someClass) {
  var classList = $(elem).attr("class").split(/\s+/);
  for (var i = 0; i < classList.length; i++) {
    if (classList[i] === someClass) {
      return true;
    }
  }
  return false;
}

var setTextScale = function (elem, scale) {
  var id = $(elem).attr('id')
  setAttribute(id, "scale", scale)
  return move("#" + id)
    .ease("out")
    .set("font-size", ""+4*scale+"pt")
    .duration("0.1")
}

var moveTextsToInitialPosition = function (duration) {
  $(".wrap").each(function () {
      moveTextToInitialPosition(this, duration)
  })
}

var moveTextToInitialPosition = function(elem, duration) {
  var id = $(elem).attr('id')
  attributes = initialPosition[id]
  for (var attribute in attributes) {
    move("#" + id)
      .set(attribute, attributes[attribute])
      .duration(duration)
      .end()
  }
}


$(document).ready(function () {

  // initially move each text to its position
  moveTextsToInitialPosition("0.0s")
  $(".wrap").each(function () {
    var id = $(this).attr('id')
    move("#" + id)
    .set("opacity", "1")
    .delay("1s")
    .duration("0.8s")
    .end()

    move("#" + id).delay("0s").end()
  })


  // $(".wrap").click(function () {
  //     let text = $(this);
  //     let test_pos = text.offset().left;
  //     $(".wrap").each(function () {
  //         $(this).removeClass("focus");
  //         if ($(this).offset().left < test_pos) {
  //             $("#container_left").append(this);
  //         } else {
  //             $("#container_right").append(this);

  //         }

  //     })
  //     $("#container_middle").append($(this));
  //     $(this).addClass("focus");
  //  })

  $(".wrap").hover(function () {
    var id = $(this).attr('id');
    if (!hasClass(this, "focus")) {
      move("#" + id)
        .set("font-size", getAttribute(id, "scale")*5+"pt")
        .duration("0.25")
        .end();
    }
  }, function () {
    var id = $(this).attr('id');
    move("#" + id)
      .set("font-size", getAttribute(id, "scale") * 4 + "pt")
      .duration("0.25")
      .end();
  })

  $(".wrap").click(function () {
    // clicked text toggles scale
    var idClicked = $(this).attr('id');
    if (!hasClass(this, "focus")) {
      $(this).addClass("focus")
      move("#" + idClicked)
        .set("font-size", getAttribute(idClicked, "scale") * 4 + "pt")
        .duration("0.15")
        .end();
      // todo: move to position at top
      setTextScale(this, 2.5)
      .set("top", "2%")
      .set("max-width", "40vw")
      .set("max-height", "100vh")
      // .set("top", "0%")
      .end()

    } else {
      $(this).removeClass("focus")
      setTextScale(this, 1.0).end()
      moveTextsToInitialPosition("0.15s");
    }
    // all other texts change scale to small
    $(".wrap").each(function () {
      var idOther = $(this).attr('id');
      if (idOther == idClicked)
        return;
      setTextScale(this, 1).end()
      $(this).removeClass("focus")

    })
  })

  // clicking background minimizes all texts
  $("body .gross").click(function () {
    $(".wrap").each(function () {
      setTextScale(this, 1).end()
      $(this).removeClass("focus")
    })
    moveTextsToInitialPosition("0.15s");
  })

});



