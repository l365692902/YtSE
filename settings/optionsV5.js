function save() {
    let saveList = new Array()
    $(".ui-sortable").find("li:not(#add):visible").each(function (i, o) {
        console.log(i)
        console.log(o)
        console.log($(".playlist", o).prop("checked"))
        //如果是playlist
        if ($(".playlist", o).prop("checked")) {
            console.log($(".labKeyword", o).text())
            let [saveKeyword, saveChannel] = $(".labKeyword", o).text().split(";", 2)
            if (saveChannel === undefined) { saveChannel = "" }
            saveList[i] = new keyWord("", saveChannel, saveKeyword)

        } else {//如果是一般keyword
            let [saveKeyword, saveChannel] = $(".labKeyword", o).text().split(";", 2)
            if (saveChannel === undefined) { saveChannel = "" }
            saveList[i] = new keyWord(saveKeyword, saveChannel, "")
        }
        if ($(".onoff", o).prop("checked") == false) {
            saveList[i].onOff = false
        }
    })
    console.log("saving settings")
    browser.storage.local.set({ list_KeyWord: saveList })
}

function handleRadio() {
    if ($(this).prop("previous_status") == true) {
        $(this).prop("checked", false)
        $(this).prop("previous_status", false)
    } else {
        $(this).prop("checked", true)
        $(this).prop("previous_status", true)
    }
    save()
}

function handleRemove() {
    $(this).parent().remove()
    save()
}

function handleLabel() {
    let content = $(this).text()
    $(this).prev().prop("value", content)
    $(this).prev().css("display", "inline").focus()
    $(this).css("display", "none")
}

function handleText() {
    let content = $(this).prop("value")
    $(this).next().text(content)
    $(this).next().css("display", "inline")
    $(this).css("display", "none")
    save()
}

function handleAdd() {
    console.log($("#add .addKeyword").prop("value"))
    console.log(typeof ($("#add .addKeyword").prop("value")))
    console.log($("#add .addKeyword").prop("value").split(/;\s*/, 2))

    let [keyword, channel] = $("#add .addKeyword").prop("value").split(/\s*;\s*/, 2)
    keyword = keyword.replace(/\s*,\s*/g, ",")
    keyword = keyword.replace(/'/g, "")
    if (channel === undefined) { channel = "" }
    channel = channel.replace(/'/g, "")
    console.log("|" + keyword + "|" + channel + "|")

    $("#add").after('<li>\
    <img src="if_move_2561476.png" width="128" height="128" alt="" />\
    <input type="text" class="txtKeyword" style="display: none">\
    <label class="labKeyword">' + keyword + ';' + channel + '</label>\
    <input type="image" class="remove png" src="if_minus-square_2561471.png">\
    <div class="asPl">\
      <input type="radio" class="playlist">\
      <label>playlist</label>\
      <input type="radio" class="onoff">\
      <label>on/off</label>\
    </div>\
    </li>')
    keyword = keyword.replace(/,/g, ";")
    $("#add").next().find(".onoff").prop("checked", true)
    $("#add").next().find(".onoff").prop("previous_status", true)

    save()

    $("#add").next().on("dblclick", "> label", handleLabel)
    $("#add").next().on("change focusout", "> .txtKeyword", handleText)
    $("#add").next().on("click", ".asPl :radio", handleRadio)
    $("#add").next().on("click", ".remove", handleRemove)
}

function initialize() {
    // let newList = new Array()
    // newList[0] = new keyWord("k", "l", "")
    // newList[1] = new keyWord("", "ll", "kk")
    // browser.storage.local.set({ list_KeyWord: newList })
    let list = browser.storage.local.get("list_KeyWord")
    list.then((o) => {
        console.log(o.list_KeyWord)
        if (o.list_KeyWord === undefined) {
            console.log("no settings")
            return
        }
        // $(".ui-sortable-handle").remove()
        for (let i = 0; i < o.list_KeyWord.length; i++) {
            let isList, keywordContent
            if (o.list_KeyWord[i].self == "") {
                isList = true
                keywordContent = o.list_KeyWord[i].playList
            } else {
                isList = false
                keywordContent = o.list_KeyWord[i].self
            }

            $(".ui-sortable").append('<li>\
            <img src="if_move_2561476.png" width="128" height="128" alt="" />\
            <input type="text" class="txtKeyword" style="display: none">\
            <label class="labKeyword">' + keywordContent + ';' + o.list_KeyWord[i].channel + '</label>\
            <input type="image" class="remove png" src="if_minus-square_2561471.png">\
            <div class="asPl">\
              <input type="radio" class="playlist">\
              <label>playlist</label>\
              <input type="radio" class="onoff">\
              <label>on/off</label>\
            </div>\
            </li>')
            $(".ui-sortable :last-child").on("dblclick", "> label", handleLabel)
            $(".ui-sortable :last-child").on("change focusout", "> .txtKeyword", handleText)
            $(".ui-sortable :last-child").on("click", ".asPl :radio", handleRadio)
            $(".ui-sortable :last-child").on("click", ".remove", handleRemove)
            if (isList) {
                $(".ui-sortable li:last-child .playlist").prop("checked", true)
                $(".ui-sortable li:last-child .playlist").prop("previous_status", true)
            }
            if (o.list_KeyWord[i].onOff) {
                $(".ui-sortable li:last-child .onoff").prop("checked", true)
                $(".ui-sortable li:last-child .onoff").prop("previous_status", true)
            }
        }
    }, (error) => {
        window.alert("error, can't get storage")
    })
}


$(document).ready(function () {
    let list_keyword = new Array()

    $(".asPl :radio").on("click", function () {
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
        axis: "y",
        update: save
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

    initialize()

    $(".add").on("click", handleAdd)
    //do the samething when hit "enter"
    $(".addKeyword").on("keypress", function (e) {
        let code = e.keyCode || e.which
        if (code == 13) { handleAdd() }
    })
})