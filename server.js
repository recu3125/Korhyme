var express = require('express')
// express 는 함수이므로, 반환값을 변수에 저장한다.
var app = express()
const fs = require('fs')
const Hangul = require('hangul-js');

var file = [[[], []], [[], []], [[], []]]
var filesplit = [[[], []], [[], []], [[], []]]
// 3000 포트로 서버 오픈
var port = 80
app.listen(port, async function () {
  console.log("start at " + port)
  getfile(0).then(arr => {
    arr[0].map(a => { // 단어
      file[0][0].push(a)
      filesplit[0][0].push(a.split('L'))
      file[1][0].push(a)
      filesplit[1][0].push(a.split('L'))
      file[2][0].push(a)
      filesplit[2][0].push(a.split('L'))
    })
    arr[1].map(a => { // 발음
      file[0][1].push(a)
      filesplit[0][1].push(a.split('L'))
      file[1][1].push(a)
      filesplit[1][1].push(a.split('L'))
      file[2][1].push(a)
      filesplit[2][1].push(a.split('L'))
    })
  })
  getfile(1).then(arr => {
    arr[0].map(a => { // 단어
      file[1][0].push(a)
      filesplit[1][0].push(a.split('L'))
      file[2][0].push(a)
      filesplit[2][0].push(a.split('L'))
    })
    arr[1].map(a => { // 발음
      file[1][1].push(a)
      filesplit[1][1].push(a.split('L'))
      file[2][1].push(a)
      filesplit[2][1].push(a.split('L'))
    })
  })
  getfile(2).then(arr => {
    arr[0].map(a => { // 단어
      file[2][0].push(a)
      filesplit[2][0].push(a.split('L'))
    })
    arr[1].map(a => { // 발음
      file[2][1].push(a)
      filesplit[2][1].push(a.split('L'))
    })
    console.log('data loaded')
  })
})

app.get('/', function (req, res) {
  res.sendFile(__dirname + "/public/main.html")
})

app.get('/search', (req, res) => {
  res.sendFile(__dirname + "/public/search.html")
})

app.get('/info', (req, res) => {
  res.sendFile(__dirname + "/public/info.html")
})

app.get('/naver563cb392f54442bd9c3cc519ad255616.html', (req, res) => {
  res.sendFile(__dirname + "/naver563cb392f54442bd9c3cc519ad255616.html")
})

app.get('/robots.txt', (req, res) => {
  res.sendFile(__dirname + "/robots.txt")
})
app.get('/sitemap', (req, res) => {
  res.sendFile(__dirname + "/sitemap.xml")
})

var sel
app.get('/process/:key/:sel/:from', (req, res) => {
  var start = performance.now()
  var key = req.params.key
  sel = Number(req.params.sel)
  var from = Number(req.params.from)
  res.send(processf(key, sel, from))
  var end = performance.now()
  console.log(`sended result to client : key:${key}, sel:${sel}, from:${from}, time:${end - start} ms`)
})

app.use('/spublic', express.static(__dirname + '/public'));
app.use('/sicon', express.static(__dirname + '/icon'));
app.use('/sfonts', express.static(__dirname + '/fonts'));

function processf(key, sel, from) {
  if (key == '') {
    location.href = '/'
    return '0';
  }
  var input = key
  var tosearch = stdpron(input) //5ms 이하
  var scores = search(tosearch) //500-2000ms(차이큼)


  // 정렬후 출력  1000ms
  var result = Object.entries(scores).sort((a, b) => a[1] - b[1]).map(e => e[0]).reverse()
  var words = file[sel][0]
  var outputlist = [
    ['' + words[result[from]], Math.round(scores[result[from]] * 4)]
  ]
  for (var i = from + 1; i < from + 200; i++) {
    var word = ('' + words[result[i]])
    outputlist.push([word, Math.round(scores[result[i]] * 4)])
  }
  return JSON.stringify(outputlist)
}


function korformatter(commonkor) {
  //가나다
  commonkor = commonkor.replace(/ ?/g, 'L').replace(/^\L+|\L+$/g, '').trim()
  //가L나L다
  var disassemed = betterDisassemble(commonkor).replace(/ ?/g, ' ').replace(/^\L+|\L+$/g, '').trim()
  disassemed = disassemed.replace(/ㅗ ㅏ/g, 'ㅘ')
    .replace(/ㅗ ㅐ/g, 'ㅙ')
    .replace(/ㅗ ㅣ/g, 'ㅚ')
    .replace(/ㅜ ㅓ/g, 'ㅝ')
    .replace(/ㅜ ㅔ/g, 'ㅞ')
    .replace(/ㅜ ㅣ/g, 'ㅟ')
    .replace(/ㅡ ㅣ/g, 'ㅢ')
    .replace(/ㄱ ㅅ/g, 'ㄳ')
    .replace(/ㄴ ㅈ/g, 'ㄵ')
    .replace(/ㄴ ㅎ/g, 'ㄶ')
    .replace(/ㄹ ㄱ/g, 'ㄺ')
    .replace(/ㄹ ㅁ/g, 'ㄻ')
    .replace(/ㄹ ㅂ/g, 'ㄼ')
    .replace(/ㄹ ㅅ/g, 'ㄽ')
    .replace(/ㄹ ㅌ/g, 'ㄾ')
    .replace(/ㄹ ㅍ/g, 'ㄿ')
    .replace(/ㄹ ㅎ/g, 'ㅀ')
    .replace(/ㅂ ㅅ/g, 'ㅄ')
    .split('L')
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
  var cutlength = 1
  for (var i = 0; i < inlen; i += 1) {
    var sub = Hangul.disassemble(input[i]).join('')
    out += sub
  }
  return out
}

function stdpron(a) {
  var a = korformatter(a)
  //모음 한단어에 하나로
  a = a.replace(/ㅑ/g, 'ㅣ ELㅇ ㅏ')
    .replace(/ㅕ/g, 'ㅣ ELㅇ ㅓ')
    .replace(/ㅛ/g, 'ㅣ ELㅇ ㅗ')
    .replace(/ㅠ/g, 'ㅣ ELㅇ ㅜ')
    .replace(/ㅒ/g, 'ㅣ ELㅇ ㅐ')
    .replace(/ㅖ/g, 'ㅣ ELㅇ ㅔ')
    .replace(/ㅘ/g, 'ㅗ ELㅇ ㅏ')
    .replace(/ㅙ/g, 'ㅗ ELㅇ ㅐ')
    .replace(/ㅚ/g, 'ㅜ ELㅇ ㅔ')
    .replace(/ㅝ/g, 'ㅜ ELㅇ ㅓ')
    .replace(/ㅞ/g, 'ㅜ ELㅇ ㅔ')
    .replace(/ㅟ/g, 'ㅜ ELㅇ ㅣ')
    .replace(/ㅢ/g, 'ㅡ ELㅇ ㅣ')
    .replace(/([ㅏㅓㅗㅜㅡㅣㅐㅔ]) ELㅇ \1/g, '$1')
    .replace(/([ㅏㅓㅗㅜㅡㅣㅐㅔ]) ELㅇ \1/g, '$1')
    .replace(/([ㅏㅓㅗㅜㅡㅣㅐㅔ]) ELㅇ \1/g, '$1')
    .replace(/([ㅏㅓㅗㅜㅡㅣㅐㅔ]) ELㅇ \1/g, '$1')

    //사이시옷(모든 시옷을 사이시옷으로 생각)
    .replace(/ㅅL(.) ㅣ/g, 'ㄴL$1 ㅣ')
    .replace(/ㅅL[ㄴㅁ]/g, 'ㅅLㄴ')
    .replace(/ㅅLㄱ/g, 'ELㄲ')
    .replace(/ㅅLㄷ/g, 'ELㄸ')
    .replace(/ㅅLㅂ/g, 'ELㅃ')
    .replace(/ㅅLㅅ/g, 'ELㅆ')
    .replace(/ㅅLㅈ/g, 'ELㅉ')

    //된소리되기(어간생각X)
    .replace(/([ㄱㄲㅋㄳㄺㄷㅅㅆㅈㅊㅌㅂㅍㄼㄿㅄ])Lㄱ/g, '$1Lㄲ')
    .replace(/([ㄱㄲㅋㄳㄺㄷㅅㅆㅈㅊㅌㅂㅍㄼㄿㅄ])Lㄷ/g, '$1Lㄸ')
    .replace(/([ㄱㄲㅋㄳㄺㄷㅅㅆㅈㅊㅌㅂㅍㄼㄿㅄ])Lㅂ/g, '$1Lㅃ')
    .replace(/([ㄱㄲㅋㄳㄺㄷㅅㅆㅈㅊㅌㅂㅍㄼㄿㅄ])Lㅅ/g, '$1Lㅆ')
    .replace(/([ㄱㄲㅋㄳㄺㄷㅅㅆㅈㅊㅌㅂㅍㄼㄿㅄ])Lㅈ/g, '$1Lㅉ')

    //동화
    .replace(/ㄴLㄹ/g, 'ㄹLㄹ')
    .replace(/ㄹLㄴ/g, 'ㄹLㄹ')
    .replace(/ㅀLㄴ/g, 'ㄹLㄹ')
    .replace(/ㄾLㄴ/g, 'ㄹLㄹ')
    .replace(/([ㅁㅇ])Lㄹ/g, '$1Lㄴ')
    .replace(/ㄱLㄹ/g, 'ㅇLㄴ')
    .replace(/ㅂLㄹ/g, 'ㅁLㄴ')
    .replace(/[ㄱㄲㅋㄳㄺ]L([ㄴㅁ])/g, 'ㅇL$1')
    .replace(/[ㄷㅅㅆㅈㅊㅌㅎ]L([ㄴㅁ])/g, 'ㄴL$1')
    .replace(/[ㅂㅍㄼㄿㅄ]L([ㄴㅁ])/g, 'ㅁL$1')

    //받침의 발음
    .replace(/([ㄱㄴㄷㄹㅁㅂㅅㅈㅊㅋㅌㅍㄲㅆ])Lㅇ/g, 'EL$1')
    .replace(/ㄳLㅇ/g, 'ㄱLㅆ')
    .replace(/ㄵLㅇ/g, 'ㄴLㅈ')
    .replace(/ㄶLㅇ/g, 'ㄴLㅇ')
    .replace(/ㄺLㅇ/g, 'ㄹLㄱ')
    .replace(/ㄻLㅇ/g, 'ㄹLㅁ')
    .replace(/ㄼLㅇ/g, 'ㄹLㅂ')
    .replace(/ㄽLㅇ/g, 'ㄹLㅆ')
    .replace(/ㄾLㅇ/g, 'ㄹLㅌ')
    .replace(/ㄿLㅇ/g, 'ㄹLㅍ')
    .replace(/ㅀLㅇ/g, 'ㄹLㅇ')
    .replace(/ㅄLㅇ/g, 'ㅂLㅆ')
    .replace(/ㅎLㄴ/g, 'ㄴLㄴ')
    .replace(/([ㅎㄶㅀ])Lㅅ/g, '$1Lㅆ')
    .replace(/([ㅎㄶㅀ])Lㄱ/g, '$1Lㅋ')
    .replace(/([ㅎㄶㅀ])Lㄷ/g, '$1Lㅌ')
    .replace(/([ㅎㄶㅀ])Lㅈ/g, '$1Lㅊ')
    .replace(/([ㄱㄺ])Lㅎ/g, 'ELㅋ')
    .replace(/([ㄷ])Lㅎ/g, 'ELㅊ')
    .replace(/([ㅂㄼ])Lㅎ/g, 'ELㅍ')
    .replace(/([ㅈㄵ])Lㅎ/g, 'ELㅊ')
    .replace(/([ㅅㅈㅊㅌ])Lㅎ/g, 'ELㅌ')

    //7종성예외
    .replace(/ㅂ ㅏ ㄼ/g, 'ㅂ ㅏ ㅂ')
    .replace(/ㄴ ㅓ ㄼ/g, 'ㄴ ㅓ ㅂ')

    //7종성
    .replace(/[ㄲㅋㄳㄺ]L/g, 'ㄱL')
    .replace(/[ㄵ]L/g, 'ㄴL')
    .replace(/[ㅅㅆㅈㅊㅌ]L/g, 'ㄷL')
    .replace(/[ㄼㄽㄾ]L/g, 'ㄹL')
    .replace(/[ㄻ]L/g, 'ㅁL')
    .replace(/[ㅍㅄ]L/g, 'ㅂL')
    .replace(/[ㄿ]L/g, 'ㅇL')

    .replace(/ㅎL/g, 'EL')

    //규정에 없지만 자율적으로
    .replace(/([ㄴ])Lㅎ/g, 'ELㄴ')
    .replace(/([ㄹ])Lㅎ/g, 'ELㄹ')
    .replace(/([ㅁ])Lㅎ/g, 'ELㅁ')
    .replace(/([ㅇ])Lㅎ/g, 'ㅇLㅇ')
  return a;
}

function search(keyword) {
  var charmem = [] //한글자당 값 기억용 배열(짱큼)
  var pronslist = file[sel][1]
  var scores = []
  var len = pronslist.length
  var ao = keyword.split('L')
  var aleno = ao.length
  for (var i = 0; i < len; i++) { //단어 vs 단어 비교
    var a = ao //입력 단어 발음
    var alen = aleno //길이
    var b = filesplit[sel][1][i]  // 비교할 단어 발음
    var blen = b.length //길이
    if (alen < blen) {
      b = b.slice(-alen)
      blen = alen
    } else {
      a = a.slice(-blen)
      alen = blen
    }
    //마지막에 alen개 자름
    var score = 0
    var asplit
    var bsplit
    var chojongchain = 0
    for (var j = 0; j < alen; j++) { //글자 vs 글자 비교
      var befasplit = asplit
      var befbsplit = bsplit
      asplit = [a[j][0], a[j][2], a[j][4]] //초,중,종성
      bsplit = [b[j][0], b[j][2], b[j][4]]
      var force0 = 0 //무조건 같게
      var force2 = 0 //무조건 같게
      if (chojongchain) //입력단어에서 이번 종성이 다음 초성이랑 연결 ex)
      {
        force2 = 1
        chojongchain = 0
      }
      if (j > 0 && befasplit[2] == 'E' && asplit[0] == 'ㅇ' || //가이 나이 등 발음 부드러운거 결과도 부드럼게(음절차이안나게) 인데 고민필요
        j > 0 && befbsplit[2] == 'E' && bsplit[0] == 'ㅇ') // 이번 초성이 이전 종성이랑 연결
      {
        force0 = 1
        chojongchain = 1
      }
      //b(데이터베이스)글자와 a(입력)의몇번째글자인지 포함된 메모리용 식별번호
      chartocode = ((force0 * 2) + force2) * 270000000 + (alen - j) * 27000000 + (bsplit[0] == undefined ? 299 : bsplit[0].charCodeAt(0) - 'ㄱ'.charCodeAt(0)) * 90000 + (bsplit[1] == undefined ? 299 : bsplit[1].charCodeAt(0) - 'ㅏ'.charCodeAt(0)) * 300 + (bsplit[2] == undefined ? 298 : bsplit[2] == 'E' ? 299 : bsplit[2].charCodeAt(0) - 'ㄱ'.charCodeAt(0))
      //console.log(`${bsplit[0]}, ${bsplit[1]}, ${bsplit[2]}, ${bsplit[0]==undefined ? 999 : bsplit[0].charCodeAt(0)-'ㄱ'.charCodeAt(0)} , ${bsplit[1]==undefined ? 999 : bsplit[1].charCodeAt(0)-'ㅏ'.charCodeAt(0)}, ${bsplit[2]==undefined ? 998 : bsplit[2]=='E' ? 999 : bsplit[2].charCodeAt(0)-'ㄱ'.charCodeAt(0)}, ${chartocode}`)
      if (charmem[chartocode] != undefined) //있으면 불러오기
      {
        score += charmem[chartocode]
      }
      else //아니니까 계산
      {
        //relevance 메모라이제이션..인데 안빨라짐
        // jamomem = [[[],[]],[[]],[[],[]]]
        // jamotocode0 =((asplit[0]==undefined) ? 299 : asplit[0].charCodeAt(0)-'ㄱ'.charCodeAt(0)*300 + (bsplit[0]==undefined) ? 299 : bsplit[0].charCodeAt(0)-'ㄱ'.charCodeAt(0))
        // jamotocode1 =((asplit[1]==undefined) ? 299 : asplit[1].charCodeAt(0)-'ㅏ'.charCodeAt(0)*300 + (bsplit[1]==undefined) ? 299 : bsplit[1].charCodeAt(0)-'ㅏ'.charCodeAt(0))
        // jamotocode2 =((asplit[2]=='E') ? 298 : (asplit[2]==undefined) ? 299 : asplit[2].charCodeAt(0)-'ㄱ'.charCodeAt(0)*300 + (bsplit[2]=='E') ? 298 : (bsplit[2]==undefined) ? 299 : bsplit[2].charCodeAt(0)-'ㄱ'.charCodeAt(0))
        // var tempscore = 0
        // if(jamomem[0][force0][jamotocode0] == undefined){
        //   jamomem[0][force0][jamotocode0] = relevance0(asplit[0], bsplit[0], force0)
        // }
        // tempscore += jamomem[0][force0][jamotocode0] * (j == (alen - 1) ? 1.5 : 1) //마지막글자면 1.5배

        // if(jamomem[1][jamotocode0] == undefined){
        //   jamomem[1][jamotocode0] = relevance1(asplit[1], bsplit[1])
        // }
        // tempscore += jamomem[1][jamotocode0] * (j == (alen - 1) ? 1.5 : 1) //마지막글자면 1.5배

        // if(jamomem[2][force2][jamotocode0] == undefined){
        //   jamomem[2][force2][jamotocode0] = relevance2(asplit[2], bsplit[2], force2)
        // }
        // tempscore += jamomem[2][force2][jamotocode0] * (j == (alen - 1) ? jamomem[2][force2][jamotocode0] >= 2 ? 10 : 1.5 : 1) // 마지막글잔데 받침 똑같으면 10배나?? 해놨네
        var tempscore = 0
        tempscore += relevance0(asplit[0], bsplit[0], force0) * (j == (alen - 1) ? 1.5 : 1)
        tempscore += relevance1(asplit[1], bsplit[1]) * (j == (alen - 1) ? 1.5 : 1) //마지막글자면 1.5배
        var rel2 = relevance2(asplit[2], bsplit[2], force2)
        tempscore += rel2 * (j == (alen - 1) ? rel2 >= 2 ? 10 : 1.5 : 1) // 마지막글잔데 받침 똑같으면 10배나?? 해놨네

        score += tempscore
        charmem[chartocode] = tempscore
      }
    }
    score = Math.max(score, 0)
    score /= aleno
    scores.push(score)
  }
  return scores
}
function relevance0(a, b, force) {
  if (force == 1 && a != b) return -10000; //이러면 아예 제외해버린다..?
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

function arebothin(a, b, arr) {
  for (var i = 0, bothinlen = arr.length; i < bothinlen; i++) {
    var element = arr[i]
    if (element.includes(a) && element.includes(b))
      return 1;
  }
  return 0;
}

async function getfile(num) {
  var numtopath = [__dirname + '/public/lyrics.txt', __dirname + '/public/news.txt', __dirname + '/public/dict.txt']
  var a = [],
    b = []
  return new Promise(resolve => {
    fs.readFile(numtopath[num], 'utf8', (err, result) => {
      if (err) {
        console.error(err)
        return
      }
      while (result.indexOf("\r") >= 0)
        result = result.replace(/\r/g, "");
      var arrLines = result.split("\n");
      for (var j of arrLines) {
        var splitted = j.split('\t')
        a.push(splitted[0])
        b.push(splitted[1])
      }
      resolve([a, b])
    })
  })
}

module.exports = app;