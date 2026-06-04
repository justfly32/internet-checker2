# 초보자용 Node.js 프로젝트 — GitHub / Vercel / Railway / Supabase 배포 가이드

> 이 매뉴얼은 **방문자 메모장(Guestbook)** 예제를 기준으로 작성되었습니다.
> Express + Supabase만 사용하는 가장 단순한 구조로, 따라 하기만 하면 됩니다.

---

## 목차

1. [시작하기 전 준비물](#1-시작하기-전-준비물)
2. [프로젝트 만들기](#2-프로젝트-만들기)
3. [로컬에서 실행해보기](#3-로컬에서-실행해보기)
4. [GitHub에 올리기](#4-github에-올리기)
5. [Vercel / Railway 배포하기](#5-vercel--railway-배포하기)
6. [Supabase DB 연결하기](#6-supabase-db-연결하기)
7. [오류 대처법](#7-오류-대처법)

---

## 1. 시작하기 전 준비물

### 가입해야 할 사이트 (모두 무료)

| 사이트 | 용도 | 가입 링크 |
|--------|------|-----------|
| **GitHub** | 소스 코드 저장 | https://github.com |
| **Vercel** | 웹 배포 (간단) | https://vercel.com |
| **Railway** | 웹 배포 (고급) | https://railway.app |
| **Supabase** | 데이터베이스 | https://supabase.com |

가입 방법은 모두 동일합니다.
1. 사이트 접속
2. 오른쪽 위 **Sign Up** 또는 **Start Free** 클릭
3. GitHub 계정으로 가입 (권장) 또는 이메일로 가입
4. 이메일 인증 (필요한 경우)

> **GitHub 계정**이 하나 있으면 Vercel, Railway, Supabase 모두 GitHub 계정으로 로그인할 수 있어 편리합니다.

### 설치해야 할 프로그램

#### 1) Node.js (LTS 버전)
- Node.js는 JavaScript를 PC에서 실행할 수 있게 해주는 프로그램입니다.
- 다운로드: https://nodejs.org
- **LTS**라고 적힌 버전을 다운로드하세요 (왼쪽 큰 버튼).
- 설치 프로그램을 실행하고 **계속 Next**만 누르면 됩니다.
- 설치가 끝나면 **터미널(명령 프롬프트)**을 열고 아래 명령어를 쳐서 정상 설치를 확인합니다.

```
node --version
```

`v20.xx.x` 같은 숫자가 나오면 성공입니다.

#### 2) Git
- Git은 소스 코드의 버전을 관리하고 GitHub에 업로드할 때 사용합니다.
- 다운로드: https://git-scm.com
- 설치 프로그램을 실행합니다. 중간에 **"Choosing the default editor"** 화면이 나오면 **Notepad++** 또는 **VS Code**를 선택하세요 (기본값 그대로 Next도 무방).
- 설치 후 터미널에서 확인:

```
git --version
```

`git version 2.xx.x`가 나오면 성공입니다.

#### 3) VS Code (권장, 메모장으로도 가능)
- 코드를 작성할 때 사용하는 에디터입니다. 메모장으로도 할 수 있지만 VS Code가 훨씬 편리합니다.
- 다운로드: https://code.visualstudio.com
- 설치 후 실행하면 자동으로 한국어를 추천합니다. (안 나오면 Extensions에서 `Korean` 검색 후 설치)

---

### 터미널(명령 프롬프트) 여는 방법

- **Windows**: 키보드에서 `Win` 키를 누르고 `cmd` 입력 → Enter
- **VS Code 사용 시**: VS Code를 실행한 후 상단 메뉴 **Terminal → New Terminal** (더 편리합니다)

> 이 매뉴얼에서는 모든 명령어를 **터미널**에 입력합니다.
> `$` 기호는 "여기에 명령어를 입력하세요"라는 표시입니다. 실제로 `$`까지 입력하지는 마세요.

---

## 2. 프로젝트 만들기

### 2-1. 폴더 만들기

내 컴퓨터에 프로젝트를 저장할 폴더를 만듭니다.

**방법 1 — 터미널에서 만들기:**
```
$ mkdir guestbook
$ cd guestbook
```

- `mkdir` = "make directory" = 폴더 만들기
- `cd` = "change directory" = 폴더로 이동하기
- 위 명령어를 입력하면 `guestbook` 폴더가 만들어지고 그 안으로 이동합니다.

**방법 2 — 탐색기(마우스)로 만들기:**
1. 바탕화면이나 원하는 위치에서 마우스 오른쪽 클릭 → **새 폴더**
2. 이름을 `guestbook`으로 변경
3. VS Code를 열고 **File → Open Folder** → `guestbook` 폴더 선택
4. VS Code 안에서 터미널 열기: **Terminal → New Terminal**
5. 터미널에 이미 `guestbook` 폴더로 들어와 있습니다.

### 2-2. package.json 만들기

터미널에 아래 명령어를 입력합니다:

```
$ npm init -y
```

- `npm` = Node Package Manager = Node.js 패키지 관리 도구
- `init` = 초기화
- `-y` = "yes" = 모든 질문에 예라고 대답 (기본값 사용)

실행하면 `guestbook` 폴더 안에 `package.json` 파일이 생깁니다.
이 파일은 **"이 프로젝트가 어떤 패키지를 사용하는지 기록하는 명세서"**입니다.

### 2-3. 필요한 패키지 설치

터미널에 아래 명령어를 입력합니다:

```
$ npm install express @supabase/supabase-js
```

- `express` = 웹 서버를 만드는 패키지 (Node.js에서 가장 유명함)
- `@supabase/supabase-js` = Supabase 데이터베이스를 JavaScript에서 사용하는 패키지
- `npm install` = 패키지를 다운로드해서 설치

실행하면 `node_modules` 폴더와 `package-lock.json` 파일이 생깁니다.
- `node_modules`: 실제 패키지 파일들이 저장되는 폴더 (용량이 크지만 신경 쓸 필요 없음)
- `package-lock.json`: 패키지 버전이 정확히 기록된 파일

> **에러가 나면?** 가끔 네트워크 문제로 설치가 실패할 수 있습니다.
> ```
> $ rm -rf node_modules package-lock.json
> $ npm install
> ```
> 위 명령어로 `node_modules`와 `package-lock.json`을 지우고 다시 설치하세요.

### 2-4. .gitignore 파일 만들기

`.gitignore`는 **"Git에 올리지 않을 파일 목록"**을 적는 파일입니다.
- `node_modules`는 용량이 너무 커서 GitHub에 올리면 안 됩니다.
- `.env`는 비밀번호 같은 민감한 정보가 들어있어 GitHub에 올리면 안 됩니다.

VS Code에서 새 파일을 만들고 (`File → New File`) 아래 내용을 복사해서 붙여넣고 `.gitignore`라는 이름으로 저장하세요.

```
node_modules
.env
```

> **메모장으로 만들 때 주의:** `.gitignore`라고 이름을 지으면 메모장이 `.gitignore.txt`로 저장할 수 있습니다.
> 파일 저장 창에서 **파일 형식**을 "모든 파일"로 바꾸고 이름을 `.gitignore`로 저장하세요.

### 2-5. 서버 코드 작성 (server.js)

VS Code에서 새 파일 → `server.js`로 저장 → 아래 내용을 **전체 복사**해서 붙여넣으세요.

```javascript
// 1. 패키지 불러오기
const express = require('express');
const { createClient } = require('@supabase/supabase-js');

// 2. Express 앱 생성
const app = express();

// 3. JSON 데이터를 받을 수 있게 설정
app.use(express.json());

// 4. public 폴더를 정적 파일 제공 폴더로 지정
//    (index.html 등 일반 파일을 자동으로 서빙)
app.use(express.static('public'));

// 5. Supabase 클라이언트 생성
//    .env 파일이나 환경변수에서 URL과 Key를 읽어옴
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// 6. 메모 목록 조회 API (GET)
//    브라우저에서 /api/memos로 접속하면 실행됨
app.get('/api/memos', async (req, res) => {
  const { data, error } = await supabase
    .from('memos')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// 7. 메모 저장 API (POST)
//    브라우저에서 { "content": "..." }를 보내면 실행됨
app.post('/api/memos', async (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: '내용을 입력하세요.' });

  const { data, error } = await supabase
    .from('memos')
    .insert({ content })
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

// 8. 서버 실행
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
```

> **코드 설명 (초보자용):**
> - `require()`: 다른 패키지를 불러오는 명령어
> - `express()`: Express 서버 객체 생성
> - `app.get()`: 사용자가 GET 요청(주소창에 입력)을 하면 실행할 함수
> - `app.post()`: 사용자가 POST 요청(데이터를 보냄)을 하면 실행할 함수
> - `res.json()`: 결과를 JSON 형식으로 응답
> - `process.env`: 환경변수를 읽어오는 객체 (Railway/Vercel에서 설정한 값)
> - `app.listen()`: 서버를 특정 포트에서 실행

### 2-6. HTML 화면 만들기

`guestbook` 폴더 안에 `public` 폴더를 만듭니다.

터미널에서:
```
$ mkdir public
```

VS Code에서 새 파일 → `index.html`로 저장 → `public` 폴더에 저장 → 아래 내용 복사 붙여넣기.

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>방문자 메모장</title>
  <style>
    body { font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
    textarea { width: 100%; height: 80px; margin-bottom: 10px; padding: 8px; }
    button { padding: 8px 16px; cursor: pointer; }
    .memo { border: 1px solid #ddd; padding: 10px; margin: 8px 0; border-radius: 4px; }
    .memo small { color: #888; }
    .error { color: red; }
  </style>
</head>
<body>
  <h1>방문자 메모장</h1>

  <textarea id="content" placeholder="메모를 입력하세요..."></textarea>
  <button onclick="saveMemo()">저장</button>
  <p id="error" class="error"></p>

  <h2>메모 목록</h2>
  <div id="memos"></div>

  <script>
    // 페이지 로딩 시 메모 목록 불러오기
    window.onload = loadMemos;

    async function loadMemos() {
      const res = await fetch('/api/memos');
      const memos = await res.json();
      const container = document.getElementById('memos');
      container.innerHTML = memos.map(m => `
        <div class="memo">
          <div>${m.content}</div>
          <small>${new Date(m.created_at).toLocaleString()}</small>
        </div>
      `).join('');
    }

    async function saveMemo() {
      const content = document.getElementById('content').value;
      if (!content) return;

      const res = await fetch('/api/memos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });

      if (!res.ok) {
        const err = await res.json();
        document.getElementById('error').textContent = '에러: ' + err.error;
        return;
      }

      document.getElementById('content').value = '';
      document.getElementById('error').textContent = '';
      loadMemos();  // 목록 새로고침
    }
  </script>
</body>
</html>
```

### 2-7. 현재 폴더 구조 확인

지금까지 만들어진 폴더와 파일을 확인합니다.

터미널에서:
```
$ dir
```

또는 VS Code 좌측 EXPLORER 창을 보면 아래처럼 보여야 합니다:

```
guestbook/
├── node_modules/       (폴더 — 패키지들)
├── public/
│   └── index.html      (HTML 화면)
├── .gitignore          (Git 제외 목록)
├── package.json        (패키지 명세서)
├── package-lock.json   (패키지 버전 잠금)
└── server.js           (서버 코드)
```

---

## 3. 로컬에서 실행해보기

### 3-1. .env 파일 만들기

`.env` 파일은 **"환경변수를 저장하는 파일"**입니다.
비밀번호 같은 민감한 정보를 코드에 직접 적지 않고 `.env`에 따로 보관합니다.

> **중요:** `.env`는 절대 GitHub에 올리면 안 됩니다. 앞서 만든 `.gitignore`에 `.env`가 포함되어 있어 Git이 자동으로 무시합니다.

VS Code에서 새 파일 → `.env`로 저장 → 아래 내용을 적습니다.
(아직 Supabase를 안 만들었다면 나중에 채워넣습니다. 지금은 실행만 확인할 거라면 빈칸이어도 일단 서버는 켜집니다.)

```
SUPABASE_URL=여기에_수파베이스_URL_넣기
SUPABASE_KEY=여기에_수파베이스_KEY_넣기
```

> `.env` 파일은 따옴표 없이 `변수명=값` 형식입니다.
> 예: `SUPABASE_URL=https://abcdefg.supabase.co`

### 3-2. 서버 실행

터미널에서:
```
$ node server.js
```

성공하면 아래 메시지가 출력됩니다:
```
서버 실행 중: http://localhost:3000
```

> **에러가 난다면?**
> - `Cannot find module 'express'` → `npm install express`를 다시 실행하세요.
> - `Cannot find module '@supabase/supabase-js'` → `npm install @supabase/supabase-js`를 다시 실행하세요.

### 3-3. 브라우저에서 확인

1. 웹 브라우저(Chrome, Edge)를 엽니다.
2. 주소창에 `http://localhost:3000`을 입력하고 Enter.
3. **"방문자 메모장"** 화면이 보여야 합니다.
4. 메모를 입력하고 **저장** 버튼을 클릭합니다.
   - Supabase가 아직 연결되지 않았으므로 저장은 실패합니다 (`Supabase URL이 필요합니다` 에러 발생).
   - 6장에서 Supabase를 연결한 후 정상 동작합니다.

### 3-4. 서버 종료

터미널에서 `Ctrl + C`를 누르면 서버가 종료됩니다.

---

## 4. GitHub에 올리기

### 4-1. GitHub에서 새 리포지토리 만들기

1. https://github.com 에 로그인
2. 오른쪽 위 **+** 버튼 → **New repository**
3. **Repository name**에 `guestbook` 입력
4. **Public** 선택 (무료는 Public만 가능)
5. **"Add a README file"** 체크 해제 (직접 만들었으므로)
6. **".gitignore"**도 **None** 유지 (직접 만들었으므로)
7. **Create repository** 버튼 클릭

생성된 페이지에 아래와 같은 안내문이 나타납니다:
```
…or push an existing repository from the command line
git remote add origin https://github.com/사용자이름/guestbook.git
git branch -M main
git push -u origin main
```

이 안에 있는 명령어들을 아래에서 사용합니다.

### 4-2. 터미널에서 Git 명령어 입력

터미널에 아래 명령어를 **한 줄씩** 입력합니다. 각 명령어가 무엇을 하는지 설명을 읽으면서 천천히 따라 하세요.

#### 1) Git 저장소 초기화
```
$ git init
```
- `git init`: 현재 폴더를 Git으로 관리하겠다고 선언
- `.git`이라는 숨김 폴더가 생깁니다 (평소에는 안 보임)

#### 2) 모든 파일을 Git에 등록
```
$ git add .
```
- `git add`: 파일을 "이번에 올릴 파일 목록"에 추가
- `.`(점): 현재 폴더의 모든 파일
- 즉, 모든 파일을 업로드 대상에 포함

#### 3) 등록한 파일들을 하나로 묶기 (커밋)
```
$ git commit -m "first commit"
```
- `git commit`: 추가한 파일들을 하나의 버전으로 묶음
- `-m "first commit"`: 이 버전의 설명 (메시지)을 "first commit"으로 지정
- **에러:** `please tell me who you are` → Git에 사용자 정보가 없어서 발생
  ```
  $ git config --global user.email "your@email.com"
  $ git config --global user.name "Your Name"
  ```
  위 명령어로 이름과 이메일을 설정한 후 다시 `git commit` 실행

#### 4) 기본 브랜치 이름을 main으로 변경
```
$ git branch -M main
```
- `git branch`: 가지(브랜치)를 관리하는 명령어
- `-M main`: 기본 브랜치 이름을 `master` 대신 `main`으로 변경
- GitHub의 기본 브랜치 이름이 `main`이므로 맞춰주는 것입니다.

#### 5) GitHub 리포지토리와 내 컴퓨터 연결
```
$ git remote add origin https://github.com/사용자이름/guestbook.git
```
- `git remote add`: 원격 저장소 주소를 등록
- `origin`: 원격 저장소의 별명 (관례적으로 `origin` 사용)
- `https://github.com/사용자이름/guestbook.git`: 앞에서 만든 GitHub 리포지토리 주소
- **주의:** `사용자이름` 부분을 여러분의 GitHub 아이디로 바꾸세요.
- 맨 앞에서 GitHub 페이지에 나온 명령어를 그대로 복사해도 됩니다.

#### 6) GitHub에 업로드
```
$ git push -u origin main
```
- `git push`: 로컬 파일을 원격(GitHub)에 업로드
- `-u origin main`: 앞으로 `origin`의 `main` 브랜치로 업로드하겠다고 기억
- **에러:** 로그인 창이 뜨면 GitHub 아이디/비밀번호 입력
  - 2021년부터 비밀번호 대신 **토큰**을 사용합니다.
  - https://github.com/settings/tokens 에서 토큰 생성 → 비밀번호 대신 사용

### 4-3. GitHub에 올라갔는지 확인

1. 브라우저에서 GitHub 리포지토리 페이지 열기
2. `server.js`, `public/index.html`, `.gitignore`, `package.json` 등이 보이면 성공
3. `node_modules` 폴더는 보이지 않아야 정상 (.gitignore가 제 역할을 한 것)

> **`node_modules`가 올라갔다면?**
> `.gitignore` 파일에 `node_modules`가 제대로 적혀있는지 확인하세요.
> 잘못 올라간 경우:
> ```
> $ git rm -r --cached node_modules
> $ git commit -m "remove node_modules"
> $ git push
> ```

---

## 5. Vercel / Railway 배포하기

> **Vercel vs Railway — 무엇을 선택할까?**
>
> | 항목 | Vercel (Hobby) | Railway (Free) |
> |------|---------------|----------------|
> | 실행 환경 | 서버리스 함수 | 가상 서버 (Docker) |
> | 요청 타임아웃 | **10초** | 제한 없음 |
> | Puppeteer 사용 | 불가능 | 가능 (Browserless.io 연동) |
> | 설정 난이도 | ★☆☆ 쉬움 | ★★☆ 중간 |
> | 한글/UTF-8 | 완벽 | 완벽 |
>
> **추천:**
> - 단순한 CRUD, 10초 안에 끝나는 API → **Vercel**
> - Puppeteer로 웹 스크래핑, 긴 작업 시간 필요 → **Railway**
> - 설정을 최대한 간단하게 → **Vercel**
> - 자유로운 커스터마이징 필요 → **Railway**

---

### 5-A. Vercel 배포 (간단한 CRUD에 추천)

#### 1) Vercel 가입 및 로그인
1. https://vercel.com 접속
2. **Sign Up** 또는 **Continue with GitHub** 클릭
3. GitHub 계정으로 로그인 (권장)

#### 2) 프로젝트 가져오기
1. Vercel 대시보드에서 **Add New... → Project**
2. GitHub 리포지토리 목록에서 `guestbook` 찾기 → **Import**
3. **Configure Project** 화면이 나타납니다.

#### 3) Vercel 설정
- **Framework Preset**: **Other** 선택
- **Build Command**: 비워둠 (빈 칸)
- **Output Directory**: `public` 입력
  - 이유: Express가 `public` 폴더를 정적 파일로 제공하도록 설정했기 때문
  - Vercel이 `public` 폴더를 자동으로 서빙합니다.
- **Install Command**: 비워둠 (기본 `npm install`)

#### 4) 환경변수 등록
**Environment Variables** 섹션에서 아래 두 개를 추가합니다:
- `SUPABASE_URL` = (Supabase URL, 아직 없으면 나중에 추가)
- `SUPABASE_KEY` = (Supabase Key, 아직 없으면 나중에 추가)

**주의:** Vercel 환경변수 등록 시 **"Add"** 버튼 꼭 누르세요. 입력만 하고 넘어가면 저장되지 않습니다.

#### 5) 배포
**Deploy** 버튼 클릭 → 약 1분 후 배포 완료

#### 6) 완료 확인
- 배포 완료와 함께 자동으로 생성된 URL(예: `guestbook.vercel.app`)이 표시됩니다.
- **Visit** 버튼을 클릭해서 브라우저에서 확인합니다.
- "방문자 메모장" 화면이 뜨면 성공!
- Supabase가 연결되지 않아 저장은 실패하지만 화면은 정상적으로 보여야 합니다.

#### 7) Vercel 전용 설정 추가 (선택)

Express 서버를 Vercel에서 올바르게 실행하려면 `vercel.json` 파일을 추가해야 할 수도 있습니다.

`guestbook` 폴더에 `vercel.json` 파일을 만들고 아래 내용을 저장하세요:

```json
{
  "builds": [
    { "src": "server.js", "use": "@vercel/node" },
    { "src": "public/**", "use": "@vercel/static" }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "server.js" },
    { "src": "/(.*)", "dest": "public/$1" }
  ]
}
```

- `builds`: 어떤 파일을 어떻게 빌드할지 정의
- `routes`: URL 경로가 들어왔을 때 어디로 보낼지 정의
  - `/api/...` 요청은 `server.js`로 전달
  - 그 외 요청은 `public` 폴더의 파일로 전달

이 파일을 추가한 후 GitHub에 push하면 Vercel이 자동으로 재배포합니다.

---

### 5-B. Railway 배포 (스크래핑/긴 작업에 추천)

#### 1) Railway 가입 및 로그인
1. https://railway.app 접속
2. **Start a New Project** 또는 **Login with GitHub** 클릭
3. GitHub 계정으로 로그인

#### 2) 프로젝트 생성
1. 대시보드에서 **New Project** 버튼 클릭
2. **Deploy from GitHub repo** 선택
3. GitHub 리포지토리 목록에서 `guestbook` 선택
4. **Deploy Now** 버튼 클릭 (Add Variables 화면은 일단 Skip)

#### 3) 배포 진행 확인
- 자동으로 배포가 시작됩니다.
- 대시보드에서 **Deployments** 탭을 클릭하면 로그를 볼 수 있습니다.
- **"Build complete"** 또는 **"Deploy complete"** 메시지가 나오면 완료.

#### 4) 포트 설정
Railway는 자동으로 포트를 감지하지만, 명시적으로 설정하는 것이 안전합니다.

1. 대시보드 → **Variables** 탭
2. **New Variable** 클릭
3. Key: `PORT`, Value: `3000`
4. **Add** 버튼 클릭

#### 5) 환경변수 등록
Variables에 추가할 항목:
- `SUPABASE_URL` = (Supabase URL, 아직 없으면 나중에 추가)
- `SUPABASE_KEY` = (Supabase Key, 아직 없으면 나중에 추가)

**추가 방법:**
1. **New Variable** 버튼 클릭
2. Key 입력, Value 입력
3. **Add Variable** 버튼 클릭
4. 위 과정을 두 번 반복

환경변수를 추가하면 **자동으로 재배포**됩니다.

#### 6) 도메인 확인
1. 대시보드 → **Settings** 탭
2. **Public Networking** 섹션
3. 생성된 도메인(예: `guestbook.up.railway.app`) 확인
4. 브라우저에서 해당 주소로 접속 → "방문자 메모장" 화면이 뜨면 성공!

#### 7) 재배포 방법
코드를 수정하고 GitHub에 push하면 Railway가 **자동으로 다시 배포**합니다.
수동으로 재배포하려면 **Deployments** 탭 → **Redeploy** 버튼 클릭.

---

## 6. Supabase DB 연결하기

### 6-1. Supabase 프로젝트 만들기

1. https://supabase.com 접속
2. **Start your project** 또는 **New project** 버튼 클릭
3. **Organization**: 기본값 (본인 이름) 그대로
4. **Name**: `guestbook` 입력
5. **Database Password**: 강력한 비밀번호 입력 (꼭 메모해두세요!)
6. **Region**: `Singapore` (한국에서 가장 가까운 리전) 또는 `Seoul`(있으면)
7. **Pricing Plan**: **Free** 선택
8. **Create new project** 버튼 클릭

프로젝트 생성에 약 1~2분 정도 걸립니다.
기다리는 동안 다음 단계를 준비하세요.

### 6-2. 테이블 만들기 (SQL Editor)

1. 좌측 메뉴에서 **SQL Editor** 클릭
2. **New Query** 버튼 클릭
3. 아래 SQL 코드를 **전체 복사**해서 붙여넣기:

```sql
-- 방문자 메모장의 메모를 저장하는 테이블
CREATE TABLE memos (
  -- id: 자동 증가하는 고유 번호 (1, 2, 3...)
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  -- content: 메모 내용 (빈 칸 불가)
  content TEXT NOT NULL,
  -- created_at: 자동 기록되는 생성 시간
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 생성 확인 (memos 테이블 목록이 나오면 성공)
SELECT * FROM memos;
```

4. **Run** 또는 **Ctrl+Enter**를 눌러 실행
5. 결과창에 `memos` 테이블이 표시되면 성공!

> **SQL 설명 (초보자용):**
> - `CREATE TABLE`: 테이블(표)을 만듦
> - `BIGINT`: 큰 정수 숫자 타입
> - `GENERATED BY DEFAULT AS IDENTITY`: 자동으로 1씩 증가
> - `PRIMARY KEY`: 각 행을 고유하게 식별하는 키
> - `TEXT NOT NULL`: 빈 값이 허용되지 않는 텍스트
> - `TIMESTAMPTZ`: 시간대 정보를 포함하는 날짜/시간 타입
> - `DEFAULT NOW()`: 값을 안 넣으면 자동으로 현재 시간 입력

### 6-3. URL과 Key 복사하기

1. 좌측 메뉴에서 **Project Settings** (톱니바퀴 아이콘) 클릭
2. **Configuration → API** 클릭
3. 아래 두 값을 복사합니다:

#### Project URL
- **"Project URL"** 항목의 값 (예: `https://abcdefghijklm.supabase.co`)
- **Copy** 버튼 클릭해서 복사

#### API Key (service_role)
- **"service_role key"** 항목의 값 (길고 복잡한 문자열)
- `anon public`이 아니라 **`service_role`** 키를 복사하세요!
- **Copy** 버튼 클릭해서 복사

> **⚠️ service_role vs anon key**
> - `anon public key`: 로그인한 사용자용 (권한이 제한됨)
> - `service_role key`: **관리자용** (모든 권한 있음, 절대 외부에 노출 금지)
> - 지금은 서버에서만 사용하므로 service_role key가 편리합니다.

### 6-4. 배포 환경에 환경변수 등록

복사한 두 값을 배포한 플랫폼(Vercel 또는 Railway)에 등록합니다.

#### Vercel에 등록하기:
1. Vercel 대시보드 → `guestbook` 프로젝트
2. **Settings** → **Environment Variables**
3. `SUPABASE_URL` = 복사한 URL
4. `SUPABASE_KEY` = 복사한 service_role key
5. **Save** 버튼
6. **Deployments** 탭 → 마지막 배포의 **...** → **Redeploy**

#### Railway에 등록하기:
1. Railway 대시보드 → `guestbook` 프로젝트
2. **Variables** 탭
3. **New Variable** → Key: `SUPABASE_URL`, Value: 복사한 URL
4. **New Variable** → Key: `SUPABASE_KEY`, Value: 복사한 service_role key
5. 자동으로 재배포됩니다.

### 6-5. 데이터 저장 확인

#### 방법 1 — 웹 브라우저로 확인
1. 배포된 사이트(Vercel 또는 Railway URL)에 접속
2. 메모 입력 후 **저장** 버튼 클릭
3. 입력한 메모가 목록에 나타나면 성공!

#### 방법 2 — Supabase Table Editor로 확인
1. Supabase 대시보드 → 좌측 **Table Editor** 클릭
2. `memos` 테이블 선택
3. 방금 입력한 메모가 보이면 완벽!

### 6-6. 로컬 PC에서도 Supabase 연결하기

앞서 만든 `.env` 파일을 수정합니다.

`guestbook/.env` 파일을 열고 아래처럼 수정:
```
SUPABASE_URL=https://abcdefghijklm.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

실제 값은 위에서 복사한 값으로 바꾸세요.

저장 후 로컬 서버 실행:
```
$ node server.js
```

`http://localhost:3000` 접속 → 이제 메모가 정상 저장됩니다.
로컬과 배포 환경이 **같은 Supabase DB**를 공유합니다.

---

## 7. 오류 대처법

### 오류: `npm install` 실패

**증상:**
```
npm ERR! code ECONNRESET
npm ERR! network request to https://registry.npmjs.org/... failed
```

**원인:** 네트워크 연결 불안정 또는 npm 서버 문제

**해결:**
```
$ rm -rf node_modules package-lock.json
$ npm cache clean --force
$ npm install
```

1. `node_modules` 폴더와 `package-lock.json` 파일을 삭제
2. npm 캐시를 강제로 비움
3. 다시 설치

여전히 실패하면 잠시 후 다시 시도하거나, 휴대폰 와이파이 등 다른 네트워크로 시도.

---

### 오류: `git commit` 할 때 `please tell me who you are`

**증상:**
```
Author identity unknown
*** Please tell me who you are.
```

**원인:** Git에 사용자 정보가 등록되지 않음

**해결:**
```
$ git config --global user.email "your@email.com"
$ git config --global user.name "Your Name"
```

- `--global`: 앞으로 모든 Git 프로젝트에 적용
- 이메일은 GitHub에 가입한 이메일과 같을 필요는 없지만, 같으면 편리함
- 설정 후 다시 `git commit -m "first commit"` 실행

---

### 오류: `git push` 할 때 로그인 실패

**증상:**
```
remote: Support for password authentication was removed on August 13, 2021.
```

**원인:** GitHub이 비밀번호 인증을 중단함. 대신 **토큰** 또는 **GitHub CLI**를 사용해야 함

**해결 방법 1 — 토큰 사용:**
1. https://github.com/settings/tokens 접속
2. **Generate new token (classic)** 클릭
3. Note: `guestbook` 입력
4. **repo** 항목 체크
5. 하단 **Generate token** 클릭
6. 생성된 토큰 복사 (`ghp_...`로 시작)
7. 터미널에서 `git push` 실행 시 ID에 GitHub 아이디, PW에 복사한 토큰 입력

**해결 방법 2 — GitHub CLI 사용 (권장):**
1. https://cli.github.com 에서 GitHub CLI 다운로드 및 설치
2. 터미널에서 `gh auth login` 실행
3. 브라우저에서 로그인 후 완료
4. 이후 `git push`가 정상 동작

---

### 오류: Vercel 배포 후 접속 시 504 Error

**증상:**
```
Error: 504 Gateway Timeout
```

**원인:** Vercel Hobby 요금제는 서버리스 함수 **10초 타임아웃**이 있음
요청이 10초 이상 걸리면 시간 초과 오류 발생

**해결:**
- 작업 시간을 10초 이내로 줄이기
- 또는 **Railway**로 배포 전환 (Railway는 타임아웃 제한이 없음)

---

### 오류: Vercel 배포 후 404 Error

**증상:**
```
Error: 404 Not Found
```
페이지가 보이지 않고 404 오류

**원인:** `vercel.json` 설정이 없어서 Express 라우팅이 동작하지 않음

**해결:**
`vercel.json` 파일을 만들고 아래 내용 저장:

```json
{
  "builds": [
    { "src": "server.js", "use": "@vercel/node" },
    { "src": "public/**", "use": "@vercel/static" }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "server.js" },
    { "src": "/(.*)", "dest": "public/$1" }
  ]
}
```

파일 추가 후 GitHub에 push → Vercel 자동 재배포

---

### 오류: Railway 배포 후 502 Bad Gateway

**증상:**
```
502 Bad Gateway
```

**원인:** 서버가 실행 중인 포트와 Railway가 예상하는 포트가 다름

**해결:**
1. Railway 대시보드 → **Variables** 탭
2. `PORT = 3000` 추가
3. 자동 재배포 후 정상 동작

---

### 오류: Supabase 401 Unauthorized

**증상:**
```
error: "401 Unauthorized"
```

**원인:** 잘못된 API 키 사용 (anon key를 썼는데 RLS 정책에 막히거나, 키가 틀림)

**해결:**
1. Supabase → Project Settings → API
2. **service_role key**를 복사 (anon key 아님)
3. Vercel/Railway 환경변수 `SUPABASE_KEY`에 업데이트
4. 재배포

---

### 오류: Supabase 404 — relation "memos" does not exist

**증상:**
```
error: "relation "memos" does not exist"
```

**원인:** Supabase에 `memos` 테이블을 아직 만들지 않음

**해결:**
1. Supabase 대시보드 → **SQL Editor**
2. 아래 SQL 실행:

```sql
CREATE TABLE memos (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

3. 다시 요청 시 정상 동작

---

### 오류: Railway 로그 확인하는 법

**증상:** Railway에서 앱이 실행은 되는데 무언가 이상함

**해결:**
1. Railway 대시보드 → 해당 프로젝트
2. **Deployments** 탭
3. 최신 배포 클릭
4. **View Logs** 버튼 클릭
5. 서버 출력 메시지(Console.log 등)가 실시간으로 표시됨
6. 여기서 에러 메시지를 확인할 수 있음

---

### 오류: Vercel 로그 확인하는 법

1. Vercel 대시보드 → 해당 프로젝트
2. **Functions** 탭
3. 최근 요청 목록에서 에러가 난 요청 클릭
4. **Logs** 탭에서 상세 에러 메시지 확인

---

### 오류: `better-sqlite3` 네이티브 모듈 에서 (Railway)

**증상:**
```
npm ERR! better-sqlite3@... install: `node-gyp rebuild`
npm ERR! Exit status 3221225786 (SIGTERM)
npm ERR! Failed at the better-sqlite3@... install script.
```

**원인:** `better-sqlite3`는 C++ 코드를 컴파일해야 하는데, Railway 빌드 환경에서 실패

**해결:**
`package.json` 파일을 열어서 `better-sqlite3`를 `dependencies`에서 `optionalDependencies`로 이동:

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "@supabase/supabase-js": "^2.0.0"
  },
  "optionalDependencies": {
    "better-sqlite3": "^11.0.0"
  }
}
```

- `dependencies`: 필수 패키지. 설치 실패 시 npm install 자체가 실패
- `optionalDependencies`: 선택 패키지. 설치 실패해도 npm install은 성공

Supabase만 사용한다면 `better-sqlite3`가 필요 없으므로 이렇게 설정해도 무방합니다.

---

### 오류: 한글이 깨져서 저장됨

**증상:** 메모에 한글을 입력했는데 `???` 또는 깨진 글자로 저장됨

**원인:** HTML에 `<meta charset="UTF-8">` 누락 또는 서버에 인코딩 설정 누락

**해결:**
1. HTML 파일 `<head>`에 반드시 아래 태그가 있는지 확인:
   ```html
   <meta charset="UTF-8">
   ```
2. 서버 코드에 아래 설정 추가:
   ```javascript
   app.use(express.json());  // JSON 요청을 받을 때 UTF-8 유지
   ```
3. Supabase는 기본적으로 UTF-8을 지원하므로 위 설정만으로 해결됨

---

### 마지막 팁: 순서 요약

초보자가 헷갈리지 않도록 전체 진행 순서를 요약합니다.

```
1. Node.js + Git 설치
2. guestbook 폴더 생성
3. npm init -y
4. npm install express @supabase/supabase-js
5. .gitignore 파일 생성 (node_modules, .env)
6. server.js 작성 (위 코드 복붙)
7. public/index.html 작성 (위 코드 복붙)
8. node server.js → localhost:3000 접속 확인
───────────────────────────── 여기까지 로컬
9. GitHub 리포지토리 생성
10. git init → add → commit → push
───────────────────────────── 여기까지 GitHub 업로드
11. Supabase 프로젝트 생성 + 테이블 생성
12. Vercel 또는 Railway에 배포 + 환경변수 등록
13. 배포된 사이트에서 메모 저장 확인
───────────────────────────── 여기까지 배포 완료!
```

**축하합니다!** 초보자용 방문자 메모장 프로젝트가 완성되었습니다.
