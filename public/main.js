function search() {
    var input = document.getElementById("input").value
    if(input.length<=1){
        alert('1글자 이하로는 검색하실 수 없습니다!')
        return 0;
    }
    var output=''
    var oFrame = document.getElementById("frmFile");
    var strRawContents = oFrame.contentWindow.document.body.childNodes[0].innerHTML;
    while (strRawContents.indexOf("\r") >= 0)
        strRawContents = strRawContents.replace("\r", "");
    var arrLines = strRawContents.split("\n");
    for (var i = 0; i < arrLines.length; i++) {
        var curLine = arrLines[i];
        if(curLine.startsWith(input))
        {
            output=output+'• '+curLine+'\n'
        }
    }
    document.getElementById("output").innerText = output
}
