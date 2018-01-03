function handleRadio() {
    if ($(this).prop("previous_status") == true) {
        $(this).prop("checked", false)
        $(this).prop("previous_status", false)
    } else {
        $(this).prop("checked", true)
        $(this).prop("previous_status", true)
    }
}

function handleRemove() {
    $(this).parent().remove()
}


$(document).ready(function () {
    $(".asPl :radio").on("click", function (e) {
        if ($(this).prop("previous_status") == true) {
            $(this).prop("checked", false)
            $(this).prop("previous_status", false)
        } else {
            $(this).prop("checked", true)
            $(this).prop("previous_status", true)
        }
    })

    $("ul").sortable({
        items: "> li:not(#add)",
        axis: "y"
    })

    $(".remove").on("click", function () {
        $(this).parent().remove()
    })

    $("li > label").on("dblclick", function () {
        console.log(this)
        let content = $(this).text()
        console.log(content)
        $(this).prev().css("display", "inline").focus()
        $(this).css("display", "none")
    })

    $("li > .txtKeyword").on("change focusout", function () {
        console.log(this)
        let content = $(this).prop("value")
        console.log(content)
        $(this).next().css("display", "inline")
        $(this).css("display", "none")
    })

    $(".add").on("click", function () {
        console.log(this)
        $(this).parent().after('<li class="ui-sortable-handle">\
        <img src="if_move_2561476.png" alt="" width="128" height="128">\
        <input class="txtKeyword" style="display: none" type="text">\
        <label>hello world</label>\
        <input class="remove png" src="if_minus-square_2561471.png" type="image">\
        <div class="asPl">\
          <input type="radio">\
          <label>playlist</label>\
          <input type="radio">\
          <label>on/off&nbsp;</label>\
        </div>\
      </li>')
        $(this).parent().next().on("dblclick", "> label", function () {
            let content = $(this).text()
            $(this).prev().css("display", "inline").focus()
            $(this).css("display", "none")
        })
        $(this).parent().next().on("change focusout", "> .txtKeyword", function () {
            let content = $(this).prop("value")
            $(this).next().css("display", "inline")
            $(this).css("display", "none")
        })
        $(this).parent().next().on("click", ".asPl :radio", handleRadio)
        $(this).parent().next().on("click", ".remove", handleRemove)
    })
})