$(document).ready(function () {
    $(".col > ul").resizable()
    $("button").button()
    $("#dialog").dialog({
        width: 600
    });
    $("#ImportPlaylist").on("click", function () {
        $("#dialog").dialog("open")
    })
})