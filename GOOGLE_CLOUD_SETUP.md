# 🚀 Google Cloud Run에 Scratch GUI 배포 가이드

## 아키텍처 개요

```
학생 브라우저
    ↓
Vercel Frontend (codekids-platform.vercel.app)
    ↓
Google Cloud Run (scratch-gui-codekids.a.run.app)
    ↓
Google Drive API (프로젝트 저장/로드)
```

## 1. 사전 준비

### Google Cloud 프로젝트 설정
```bash
# Google Cloud SDK 설치 후
gcloud auth login
gcloud config set project YOUR_PROJECT_ID

# 필요한 API 활성화
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

### Scratch GUI 소스 준비
```bash
git clone https://github.com/scratchfoundation/scratch-gui.git
cd scratch-gui
```

## 2. Dockerfile 생성

```dockerfile
# scratch-gui/Dockerfile
FROM node:16-alpine

WORKDIR /app

# 패키지 파일 복사
COPY package*.json ./
RUN npm ci --only=production

# 소스 코드 복사
COPY . .

# 빌드
RUN npm run build

# 프로덕션 서버 설정
FROM nginx:alpine
COPY --from=0 /app/build /usr/share/nginx/html

# CORS 설정을 위한 nginx 설정
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
```

## 3. nginx.conf 생성

```nginx
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    server {
        listen 8080;
        server_name localhost;

        # CORS 설정 - Vercel 도메인 허용
        add_header 'Access-Control-Allow-Origin' 'https://codekids-platform-*.vercel.app' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range' always;
        add_header 'Access-Control-Expose-Headers' 'Content-Length,Content-Range' always;

        # iframe 허용
        add_header 'X-Frame-Options' 'SAMEORIGIN' always;

        location / {
            root   /usr/share/nginx/html;
            index  index.html index.htm;
            try_files $uri $uri/ /index.html;
        }

        # OPTIONS 요청 처리
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

## 4. Cloud Run 배포

```bash
# 현재 디렉토리: scratch-gui/

# 1. 이미지 빌드 및 푸시
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/scratch-gui

# 2. Cloud Run에 배포
gcloud run deploy scratch-gui \
  --image gcr.io/YOUR_PROJECT_ID/scratch-gui \
  --platform managed \
  --region asia-northeast1 \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --cpu 1 \
  --max-instances 10

# 3. 배포된 URL 확인
gcloud run services describe scratch-gui \
  --platform managed \
  --region asia-northeast1 \
  --format 'value(status.url)'
```

## 5. 환경변수 설정

### Google Drive API 연동
```bash
# Scratch GUI에 환경변수 추가
gcloud run services update scratch-gui \
  --set-env-vars "GOOGLE_CLIENT_ID=129459484885-49jhhorvjq9cbd1nhjnf4qlrslqchdj7.apps.googleusercontent.com" \
  --set-env-vars "GOOGLE_DRIVE_FOLDER_ID=1rEMeET9wqGR2Ky-fefFm6BumbXsRBi77" \
  --region asia-northeast1
```

## 6. 도메인 설정 (선택사항)

```bash
# 커스텀 도메인 매핑
gcloud run domain-mappings create \
  --service scratch-gui \
  --domain scratch.codekids.kr \
  --region asia-northeast1
```

## 7. Vercel 설정 업데이트

배포 완료 후 실제 Cloud Run URL로 업데이트:

```javascript
// js/scratch-integration.js 수정
const cloudScratchURL = 'https://scratch-gui-codekids-실제URL.a.run.app';
```

## 8. 보안 설정

### IAM 권한
```bash
# Cloud Run Invoker 권한만 부여 (더 안전)
gcloud run services add-iam-policy-binding scratch-gui \
  --member="allUsers" \
  --role="roles/run.invoker" \
  --region asia-northeast1
```

### HTTPS 강제
```bash
# Cloud Run은 기본적으로 HTTPS 지원
# 추가 보안을 위한 설정
gcloud run services update scratch-gui \
  --set-env-vars "FORCE_HTTPS=true" \
  --region asia-northeast1
```

## 9. 모니터링 설정

```bash
# Cloud Logging 활성화
gcloud logging sinks create scratch-gui-logs \
  bigquery.googleapis.com/projects/YOUR_PROJECT_ID/datasets/logs
```

## 10. 비용 최적화

```bash
# 자동 스케일링 설정
gcloud run services update scratch-gui \
  --min-instances 0 \
  --max-instances 5 \
  --concurrency 80 \
  --region asia-northeast1
```

## 배포 완료 후 확인사항

1. ✅ Cloud Run URL 접속 확인
2. ✅ Vercel에서 iframe 로드 확인
3. ✅ Google Drive 연동 테스트
4. ✅ CORS 정책 확인
5. ✅ 성능 및 로딩 속도 테스트

## 예상 비용

- **Cloud Run**: 요청당 과금 (~$0.40/백만 요청)
- **Container Registry**: 스토리지 (~$0.10/GB/월)
- **Cloud Build**: 빌드 시간당 (~$0.003/분)

예상 월 비용: **$5-20** (소규모 교육용)

---

**배포 완료 후 Vercel 프론트엔드가 Google Cloud의 Scratch GUI를 사용하게 됩니다!**