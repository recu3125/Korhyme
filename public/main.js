var inputlen
var resultssaved = []
var wordssaved = []
var scoressaved = []
var resultsnowshown = 0
var islight = 1
function darktgl() {
    if (islight == 1) {
        islight = 0
        document.getElementById('darktgl').style.backgroundColor = "#FFFFFF"
        document.getElementById('backgr').style.background = "linear-gradient(60deg, #072320,#093330)"
        document.getElementById('backgr').style.color = "#FFFFFF"
        document.getElementById('topbar').style.backgroundColor = '#334444'
        document.getElementById('hr').style.backgroundColor = '#f5c12f'
        document.getElementById('hr').style.border = 'solid 3px #f5c12f'
        document.getElementById('inputdiv').style.border = 'solid 3px #f5c12f'
        document.getElementById('inputdiv').style.backgroundColor = '#f5c12f'
        document.getElementById('input').style.border = 'solid 2px #f5c12f'
        document.getElementById('input').style.backgroundColor = 'solid 2px #072320'
        document.getElementById('input').style.color = 'solid 2px #FFFFFF'
        document.getElementById('search').style.border = 'solid 3px #f5c12f'
        document.getElementById('search').style.backgroundColor = '#f5c12f'
        document.getElementById("tbl").rows[0].style.backgroundColor = '#f5c12f'
        document.getElementById("selector").className = 'sliderdark'
        var rowCount = document.getElementById('tbl').rows.length;
        for (var i = 1; i < rowCount; i++) {
            if (i % 2 == 0)
                document.getElementById("tbl").rows[i].style.backgroundColor = '#222222';
            else
                document.getElementById("tbl").rows[i].style.backgroundColor = '#111111';
            document.getElementById("tbl").rows[i].style.color = '#FFFFFF';
        }
    }
    else {
        islight = 1
        document.getElementById('darktgl').style.backgroundColor = "#000000"
        document.getElementById('backgr').style.background = "linear-gradient(60deg, #f5c12f,#ffdc7b)"
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
        document.getElementById("tbl").rows[0].style.backgroundColor = '#1ca7a0'
        document.getElementById("selector").className = 'slider'
        var rowCount = document.getElementById('tbl').rows.length;
        for (var i = 1; i < rowCount; i++) {
            if (i % 2 == 0)
                document.getElementById("tbl").rows[i].style.backgroundColor = '#FFFFFF';
            else
                document.getElementById("tbl").rows[i].style.backgroundColor = '#DDDDDD';
            document.getElementById("tbl").rows[i].style.color = '#000000';
        }
    }
}

//복붙코드
mybutton = document.getElementById("myBtn");
window.onscroll = function () { scrollFunction() };
function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        mybutton.style.display = "block";
    } else {
        mybutton.style.display = "none";
    }
}
function topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}
//요기까지
function selectorchange() {
    var selectorarr = [
        '<b>빠름</b> : 빠른 검색, 적은 값',
        '<b>보통</b> : 기본 검색, 보통 값',
        '<b>다양</b> : 느린 검색, 많은 값']
    document.getElementById('selectorlabel').innerHTML = selectorarr[document.getElementById('selector').value]
}
function initinput() {
    document.getElementById("input").value = getParameter("key")
    document.getElementById('selector').value = getParameter("sel")
    if (getParameter("key") == '') location.href = '/'
    selectorchange()
}
function buttonclick() {
    var input = getParameter("key")
    inputlen = input.length
    input = input.replace(/[^가-힣]/, '') //자동 제외후
    var tosearch = stdpron(input)
    var scores = search(tosearch)


    // 정렬후 출력
    var result = Object.entries(scores).sort((a, b) => a[1] - b[1]).map(e => +e[0]).reverse()
    var outputlist = [['단어', '점수']]
    var words = getfile(document.getElementById('selector').value)[0]
    for (var i = 0; i < 50; i++) {
        var word = ('' + words[result[i]])
        outputlist.push([word, Math.round(scores[result[i]] * 4)])
    }
    resultssaved = result
    wordssaved = words
    scoressaved = scores
    document.getElementById('tbcen')
        .appendChild(populateTable(null, outputlist.length, outputlist[0].length, outputlist));

    document.getElementById('loading').style.display = 'none'
    document.getElementById('scrollload').style.display = 'block'

    setInterval(() => {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            resultsnowshown += 50
            var table = document.getElementById("tbl")
            for (var i = resultsnowshown; i < resultsnowshown + 50; ++i) {
                var row = document.createElement('tr');
                var word = ('' + wordssaved[resultssaved[i]])

                row.appendChild(document.createElement('td'));
                row.cells[0].appendChild(document.createTextNode(word));
                row.appendChild(document.createElement('td'));
                row.cells[1].appendChild(document.createTextNode(Math.round(scoressaved[resultssaved[i]] * 4)));

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
                row.style.box_sizing = 'border-box'
                table.appendChild(row);
            }
        }
    }, 1000);
}
function populateTable(table, rows, cells, content) {
    document.getElementById("tbl").remove()
    if (!table) table = document.createElement('table');
    table.id = "tbl"
    table.style.backgroundColor = '#000000'
    table.style.color = 'rgb(0, 0, 0)'
    table.style.border = '1px solid black'
    table.style.width = '80%'

    for (var i = 0; i < rows; ++i) {
        var row = document.createElement('tr');
        for (var j = 0; j < cells; ++j) {
            row.appendChild(document.createElement('td'));
            row.cells[j].appendChild(document.createTextNode(content[i][j]));
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
            if (i % 2 == 0)
                row.style.backgroundColor = '#333322';
            else
                row.style.backgroundColor = '#222211';
            row.style.color = '#FFFFFF';
        }
        row.style.border = '2px solid black'
        row.style.text_align = 'center'
        row.style.box_sizing = 'border-box'
        table.appendChild(row);
    }
    return table;
}
function redir() {
    var redinp = document.getElementById("input").value
    location.href = '/search?key=' + redinp + "\&sel=" + document.getElementById('selector').value
}
function getParameter(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
function korformatter(commonkor) {
    //가나다
    commonkor = commonkor.replace(/ ?/g, 'L').replace(/^\L+|\L+$/g, '').trim()
    //가L나L다
    disassemed = betterDisassemble(commonkor).replace(/ ?/g, ' ').replace(/^\L+|\L+$/g, '').trim()
    disassemed = disassemed.replace(/ㅗ ㅏ/g, 'ㅘ')
    disassemed = disassemed.replace(/ㅗ ㅐ/g, 'ㅙ')
    disassemed = disassemed.replace(/ㅗ ㅣ/g, 'ㅚ')
    disassemed = disassemed.replace(/ㅜ ㅓ/g, 'ㅝ')
    disassemed = disassemed.replace(/ㅜ ㅔ/g, 'ㅞ')
    disassemed = disassemed.replace(/ㅜ ㅣ/g, 'ㅟ')
    disassemed = disassemed.replace(/ㅡ ㅣ/g, 'ㅢ')
    disassemed = disassemed.replace(/ㄱ ㅅ/g, 'ㄳ')
    disassemed = disassemed.replace(/ㄴ ㅈ/g, 'ㄵ')
    disassemed = disassemed.replace(/ㄴ ㅎ/g, 'ㄶ')
    disassemed = disassemed.replace(/ㄹ ㄱ/g, 'ㄺ')
    disassemed = disassemed.replace(/ㄹ ㅁ/g, 'ㄻ')
    disassemed = disassemed.replace(/ㄹ ㅂ/g, 'ㄼ')
    disassemed = disassemed.replace(/ㄹ ㅅ/g, 'ㄽ')
    disassemed = disassemed.replace(/ㄹ ㅌ/g, 'ㄾ')
    disassemed = disassemed.replace(/ㄹ ㅍ/g, 'ㄿ')
    disassemed = disassemed.replace(/ㄹ ㅎ/g, 'ㅀ')
    disassemed = disassemed.replace(/ㅂ ㅅ/g, 'ㅄ')
    disassemed = disassemed.split('L')
    for (var i = 0, len = disassemed.length; i < len; i++) {
        disassemed[i] = disassemed[i].replace(/^\L+|\L+$/g, '').trim()
        if (disassemed[i].length == 3) {
            disassemed[i] = disassemed[i] + ' E'
        }
    }
    disassemed = disassemed.join('L')
    return disassemed
}
function betterDisassemble(input) {
    var inlen = input.length
    var out = ''
    if (inlen <= 10) {
        return Hangul.disassemble(input).join('')
    }
    for (var i = 0; i < inlen - 10; i += 10) {
        var sub = Hangul.disassemble(input.substring(i, i + 10)).join('')
        out += sub
    }
    var fin = Hangul.disassemble(input.substring(Math.floor(inlen / 10) * 10, inlen)).join('')
    out += fin
    return out
}
function stdpron(a) {
    var a = korformatter(a)
    //모음 한단어에 하나로
    a = a.replace(/ㅑ/g, 'ㅣ ELㅇ ㅏ')
    a = a.replace(/ㅕ/g, 'ㅣ ELㅇ ㅓ')
    a = a.replace(/ㅛ/g, 'ㅣ ELㅇ ㅗ')
    a = a.replace(/ㅠ/g, 'ㅣ ELㅇ ㅜ')
    a = a.replace(/ㅒ/g, 'ㅣ ELㅇ ㅐ')
    a = a.replace(/ㅖ/g, 'ㅣ ELㅇ ㅔ')
    a = a.replace(/ㅘ/g, 'ㅗ ELㅇ ㅏ')
    a = a.replace(/ㅙ/g, 'ㅗ ELㅇ ㅐ')
    a = a.replace(/ㅚ/g, 'ㅜ ELㅇ ㅔ')
    a = a.replace(/ㅝ/g, 'ㅜ ELㅇ ㅓ')
    a = a.replace(/ㅞ/g, 'ㅜ ELㅇ ㅔ')
    a = a.replace(/ㅟ/g, 'ㅜ ELㅇ ㅣ')
    a = a.replace(/ㅢ/g, 'ㅡ ELㅇ ㅣ')
    a = a.replace(/([ㅏㅓㅗㅜㅡㅣㅐㅔ]) ELㅇ \1/g, '$1')
    a = a.replace(/([ㅏㅓㅗㅜㅡㅣㅐㅔ]) ELㅇ \1/g, '$1')
    a = a.replace(/([ㅏㅓㅗㅜㅡㅣㅐㅔ]) ELㅇ \1/g, '$1')
    a = a.replace(/([ㅏㅓㅗㅜㅡㅣㅐㅔ]) ELㅇ \1/g, '$1')

    //사이시옷(모든 시옷을 사이시옷으로 생각)
    a = a.replace(/ㅅL(.) ㅣ/g, 'ㄴL$1 ㅣ')
    a = a.replace(/ㅅL[ㄴㅁ]/g, 'ㅅLㄴ')
    a = a.replace(/ㅅLㄱ/g, 'ELㄲ')
    a = a.replace(/ㅅLㄷ/g, 'ELㄸ')
    a = a.replace(/ㅅLㅂ/g, 'ELㅃ')
    a = a.replace(/ㅅLㅅ/g, 'ELㅆ')
    a = a.replace(/ㅅLㅈ/g, 'ELㅉ')

    //된소리되기(어간생각X)
    a = a.replace(/([ㄱㄲㅋㄳㄺㄷㅅㅆㅈㅊㅌㅂㅍㄼㄿㅄ])Lㄱ/g, '$1Lㄲ')
    a = a.replace(/([ㄱㄲㅋㄳㄺㄷㅅㅆㅈㅊㅌㅂㅍㄼㄿㅄ])Lㄷ/g, '$1Lㄸ')
    a = a.replace(/([ㄱㄲㅋㄳㄺㄷㅅㅆㅈㅊㅌㅂㅍㄼㄿㅄ])Lㅂ/g, '$1Lㅃ')
    a = a.replace(/([ㄱㄲㅋㄳㄺㄷㅅㅆㅈㅊㅌㅂㅍㄼㄿㅄ])Lㅅ/g, '$1Lㅆ')
    a = a.replace(/([ㄱㄲㅋㄳㄺㄷㅅㅆㅈㅊㅌㅂㅍㄼㄿㅄ])Lㅈ/g, '$1Lㅉ')

    //동화
    a = a.replace(/ㄴLㄹ/g, 'ㄹLㄹ')
    a = a.replace(/ㄹLㄴ/g, 'ㄹLㄹ')
    a = a.replace(/ㅀLㄴ/g, 'ㄹLㄹ')
    a = a.replace(/ㄾLㄴ/g, 'ㄹLㄹ')
    a = a.replace(/([ㅁㅇ])Lㄹ/g, '$1Lㄴ')
    a = a.replace(/ㄱLㄹ/g, 'ㅇLㄴ')
    a = a.replace(/ㅂLㄹ/g, 'ㅁLㄴ')
    a = a.replace(/[ㄱㄲㅋㄳㄺ]L([ㄴㅁ])/g, 'ㅇL$1')
    a = a.replace(/[ㄷㅅㅆㅈㅊㅌㅎ]L([ㄴㅁ])/g, 'ㄴL$1')
    a = a.replace(/[ㅂㅍㄼㄿㅄ]L([ㄴㅁ])/g, 'ㅁL$1')

    //받침의 발음
    a = a.replace(/([ㄱㄴㄷㄹㅁㅂㅅㅈㅊㅋㅌㅍㄲㅆ])Lㅇ/g, 'EL$1')
    a = a.replace(/ㄳLㅇ/g, 'ㄱLㅆ')
    a = a.replace(/ㄵLㅇ/g, 'ㄴLㅈ')
    a = a.replace(/ㄶLㅇ/g, 'ㄴLㅇ')
    a = a.replace(/ㄺLㅇ/g, 'ㄹLㄱ')
    a = a.replace(/ㄻLㅇ/g, 'ㄹLㅁ')
    a = a.replace(/ㄼLㅇ/g, 'ㄹLㅂ')
    a = a.replace(/ㄽLㅇ/g, 'ㄹLㅆ')
    a = a.replace(/ㄾLㅇ/g, 'ㄹLㅌ')
    a = a.replace(/ㄿLㅇ/g, 'ㄹLㅍ')
    a = a.replace(/ㅀLㅇ/g, 'ㄹLㅇ')
    a = a.replace(/ㅄLㅇ/g, 'ㅂLㅆ')
    a = a.replace(/ㅎLㄴ/g, 'ㄴLㄴ')
    a = a.replace(/([ㅎㄶㅀ])Lㅅ/g, '$1Lㅆ')
    a = a.replace(/([ㅎㄶㅀ])Lㄱ/g, '$1Lㅋ')
    a = a.replace(/([ㅎㄶㅀ])Lㄷ/g, '$1Lㅌ')
    a = a.replace(/([ㅎㄶㅀ])Lㅈ/g, '$1Lㅊ')
    a = a.replace(/([ㄱㄺ])Lㅎ/g, 'ELㅋ')
    a = a.replace(/([ㄷ])Lㅎ/g, 'ELㅊ')
    a = a.replace(/([ㅂㄼ])Lㅎ/g, 'ELㅍ')
    a = a.replace(/([ㅈㄵ])Lㅎ/g, 'ELㅊ')
    a = a.replace(/([ㅅㅈㅊㅌ])Lㅎ/g, 'ELㅌ')

    //7종성예외
    a = a.replace(/ㅂ ㅏ ㄼ/g, 'ㅂ ㅏ ㅂ')
    a = a.replace(/ㄴ ㅓ ㄼ/g, 'ㄴ ㅓ ㅂ')

    //7종성
    a = a.replace(/[ㄲㅋㄳㄺ]L/g, 'ㄱL')
    a = a.replace(/[ㄵ]L/g, 'ㄴL')
    a = a.replace(/[ㅅㅆㅈㅊㅌ]L/g, 'ㄷL')
    a = a.replace(/[ㄼㄽㄾ]L/g, 'ㄹL')
    a = a.replace(/[ㄻ]L/g, 'ㅁL')
    a = a.replace(/[ㅍㅄ]L/g, 'ㅂL')
    a = a.replace(/[ㄿ]L/g, 'ㅇL')

    a = a.replace(/ㅎL/g, 'EL')

    //규정에 없지만 자율적으로
    a = a.replace(/([ㄴ])Lㅎ/g, 'ELㄴ')
    a = a.replace(/([ㄹ])Lㅎ/g, 'ELㄹ')
    a = a.replace(/([ㅁ])Lㅎ/g, 'ELㅁ')
    a = a.replace(/([ㅇ])Lㅎ/g, 'ㅇLㅇ')
    return a;
}
function onlyUnique(value, index, self) {
    var vallen = value.split('L').length
    return (self.indexOf(value) === index) && (inputlen + 2 >= vallen);
}
function search(keyword) {
    var wordslist = getfile(document.getElementById('selector').value)[1]
    var scores = []
    var len = wordslist.length
    var ao = keyword.split('L')
    var aleno = ao.length
    for (var i = 0; i < len; i++) {
        var a = ao //입력 단어 발음
        var alen = aleno //길이
        b = (wordslist[i] || '').split('L')// 비교할 단어 발음
        var blen = b.length //길이
        if (alen < blen) {
            b = b.slice(-alen)
            blen = alen
        }
        else {
            a = a.slice(-blen)
            alen = blen
        }
        //마지막에 alen개 자름
        var score = 0
        var asplit
        var bsplit
        for (var j = 0; j < alen; j++) {
            var befasplit = asplit
            var befbsplit = bsplit
            asplit = (a[j] || '').split(' ')
            bsplit = (b[j] || '').split(' ')
            var force0 = 0 //무조건 같게
            var force2 = 0 //무조건 같게
            if (j > 0 && befasplit[2] == 'E' && asplit[0] == 'ㅇ'
                || j > 0 && befbsplit[2] == 'E' && bsplit[0] == 'ㅇ')
                force0 = 1
            if (j < alen - 1 && asplit[2] == 'E' && (a[j + 1] || '').split(' ')[0] == 'ㅇ'
                || j < alen - 1 && bsplit[2] == 'E' && (b[j + 1] || '').split(' ')[0] == 'ㅇ')
                force2 = 1
            score += relevance0(asplit[0], bsplit[0], force0) * (j == (alen - 1) ? 1.5 : 1)
            score += relevance1(asplit[1], bsplit[1]) * (j == (alen - 1) ? 1.5 : 1)
            var rel2 = relevance2(asplit[2], bsplit[2], force2)
            score += rel2 * (j == (alen - 1) ? rel2 >= 2 ? 10 : 1.5 : 1)
        }
        score = Math.max(score, 0)
        score /= aleno
        scores.push(score)
    }
    return scores
}
function relevance0(a, b, force) {
    if (force == 1 && a != b) return -10000;
    if (a == b) return 5;
    var similar = ['ㄱㄲㅋ', 'ㄷㄸㅌ', 'ㅂㅃㅍ', 'ㅈㅉㅊ', 'ㅅㅆ', 'ㅇㅎ']
    var ssimilar = ['ㄱㄲㅋㄷㄸㅌㅂㅃㅍ', 'ㅈㅉㅊㅅㅆ', 'ㄴㄹㅁ']
    if (arebothin(a, b, similar)) return 3;
    if (arebothin(a, b, ssimilar)) return 1;
    else return 0;
}
function relevance1(a, b) {
    if (a == b) return 40;
    var same = ['ㅙㅚㅞ', 'ㅔㅐ']
    var similar = ['ㅏㅘ', 'ㅓㅝㅗ', 'ㅕㅛ', 'ㅜㅡ', 'ㅣㅟㅢ', 'ㅐㅔㅙㅞㅚ', 'ㅒㅖ']
    if (arebothin(a, b, same)) return 40;
    else if (arebothin(a, b, similar)) return 35;
    else return 0;
}
function relevance2(a, b, force) {
    if (force == 1 && a != b) return -10000;
    if (a == 'E' && b == 'E') return 3;
    if (a == b) return 2;
    var same = ['ㄲㅋㄳㄺㄱ', 'ㄵㄴㄶ', 'ㅅㅆㅈㅌㅍㄷ', 'ㄼㄽㄾㄹㅀ', 'ㄻㅁ', 'ㅍㅄㄿㅂ', 'ㅇ']
    var similar = ['ㄲㅋㄳㄺㄱㅅㅆㅈㅌㅍㄷㅍㅄㄿㅂ', 'ㄵㄴㄶㄻㅁㅇ']
    if (arebothin(a, b, same)) return 2;
    else if (arebothin(a, b, similar)) return 1;
    else return 0;
}
function arebothin(a, b, arr2d) {
    for (var i of arr2d) {
        for (var j of i) {
            if (j == a) {
                for (var k of i) {
                    if (k == b)
                        return 1;
                }
                return 0;
            }
            if (j == b) {
                for (var k of i) {
                    if (k == a)
                        return 1;
                }
                return 0;
            }
        }
    }
    return 0;
}
function getfile(selectednum) {
    var a = [], b = []
    for (i = 0; i <= selectednum; i++) {
        var oFrame = document.getElementById('' + i);
        var strRawContents = oFrame.contentWindow.document.body.childNodes[0].innerHTML;
        while (strRawContents.indexOf("\r") >= 0)
            strRawContents = strRawContents.replace(/\r/g, "");
        var arrLines = strRawContents.split("\n");
        for (j of arrLines) {
            splitted = j.split('\t')
            a.push(splitted[0])
            b.push(splitted[1])
        }
    }
    return [a, b]
}

//기능 외, 데이터베이스 제작용 함수 TODO
//완성된 단어 목록 입력시 독자포맷 발음으로 콘솔로그
function databasemaker(filename) {
    var oFrame = document.getElementById(filename);
    var strRawContents = oFrame.contentWindow.document.body.childNodes[0].innerHTML;
    console.log(stdpron(strRawContents.replace(/\n/g, 'A')).replace(/A/g, '\n').replace(/^L/gm, '').replace(/L$/gm, ''))
}