var inputlen
function initinput() {
    document.getElementById("input").value = getParameter("key")
    document.getElementById("freqcheck").checked = (getParameter("freq") == "true")
    if(getParameter("key")=='') location.href = '/'
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
    var words = document.getElementById("freqcheck").checked ? getfile("freq")[0] : getfile("all")[0]
    for (var i = 0; i < 100; i++) {
        var word = ('' + words[result[i]]).replace(/[ \tE]/g, '')
        word = Hangul.assemble(word)
        outputlist.push([word, Math.round(scores[result[i]] * 4)])
    }
    document.getElementById('tbcen')
        .appendChild(populateTable(null, outputlist.length, outputlist[0].length, outputlist));

    document.getElementById('loading').style.display = 'none'
}

function populateTable(table, rows, cells, content) {
    document.getElementById("tbl").remove()
    if (!table) table = document.createElement('table');
    table.id = "tbl"
    table.style.backgroundColor = '#000000'
    table.style.color = 'rgb(0, 0, 0)'
    table.style.border = '2px solid black'
    table.style.width = '80%'

    for (var i = 0; i < rows; ++i) {
        var row = document.createElement('tr');
        for (var j = 0; j < cells; ++j) {
            row.appendChild(document.createElement('td'));
            row.cells[j].appendChild(document.createTextNode(content[i][j]));
        }
        if (i == 0) {
            row.style.backgroundColor = '#1ca7a0';
            row.style.color = '#FFFFFF';

        }
        else if (i % 2 == 0)
            row.style.backgroundColor = '#FFFFFF';
        else
            row.style.backgroundColor = '#BBBBBB';
        row.style.border = '2px solid black'
        row.style.text_align = 'center'
        row.style.box_sizing = 'border-box'
        table.appendChild(row);
    }
    return table;
}
function redir() {
    var redinp = document.getElementById("input").value
    location.href = '/search?key=' + redinp + "\&freq=" + document.getElementById("freqcheck").checked
}
function getParameter(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
function korformatter(commonkor) {
    //가나다
    commonkor = commonkor.replace(/ ?/g, '\t').trim()
    //가\t나\t다
    disassemed = betterDisassemble(commonkor).replace(/ ?/g, ' ').trim()
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
    disassemed = disassemed.split('\t')
    for (var i = 0, len = disassemed.length; i < len; i++) {
        disassemed[i] = disassemed[i].trim()
        if (disassemed[i].length == 3) {
            disassemed[i] = disassemed[i] + ' E'
        }
    }
    disassemed = disassemed.join('\t')
    return disassemed
}
function betterDisassemble(input) {
    var inlen = input.length
    var out = ''
    if(inlen<=10)
    {
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
    a = a.replace(/ㅑ/g, 'ㅣ E\tㅇ ㅏ')
    a = a.replace(/ㅕ/g, 'ㅣ E\tㅇ ㅓ')
    a = a.replace(/ㅛ/g, 'ㅣ E\tㅇ ㅗ')
    a = a.replace(/ㅠ/g, 'ㅣ E\tㅇ ㅜ')
    a = a.replace(/ㅒ/g, 'ㅣ E\tㅇ ㅐ')
    a = a.replace(/ㅖ/g, 'ㅣ E\tㅇ ㅔ')
    a = a.replace(/ㅘ/g, 'ㅗ E\tㅇ ㅏ')
    a = a.replace(/ㅙ/g, 'ㅗ E\tㅇ ㅐ')
    a = a.replace(/ㅚ/g, 'ㅜ E\tㅇ ㅔ')
    a = a.replace(/ㅝ/g, 'ㅜ E\tㅇ ㅓ')
    a = a.replace(/ㅞ/g, 'ㅜ E\tㅇ ㅔ')
    a = a.replace(/ㅟ/g, 'ㅜ E\tㅇ ㅣ')
    a = a.replace(/ㅢ/g, 'ㅡ E\tㅇ ㅣ')
    a = a.replace(/([ㅏㅓㅗㅜㅡㅣㅐㅔ]) E\tㅇ \1/g, '$1')
    a = a.replace(/([ㅏㅓㅗㅜㅡㅣㅐㅔ]) E\tㅇ \1/g, '$1')
    a = a.replace(/([ㅏㅓㅗㅜㅡㅣㅐㅔ]) E\tㅇ \1/g, '$1')
    a = a.replace(/([ㅏㅓㅗㅜㅡㅣㅐㅔ]) E\tㅇ \1/g, '$1')

    //사이시옷(모든 시옷을 사이시옷으로 생각)
    a = a.replace(/ㅅ\t(.) ㅣ/g, 'ㄴ\t$1 ㅣ')
    a = a.replace(/ㅅ\t[ㄴㅁ]/g, 'ㅅ\tㄴ')
    a = a.replace(/ㅅ\tㄱ/g, 'E\tㄲ')
    a = a.replace(/ㅅ\tㄷ/g, 'E\tㄸ')
    a = a.replace(/ㅅ\tㅂ/g, 'E\tㅃ')
    a = a.replace(/ㅅ\tㅅ/g, 'E\tㅆ')
    a = a.replace(/ㅅ\tㅈ/g, 'E\tㅉ')

    //된소리되기(어간생각X)
    a = a.replace(/([ㄱㄲㅋㄳㄺㄷㅅㅆㅈㅊㅌㅂㅍㄼㄿㅄ])\tㄱ/g, '$1\tㄲ')
    a = a.replace(/([ㄱㄲㅋㄳㄺㄷㅅㅆㅈㅊㅌㅂㅍㄼㄿㅄ])\tㄷ/g, '$1\tㄸ')
    a = a.replace(/([ㄱㄲㅋㄳㄺㄷㅅㅆㅈㅊㅌㅂㅍㄼㄿㅄ])\tㅂ/g, '$1\tㅃ')
    a = a.replace(/([ㄱㄲㅋㄳㄺㄷㅅㅆㅈㅊㅌㅂㅍㄼㄿㅄ])\tㅅ/g, '$1\tㅆ')
    a = a.replace(/([ㄱㄲㅋㄳㄺㄷㅅㅆㅈㅊㅌㅂㅍㄼㄿㅄ])\tㅈ/g, '$1\tㅉ')

    //동화
    a = a.replace(/ㄴ\tㄹ/g, 'ㄹ\tㄹ')
    a = a.replace(/ㄹ\tㄴ/g, 'ㄹ\tㄹ')
    a = a.replace(/ㅀ\tㄴ/g, 'ㄹ\tㄹ')
    a = a.replace(/ㄾ\tㄴ/g, 'ㄹ\tㄹ')
    a = a.replace(/([ㅁㅇ])\tㄹ/g, '$1\tㄴ')
    a = a.replace(/ㄱ\tㄹ/g, 'ㅇ\tㄴ')
    a = a.replace(/ㅂ\tㄹ/g, 'ㅁ\tㄴ')
    a = a.replace(/[ㄱㄲㅋㄳㄺ]\t([ㄴㅁ])/g, 'ㅇ\t$1')
    a = a.replace(/[ㄷㅅㅆㅈㅊㅌㅎ]\t([ㄴㅁ])/g, 'ㄴ\t$1')
    a = a.replace(/[ㅂㅍㄼㄿㅄ]\t([ㄴㅁ])/g, 'ㅁ\t$1')

    //받침의 발음
    a = a.replace(/([ㄱㄴㄷㄹㅁㅂㅅㅈㅊㅋㅌㅍㄲㅆ])\tㅇ/g, 'E\t$1')
    a = a.replace(/ㄳ\tㅇ/g, 'ㄱ\tㅆ')
    a = a.replace(/ㄵ\tㅇ/g, 'ㄴ\tㅈ')
    a = a.replace(/ㄶ\tㅇ/g, 'ㄴ\tㅇ')
    a = a.replace(/ㄺ\tㅇ/g, 'ㄹ\tㄱ')
    a = a.replace(/ㄻ\tㅇ/g, 'ㄹ\tㅁ')
    a = a.replace(/ㄼ\tㅇ/g, 'ㄹ\tㅂ')
    a = a.replace(/ㄽ\tㅇ/g, 'ㄹ\tㅆ')
    a = a.replace(/ㄾ\tㅇ/g, 'ㄹ\tㅌ')
    a = a.replace(/ㄿ\tㅇ/g, 'ㄹ\tㅍ')
    a = a.replace(/ㅀ\tㅇ/g, 'ㄹ\tㅇ')
    a = a.replace(/ㅄ\tㅇ/g, 'ㅂ\tㅆ')
    a = a.replace(/ㅎ\tㄴ/g, 'ㄴ\tㄴ')
    a = a.replace(/([ㅎㄶㅀ])\tㅅ/g, '$1\tㅆ')
    a = a.replace(/([ㅎㄶㅀ])\tㄱ/g, '$1\tㅋ')
    a = a.replace(/([ㅎㄶㅀ])\tㄷ/g, '$1\tㅌ')
    a = a.replace(/([ㅎㄶㅀ])\tㅈ/g, '$1\tㅊ')
    a = a.replace(/([ㄱㄺ])\tㅎ/g, 'E\tㅋ')
    a = a.replace(/([ㄷ])\tㅎ/g, 'E\tㅊ')
    a = a.replace(/([ㅂㄼ])\tㅎ/g, 'E\tㅍ')
    a = a.replace(/([ㅈㄵ])\tㅎ/g, 'E\tㅊ')
    a = a.replace(/([ㅅㅈㅊㅌ])\tㅎ/g, 'E\tㅌ')

    //7종성예외
    a = a.replace(/ㅂ ㅏ ㄼ/g, 'ㅂ ㅏ ㅂ')
    a = a.replace(/ㄴ ㅓ ㄼ/g, 'ㄴ ㅓ ㅂ')

    //7종성
    a = a.replace(/[ㄲㅋㄳㄺ]\t/g, 'ㄱ\t')
    a = a.replace(/[ㄵ]\t/g, 'ㄴ\t')
    a = a.replace(/[ㅅㅆㅈㅊㅌ]\t/g, 'ㄷ\t')
    a = a.replace(/[ㄼㄽㄾ]\t/g, 'ㄹ\t')
    a = a.replace(/[ㄻ]\t/g, 'ㅁ\t')
    a = a.replace(/[ㅍㅄ]\t/g, 'ㅂ\t')
    a = a.replace(/[ㄿ]\t/g, 'ㅇ\t')

    a = a.replace(/ㅎ\t/g, 'E\t')

    //규정에 없지만 자율적으로
    a = a.replace(/([ㄴ])\tㅎ/g, 'E\tㄴ')
    a = a.replace(/([ㄹ])\tㅎ/g, 'E\tㄹ')
    a = a.replace(/([ㅁ])\tㅎ/g, 'E\tㅁ')
    a = a.replace(/([ㅇ])\tㅎ/g, 'ㅇ\tㅇ')
    return a;
}
function onlyUnique(value, index, self) {
    var vallen = value.split('\t').length
    return (self.indexOf(value) === index) && (inputlen + 2 >= vallen);
}
function search(keyword) {
    var wordslist = document.getElementById("freqcheck").checked ? getfile("freq")[1] : getfile("all")[1]
    var scores = []
    var len = wordslist.length
    var ao = keyword.split('\t')
    var aleno = ao.length
    for (var i = 0; i < len; i++) {
        var a = ao //입력 단어 발음
        var alen = aleno //길이
        b = wordslist[i].split('\t')// 비교할 단어 발음
        var blen = b.length //길이
        if (alen < blen){
            b = b.slice(-alen)
            blen=alen
        }
        else{
            a = a.slice(-blen)
            alen=blen
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
    if (a == 'ㅇ' && b == 'ㅇ') return 6;
    if (a == b) return 5;
    var similar = ['ㄱㄲㅋ', 'ㄷㄸㅌ', 'ㅂㅃㅍ', 'ㅈㅉㅊ', 'ㅅㅆ']
    var ssimilar = ['ㄱㄲㅋㄷㄸㅌㅂㅃㅍ', 'ㅈㅉㅊㅅㅆ', 'ㅇㅎ', 'ㄴㄹㅁ']
    if (arebothin(a, b, similar)) return 3;
    if (arebothin(a, b, ssimilar)) return 1;
    else return 0;
}
function relevance1(a, b) {
    if (a == b) return 40;
    var same = ['ㅙㅚㅞ', 'ㅔㅐ']
    var similar = ['ㅏㅘ','ㅓㅝㅗ','ㅕㅛ','ㅜㅡ','ㅣㅟㅢ','ㅐㅔㅙㅞㅚ','ㅒㅖ']
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
function getfile(fileName) {
    var oFrame = document.getElementById(fileName);
    var strRawContents = oFrame.contentWindow.document.body.childNodes[0].innerHTML;
    while (strRawContents.indexOf("\r") >= 0)
        strRawContents = strRawContents.replace(/\r/g, "");
    var arrLines = strRawContents.split("\n");
    var a = [], b = [], c = []
    if (document.getElementById("freqcheck").checked) {
        for (i of arrLines) {
            splitted = i.split(',')
            a.push(splitted[0])
            b.push(splitted[1])
        }
        return [a,b]
    }
    else {
        for (i of arrLines) {
            splitted = i.split(',')
            a.push(splitted[0])
            b.push(splitted[1])
            c.push(splitted[2])
        }
        return [a,b,c]
    }
}