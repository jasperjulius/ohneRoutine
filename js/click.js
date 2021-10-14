var baseFontSize = 5;

var generalAttributes = {
  "font-size":baseFontSize,
  "bias":0,
  "max-width-focus": "34vw"
}

var initialAttributes = {
  wrap_lena: {
    left: "70%",
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
    left: "38%",
    top: "61%",
    bias: "150",
    "scale":1,
    "max-width": "9vw"
  },

  wrap_amelie: {
    left: "75%",
    top: "45%",
    bias: 350,
    "scale":1,
    "max-width": "16vw",
    "max-width-focus": "45vw",
  },

  wrap_clara: {
    left: "31%",
    top: "5%",
    bias: "80",
    "scale":1,
    "max-width": "13vw"
  }
}

function ID(elem) {
  return $(elem).attr("id")
}


var getAttributeAsNumber = function(id, attr) {
  var attribute = getAttribute(id, attr);
  var attribute = attribute.replace(/[a-zA-Z]/, "")
  return parseFloat(attribute)
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
  let id = ID(elem)
  setAttribute(id, "scale", scale)
  return move("#" + id)
    .ease("out")
    .set("font-size", ""+baseFontSize*scale+"pt")
    .duration("0.1")
}

var applyInitialStates = function (duration) {
  $(".wrap").each(function () {
      applyInitialState(this, duration).end()
  })
}

var applyInitialState = function(elem, duration) {
  let id = ID(elem)
  attributes = initialAttributes[id]
  moveFunc = move("#" + id)
    .duration(duration)
    .x(0)
    .set("margin-left", 0)
  for (var attribute in attributes) {
    moveFunc = moveFunc
      .set(attribute, attributes[attribute])
  }
  return moveFunc
}

var calcCenterOfObject = function(elem){
  var pos = $(elem).position()
  var height = $(elem).height()
  var width = $(elem).width()
  var result = {x:pos.left + width/2,
          y:pos.top + height/2}
  // console.log("pos: "+pos)
  // console.log("height, width:"+height+", "+width)
  // console.log("center of element: "+result)
  return result
}

$(document).ready(function () {

  // initially move each text to its position
  applyInitialStates("0.0s")
  $(".wrap").each(function () {
    move("#" + ID(this))
    .set("opacity", "1")
    .ease("out")
    .delay("0.4s")
    .duration("1.2s")
    .end()

    move("#" + ID(this)).delay("0s").end()
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
    let id = ID(this)
    if (!hasClass(this, "focus")) {
      move("#" + id)
        .set("font-size", getAttribute(id, "scale")*(baseFontSize+1)+"pt")
        .duration("0.25")
        .end();
    }
  }, function () {
    let id = ID(this);
    move("#" + id)
      .set("font-size", getAttribute(id, "scale") * baseFontSize + "pt")
      .duration("0.25")
      .end();
  })

  // click on any text - 
  $(".wrap").click(function () {
    let idClicked = ID(this);

    // todo: transform to using moveObject instead of triggering every animation straight away - might solve some problems
    let moveObjects = {
      wrap_lena: move('#'+"wrap_lena"),
      wrap_jasper: move('#'+"wrap_jasper"),
      wrap_luci: move('#'+"wrap_luci"),
      wrap_luca: move('#'+"wrap_luca"),
      wrap_amelie: move('#'+"wrap_amelie"),
      wrap_clara: move('#'+"wrap_clara")
    }
    // all texts change scale to small
    $(".wrap").each(function () {
      $(this).removeClass("focus")
      setTextScale(this, 1).end()
      applyInitialState(this, "0.15s").end()
    })

    // clicked text toggles scale
    if (!hasClass(this, "focus")) {
      $(this).addClass("focus")
      move("#" + idClicked)
        .x(0)
        .set("font-size", getAttribute(idClicked, "scale") * baseFontSize + "pt")
        .duration("0.15")
        .end();
      setTextScale(this, 3.2)
      .set("top", "2%")
      .sub("margin-left", getAttribute(idClicked, "bias"))
      .set("max-width", getAttribute(idClicked, "max-width-focus"))
      .end()

    } else {
      $(this).removeClass("focus")
      setTextScale(this, 1.0).end()
      applyInitialState(this, "0.15s");
      return
    }

    // all other texts are moved to the side
    const centerBeforeClick = calcCenterOfObject(this)
    const windowWidth = jQuery(window).width()
    const leftBorderClicked = $(this).position().left - getAttribute(idClicked, "bias")
    const widthClicked = getAttributeAsNumber(idClicked, "max-width-focus") / 100 * windowWidth
    const rightBorderClicked = leftBorderClicked + widthClicked
    // console.log("viewport: " + jQuery(window).width()+", leftBorderClicked: "+leftBorderClicked+", rightBorderClicked: "+rightBorderClicked+", widthClicked: "+widthClicked)
    $(".wrap").each(function () {
      if (hasClass(this, "focus"))
        return;
      thisMove = applyInitialState(this, "0.1s").end()
      const center = calcCenterOfObject(this)
      if (center.x < centerBeforeClick.x){
        let newPositionX = center.x/centerBeforeClick.x*leftBorderClicked*0.9
        let change = newPositionX - center.x
        move('#'+ID(this))
          .ease("out")
          .x(change-20)
          .duration("0.15s")
           .end()
      } else {
        const w = windowWidth
        // todo: calculate 
        let newPositionX = w - (w - center.x)/(w - centerBeforeClick.x)*(w - rightBorderClicked) * 0.9
        let change = newPositionX - center.x
        move('#' + ID(this))
          .ease("out")
          .x(change + 20)
          .duration("0.15s")
          .end()
      }

    })
  })

  // clicking background minimizes all texts
  $("body .gross").click(function () {
    $(".wrap").each(function () {
      setTextScale(this, 1).end()
      $(this).removeClass("focus")
      applyInitialState(this, "0.15s").end()
    })
    
  })

  // todo: when you mark text, it recognizes it as a click
});



