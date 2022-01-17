function buttonclick() {
    var input = document.getElementById("input").value
    if (input.length <= 1) {
        alert('1글자 이하로는 검색하실 수 없습니다!')
        return 0;
    }
    input = input.replace(/[^가-힣]/, '') //띄어쓰기금지, 한국어 외 금지 -혹은 자동 제외후 검색

    //가능한 검색어들 추출
    var tosearch = possiblepron(input)
    //로 검색된 점수 총합
    var tosearchlen=tosearch.length
    for (var i=0;i<tosearchlen;i++) {
        if (i == 0) {
            var scores = search(tosearch[0])
        }
        else if(i==tosearchlen-1)
        {
            var serres = search(tosearch[i])
            for (var j = 0, len = scores.length; j < len; j++)
                scores[j] += (serres[j]*2)
        }
        else {
            var serres = search(tosearch[i])
            for (var j = 0, len = scores.length; j < len; j++)
                scores[j] += serres[j]
        }
    }
    //정렬후 출력
    let result = Object.entries(scores).sort((a, b) => a[1] - b[1]).map(e => +e[0]).reverse()
    let output = ''
    let words = getFile()
    for (var i = 0; i < 100; i++) {
        var word = ('' + words[result[i]]).replace(/[ \tE]/g, '')
        word = Hangul.assemble(word)
        output = output + word + '                score:' + scores[result[i]] + '<br>'
    }
    document.getElementById('output').innerHTML = output
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
    return result
}
function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
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
        if (a.length > b.length)
            [a, b] = [b, a]
        // a > b
        b = b.slice(-a.length)
        var score = 0
        for (var j = 0, len2 = a.length; j < len2; j++) {
            score += relevance0(a[j].split(' ')[0], b[j].split(' ')[0])
            score += relevance1(a[j].split(' ')[1], b[j].split(' ')[1])
            score += relevance2(a[j].split(' ')[2], b[j].split(' ')[2])
        }
        scores.push(score)
    }
    return scores
}
function relevance0(a, b) {
    if (a == b) return 3;
    var similar = ['ㄱㄲㅋ', 'ㄷㄸㅌ', 'ㅂㅃㅍ', 'ㅈㅉㅊ', 'ㅅㅆ','ㄴㅁ','ㅇㅎ']
    if (arebothin(a, b, similar)) return 2;
    else return 0;
}
function relevance1(a, b) {
    if (a == b) return 50;
    var same = ['ㅙㅚㅞ', 'ㅔㅐ']
    var similar = ['ㅗㅛ', 'ㅜㅠ', 'ㅘㅏㅑ', 'ㅝㅓㅕ', 'ㅟㅢㅣ', 'ㅚㅙㅞㅐㅔㅖㅒ']
    if (arebothin(a, b, same)) return 40;
    else if (arebothin(a, b, similar)) return 6;
    else return 0;
}
function relevance2(a, b) {
    if (a == b) return 3;
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






