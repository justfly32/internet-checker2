# 인터넷 체커

SKB, KT, LGU+ 통신 3사의 초고속인터넷 주소별 서비스 가용성을 한 번에 조회하는 도구입니다.

## 사용법

### Windows (최초 설치)

```
setup.bat
```

더블클릭 한 번으로 Node.js 설치 확인 → `npm install` → 서버 실행 → 브라우저 오픈까지 자동 처리됩니다.

### 실행

**macOS**
```
./start.command
```

**Windows**
```
start.bat
```

또는 직접 실행:
```
node server.js
```

브라우저에서 `http://localhost:3000` 으로 접속합니다.

### CLI
```bash
node checker.js "서울 강남구 테헤란로 152"
```

## 구조

```
server.js          Express 서버 + API
checker.js         CLI 모드
providers/
  index.js         조회 오케스트레이터 (Puppeteer / Browserless.io)
  skt.js           SK Broadband 조회
  kt.js            KT 조회
  lgu.js           LGU+ 조회
public/
  index.html       웹 UI
setup.bat          Windows 최초 설치 + 실행
start.bat          Windows 실행 (설치 후)
start.command      macOS 실행
```

조회에는 약 30~60초 소요됩니다.

## 배포

### Railway (현재 운영 중)

**서비스 주소:** https://internet-checker2-production.up.railway.app/

[Railway](https://railway.com) Free 플랜에 배포되어 있습니다.

1. GitHub에 푸시
2. Railway → **New Project** → **Deploy from GitHub repo**
3. 환경변수 설정 (Variables):

| 변수명 | 값 |
|--------|-----|
| `BROWSERLESS_WS_ENDPOINT` | `wss://chrome.browserless.io/ws?token=...` |
| `PUPPETEER_SKIP_DOWNLOAD` | `true` |

Puppeteer 작업은 [Browserless.io](https://www.browserless.io)의 원격 Chrome을 사용합니다. Free 티어에서 월 1,500회 요청 가능하므로 로컬 Chrome이 필요 없습니다.

### 로컬 실행

```
node server.js
```

환경변수 `BROWSERLESS_WS_ENDPOINT`가 설정되지 않으면 로컬에 설치된 Puppeteer Chrome을 사용합니다.
