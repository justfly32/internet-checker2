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

> 환경변수 `BROWSERLESS_WS_ENDPOINT`가 설정되지 않으면 자동으로 로컬 Chrome(Puppeteer)을 사용합니다.

### 로컬 실행 (PC에 설치)

```
setup.bat      (최초 1회: Node.js 확인 + npm install)
start.bat      (서버 실행 + 브라우저 오픈)
```

또는 직접 실행:
```bash
node server.js
```

> Windows에서 Puppeteer가 Chrome을 찾지 못하면 https://chrome.google.com 에서 Chrome을 설치하거나 `setup.bat`을 먼저 실행하세요.

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

[Railway](https://railway.com) Free 플랜에 배포되어 있습니다. Node.js Express 앱을 컨테이너 형태로 실행하며, Puppeteer 브라우저 작업은 외부 서비스인 [Browserless.io](https://www.browserless.io)를 통해 처리합니다.

#### 아키텍처

```
사용자 → Railway (Express API) ──WebSocket──→ Browserless.io (원격 Chrome)
                                                  ↓
                                             SKB / KT / LGU+ 사이트
```

- **Railway**: Express API 서버 호스팅, 정적 파일(public/) 서빙
- **Browserless.io**: 원격 Chrome 브라우저 실행, 각 통신사 사이트 스크래핑
- 두 서비스 모두 Free 티어로 운영 가능

#### 배포 방법

1. GitHub에 코드 푸시
2. [Railway](https://railway.com) 로그인 → **New Project** → **Deploy from GitHub repo**
3. 해당 레포지토리 선택 → 자동 빌드 및 배포
4. Settings → **Generate Domain** 으로 공개 URL 생성

#### 필요한 환경변수

| 변수명 | 필수 | 설명 |
|--------|:----:|------|
| `BROWSERLESS_WS_ENDPOINT` | ✅ | Browserless.io WebSocket 주소 (토큰 포함) |
| `PUPPETEER_SKIP_DOWNLOAD` | ✅ | `true`로 설정 시 빌드에서 Chrome 다운로드 생략 |

`PORT` 변수는 Railway가 자동으로 설정합니다.

#### 무료 사용량

| 서비스 | 한도 | 비고 |
|--------|------|------|
| Railway Free | 월 $1 크레딧, 0.5GB RAM | 사용량 적으면 크레딧 내에서 충분 |
| Browserless.io Free | 월 1,500회 요청 | 3사 동시 조회 시 1회당 3회 차감 (약 500회 조회 가능) |

#### 주의사항

- Railway Free 플랜은 **트래픽이 없으면 자동으로 Sleep** 상태가 됩니다. 요청이 들어오면 다시 깨어나며 첫 응답이 다소 지연될 수 있습니다.
- Browserless.io 무료 티어는 **월 1,500회 요청 제한**이 있습니다. 초과 시 유료 전환 또는 사용 중단됩니다.
- 각 통신사 조회는 평균 **30~60초** 소요됩니다.

### 로컬 실행 (PC)

자세한 내용은 위 **사용법** 섹션을 참고하세요.
