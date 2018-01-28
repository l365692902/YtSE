function handleFile() {
    console.log("got a file")
    console.log($("#fileField"))
    let file = $("#fileField")[0]
    // let file =document.getElementById("fileField").files[0]
    console.log(file.files[0])
    let reader = new FileReader()
    reader.readAsText(file.files[0])
    reader.onload = (myFile) => {
        // console.log(myFile.target.result)
        let ob = JSON.parse(myFile.target.result)
        console.log(ob[1])
    }
}

function htmlSnippet(videoInfo) {
    return '\
    <div class="row">\
        <div class="col">\
            <div class="dismissable">\
                <span class="thumbnail">\
                    <a href="https://www.youtube.com' + videoInfo.videoUrl + '">\
                        <div>\
                            <img class="img-shadow" src="' + videoInfo.coverUrl + '"\
                            width="168">\
                        </div>\
                    </a>\
                </span>\
                <a href="https://www.youtube.com' + videoInfo.videoUrl + '">\
                    <h3>\
                        <span class="video-title">' + videoInfo.title + '</span>\
                    </h3>\
                    <div class="metadata">\
                        <div class="byline">' + videoInfo.channelName + '</div>\
                        <div class="metadate-line">' + videoInfo.videoTime + '</div>\
                    </div>\
                </a>\
            </div>\
        </div>\
    </div>'
}

function handleReload() {
    console.log("reloading...")
    $(".videoList").empty()
    browser.storage.local.get("list_vedio").then((o) => {
        if (o.list_vedio !== undefined) {
            for (let i = 0; i < o.list_vedio.length; i++) {
                $(".videoList").append(htmlSnippet(o.list_vedio[i]))
            }
        }
    })
}
$(document).ready(function () {
    $("#settings").on("click", function () {
        browser.runtime.openOptionsPage()
    })
    $("#update").on("click", function () {
        browser.runtime.sendMessage({ updateAll: true })
    })
    $("#reload").on("click", handleReload)
    handleReload()
})