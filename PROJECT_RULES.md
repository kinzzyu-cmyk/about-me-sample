# 프로젝트 작업 규칙 (Project Rules)

이 프로젝트는 Vanilla JavaScript를 사용하는 Vite 프로젝트이며, GitHub 업로드 후 Netlify를 통해 배포됩니다.
향후 모든 코드 작업 시 아래 규칙을 반드시 준수합니다.

---

### 1. 코드 분리
- HTML, CSS, JavaScript 코드는 각각 분리된 독립된 파일로 작성합니다.
- HTML 내 인라인 스타일(`style="..."`)이나 인라인 스크립트(`<script>...</script>`) 작성을 지양합니다.

### 2. 디렉터리 및 파일 구조
- `index.html`: 프로젝트 루트(`root`)에 위치합니다.
- CSS 및 JavaScript 파일: `src` 디렉터리에 작성합니다.
- 정적 자산(이미지, 폰트 등): `src/assets` 또는 `public` 디렉터리에 관리합니다.
- 설정 파일: `vite.config.js`, `package.json` 등 설정 파일은 프로젝트 루트에 둡니다.

```text
about-me-sample/
├── index.html          # 진입 HTML 파일 (프로젝트 루트)
├── vite.config.js      # Vite 설정 파일 (프로젝트 루트)
├── package.json        # 의존성 및 스크립트 설정
├── src/                # 소스 코드 디렉터리
│   ├── main.js         # JavaScript 진입 파일
│   ├── style.css       # 스타일시트
│   └── assets/         # 애플리케이션 리소스
└── public/             # 정적 파일
```

### 3. 모듈 연결 및 스타일 Import
- JavaScript는 `<script type="module" src="/src/main.js"></script>`와 같이 ES 모듈 방식으로 연결합니다.
- CSS는 HTML의 `<link>` 태그가 아닌 JavaScript 진입 파일(`src/main.js`)에서 `import './style.css'` 형태로 import하여 Vite 번들링 파이프라인에 포함되도록 합니다.

### 4. 외부 라이브러리 사용
- 외부 JavaScript 라이브러리는 반드시 `npm install <package>`로 설치 후 ES 모듈로 `import`하여 사용합니다.
- CDN(Script 태그 방식) 링크는 사용하지 않습니다.

### 5. 기존 파일 및 점진적 변경
- 기존 파일과 설정을 먼저 확인하고, 필요한 부분만 최소한으로 수정합니다.
- 불필요한 설정이나 전면 재작성을 지양합니다.

---

### 배포 가이드 (Netlify)
- **Build command**: `npm run build`
- **Publish directory**: `dist`
