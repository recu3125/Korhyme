let express = require('express')
// express 는 함수이므로, 반환값을 변수에 저장한다.
let app = express()
const fs = require('fs')
const Hangul = require('hangul-js');
let file = [,,]
// nginx용 8080 포트로 서버 오픈
let port = 8080

app.use((req, res, next) => {
  res.setTimeout(20000, () => {
    console.log('Request has timed out.');
    res.send(408)
    console.error('response timeout');
    process.exit(1)
  });
  next();
});

app.listen(port, async function () {
  console.log("start at " + port)
  file[0] = await getfile(0)
  file[1] = await getfile(1)
  file[2] = await getfile(2)
  for (let i = 0; i <= 2; i++) {
    for (let j = 0, len = file[i][1].length; j < len; j++) {
      file[i][1][j] = file[i][1][j].split('L')
    }
  }
  console.log('data loaded')
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

app.get('/qna', (req, res) => {
  res.sendFile(__dirname + "/public/qna.html")
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

let sel
app.get('/process/:key/:sel/:sel2/:from/:min/:max', async (req, res) => {
  let key = req.params.key
  sel = Number(req.params.sel)
  let sel2 = Number(req.params.sel2)
  let from = Number(req.params.from)
  let minlen = Number(req.params.min)
  let maxlen = Number(req.params.max)
  let start = +new Date()
  res.send(await processf(key, sel2, from, minlen, maxlen))
  let end = +new Date()
  console.log(`sended result to client : key:${key}, sel:${sel}, sel2:${sel2}, from:${from}, minmax:${minlen}-${maxlen}, processtime:${end - start} ms, time:${new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" }).toString()}`)
})

app.use('/spublic', express.static(__dirname + '/public'));
app.use('/sicon', express.static(__dirname + '/icon'));
app.use('/sfonts', express.static(__dirname + '/fonts'));
app.use('/scss', express.static(__dirname + '/css'));

async function processf(key, sel2, from, minlen, maxlen) {
  if (key == '') {
    location.href = '/'
    return '0';
  }
  let input = key
  let inputlen = input.length
  let tosearch = await stdpron(input)
  if (minlen < 2 || maxlen > 6) {
    minlen = 2
    maxlen = 6
  }
  let scores = await search(tosearch, minlen, maxlen)
  // sort로 값으로 역순 정렬후 그순서대로 from부터 from+200까지 앞에서부터 잘라줌

  // let result = Object.entries(scores).sort((a, b) => a[1] - b[1]).map(e => e[0]).reverse()
  // let words = file[sel][0]
  // let outputlist = [
  //   ['' + words[result[from]], Math.round(scores[result[from]] * 4)]
  // ]
  // for (let i = from + 1; i < from + 200; i++) {
  //   let word = ('' + words[result[i]])
  //   outputlist.push([word, Math.round(scores[result[i]] * 4)])
  // }

  //카운팅 소트(역순)
  let len = scores.length
  let maxvalue = 300
  let sortcount = Array(maxvalue).fill(0)
  let orderresult = []
  let words
  // const wordstojoin = [[0],[0,1],[0,1,2],[2]]
  // for (i=0;i<wordstojoin[sel].length;i++){
  //   words = words.concat(file[wordstojoin[sel][i]][0])
  // }
  switch(sel){
    case 0:
      words = file[0][0]
      break;
    case 1:
      words = file[0][0].concat(file[1][0])
      break;
    case 2:
      words = file[0][0].concat(file[1][0],file[2][0])
      break;
    case 3:
      words = file[2][0]
      break;
  }
  outputlist = []
  for (let i = 0; i < len; i++) {
    sortcount[scores[i]] += 1//점수별 나온 개수
  }
  for (let i = maxvalue - 2; i >= 0; i--) //역순
  {
    sortcount[i] += sortcount[i + 1]//다더해서 위치
  }
  for (let i = 0; i < len; i++) {
    sortcount[scores[i]] -= 1
    orderresult[sortcount[scores[i]]] = i
  }

  if (sel2 == 1) {// 다양옵션
    outlen = 0
    alreadythere = []
    for (let i = 0; outlen < from + 200; i++) {
      let word = ('' + words[orderresult[i]])

      isalreadythere = false
      allen = alreadythere.length
      for (j = 0; j < allen; j++) {
        if (word.slice(-2) == alreadythere[j]) {
          isalreadythere = true
          break
        }
      }
      if (!isalreadythere) {
        alreadythere.push(word.slice(-2))
        outputlist.push([word, scores[orderresult[i]]])
        outlen += 1
      }
    }
  }
  else {//기본옵션
    for (let i = from; i < from + 200; i++) {
      let word = ('' + words[orderresult[i]])
      outputlist.push([word, scores[orderresult[i]]])
    }
  }

  return JSON.stringify(outputlist.slice(-200))
}


function korformatter(commonkor) {
  //가나다
  commonkor = commonkor.replace(/ ?/g, 'L').replace(/^\L+|\L+$/g, '').trim()
  //가L나L다
  let disassemed = betterDisassemble(commonkor).replace(/ ?/g, ' ').replace(/^\L+|\L+$/g, '').trim()
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
  for (let i = 0, len = disassemed.length; i < len; i++) {
    disassemed[i] = disassemed[i].replace(/^\L+|\L+$/g, '').trim()
    if (disassemed[i].length == 3) {
      disassemed[i] = disassemed[i] + ' E'
    }
  }
  disassemed = disassemed.join('L')
  return disassemed
}

function betterDisassemble(input) {
  let inlen = input.length
  let out = ''
  if (inlen <= 10) {
    return Hangul.disassemble(input).join('')
  }
  for (let i = 0; i < inlen - 10; i += 10) {
    let sub = Hangul.disassemble(input.substring(i, i + 10)).join('')
    out += sub
  }
  let fin = Hangul.disassemble(input.substring(Math.floor(inlen / 10) * 10, inlen)).join('')
  out += fin
  return out
}

function stdpron(a) {
  a = korformatter(a)
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


function search(keyword, minlen, maxlen) {
  let memoization = [] //한글자당 값 기억용 배열(짱큼)
  let wordslist
  let pronslist

  // const wordstojoin = [[0],[0,1],[0,1,2],[2]]
  // for (i=0;i<wordstojoin[sel].length;i++){
  //   wordslist = wordslist.concat(file[wordstojoin[sel][i]][0])
  // }
  // for (i=0;i<wordstojoin[sel].length;i++){
  //   pronslist = pronslist.concat(file[wordstojoin[sel][i]][1])
  // }

  
  switch(sel){
    case 0:
      wordslist = file[0][0]
      pronslist = file[0][1]
      break;
    case 1:
      wordslist = file[0][0].concat(file[1][0])
      pronslist = file[0][1].concat(file[1][1])
      break;
    case 2:
      wordslist = file[0][0].concat(file[1][0],file[2][0])
      pronslist = file[0][1].concat(file[1][1],file[2][1])
      break;
    case 3:
      wordslist = file[2][0]
      pronslist = file[2][1]
      break;
  }

  let ao = keyword.split('L')
  let aleno = ao.length;
  //for (let i = 0; i < len; i++) { //단어 vs 단어 비교
  //1000개씩묶고 setimmediate
  const batchSize = 10000;
  const len = wordslist.length;
  const scores = [];

  function processBatch(startIndex, resolve) {
    const endIndex = Math.min(startIndex + batchSize, len);
    for (let i = startIndex; i < endIndex; i++) {
      if (wordslist[i].length < minlen || wordslist[i].length > maxlen) {
        scores.push(0)
        continue
      }
      let a = ao //입력 단어 발음
      let alen = aleno //길이
      let b = pronslist[i] // 비교할 단어 발음
      let blen = b.length //길이

      if (alen < blen) {
        b = b.slice(-alen)
        blen = alen
      } else {
        a = a.slice(-blen)
        alen = blen
      }
      //마지막에 alen개 자름
      let score = 0
      let asplit
      let bsplit
      let chojongchain = 0
      for (let j = 0; j < alen; j++) { //글자 vs 글자 비교
        let befasplit = asplit
        let befbsplit = bsplit
        asplit = [a[j][0], a[j][2], a[j][4]] //초,중,종성
        bsplit = [b[j][0], b[j][2], b[j][4]]
        let force0 = 0 //무조건 같게
        let force2 = 0 //무조건 같게
        if (chojongchain) //입력단어에서 이번 종성이 다음 초성이랑 연결 ex) 안이이면 
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
        //b(데이터베이스)글자와 a(입력)의몇번째글자인지 포함된 메모리용 식별번호
        chartocode = ((force0 * 2) + force2) * 270000000 + (alen - j) * 27000000 + (bsplit[0] == undefined ? 299 : bsplit[0].charCodeAt(0) - 'ㄱ'.charCodeAt(0)) * 90000 + (bsplit[1] == undefined ? 299 : bsplit[1].charCodeAt(0) - 'ㅏ'.charCodeAt(0)) * 300 + (bsplit[2] == undefined ? 298 : bsplit[2] == 'E' ? 299 : bsplit[2].charCodeAt(0) - 'ㄱ'.charCodeAt(0))
        //console.log(`${bsplit[0]}, ${bsplit[1]}, ${bsplit[2]}, ${bsplit[0]==undefined ? 999 : bsplit[0].charCodeAt(0)-'ㄱ'.charCodeAt(0)} , ${bsplit[1]==undefined ? 999 : bsplit[1].charCodeAt(0)-'ㅏ'.charCodeAt(0)}, ${bsplit[2]==undefined ? 998 : bsplit[2]=='E' ? 999 : bsplit[2].charCodeAt(0)-'ㄱ'.charCodeAt(0)}, ${chartocode}`)
        let memnow = memoization[chartocode]
        if (memnow != undefined) //있으면 불러오기
        {
          score += memnow
        }
        else //아니니까 계산
        {
          let tempscore = 0
          tempscore += relevance0(asplit[0], bsplit[0], force0) * (j == (alen - 1) ? 1.5 : 1)
          tempscore += relevance1(asplit[1], bsplit[1]) * (j == (alen - 1) ? 1.5 : 1) //마지막글자면 1.5배
          let rel2 = relevance2(asplit[2], bsplit[2], force2)
          tempscore += rel2 * (j == (alen - 1) ? rel2 >= 2 ? 10 : 1.5 : 1) // 마지막글잔데 받침 똑같으면 10배나?? 해놨네
          score += tempscore
          memoization[chartocode] = tempscore
        }
      }
      score = Math.round(Math.max(score, 0) / aleno * 4)
      scores.push(score)
    }

    if (endIndex < len) {
      setImmediate(() => processBatch(endIndex, resolve));
    } else {
      resolve(scores);
    }
  }
  return new Promise((resolve, reject) => {
    processBatch(0, resolve)
  })
}
function relevance0(a, b, force) {
  if (force == 1 && a != b) return -10000; //이러면 아예 제외해버린다..?
  if (a == b) return 5;
  let similar = ['ㄱㄲㅋ', 'ㄷㄸㅌ', 'ㅂㅃㅍ', 'ㅈㅉㅊ', 'ㅅㅆ', 'ㅇㅎ']
  let ssimilar = ['ㄱㄲㅋㄷㄸㅌㅂㅃㅍ', 'ㅈㅉㅊㅅㅆ', 'ㄴㄹㅁ']
  if (arebothin(a, b, similar)) return 3;
  if (arebothin(a, b, ssimilar)) return 1;
  else return 0;
}

function relevance1(a, b) {
  if (a == b) return 40;
  let same = ['ㅙㅚㅞ', 'ㅔㅐ']
  let similar = ['ㅏㅘ', 'ㅓㅝㅗ', 'ㅕㅛ', 'ㅜㅡ', 'ㅣㅟㅢ', 'ㅐㅔㅙㅞㅚ', 'ㅒㅖ']
  if (arebothin(a, b, same)) return 40;
  else if (arebothin(a, b, similar)) return 39;
  else return 0;
}

function relevance2(a, b, force) {
  if (force == 1 && a != b) return -10000;
  if (a == 'E' && b == 'E') return 3;
  if (a == b) return 2;
  let same = ['ㄲㅋㄳㄺㄱ', 'ㄵㄴㄶ', 'ㅅㅆㅈㅌㅍㄷ', 'ㄼㄽㄾㄹㅀ', 'ㄻㅁ', 'ㅍㅄㄿㅂ', 'ㅇ']
  let similar = ['ㄲㅋㄳㄺㄱㅅㅆㅈㅌㅍㄷㅍㅄㄿㅂ', 'ㄵㄴㄶㄻㅁㅇ']
  if (arebothin(a, b, same)) return 2;
  else if (arebothin(a, b, similar)) return 1;
  else return 0;
}

function arebothin(a, b, arr) {
  for (let i = 0, bothinlen = arr.length; i < bothinlen; i++) {
    let element = arr[i]
    if (element.includes(a) && element.includes(b))
      return 1;
  }
  return 0;
}

async function getfile(num) {
  let numtopath = [__dirname + '/data/lyrics.txt', __dirname + '/data/news.txt', __dirname + '/data/dict.txt']
  let a = [],
    b = []
  return new Promise(resolve => {
    fs.readFile(numtopath[num], 'utf8', (err, result) => {
      if (err) {
        console.error(err)
        return
      }
      while (result.indexOf("\r") >= 0)
        result = result.replace(/\r/g, "");
      let arrLines = result.split("\n");
      for (let j of arrLines) {
        let splitted = j.split('\t')
        a.push(splitted[0])
        b.push(splitted[1])
      }
      resolve([a, b])
    })
  })
}

module.exports = app;
