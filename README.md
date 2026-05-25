# 인터넷 체커

SKB, KT, LGU+ 통신 3사의 초고속인터넷 주소별 서비스 가용성을 한 번에 조회하는 도구입니다.

## 사용법

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
  index.js         조회 오케스트레이터 (Puppeteer)
  skt.js           SK Broadband 조회
  kt.js            KT 조회
  lgu.js           LGU+ 조회
public/
  index.html       웹 UI
```

조회에는 약 30~60초 소요됩니다.
