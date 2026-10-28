# SIDE B — Worry Stone

67ID 졸업전시 2026 · 워리스톤 QR 웹사이트. 빌드 도구 없이 HTML/CSS/JS로만 되어 있어서 GitHub Pages나 Netlify에 폴더째 올리면 바로 동작합니다.

## 화면 흐름

| 주소 | 화면 |
| --- | --- |
| `/#issue-rumi` … `/#issue-bloom` | QR 접속 → 영수증 프린터에서 해당 워리스톤 ID 카드 출력 → 증서 저장 / HOME |
| `/#home` | STONE · ARCHIVE · BOOK 메뉴 |
| `/#stone` | 워리스톤 5개 목록, 누르면 ID 카드가 위에 뜸 (`/#stone-veil`처럼 바로 열 수도 있음) |
| `/#archive` | 아카이브 영상 + YouTube 링크 |
| `/#book` | 리아 파일 전설과 SIDE B의 의미 (스크롤) |

`?stone=rumi` 형태로 들어와도 `#issue-rumi`로 바뀝니다.

## QR에 넣을 주소 (도메인만 바꿔서 사용)

```
https://<도메인>/#issue-rumi
https://<도메인>/#issue-spark
https://<도메인>/#issue-veil
https://<도메인>/#issue-soul
https://<도메인>/#issue-bloom
```

## 수정하는 곳

- 돌 이름·설명·번호, YouTube 영상: `js/data.js`
- 이미지: `assets/img/`
  - `stones/` 돌 누끼 · `cards/` ID 카드 (969×1467, 3배) · `certificates/` 저장되는 증서 (1206×2622 JPG)
  - `backgrounds/` 발급 화면의 돌별 배경 (1206×2622)
  - 같은 파일 이름으로 고해상도(@3x) 이미지를 덮어쓰면 그대로 적용됩니다.

## 배포 (GitHub Pages)

1. GitHub에 새 저장소를 만들고 이 폴더 내용을 올립니다.
2. Settings → Pages → Branch를 `main` / `(root)`로 저장합니다.
3. `https://<아이디>.github.io/<저장소>/` 주소가 생깁니다.

Netlify를 쓰려면 Netlify에서 이 GitHub 저장소를 연결하면 push할 때마다 자동으로 다시 배포됩니다.
