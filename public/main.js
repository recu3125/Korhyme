var inputlen
var resultssaved = []
var wordssaved = []
var scoressaved = []
var resultsnowshown = 0
var islight = 1
function viewportset() {
    var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    if (width < 600) {
        document.querySelector("meta[name=viewport]").setAttribute('content', 'width=device-width, initial-scale=' + Math.min(width / 600, 1));
    }
    if (location.pathname.startsWith('/search'))
        document.title = getParameter("key") + '와 라임이 맞는 단어'
    else
        document.title = 'Korhyme : 한국어 라임 검색기'
}
function isavailable(id) {
    return document.getElementById(id) !== null && document.getElementById(id) !== undefined
}
function darktgl() {
    if (islight == 1) {
        islight = 0
        if (isavailable('darktgl')) document.getElementById('darktgl').style.backgroundColor = "#FFFFFF"
        if (isavailable('backgr')) document.getElementById('backgr').style.background = "linear-gradient(90deg, #021515,#042525)"
        if (isavailable('backgr')) document.getElementById('backgr').style.color = "#FFFFFF"
        if (isavailable('topbar')) document.getElementById('topbar').style.backgroundColor = '#334444'
        if (isavailable('hr')) document.getElementById('hr').style.backgroundColor = '#f5c12f'
        if (isavailable('hr')) document.getElementById('hr').style.border = 'solid 3px #f5c12f'
        if (isavailable('inputdiv')) document.getElementById('inputdiv').style.border = 'solid 3px #f5c12f'
        if (isavailable('inputdiv')) document.getElementById('inputdiv').style.backgroundColor = '#f5c12f'
        if (isavailable('input')) document.getElementById('input').style.border = 'solid 2px #f5c12f'
        if (isavailable('input')) document.getElementById('input').style.color = 'solid 2px #FFFFFF'
        if (isavailable('search')) document.getElementById('search').style.border = 'solid 3px #f5c12f'
        if (isavailable('search')) document.getElementById('search').style.backgroundColor = '#f5c12f'
        if (isavailable('tbl')) document.getElementById("tbl").rows[0].style.backgroundColor = '#f5c12f'
        if (isavailable('selector')) document.getElementById("selector").className = 'sliderdark'
        if (isavailable('tbl')) {
            var rowCount = document.getElementById('tbl').rows.length;
            for (var i = 1; i < rowCount; i++) {
                if (i % 2 == 1)
                    document.getElementById("tbl").rows[i].style.backgroundColor = '#222222';
                else
                    document.getElementById("tbl").rows[i].style.backgroundColor = '#111111';
                document.getElementById("tbl").rows[i].style.color = '#FFFFFF';
            }
        }
    }
    else {
        islight = 1
        if (isavailable('darktgl')) document.getElementById('darktgl').style.backgroundColor = "#000000"
        if (isavailable('backgr')) document.getElementById('backgr').style.background = "linear-gradient(90deg, #f5c12f,#ffdc7b)"
        if (isavailable('backgr')) document.getElementById('backgr').style.color = "#000000"
        if (isavailable('topbar')) document.getElementById('topbar').style.backgroundColor = '#777766'
        if (isavailable('hr')) document.getElementById('hr').style.backgroundColor = '#1ca7a0'
        if (isavailable('hr')) document.getElementById('hr').style.border = 'solid 3px #1ca7a0'
        if (isavailable('inputdiv')) document.getElementById('inputdiv').style.border = 'solid 3px #1ca7a0'
        if (isavailable('inputdiv')) document.getElementById('inputdiv').style.backgroundColor = '#1ca7a0'
        if (isavailable('input')) document.getElementById('input').style.border = 'solid 2px #1ca7a0'
        if (isavailable('input')) document.getElementById('input').style.backgroundColor = 'solid 2px #FFFFFF'
        if (isavailable('input')) document.getElementById('input').style.color = 'solid 2px #000000'
        if (isavailable('search')) document.getElementById('search').style.border = 'solid 3px #1ca7a0'
        if (isavailable('search')) document.getElementById('search').style.backgroundColor = '#1ca7a0'
        if (isavailable('tbl')) document.getElementById("tbl").rows[0].style.backgroundColor = '#1ca7a0'
        if (isavailable('selector')) document.getElementById("selector").className = 'slider'
        if (isavailable('tbl')) {
            var rowCount = document.getElementById('tbl').rows.length;
            for (var i = 1; i < rowCount; i++) {
                if (i % 2 == 1)
                    document.getElementById("tbl").rows[i].style.backgroundColor = '#FFFFFF';
                else
                    document.getElementById("tbl").rows[i].style.backgroundColor = '#DDDDDD';
                document.getElementById("tbl").rows[i].style.color = '#000000';
            }
        }
    }
}

var mybutton
window.onscroll = function () { scrollFunction() };
function scrollFunction() {
    if (location.pathname.startsWith('/search')) {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            mybutton.style.display = "block";
        } else {
            mybutton.style.display = "none";
        }
    }
}
function topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}
function selectorchange() {
    var selectorarr = [
        '<b>빠름</b> : 빠른 검색, 적은 값',
        '<b>보통</b> : 기본 검색, 보통 값',
        '<b>다양</b> : 느린 검색, 많은 값']
    document.getElementById('selectorlabel').innerHTML = selectorarr[document.getElementById('selector').value]
}
function initinput() {
    var selectorarr = [
        '<b>빠름</b> : 빠른 검색, 적은 값',
        '<b>보통</b> : 기본 검색, 보통 값',
        '<b>다양</b> : 느린 검색, 많은 값']
    document.getElementById("input").value = getParameter("key")
    document.getElementById('selector').value = getParameter("sel")
    document.getElementById('selectorlabel').innerHTML = selectorarr[getParameter("sel")]
    islight = (getParameter("dark")) == 1 ? 1 : 0
    darktgl()
}

async function refillres(from) {
    console.log(`resultnowshown is ${resultsnowshown}`)
    await $.ajax({
        url: `/process/${getParameter("key")}/${getParameter("sel")}/${from}`,
        type: "GET",
        success: function (result) {
            if (result) {
                JSON.parse(result).map(a => resultlist.push(a))
                isloading=0
                console.log('loaded')
            }
            else {
                alert("불러오기 실패");
            }
        }
    });
}

var checkinterval
var resultlist = []
async function buttonclick() {
    mybutton = document.getElementById("myBtn");
    await refillres(0)
    resultlist.unshift(['단어', '점수'])
    resultsnowshown+=50;
    document.getElementById('tbcen')
        .appendChild(populateTable(null, 50, 2));
    document.getElementById('loading').style.display = 'none'
    document.getElementById('scrollload').style.display = 'block'
    checkinterval = setInterval(checkaddrow, 1000);
}

var isloading = 0

async function checkaddrow() {
    console.log(`resultnowshown is ${resultsnowshown}`)
    if (resultlist.length <= 150&&isloading==0) {
        isloading=1
        clearInterval(checkinterval);
        refillres(resultsnowshown+100)
        checkinterval = setInterval(checkaddrow, 1000);
    }
    if (location.pathname.startsWith('/search') && (window.innerHeight + window.scrollY) >= document.body.offsetHeight&&resultlist.length>=50) {
        resultsnowshown += 50
        var table = document.getElementById("tbl")
        for (var i = resultsnowshown; i < resultsnowshown + 50; ++i) {
            var row = document.createElement('tr');
            rowres = resultlist.shift()
            var word = ('' + rowres[0])
            row.appendChild(document.createElement('td'));
            row.cells[0].appendChild(document.createTextNode(word));
            row.appendChild(document.createElement('td'));
            row.cells[1].appendChild(document.createTextNode(Math.round(rowres[1])));

            if (islight) {
                if (i % 2 == 0)
                    row.style.backgroundColor = '#FFFFFF';
                else
                    row.style.backgroundColor = '#DDDDDD';
            }
            else {
                if (i % 2 == 0)
                    row.style.backgroundColor = '#222222';
                else
                    row.style.backgroundColor = '#111111';
                row.style.color = '#FFFFFF';
            }
            row.style.border = '2px solid black'
            row.style.text_align = 'center'
            row.style.fontSize = '17pt'
            row.style.box_sizing = 'border-box'
            table.appendChild(row);
        }
    }
}

function populateTable(table, rows, cells) {
    document.getElementById("tbl").remove()
    if (!table) table = document.createElement('table');
    table.id = "tbl"
    table.style.backgroundColor = '#000000'
    table.style.color = 'rgb(0, 0, 0)'
    table.style.border = '1px solid black'
    table.style.width = '80%'

    for (var i = 0; i < rows; ++i) {
        var row = document.createElement('tr');
        var rowres = resultlist.shift()
        for (var j = 0; j < cells; ++j) {
            row.appendChild(document.createElement('td'));
            row.cells[j].appendChild(document.createTextNode(rowres[j]));
        }
        if (islight) {
            if (i == 0) {
                row.style.backgroundColor = '#1ca7a0';
                row.style.color = '#FFFFFF';

            }
            else if (i % 2 == 0)
                row.style.backgroundColor = '#FFFFFF';
            else
                row.style.backgroundColor = '#DDDDDD';
        }
        else {
            if (i == 0) {
                row.style.backgroundColor = '#f5c12f';
                row.style.color = '#FFFFFF';
            }
            else if (i % 2 == 0)
                row.style.backgroundColor = '#222222';
            else
                row.style.backgroundColor = '#111111';
            row.style.color = '#FFFFFF';
        }
        row.style.border = '2px solid black'
        row.style.fontSize = '17pt'
        row.style.text_align = 'center'
        row.style.box_sizing = 'border-box'
        table.appendChild(row);
    }
    return table;
}
function redir() {
    clearInterval(checkinterval);
    var redinp = document.getElementById("input").value
    location.href = '/search?key=' + redinp + "\&sel=" + document.getElementById('selector').value + "\&dark=" + Number(islight == 1 ? 0 : 1)
}
function getParameter(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

//작동안함 ( iframe 없음 )
function databasemaker(filename) {
    var oFrame = document.getElementById(filename);
    var strRawContents = oFrame.contentWindow.document.body.childNodes[0].innerHTML;
    console.log(stdpron(strRawContents.replace(/\n/g, 'A')).replace(/A/g, '\n').replace(/^L/gm, '').replace(/L$/gm, ''))
}