# 클라우드 프로젝트 디렉토리

이 디렉토리는 CodeKids 플랫폼의 클라우드 프로젝트를 저장하는 곳입니다.

## 디렉토리 구조

```
cloud-projects/
├── README.md          # 이 파일
├── projects.json      # 프로젝트 메타데이터
├── files/             # 실제 .sb3 프로젝트 파일
└── thumbnails/        # 프로젝트 썸네일 이미지
```

## 프로젝트 추가 방법

### 1. 프로젝트 파일 준비
- Scratch 3.0에서 프로젝트를 만들고 `.sb3` 파일로 저장
- 파일명은 프로젝트 ID와 일치하도록 설정 (예: `maze-game.sb3`)

### 2. 썸네일 이미지 준비
- 크기: 16:9 비율 권장 (예: 640x360px)
- 형식: PNG 또는 JPG
- 파일명은 프로젝트 ID와 일치 (예: `maze-game.png`)

### 3. projects.json 업데이트
```json
{
  "id": "cloud_xxx",
  "title": "프로젝트 제목",
  "description": "프로젝트 설명",
  "category": "game|animation|education|art",
  "difficulty": "초급|중급|고급",
  "author": "작성자",
  "rating": 0.0,
  "downloads": 0,
  "fileSize": "0.0MB",
  "thumbnail": "filename.png",
  "filePath": "/cloud-projects/files/filename.sb3",
  "tags": ["태그1", "태그2"],
  "createdAt": "YYYY-MM-DD",
  "features": ["기능1", "기능2"]
}
```

## 카테고리 분류

- **game**: 게임 프로젝트
- **animation**: 애니메이션 프로젝트
- **education**: 교육용 프로젝트
- **art**: 예술/창작 프로젝트

## 난이도 기준

- **초급**: Scratch 기본 블록 활용, 간단한 로직
- **중급**: 변수, 리스트, 복잡한 조건문 활용
- **고급**: 클론, 사용자 정의 블록, 복잡한 알고리즘

## 서버 설정 (선택사항)

실제 파일 서비스를 위해서는 웹 서버 설정이 필요합니다:

### Python 서버
```bash
python -m http.server 8888
```

### Node.js 서버
```bash
npx http-server -p 8888 --cors
```

### nginx 설정
```nginx
location /cloud-projects/ {
    alias /path/to/cloud-projects/;
    add_header Access-Control-Allow-Origin *;
}
```

## 참고사항

- 모든 프로젝트 파일은 Scratch 3.0 형식 (.sb3)이어야 합니다
- 파일 크기는 가능한 5MB 이하로 유지하세요
- 교육 목적에 적합한 컨텐츠만 업로드하세요
- 저작권이 있는 컨텐츠는 사용하지 마세요