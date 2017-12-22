class keyWord {
    constructor(keyWord = "", youTuber = "", channel = "", playList = "") {
        this.self = keyWord
        this.youTuber = youTuber
        this.channel = channel
        this.playList = playList
    }
}

$(document).ready(function () {
    // $("#sortable").selectable();
    let list_KeyWord = new Array();

    // list_KeyWord[0] = new keyWord("阅后即瞎")
    // list_KeyWord[1] = new keyWord("爸爸去哪")
    // let store = browser.storage.local.set({ list_KeyWord })
    let list = browser.storage.local.get("list_KeyWord")
    list.then((e) => {
        console.log("first get list")
        console.log(e.list_KeyWord)
        if (e.list_KeyWord === undefined) {
            console.log("no settings yet, it will give a error when first run \n don't worry, that's ok")
        }
        console.log(e.list_KeyWord.length)
        $("#sortable").empty()
        for (let i = 0; i < e.list_KeyWord.length; i++) {
            console.log(e.list_KeyWord[i].self)
            $("#sortable").append("<li>" + e.list_KeyWord[i].self + "</li>")
        }
    }, (error) => {
        window.alert("no settings")
    })
    $("ul").sortable();
    $("#add").submit((e) => {
        // e.preventDefault()//debug
        console.log("got a new one")
        console.log($("#newKeyWord").val())
        $("#sortable").prepend("<li>" + $("#newKeyWord").val() + "</li>")
        $("#sortable").find("li").each((i, e) => {
            console.log(e.innerText)
            list_KeyWord[i] = new keyWord(e.innerText)
        })
        console.log(list_KeyWord)
        let store = browser.storage.local.set({ list_KeyWord })

    })
    $("#delete").click(() => {
        list_KeyWord.length = 0
        $("#sortable").find("li").last().remove()
        $("#sortable").find("li").each((i, e) => {
            list_KeyWord[i] = new keyWord(e.innerText)
        })
        let store = browser.storage.local.set({ list_KeyWord })
    })
    // $("#sortable").disableSelection();
})