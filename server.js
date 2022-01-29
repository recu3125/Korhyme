var express = require('express')
// express 는 함수이므로, 반환값을 변수에 저장한다.
var app = express()
const fs = require('fs')
const Hangul = require('hangul-js');

var file = [[],[],[]]
// 3000 포트로 서버 오픈
var port = process.env.PORT || 9000
app.listen(port, async function () {
  console.log("start at " + port)
  file[0] = await getfile(0)
  file[1] = await getfile(1)
  file[2] = await getfile(2)
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

app.get('/process/:key/:sel/:from', (req, res) => {
  key = req.params.key
  sel = Number(req.params.sel)
  from = Number(req.params.from)
  res.send(processf(key, sel, from))
  console.log(`sended result to client : key:${key}, sel:${sel}, from:${from}`)
})

app.use('/static', express.static(__dirname + '/public'));

function processf(key, sel, from) {
  if (key == '') {
    location.href = '/'
    return 0;
  }
  var input = key
  inputlen = input.length
  input = input.replace(/[^가-힣]/g, '') //자동 제외후
  var tosearch = stdpron(input)
  var scores = search(tosearch)


  // 정렬후 출력
  var result = Object.entries(scores).sort((a, b) => a[1] - b[1]).map(e => e[0]).reverse()
  var words = []
  for(i=0;i<=sel;i++)
  {
    file[i][0].map(a=> words.push(a))
  }
  var outputlist = [['' + words[result[from]], Math.round(scores[result[from]] * 4)]]
  for (var i = from+1; i < from+200; i++) {
    var word = ('' + words[result[i]])
    outputlist.push([word, Math.round(scores[result[i]] * 4)])
  }
  resultssaved = result
  wordssaved = words
  scoressaved = scores
  return JSON.stringify(outputlist)
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
  var wordslist = []
  for(i=0;i<=sel;i++)
  {
    file[i][1].map(a=> wordslist.push(a))
  }
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

async function getfile(num) {
  console.log(num)
  var numtopath = [__dirname +'/public/lyrics.txt', __dirname +'/public/news.txt', __dirname +'/public/dict.txt']
  console.log(numtopath[num])
  var a = [], b = []
  console.log('3')
  return new Promise(resolve => {
  fs.readFile(numtopath[num], 'utf8', (err, result) => {
    if (err) {
      console.log('e')
      console.error(err)
      return
    }
    console.log('4')
    while (result.indexOf("\r") >= 0)
      result = result.replace(/\r/g, "");
      console.log('5')
    var arrLines = result.split("\n");
    for (j of arrLines) {
      splitted = j.split('\t')
      a.push(splitted[0])
      b.push(splitted[1])
    }
    console.log(a[10])
    resolve([a, b])
  })
  })
}

module.exports = app;