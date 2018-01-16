$(document).ready(function () {
    $(".col > ul").resizable()
    $("button").button()
    $("#dialog").dialog({
        width: 600,
        autoOpen: false
    });
    $("#dlHelp").dialog({
        width: 600,
        autoOpen: false
    })
    $("#ImportPlaylist").on("click", function () {
        $("#dialog").dialog("open")
    })
    $("#Help").on("click", function () {
        $("#dlHelp").dialog("open")
    })
    $("#ulKeyword .labKeyword").tooltip({
        open: function () {
            if (this.offsetWidth == this.scrollWidth) {
                $(this).tooltip("disable")
                $(this).tooltip("enable")
            }
        }
    })
    $("#ulKeyword").sortable({
        axis: "y",
        start: function () {
            $("#ulKeyword .labKeyword").tooltip("disable")
        },
        stop: function () {
            $("#ulKeyword .labKeyword").tooltip("enable")
        }
    })

})