function save() {
    console.log("saving...")
    let saveList = new Array()
    let offList = new Array()
    let tempKeyword
    $("#ulKeyword .spKeyword:visible").each(function (idx, elm) {
        // console.log(idx)
        // console.log(elm)
        let [keyword, channel] = parseInputLine($(".labKeyword", elm).prop("longOutput"))
        if ($(".ckPlaylist", elm).prop("checked")) {
            //this is a playlist
            tempKeyword = new keyWord([""], channel, keyword.join())
        } else {
            //this is a keyword
            tempKeyword = new keyWord(keyword, channel, "")
        }
        if ($(".ckOnoff", elm).prop("checked") == false) {
            tempKeyword.onOff = false
            offList.push(tempKeyword)
        } else {
            saveList.push(tempKeyword)
        }
    })
    // console.log(saveList)
    // console.log("from")
    // console.log($("#ulKeyword .spKeyword:visible"))
    browser.storage.local.set({ list_KeyWord: saveList })
    browser.storage.local.set({ list_OffKeyWord: offList })
}

function handleLabel() {
    $(this).prev().prop("value", $(this).prop("longOutput"))
    $(this).prev().css("display", "inline").focus()
    $(this).css("display", "none")
}

function handleTextfield() {
    console.log("did it focus out?")
    let [keyword, channel] = parseInputLine($(this).prop("value"))
    let longOutput = reverseParseKeyword(keyword, channel)
    let shortOutput = keyword.join(",") + ";" + channel
    $(this).next().text(shortOutput)
    $(this).next().prop("longOutput", longOutput)
    $(this).next().css("display", "inline")
    $(this).css("display", "none")
    console.log("did it work?")
    save()
}

function handleDelete() {
    $(this).closest(".liKeyword").remove()
    save()
}

function parseInputLine(keyString) {
    //find the character before semicolon
    // console.log("parseR1: "+keyString)
    let preSemicolon = keyString.match(/[^\\];/g)
    if (preSemicolon === null) { preSemicolon = [""] }
    // console.log(preSemicolon)
    for (let i = 0; i < preSemicolon.length; i++) {
        preSemicolon[i] = preSemicolon[i].slice(0, -1)
    }
    // console.log(preSemicolon)
    //split keyString with semicolon
    // let [keyword, channel] = $("#tfAdd").prop("value").split(/[^\\];/, 2)
    let [keyword, channel] = keyString.split(/[^\\];/, 2)
    // console.log("parseR2: " + keyword + "|" + channel)
    // console.log(preSemicolon)
    if (preSemicolon[0] !== undefined) { keyword += preSemicolon[0] }
    //if there is no channel given
    if (channel === undefined) { channel = "" }
    if (preSemicolon[1] !== undefined) { channel += preSemicolon[1] }
    //clear \;
    keyword = keyword.replace(/\\;/g, ";")
    channel = channel.replace(/\\;/g, ";")

    //to true keyword
    let preComma = keyword.match(/[^\\],/g)
    if (preComma === null) { preComma = [""] }
    for (let i = 0; i < preComma.length; i++) {
        preComma[i] = preComma[i].slice(0, -1)
    }
    // console.log(preComma)
    let keywordArray = keyword.split(/[^\\],/g)
    for (let i = 0; i < keywordArray.length; i++) {
        if (preComma[i] !== undefined) { keywordArray[i] += preComma[i] }
        keywordArray[i] = keywordArray[i].replace(/\\,/g, ",")
    }
    // console.log("parseR3: " + keywordArray + "|" + channel)
    return [keywordArray, channel]
}

function reverseParseKeyword(keywordArray, channel) {
    // console.log(keywordArray)
    let result
    if (jQuery.type(keywordArray) === "array") {
        let keyword = new Array(keywordArray.length)
        for (let i = 0; i < keywordArray.length; i++) {
            // console.log(keywordArray[i])
            keyword[i] = keywordArray[i].replace(/,/g, "\\,")
        }
        // console.log(keyword)
        result = keyword.join(",")
    } else if (jQuery.type(keywordArray) === "string") {
        result = keywordArray.replace(/,/g, "\\,")
    }
    result = result.replace(/;/g, "\\;")
    result += ";"
    result += channel.replace(/;/g, "\\;")
    // console.log("reverse: " + result)
    return result
}

function htmlSnippet(shortOutput, longOutput) {
    return '\
    <li class="liKeyword">\
        <span class="spKeyword">\
            <input name="textfield" type="text" class="tfKeyword" style="display:none">\
            <label for="textfield2" class="labKeyword" title="' + shortOutput + '">' + shortOutput + '</label>\
            <span class="spRight">\
                <input type="checkbox" class="ckPlaylist">\
                <label>Playlist</label>\
                <input type="checkbox" class="ckOnoff">\
                <label>On/Off</label>\
                <input type="button" class="btDelete" value="Delete">\
            </span>\
        </span>\
    </li>'
}

function handleAdd() {
    console.log("adding keyword...")

    let [keyword, channel] = parseInputLine($("#tfAdd").prop("value"))
    $("#tfAdd").prop("value", "")
    let longOutput = reverseParseKeyword(keyword, channel)
    let shortOutput = keyword.join(",") + ";" + channel
    // console.log(longOutput)
    // console.log(shortOutput)
    $("#ulKeyword").prepend(htmlSnippet(shortOutput, longOutput))
    $("#ulKeyword .spKeyword:first .labKeyword").prop("longOutput", longOutput)
    $("#ulKeyword .spKeyword:first .ckOnoff").prop("checked", true)

    // console.log($("#ulKeyword span:first"))
    //add event listener
    $("#ulKeyword .spKeyword:first").on("dblclick", ".labKeyword", handleLabel)
    $("#ulKeyword .spKeyword:first").on("focusout", ".tfKeyword", handleTextfield)
    $("#ulKeyword .spKeyword:first").on("click", ".btDelete", handleDelete)
    $("#ulKeyword .spKeyword:first .ckPlaylist").on("click", save)
    $("#ulKeyword .spKeyword:first .ckOnoff").on("click", save)
    // set tooltip
    $("#ulKeyword .labKeyword").tooltip({
        open: function () {
            if (this.offsetWidth == this.scrollWidth) {
                $(this).tooltip("disable")
                $(this).tooltip("enable")
            }
        }
    })
    $("#ulKeyword").on("sortstart", function () { $("#ulKeyword .labKeyword").tooltip("disable") })
    $("#ulKeyword").on("sortstop", function () { $("#ulKeyword .labKeyword").tooltip("enable") })
    save()
}

function loadSetting() {
    let prmsSaveList = browser.storage.local.get("list_KeyWord")
    let prmsOffList = browser.storage.local.get("list_OffKeyWord")
    Promise.all([prmsSaveList, prmsOffList]).then((o) => {
        if (o[0].list_KeyWord === undefined && o[1].list_OffKeyWord === undefined) {
            console.log("no settings")
            return
        }
        let allList
        if (o[0].list_KeyWord === undefined) {
            allList = o[1].list_OffKeyWord
        } else if (o[1].list_OffKeyWord === undefined) {
            allList = o[0].list_KeyWord
        } else {
            allList = o[0].list_KeyWord.concat(o[1].list_OffKeyWord)
        }
        // console.log(allList)//debug
        for (let i = 0; i < allList.length; i++) {
            let keywordContent, shortOutput
            let isPlaylist = false
            if (allList[i].playList == "") {
                //if this is keyword
                keywordContent = allList[i].self
                shortOutput = allList[i].self.join(",") + ";" + allList[i].channel
            } else {
                // if this is playlist
                isPlaylist = true
                keywordContent = allList[i].playList
                shortOutput = allList[i].playList + ";" + allList[i].channel
            }
            let longOutput = reverseParseKeyword(keywordContent, allList[i].channel)
            $("#ulKeyword").append(htmlSnippet(shortOutput, longOutput))
            $("#ulKeyword .spKeyword:last .labKeyword").prop("longOutput", longOutput)
            $("#ulKeyword .spKeyword:last .ckOnoff").prop("checked", allList[i].onOff)
            $("#ulKeyword .spKeyword:last .ckPlaylist").prop("checked", isPlaylist)
            //add event listener
            $("#ulKeyword .spKeyword:last .labKeyword").on("dblclick", handleLabel)
            $("#ulKeyword .spKeyword:last .tfKeyword").on("focusout", handleTextfield)
            $("#ulKeyword .spKeyword:last .btDelete").on("click", handleDelete)
            $("#ulKeyword .spKeyword:last .ckPlaylist").on("click", save)
            $("#ulKeyword .spKeyword:last .ckOnoff").on("click", save)
            //set tooltip
            $("#ulKeyword .spKeyword .labKeyword").tooltip({
                open: function () {
                    if (this.offsetWidth == this.scrollWidth) {
                        $(this).tooltip("disable")
                        $(this).tooltip("enable")
                    }
                }
            })
            $("#ulKeyword").on("sortstart", function () { $("#ulKeyword .labKeyword").tooltip("disable") })
            $("#ulKeyword").on("sortstop", function () { $("#ulKeyword .labKeyword").tooltip("enable") })
        }
    })

    // browser.storage.local.get("list_KeyWord").then((o) => {
    //     if (o.list_KeyWord === undefined) {
    //         console.log("no settings")
    //         return
    //     }
    //     console.log("loading...")
    //     for (let i = 0; i < o.list_KeyWord.length; i++) {
    //         let keywordContent, shortOutput
    //         let isPlaylist = false
    //         if (o.list_KeyWord[i].playList == "") {
    //             //if this is keyword
    //             keywordContent = o.list_KeyWord[i].self
    //             shortOutput = o.list_KeyWord[i].self.join(",") + ";" + o.list_KeyWord[i].channel
    //         } else {
    //             // if this is playlist
    //             isPlaylist = true
    //             keywordContent = o.list_KeyWord[i].playList
    //             shortOutput = o.list_KeyWord[i].playList + ";" + o.list_KeyWord[i].channel
    //         }
    //         let longOutput = reverseParseKeyword(keywordContent, o.list_KeyWord[i].channel)
    //         $("#ulKeyword").append(htmlSnippet(shortOutput, longOutput))
    //         $("#ulKeyword .spKeyword:last .labKeyword").prop("longOutput", longOutput)
    //         $("#ulKeyword .spKeyword:last .ckOnoff").prop("checked", o.list_KeyWord[i].onOff)
    //         $("#ulKeyword .spKeyword:last .ckPlaylist").prop("checked", isPlaylist)
    //         //add event listener
    //         $("#ulKeyword .spKeyword:last .labKeyword").on("dblclick", handleLabel)
    //         $("#ulKeyword .spKeyword:last .tfKeyword").on("focusout", handleTextfield)
    //         $("#ulKeyword .spKeyword:last .btDelete").on("click", handleDelete)
    //         $("#ulKeyword .spKeyword:last .ckPlaylist").on("click", save)
    //         $("#ulKeyword .spKeyword:last .ckOnoff").on("click", save)
    //         //set tooltip
    //         $("#ulKeyword .spKeyword .labKeyword").tooltip({
    //             open: function () {
    //                 if (this.offsetWidth == this.scrollWidth) {
    //                     $(this).tooltip("disable")
    //                     $(this).tooltip("enable")
    //                 }
    //             }
    //         })
    //         $("#ulKeyword").on("sortstart", function () { $("#ulKeyword .labKeyword").tooltip("disable") })
    //         $("#ulKeyword").on("sortstop", function () { $("#ulKeyword .labKeyword").tooltip("enable") })
    //     }
    // }, (error) => {
    //     window.alert("error, can't get storage")
    // })
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


    $("#ulKeyword").sortable({
        axis: "y",
        update: save
    })
    $("#btAdd").on("click", handleAdd)
    $("#tfAdd").on("keypress", function (e) {
        let code = e.keyCode || e.which
        if (code == 13) {
            handleAdd()
            $(this).prop("value", "")
        }
    })

    loadSetting()


})