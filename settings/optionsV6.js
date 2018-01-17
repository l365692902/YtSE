function handleOnoff() {
    console.log($(this).prop("checked"))
}
function handlePlaylist() {
    console.log($(this).prop("checked"))
}

function handleLabel() {
    let content = $(this).text()
    $(this).prev().prop("value", content)
    $(this).prev().css("display", "inline").focus()
    $(this).css("display", "none")
}

function handleTextfield() {
    let content = $(this).prop("value")
    $(this).next().text(content)
    $(this).next().css("display", "inline")
    $(this).css("display", "none")
}

function handleDelete() {
    $(this).closest(".liKeyword").remove()
}

function parseKeyword(keyString) {
    //find the character before semicolon
    let preSemicolon = keyString.match(/[^\\];/)
    if (preSemicolon === null) { preSemicolon = [""] }
    preSemicolon[0] = preSemicolon[0].slice(0, -1)
    //split keyString with semicolon
    let [keyword, channel] = $("#tfAdd").prop("value").split(/[^\\];/, 2)
    keyword += preSemicolon
    //if there is no channel given
    if (channel === undefined) { channel = "" }
    //to true keyword
    keyword = keyword.replace(/\\\,/g, ",")
    return [keyword, channel]
}

function handleAdd() {
    console.log("adding...")
    console.log($("#tfAdd").prop("value"))

    let [keyword, channel] = parseKeyword($("#tfAdd").prop("value"))
    console.log("|" + keyword + "|" + channel + "|")

    $("#ulKeyword").prepend('\
    <li class="liKeyword">\
        <span class="spKeyword">\
            <input name="textfield" type="text" class="tfKeyword" style="display:none">\
            <label for="textfield2" class="labKeyword" title='+ keyword + '>' + keyword + '</label>\
            <span class="spRight">\
                <input type="checkbox" class="ckPlaylist">\
                <label>Playlist</label>\
                <input type="checkbox" class="ckOnoff">\
                <label>On/Off</label>\
                <input type="button" class="btDelete" value="Delete">\
            </span>\
        </span>\
    </li>\
    ')

    console.log($("#ulKeyword span:first"))
    $("#ulKeyword span:first").on("dblclick", ".labKeyword", handleLabel)
    $("#ulKeyword span:first").on("change focusout", ".tfKeyword", handleTextfield)
    $("#ulKeyword span:first").on("click", ".btDelete", handleDelete)
    $("#ulKeyword .labKeyword:first").tooltip({
        open: function () {
            if (this.offsetWidth == this.scrollWidth) {
                $(this).tooltip("disable")
                $(this).tooltip("enable")
            }
        }
    })
    $("#ulKeyword").on("sortstart", function () { $("#ulKeyword .labKeyword:first").tooltip("disable") })
    $("#ulKeyword").on("sortstop", function () { $("#ulKeyword .labKeyword:first").tooltip("enable") })

}

function initialize() {
    console.log("initial")
    $("#btAdd").on("click", handleAdd)
    $(".btDelete").on("click", handleDelete)
    $(".ckPlaylist").on("click", handlePlaylist)
    $(".ckOnoff").on("click", handleOnoff)
    $(".labKeyword").on("dblclick", handleLabel)
    $(".tfKeyword").on("change focusout", handleTextfield)
}


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

    initialize()

})