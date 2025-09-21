// Vercel Serverless Function for Google Drive API
// 이 파일은 서버에서만 실행되므로 민감한 정보가 안전합니다

export default async function handler(req, res) {
    // CORS 설정
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // 환경변수에서 민감한 정보 가져오기 (Vercel 대시보드에서 설정)
    const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
    const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;
    const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID || '1rEMeET9wqGR2Ky-fefFm6BumbXsRBi77';

    if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
        return res.status(500).json({
            error: 'Server configuration error',
            message: 'Google API credentials not configured'
        });
    }

    try {
        // Access Token 가져오기
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                refresh_token: REFRESH_TOKEN,
                grant_type: 'refresh_token'
            })
        });

        const tokenData = await tokenResponse.json();

        if (!tokenData.access_token) {
            throw new Error('Failed to get access token');
        }

        const accessToken = tokenData.access_token;

        // Google Drive API 호출
        if (req.method === 'GET' && req.query.action === 'list') {
            // 파일 목록 가져오기
            const query = `'${FOLDER_ID}' in parents and (name contains '.sb3' or name contains '.sb2' or name contains '.sb') and trashed=false`;

            const filesResponse = await fetch(
                `https://www.googleapis.com/drive/v3/files?` + new URLSearchParams({
                    q: query,
                    pageSize: '50',
                    fields: 'files(id,name,size,modifiedTime,webViewLink,thumbnailLink,description)',
                    orderBy: 'modifiedTime desc'
                }),
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                }
            );

            const filesData = await filesResponse.json();

            return res.status(200).json({
                success: true,
                files: filesData.files || [],
                folderName: 'CodeKids Scratch Projects'
            });

        } else if (req.method === 'GET' && req.query.action === 'download') {
            // 파일 다운로드
            const fileId = req.query.fileId;

            if (!fileId) {
                return res.status(400).json({ error: 'File ID is required' });
            }

            const fileResponse = await fetch(
                `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                }
            );

            if (!fileResponse.ok) {
                throw new Error('Failed to download file');
            }

            const fileBuffer = await fileResponse.arrayBuffer();
            const base64 = Buffer.from(fileBuffer).toString('base64');

            return res.status(200).json({
                success: true,
                data: base64,
                mimeType: 'application/x.scratch.sb3'
            });

        } else {
            return res.status(405).json({ error: 'Method not allowed' });
        }

    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
}