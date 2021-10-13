var baseFontSize = 5;

var generalAttributes = {
  "font-size":baseFontSize,
  "bias":0
}

var initialAttributes = {
  wrap_lena: {
    left: "80%",
    top: "10%",
    bias: "280",
    "scale":1,
    "max-width": "8vw"
  },

  wrap_jasper: {
    left: "50%",
    top: "30%",
    bias: "130",
    "scale":1,
    "max-width": "9vw"
  },

  wrap_luci: {
    left: "11%",
    top: "28%",
    bias: "20",
    "scale":1,
    "max-width": "10vw"
  },

  wrap_luca: {
    left: "41%",
    top: "64%",
    bias: "150",
    "scale":1,
    "max-width": "9vw"
  },

  wrap_amelie: {
    left: "71%",
    top: "42%",
    bias: 200,
    "scale":1,
    "max-width": "16vw",
  },

  wrap_clara: {
    left: "31%",
    top: "5%",
    bias: "80",
    "scale":1,
    "max-width": "13vw"
  }
}

var getAttribute = function(id, attr) {
  var specific = initialAttributes[id][attr];
  if (specific === undefined)
    return generalAttributes[attr];
  return specific
}

var setAttribute = function (id, attr, value) {
  return initialAttributes[id][attr] = value;
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
    .set("font-size", ""+baseFontSize*scale+"pt")
    .duration("0.1")
}

var applyInitialStates = function (duration) {
  $(".wrap").each(function () {
      applyInitialState(this, duration)
  })
}

var applyInitialState = function(elem, duration) {
  var id = $(elem).attr('id')
  attributes = initialAttributes[id]
  for (var attribute in attributes) {
    move("#" + id)
      .set(attribute, attributes[attribute])
      .duration(duration)
      .set("margin-left", 0)
      .end()
  }
}


$(document).ready(function () {

  console.log(getAttribute("wrap_luca", "ljkd"))
  // initially move each text to its position
  applyInitialStates("0.0s")
  $(".wrap").each(function () {
    var id = $(this).attr('id')
    move("#" + id)
    .set("opacity", "1")
    .ease("out")
    .delay("0.4s")
    .duration("1.2s")
    .end()

    move("#" + id).delay("0s").end()
  })

  // fade-out schriftzug "ohne routine"
  move(".gross")
  .ease("out")
  .set("opacity", "0.05")
  .delay("0.4s")
  .duration("1.2s")
  .end()

  // reaction of small texts on hover
  $(".wrap").hover(function () {
    var id = $(this).attr('id');
    if (!hasClass(this, "focus")) {
      move("#" + id)
        .set("font-size", getAttribute(id, "scale")*(baseFontSize+1)+"pt")
        .duration("0.25")
        .end();
    }
  }, function () {
    var id = $(this).attr('id');
    move("#" + id)
      .set("font-size", getAttribute(id, "scale") * baseFontSize + "pt")
      .duration("0.25")
      .end();
  })

  $(".wrap").click(function () {
    // clicked text toggles scale
    var idClicked = $(this).attr('id');
    if (!hasClass(this, "focus")) {
      $(this).addClass("focus")
      move("#" + idClicked)
        .set("font-size", getAttribute(idClicked, "scale") * baseFontSize + "pt")
        .duration("0.15")
        .end();
      // todo: move to position at top
      setTextScale(this, 3.2)
      .set("top", "2%")
      .sub("margin-left", getAttribute(idClicked, "bias"))
      .set("max-width", "34vw")
      .end()

    } else {
      $(this).removeClass("focus")
      setTextScale(this, 1.0).end()
      applyInitialStates("0.15s");
    }

    // all other texts change scale to small
    $(".wrap").each(function () {
      var idOther = $(this).attr('id');
      if (idOther == idClicked)
        return;
      setTextScale(this, 1).end()
      applyInitialState(this, "0.15s")
      $(this).removeClass("focus")

    })
  })

  // clicking background minimizes all texts
  $("body .gross").click(function () {
    $(".wrap").each(function () {
      setTextScale(this, 1).end()
      $(this).removeClass("focus")
    })
    applyInitialStates("0.15s");
  })
});



