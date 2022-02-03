var express = require('express')
// express 는 함수이므로, 반환값을 변수에 저장한다.
var app = express()
const fs = require('fs')
const Hangul = require('hangul-js');

var file = [[[], []], [[], []], [[], []]]
// 3000 포트로 서버 오픈
var port = process.env.PORT || 9000
app.listen(port, async function () {
  console.log("start at " + port)
  getfile(0).then(arr => {
    arr[0].map(a => { // 단어
      file[0][0].push(a)
      file[1][0].push(a)
      file[2][0].push(a)
    })
    arr[1].map(a => { // 발음
      file[0][1].push(a)
      file[1][1].push(a)
      file[2][1].push(a)
    })
  })
  getfile(1).then(arr => {
    arr[0].map(a => { // 단어
      file[1][0].push(a)
      file[2][0].push(a)
    })
    arr[1].map(a => { // 발음
      file[1][1].push(a)
      file[2][1].push(a)
    })
  })
  getfile(2).then(arr => {
    arr[0].map(a => { // 단어
      file[2][0].push(a)
    })
    arr[1].map(a => { // 발음
      file[2][1].push(a)
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
  var key = req.params.key
  sel = Number(req.params.sel)
  var from = Number(req.params.from)
  res.send(processf(key, sel, from))
  console.log(`sended result to client : key:${key}, sel:${sel}, from:${from}`)
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
  var inputlen = input.length
  var tosearch = stdpron(input)
  var scores = search(tosearch)


  // 정렬후 출력
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
  var cache = new Map()
  var pronslist = file[sel][1]
  var scores = []
  var len = pronslist.length
  var ao = keyword.split('L')
  var aleno = ao.length
  for (var i = 0; i < len; i++) {
    var a = ao //입력 단어 발음
    var alen = aleno //길이
    var b = (pronslist[i] || '').split('L') // 비교할 단어 발음
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
    for (var j = 0; j < alen; j++) {
      var befasplit = asplit
      var befbsplit = bsplit
      asplit = [a[j][0],a[j][2],a[j][4]]
      bsplit = [b[j][0],b[j][2],b[j][4]]
      var force0 = 0 //무조건 같게
      var force2 = 0 //무조건 같게
      if (chojongchain) //이번 종성이 다음 초성이랑 연결
      {
        force2 = 1
        chojongchain = 0
      }
      if (j > 0 && befasplit[2] == 'E' && asplit[0] == 'ㅇ' ||
        j > 0 && befbsplit[2] == 'E' && bsplit[0] == 'ㅇ') // 이번 초성이 이전 종성이랑 연결
      {
        force0 = 1
        chojongchain = 1
      }
      var key = a[j] + b[j]
      if (force0 == 0 && force2 == 0 && cache.has(key)) {
        score += cache.get(key)
      }
      else {
        var nowscore = 0
        nowscore += relevance0(asplit[0], bsplit[0], force0) * (j == (alen - 1) ? 1.5 : 1)
        nowscore += relevance1(asplit[1], bsplit[1]) * (j == (alen - 1) ? 1.5 : 1) //마지막글자면 1.5배
        var rel2 = relevance2(asplit[2], bsplit[2], force2)
        nowscore += rel2 * (j == (alen - 1) ? rel2 >= 2 ? 10 : 1.5 : 1) // 마지막글잔데 받침 똑같으면 10배나?? 해놨네
        cache.set(key, nowscore)
        score += nowscore
      }
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