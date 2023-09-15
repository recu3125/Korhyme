var isMouseScroll = false;

window.addEventListener('wheel', function (e) {
  isMouseScroll = true;
});

function minchange() {
  if (document.getElementById('min').value > 6) {
    document.getElementById('min').value = Math.max(2, Math.min(6, document.getElementById('min').value % 10))
  }
  if (document.getElementById('min').value > document.getElementById('max').value) {
    document.getElementById('min').value = document.getElementById('max').value
  }
  if (document.getElementById('min').value < 2) {
    document.getElementById('min').value = 2
  }
}
function maxchange() {
  if (document.getElementById('max').value > 6) {
    document.getElementById('max').value = Math.max(2, Math.min(6, document.getElementById('max').value % 10))
  }
  if (document.getElementById('max').value < document.getElementById('min').value) {
    document.getElementById('max').value = document.getElementById('min').value
  }
  if (document.getElementById('max').value < 2) {
    document.getElementById('max').value = 2
  }
}

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
    document.title = '한국어 라임 검색기 Korhyme'
}
function darktgl() {
  if (islight == 1) {
    islight = 0
    document.getElementById('min').style.color = "#FFFFFF"
    document.getElementById('max').style.color = "#FFFFFF"
    document.getElementById('darktgl').style.backgroundColor = "#FFFFFF"
    document.getElementById('backgr').style.background = "linear-gradient(90deg, #021515,#042525)"
    document.getElementById('backgr').style.color = "#FFFFFF"
    document.getElementById('topbar').style.backgroundColor = '#334444'
    document.getElementById('hr').style.backgroundColor = '#f5c12f'
    document.getElementById('hr').style.border = 'solid 3px #f5c12f'
    document.getElementById('inputdiv').style.border = 'solid 3px #f5c12f'
    document.getElementById('inputdiv').style.backgroundColor = '#f5c12f'
    document.getElementById('input').style.border = 'solid 2px #f5c12f'
    document.getElementById('input').style.color = 'solid 2px #FFFFFF'
    document.getElementById('search').style.border = 'solid 3px #f5c12f'
    document.getElementById('search').style.backgroundColor = '#f5c12f'
    document.getElementById("selector").className = 'sliderdark'
    document.getElementById("selector2").className = 'sliderdark'
    document.getElementById("tbl").rows[0].style.backgroundColor = '#f5c12f'
    var rowCount = document.getElementById('tbl').rows.length;
    for (var i = 1; i < rowCount; i++) {
      if (i % 2 == 1)
        document.getElementById("tbl").rows[i].style.backgroundColor = '#222222';
      else
        document.getElementById("tbl").rows[i].style.backgroundColor = '#111111';
      document.getElementById("tbl").rows[i].style.color = '#FFFFFF';
    }
  }
  else {
    islight = 1
    document.getElementById('min').style.color = "#000000"
    document.getElementById('max').style.color = "#000000"
    document.getElementById('darktgl').style.backgroundColor = "#000000"
    document.getElementById('backgr').style.background = "linear-gradient(90deg, #f5c12f,#ffdc7b)"
    document.getElementById('backgr').style.color = "#000000"
    document.getElementById('topbar').style.backgroundColor = '#777766'
    document.getElementById('hr').style.backgroundColor = '#1ca7a0'
    document.getElementById('hr').style.border = 'solid 3px #1ca7a0'
    document.getElementById('inputdiv').style.border = 'solid 3px #1ca7a0'
    document.getElementById('inputdiv').style.backgroundColor = '#1ca7a0'
    document.getElementById('input').style.border = 'solid 2px #1ca7a0'
    document.getElementById('input').style.backgroundColor = 'solid 2px #FFFFFF'
    document.getElementById('input').style.color = 'solid 2px #000000'
    document.getElementById('search').style.border = 'solid 3px #1ca7a0'
    document.getElementById('search').style.backgroundColor = '#1ca7a0'
    document.getElementById("selector").className = 'slider'
    document.getElementById("selector2").className = 'slider'
    document.getElementById("tbl").rows[0].style.backgroundColor = '#1ca7a0'
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

window.onscroll = function () { scrollFunction() };
function scrollFunction() {
  var topbutton = document.getElementById("topBtn");
  if (location.pathname.startsWith('/search')) {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
      topbutton.style.display = "block";
    } else {
      topbutton.style.display = "none";
    }
  }
}
function topFunction() {
  pos = 0
  if (!isMouseScroll) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
function selectorchange() {
  var selectorarr = [
    '<b>빨리</b> : 빠른 검색, 적은 값',
    '<b>보통</b> : 기본 검색, 보통 값',
    '<b>꼼꼼</b> : 느린 검색, 많은 값',
    '<b>명사</b> : 명사만 검색 (베타)']
  document.getElementById('selectorlabel').innerHTML = selectorarr[document.getElementById('selector').value]
}
function selectorchange2() {
  var selectorarr = [
    '<b>기본</b> : 점수대로 정렬',
    '<b>다양</b> : 뒷부분 중복 제거']
  document.getElementById('selectorlabel2').innerHTML = selectorarr[document.getElementById('selector2').value]
}
function initinput() {
  var selectorarr = [
    '<b>빨리</b> : 빠른 검색, 적은 값',
    '<b>보통</b> : 기본 검색, 보통 값',
    '<b>꼼꼼</b> : 느린 검색, 많은 값',
    '<b>명사</b> : 명사만 검색 (베타)']
  var selectorarr2 = [
    '<b>기본</b> : 점수대로 정렬',
    '<b>다양</b> : 뒷부분 중복 제거']
  document.getElementById("input").value = getParameter("key")
  document.getElementById("min").value = Math.floor(getParameter("minmax") / 10)
  document.getElementById("max").value = getParameter("minmax") % 10
  document.getElementById('selector').value = getParameter("sel")
  document.getElementById('selector2').value = getParameter("sel2")
  document.getElementById('selectorlabel').innerHTML = selectorarr[getParameter("sel")]
  document.getElementById('selectorlabel2').innerHTML = selectorarr2[getParameter("sel2")]
  islight = (getParameter("dark")) == 1 ? 1 : 0
  darktgl()
}

async function refillres(from) {
  var key = getParameter("key").replace(/[^가-힣]/g, '').slice(-6)
  if (key == '') {
    location.href = '/'
  }
  try {
    const response = await fetch(`/process/${key}/${getParameter("sel")}/${getParameter("sel2")}/${from}/${Math.floor(getParameter("minmax") / 10)}/${getParameter("minmax") % 10}`, {
      method: "GET"
    });
    if (response.ok) {
      const result = await response.json();
      result.map(a => resultlist.push(a))
      isloading = 0
    } else {
      alert("불러오기 실패");
    }
  } catch (error) {
    document.body.innerHTML = `뭔가 문제가 생겼어요!<br>
    서버가 자동으로 재시작 중일 테니<br>
    눈감구 1부터 10까지 센다음 재접속해보는건 어떨까요<br>
    <br>
    그래도 뭔가 잘 안되면... 뭔가 문제가 몇개 더 생겼나 봐요<br>
    개발자가 열심히 고치고 잇겠거니 생각하면서 응원해주세요`
    throw new Error('response 408')
  }
}

var checkinterval
var resultlist = []
async function searchinit() {
  await refillres(0)
  resultlist.unshift(['단어', '점수'])
  resultsnowshown += 50;
  document.getElementById('tbcen')
    .appendChild(populateTable(null, 50, 2));
  document.getElementById('loading').style.display = 'none'
  document.getElementById('scrollload').style.display = 'block'
  checkinterval = setInterval(checkaddrow, 100);
}

var isloading = 0

async function checkaddrow() {
  if (resultlist.length <= 150 && isloading == 0) {
    isloading = 1
    clearInterval(checkinterval);
    refillres(resultsnowshown + 100)
    checkinterval = setInterval(checkaddrow, 100);
  }
  if (location.pathname.startsWith('/search') && (window.innerHeight + window.scrollY) >= document.body.offsetHeight && resultlist.length >= 50) {
    clearInterval(checkinterval);
    setTimeout(() => {
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
      checkinterval = setInterval(checkaddrow, 100);
    }, 600);
  }
}

function populateTable(table, rows, cells) {
  document.getElementById("tbl").remove()
  if (!table) table = document.createElement('table');
  table.id = "tbl"
  table.style.textAlign = 'left'
  table.style.backgroundColor = '#000000'
  table.style.color = 'rgb(0, 0, 0)'
  table.style.border = '1px solid black'
  table.style.width = '80%'
  table.style.margin = 'auto'

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
    row.style.text_align = 'left'
    row.style.box_sizing = 'border-box'
    table.appendChild(row);
  }
  return table;
}
function redir() {
  clearInterval(checkinterval);
  var redinp = document.getElementById("input").value
  location.href = '/search?key=' + redinp + "\&sel=" + document.getElementById('selector').value + "\&sel2=" + document.getElementById('selector2').value + "\&minmax=" + document.getElementById('min').value + document.getElementById('max').value + "\&dark=" + Number(islight == 1 ? 0 : 1)
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

function init() {
  new SmoothScroll(document, 100, 5)
  setInterval(minchange, 100);
  setInterval(maxchange, 100);
}




function SmoothScroll(target, speed, smooth) {
  if (target === document)
    target = (document.scrollingElement
      || document.documentElement
      || document.body.parentNode
      || document.body) // cross browser support for document scrolling

  var moving = false
  pos = target.scrollTop
  var frame = target === document.body
    && document.documentElement
    ? document.documentElement
    : target // safari is the new IE
  target.addEventListener('mousewheel', scrolled, { passive: false })
  target.addEventListener('DOMMouseScroll', scrolled, { passive: false })
  function scrolled(e) {
    e.preventDefault(); // disable default scrolling

    var delta = normalizeWheelDelta(e)

    pos += -delta * speed
    pos = Math.max(0, Math.min(pos, target.scrollHeight - frame.clientHeight)) // limit scrolling
    if (!moving) update()
  }

  function normalizeWheelDelta(e) {
    if (e.detail) {
      if (e.wheelDelta)
        return e.wheelDelta / e.detail / 40 * (e.detail > 0 ? 1 : -1) // Opera
      else
        return -e.detail / 3 // Firefox
    } else
      return e.wheelDelta / 120 // IE,Safari,Chrome
  }

  function update() {
    moving = true

    var delta = (pos - target.scrollTop) / smooth

    target.scrollTop += delta

    if (Math.abs(delta) > 0.5)
      requestFrame(update)
    else
      moving = false
  }

  var requestFrame = function () { // requestAnimationFrame cross browser
    return (
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (func) {
        window.setTimeout(func, 1000 / 50);
      }
    );
  }()
}