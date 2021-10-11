$(document).ready(function () {

    $(".wrap").click(function () {
        let text = $(this);
        let test_pos = text.offset().left;
        $(".wrap").each(function () {
            $(this).removeClass("focus");
            if ($(this).offset().left < test_pos) {
                $("#container_left").append(this);
            } else {
                $("#container_right").append(this);

            }

        })


        $("#container_middle").append($(this));
        $(this).addClass("focus");

    })



});
