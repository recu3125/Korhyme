var inputlen
function buttonclick() {
    var input = document.getElementById("input").value
    inputlen = input.length
    input = input.replace(/[^가-힣]/, '') //띄어쓰기금지, 한국어 외 금지 -혹은 자동 제외후 검색

    //가능한 검색어들 추출
    var tosearch = possiblepron(input)
    if (tosearch == 'N')
        return 0;
    //로 검색된 점수 총합
    var tosearchlen = tosearch.length
    for (var i = 0; i < tosearchlen; i++) { //첫번째면 정의
        if (i == 0) {
            var scores = []
            scores = search(tosearch[0])
        }
        else {
            var serres = search(tosearch[i])
            for (var j = 0, len = scores.length; j < len; j++)
                scores[j] = Math.max(serres[j], scores[j])
        }
    }
    //정렬후 출력
    var result = Object.entries(scores).sort((a, b) => a[1] - b[1]).map(e => +e[0]).reverse()
    var outputlist = [['단어', '점수']]
    var words = getFile()
    for (var i = 0; i < 100; i++) {
        var word = ('' + words[result[i]]).replace(/[ \tE]/g, '')
        word = Hangul.assemble(word)
        outputlist.push([word, Math.round(scores[result[i]]*4)])
    }
    document.getElementById('div1')
        .appendChild(populateTable(null, outputlist.length, outputlist[0].length, outputlist));
    let scrollHeight = Math.max(
        document.body.scrollHeight, document.documentElement.scrollHeight,
        document.body.offsetHeight, document.documentElement.offsetHeight,
        document.body.clientHeight, document.documentElement.clientHeight
    );
    div1.style.height = scrollHeight + 'px'
}

function populateTable(table, rows, cells, content) {
    document.getElementById("tbl").remove()
    if (!table) table = document.createElement('table');
    table.id = "tbl"
    table.style.backgroundColor = '#000000'
    table.style.box_sizing = 'border-box'
    table.style.border_collapse = 'collapse'
    table.style.border_spacing = '0px'
    table.style.max_width = '100%'
    table.style.color = 'rgb(0, 0, 0)'
    table.style.font_size = '16px'
    table.style.line_height = '32px'
    table.style.border = '3px solid black'
    table.style.width = '40%'
    table.style.align = 'center'

    for (var i = 0; i < rows; ++i) {
        var row = document.createElement('tr');
        for (var j = 0; j < cells; ++j) {
            row.appendChild(document.createElement('td'));
            row.cells[j].appendChild(document.createTextNode(content[i][j]));
        }
        if (i == 0) {
            row.style.backgroundColor = '#3344BB';
            row.style.color = '#FFFFFF';

        }
        else if (i % 2 == 0)
            row.style.backgroundColor = '#FFFFFF';
        else
            row.style.backgroundColor = '#DDDDDD';
        row.style.border = '3px solid black'
        row.style.text_align = 'center'
        row.style.box_sizing = 'border-box'
        table.appendChild(row);
    }
    return table;
}

function possiblepron(input) {
    input = input.replace(/ ?/g, '\t').trim()
    //텍    스    트
    disassemed = Hangul.disassemble(input).join().replace(/,/g, ' ')
    disassemed = disassemed.split('\t')
    //['ㅌ ㅔ ㄱ ', ' ㅅ ㅡ ', ' ㅌ ㅡ']
    disassemed = disassemed.join('\t')
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
    var i = 0;
    var result = pronrecursive(i, disassemed)
    result = result.replace(/A/g, '\t').replace(/B/g, ' ').split('\n')
    result = result.filter(onlyUnique)
    if (result.length >= 8) {

        if (!confirm("검색 시간이 오래 걸릴 수 있는 검색어입니다.\n그래도 검색하시겠습니까?")) {
            return 'N'
        }
    }
    return result
}
function onlyUnique(value, index, self) {
    var vallen = value.split('\t').length
    return (self.indexOf(value) === index) && (inputlen + 2 >= vallen);
}
function pronrecursive(i, text) {
    var from = ['ㅏ E\tㅇ ㅏ', 'ㅓ E\tㅇ ㅓ', 'ㅣ E\tㅇ ㅣ', 'ㅗ E\tㅇ ㅗ', 'ㅜ E\tㅇ ㅜ', 'ㅡ E\tㅇ ㅡ', 'ㅐ E\tㅇ ㅐ', 'ㅔ E\tㅇ ㅔ', 'ㅣ E\tㅇ ㅏ', 'ㅣ E\tㅇ ㅓ', 'ㅣ E\tㅇ ㅗ', 'ㅣ E\tㅇ ㅜ', 'ㅣ E\tㅇ ㅐ', 'ㅣ E\tㅇ ㅔ', 'ㅗ E\tㅇ ㅏ', 'ㅗ E\tㅇ ㅐ', 'ㅗ E\tㅇ ㅔ', 'ㅜ E\tㅇ ㅓ', 'ㅜ E\tㅇ ㅔ', 'ㅜ E\tㅇ ㅣ', 'ㅡ E\tㅇ ㅣ', 'ㅏ E\tㅎ ㅏ', 'ㅓ E\tㅎ ㅓ', 'ㅣ E\tㅎ ㅣ', 'ㅗ E\tㅎ ㅗ', 'ㅜ E\tㅎ ㅜ', 'ㅡ E\tㅎ ㅡ', 'ㅐ E\tㅎ ㅐ', 'ㅔ E\tㅎ ㅔ', 'ㅣ E\tㅎ ㅏ', 'ㅣ E\tㅎ ㅓ', 'ㅣ E\tㅎ ㅗ', 'ㅣ E\tㅎ ㅜ', 'ㅣ E\tㅎ ㅐ', 'ㅣ E\tㅎ ㅔ', 'ㅗ E\tㅎ ㅏ', 'ㅗ E\tㅎ ㅐ', 'ㅗ E\tㅎ ㅔ', 'ㅜ E\tㅎ ㅓ', 'ㅜ E\tㅎ ㅔ', 'ㅜ E\tㅎ ㅣ', 'ㅡ E\tㅎ ㅣ', 'ㄱ\tㅎ', 'ㄷ\tㅎ', 'ㅂ\tㅎ', 'ㅈ\tㅎ', 'ㅎ\tㄱ', 'ㅎ\tㄷ', 'ㅎ\tㅂ', 'ㅎ\tㅈ', 'ㅑ ', 'ㅕ ', 'ㅛ ', 'ㅠ ', 'ㅒ ', 'ㅖ ', 'ㅘ ', 'ㅙ ', 'ㅚ ', 'ㅝ ', 'ㅞ ', 'ㅟ ', 'ㅢ ', 'E\tㅋ', 'E\tㅌ', 'E\tㅍ', 'E\tㅊ', 'E\tㅋ', 'E\tㅌ', 'E\tㅍ', 'E\tㅊ']
    var to = ['ㅏ', 'ㅓ', 'ㅣ', 'ㅗ', 'ㅜ', 'ㅡ', 'ㅐ', 'ㅔ', 'ㅑ', 'ㅕ', 'ㅛ', 'ㅠ', 'ㅒ', 'ㅖ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅢ', 'ㅏ', 'ㅓ', 'ㅣ', 'ㅗ', 'ㅜ', 'ㅡ', 'ㅐ', 'ㅔ', 'ㅑ', 'ㅕ', 'ㅛ', 'ㅠ', 'ㅒ', 'ㅖ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅢ', 'E\tㅋ', 'E\tㅌ', 'E\tㅍ', 'E\tㅊ', 'E\tㅋ', 'E\tㅌ', 'E\tㅍ', 'E\tㅊ', 'ㅣ E\tㅇ ㅏ ', 'ㅣ E\tㅇ ㅓ ', 'ㅣ E\tㅇ ㅗ ', 'ㅣ E\tㅇ ㅜ ', 'ㅣ E\tㅇ ㅐ ', 'ㅣ E\tㅇ ㅔ ', 'ㅗ E\tㅇ ㅏ ', 'ㅗ E\tㅇ ㅐ ', 'ㅗ E\tㅇ ㅔ ', 'ㅜ E\tㅇ ㅓ ', 'ㅜ E\tㅇ ㅔ ', 'ㅜ E\tㅇ ㅣ ', 'ㅡ E\tㅇ ㅣ ', 'ㄱ\tㅎ', 'ㄷ\tㅎ', 'ㅂ\tㅎ', 'ㅈ\tㅎ', 'ㅎ\tㄱ', 'ㅎ\tㄷ', 'ㅎ\tㅂ', 'ㅎ\tㅈ']
    if (!text.includes(from[i]) && i >= (from.length - 1))
        return text
    else if (!text.includes(from[i]) && i < (from.length - 1)) {
        i++;
        return pronrecursive(i, text)
    }
    else if (text.includes(from[i])) {
        var text1 = text.replace(from[i], from[i].replace('\t', 'A').replace(/ /, 'B'))
        var nochange = pronrecursive(i, text1)
        var text2 = text.replace(from[i], to[i])
        var change = pronrecursive(i, text2)
        return change + '\n' + nochange
    }
}
function search(keyword) {
    var wordslist = getFile()
    var scores = []
    var len = wordslist.length
    for (var i = 0; i < len; i++) {
        word = wordslist[i]
        a = keyword.split('\t')
        b = word.split('\t')
        var originblen = b.length
        var alen = a.length
        if (alen > originblen)
            [a, b] = [b, a]
        // a > b
        b = b.slice(-alen)
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
            score += relevance2(asplit[2], bsplit[2], force2) * (j == (alen - 1) ? 1.5 : 1)
        }
        score = Math.max(score, 0)
        score /= Math.max(alen, originblen)
        scores.push(score)
    }
    return scores
}
function relevance0(a, b, force) {
    if (force == 1 && a != b) return -10000;
    if (a == 'ㅇ' && b == 'ㅇ') return 6;
    if (a == b) return 5;
    var similar = ['ㄱㄲㅋ', 'ㄷㄸㅌ', 'ㅂㅃㅍ', 'ㅈㅉㅊ', 'ㅅㅆ', 'ㄴㅁ', 'ㅇㅎ']
    var ssimilar = ['ㄱㄲㅋㄷㄸㅌㅂㅃㅍ', 'ㅈㅉㅊㅅㅆ']
    if (arebothin(a, b, similar)) return 3;
    if (arebothin(a, b, ssimilar)) return 1;
    else return 0;
}
function relevance1(a, b) {
    if (a == b) return 40;
    var same = ['ㅙㅚㅞ', 'ㅔㅐ']
    var similar = ['ㅜㅠ', 'ㅘㅏㅑ', 'ㅝㅓㅕㅗㅛ', 'ㅟㅢㅣ', 'ㅚㅙㅞㅐㅔㅖㅒ']
    if (arebothin(a, b, same)) return 40;
    else if (arebothin(a, b, similar)) return 15;
    else return 0;
}
function relevance2(a, b, force) {
    if (force == 1 && a != b) return -10000;
    if (a == 'E' && b == 'E') return 3;
    if (a == b) return 2;
    var same = ['ㄲㅋㄳㄺㄱ', 'ㄵㄴㄶ', 'ㅅㅆㅈㅌㅍㄷ', 'ㄼㄽㄾㄹㅀ', 'ㄻㅁ', 'ㅍㅄㄿㅂ', 'ㅇ']
    var similar = ['ㄲㅋㄳㄺㄱㅅㅆㅈㅌㅍㄷㅍㅄㄿㅂ', 'ㄵㄴㄶㄼㄽㄾㄹㅀㄻㅁㅇ']
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
function getFile() {
    var output = ''
    var oFrame = document.getElementById("frmFile");
    var strRawContents = oFrame.contentWindow.document.body.childNodes[0].innerHTML;
    while (strRawContents.indexOf("\r") >= 0)
        strRawContents = strRawContents.replace("\r", "");
    var arrLines = strRawContents.split("\n");
    return arrLines
}






