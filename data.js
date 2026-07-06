/* ============================================================
   TURN CITY — 콘텐츠 데이터
   어드민 패널(admin.html)에서 편집 후 이 파일을 내보내(다운로드) 교체하세요.
   news[]  : 소식/패치노트   |  guides.groups[] : 가이드(사이드바 구조)
   각 글/페이지의 content 는 블록 배열입니다.
   ============================================================ */
window.TURN_DATA = {
  news: [
    {
      id: "patch-2026-07-06",
      category: "patch",         // patch | notice
      title: "2026-07-06 패치노트",
      date: "2026-07-06",
      summary: "2026-07-06 패치노트를 안내드립니다.",
      blocks: [
        { type: "hint", style: "info", text: "이번 업데이트는 **7월 6일 04:00** 정기점검과 함께 적용되었습니다." },
        { type: "heading", level: 2, text: "신규 추가" },
        { type: "list", style: "unordered", items: [
          "신규 직업 `스쿠버 다이버` 추가",
          "낚시 컨텐츠에 신규 어종 **12종** 추가",
          "차량 튜닝 특수 도색 5종 추가"
        ]},
        { type: "heading", level: 2, text: "밸런스 조정" },
        { type: "table", headers: ["항목", "변경 전", "변경 후"], rows: [
          ["광질 획득량", "100", "120"],
          ["강화 성공 확률(4→5)", "35%", "42%"],
          ["급여 지급 주기", "30분", "20분"]
        ]},
        { type: "heading", level: 2, text: "버그 수정" },
        { type: "list", style: "task", items: [
          { text: "차고에서 특정 차량이 스폰되지 않던 문제", done: true },
          { text: "미니맵이 울트라와이드에서 어긋나던 문제", done: true },
          { text: "칭호가 간헐적으로 표시되지 않던 문제", done: true }
        ]}
      ]
    },
    { id: "patch-2026-07-04", category: "patch", title: "2026-07-04 패치노트", date: "2026-07-04", summary: "2026-07-04 패치노트를 안내드립니다.",
      blocks: [{ type: "paragraph", text: "세부 내용을 준비 중입니다." }] },
    { id: "patch-2026-07-03", category: "patch", title: "2026-07-03 패치노트", date: "2026-07-03", summary: "2026-07-03 패치노트를 안내드립니다.",
      blocks: [{ type: "paragraph", text: "세부 내용을 준비 중입니다." }] },
    { id: "notice-maint-0702", category: "notice", title: "서버 정기점검 안내", date: "2026-07-02", summary: "정기점검 일정을 안내드립니다.",
      blocks: [{ type: "hint", style: "warning", text: "**07-02 04:00 ~ 06:00** 서버 점검이 진행됩니다. 접속이 제한됩니다." }] },
    { id: "patch-2026-07-01", category: "patch", title: "2026-07-01 패치노트", date: "2026-07-01", summary: "2026-07-01 패치노트를 안내드립니다.",
      blocks: [{ type: "paragraph", text: "세부 내용을 준비 중입니다." }] },
    { id: "patch-2026-06-30", category: "patch", title: "2026-06-30 패치노트", date: "2026-06-30", summary: "2026-06-30 패치노트를 안내드립니다.",
      blocks: [{ type: "paragraph", text: "세부 내용을 준비 중입니다." }] },
    { id: "notice-event-0629", category: "notice", title: "신규 컨텐츠 업데이트 안내", date: "2026-06-29", summary: "신규 컨텐츠 업데이트 소식입니다.",
      blocks: [{ type: "paragraph", text: "세부 내용을 준비 중입니다." }] },
    { id: "patch-2026-06-28", category: "patch", title: "2026-06-28 패치노트", date: "2026-06-28", summary: "2026-06-28 패치노트를 안내드립니다.",
      blocks: [{ type: "paragraph", text: "세부 내용을 준비 중입니다." }] },
    { id: "patch-2026-06-27", category: "patch", title: "2026-06-27 패치노트", date: "2026-06-27", summary: "2026-06-27 패치노트를 안내드립니다.",
      blocks: [{ type: "paragraph", text: "세부 내용을 준비 중입니다." }] },
    { id: "notice-winner-0625", category: "notice", title: "이벤트 당첨자 발표", date: "2026-06-25", summary: "이벤트 당첨자를 발표합니다.",
      blocks: [{ type: "paragraph", text: "세부 내용을 준비 중입니다." }] },
    { id: "patch-2026-06-24", category: "patch", title: "2026-06-24 패치노트", date: "2026-06-24", summary: "2026-06-24 패치노트를 안내드립니다.",
      blocks: [{ type: "paragraph", text: "세부 내용을 준비 중입니다." }] },
    { id: "patch-2026-06-22", category: "patch", title: "2026-06-22 패치노트", date: "2026-06-22", summary: "2026-06-22 패치노트를 안내드립니다.",
      blocks: [{ type: "paragraph", text: "세부 내용을 준비 중입니다." }] }
  ],

  guides: {
    groups: [
      {
        title: "가이드",
        items: [
          {
            title: "결제등급안내",
            items: [
              {
                id: "vip-benefits",
                title: "VIP 등급 혜택",
                updated: "2026년 4월 2일",
                blocks: [
                  { type: "paragraph", text: "누적 후원 금액에 따라 아래 등급 혜택이 자동 지급됩니다. 자세한 참고사항은 다음 페이지를 확인하세요." },
                  { type: "tier", name: "VIP", color: "#f59e0b", sub: "누적 5만원", benefits: ["등급채팅", "가방 무게 500KG", "매일추첨티켓 30분당 1개"] },
                  { type: "tier", name: "VVIP", color: "#f4f5f7", sub: "누적 15만원", benefits: ["등급채팅", "가방 무게 1000KG", "매일추첨티켓 30분당 2개"] },
                  { type: "tier", name: "SVIP", color: "#f59e0b", sub: "누적 30만원", benefits: ["등급채팅", "가방 무게 1500KG", "매일추첨티켓 30분당 3개"] },
                  { type: "tier", name: "MASTER", color: "#f43f76", sub: "누적 50만원", benefits: ["등급채팅 & 머리 위 칭호", "가방 무게 2000KG", "자차수리 권한", "고급 추첨티켓 30분당 1개"] },
                  { type: "tier", name: "CUSTOM", color: "#22c55e", sub: "누적 100만원", benefits: ["등급채팅 & 머리 위 칭호", "가방 무게 2500KG", "고급 추첨티켓 30분당 2개", "스케이트보드 이용권", "차량(주민번호)번호 변경권 (숫자 4~6자리)"] },
                  { type: "tier", name: "DIAMOND", color: "#3d8bff", sub: "누적 150만원", benefits: ["등급채팅 & 머리 위 칭호", "가방 무게 3000KG", "고급 추첨티켓 30분당 3개", "개인스킨 (1개)", "등급보트 (1종)"] },
                  { type: "tier", name: "SUPERSTAR", color: "#a855f7", sub: "누적 300만원", benefits: ["등급채팅 & 머리 위 칭호", "가방 무게 4000KG", "고급 추첨티켓 30분당 1개", "VIP 추첨티켓 30분당 1개", "개인차량 (1개)", "고유번호 3자리 변경권 (100~999번)", "특별 근접무기"] },
                  { type: "tier", name: "TURN", color: "#3d8bff", sub: "누적 500만원", benefits: ["등급채팅 & 머리 위 칭호", "가방 무게 5000KG", "고급 추첨티켓 30분당 2개", "VIP 추첨티켓 30분당 1개", "고유번호 두자리 변경권 (10~99번)", "개인 머리위 칭호 (1개)", "차량(주민번호)번호 변경권 (영문+숫자 2~6자리)", "특수차장 (슈퍼점프)", "헬기비콘 이용권한 (1종)"] },
                  { type: "tier", name: "PRESTIGE", color: "#22c55e", sub: "누적 1000만원", benefits: ["등급채팅 & 머리 위 칭호", "가방 무게 6000KG", "고급 추첨티켓 30분당 3개", "VIP 추첨티켓 30분당 2개", "개인차장 (1개)", "헬기비콘 이용권한 (2종)", "등급보트 (2종)"] },
                  { type: "tier", name: "SIGNATURE", color: "#a855f7", sub: "누적 1500만원", benefits: ["등급채팅 & 머리 위 칭호", "가방 무게 8000KG", "고급 추첨티켓 30분당 4개", "VIP 추첨티켓 30분당 2개", "개인차량 커스텀 (튜닝패치)"] },
                  { type: "tier", name: "CROWN", color: "#3d8bff", sub: "누적 2000만원", benefits: ["등급채팅 & 머리 위 칭호", "가방 무게 10000KG", "고급 추첨티켓 30분당 5개", "VIP 추첨티켓 30분당 2개", "고유번호 1자리 변경권 (5~9번)", "개인 사유지 (중북부 MLO)"] }
                ]
              },
              {
                id: "vip-notes",
                title: "VIP 등급 참고사항",
                updated: "2026년 4월 2일",
                blocks: [
                  { type: "hint", style: "danger", text: "후원은 **환불이 불가능**합니다. 신중히 결정해 주세요." },
                  { type: "list", style: "unordered", items: [
                    "누적 금액은 계정 기준으로 합산됩니다.",
                    "혜택은 결제 확인 후 최대 10분 내 자동 지급됩니다.",
                    "지급 오류 시 디스코드 문의 티켓을 이용해 주세요."
                  ]}
                ]
              }
            ]
          },
          {
            title: "컨텐츠 안내",
            items: [
              {
                id: "getting-started",
                title: "시작 가이드",
                updated: "2026년 6월 1일",
                blocks: [
                  { type: "paragraph", text: "TURN CITY 에 오신 것을 환영합니다. 이 페이지는 GitBook에서 쓰이는 **모든 블록**의 예시입니다." },
                  { type: "hint", style: "success", text: "처음이라면 디스코드에서 신규 역할을 먼저 받아 주세요!" },
                  { type: "heading", level: 2, text: "접속 방법" },
                  { type: "steps", items: [
                    { title: "FiveM 설치", desc: "공식 사이트에서 FiveM을 설치합니다." },
                    { title: "서버 즐겨찾기", desc: "`connect play.turn2026.com` 을 입력합니다." },
                    { title: "캐릭터 생성", desc: "안내에 따라 캐릭터를 생성하면 끝!" }
                  ]},
                  { type: "heading", level: 2, text: "코드 예시" },
                  { type: "code", title: "server.cfg", lang: "cfg", code: "sv_hostname \"TURN CITY\"\nsv_maxclients 128\nendpoint_add_tcp \"0.0.0.0:30120\"" },
                  { type: "heading", level: 2, text: "플랫폼별 안내" },
                  { type: "tabs", tabs: [
                    { label: "Windows", content: "FiveM.exe 를 실행한 뒤 서버 주소를 입력하세요." },
                    { label: "설치 오류", content: "관리자 권한으로 재실행하고 방화벽 예외를 추가하세요." }
                  ]},
                  { type: "heading", level: 2, text: "자주 묻는 질문" },
                  { type: "expandable", title: "게임이 튕겨요", content: "그래픽 드라이버를 최신으로 업데이트하고 캐시를 삭제해 주세요." },
                  { type: "expandable", title: "권한이 안 들어와요", content: "결제 확인까지 최대 10분이 걸립니다. 그 이후에도 문제가 있으면 문의해 주세요." },
                  { type: "heading", level: 2, text: "바로가기" },
                  { type: "cards", cards: [
                    { icon: "🎮", title: "게임 시작", desc: "지금 바로 접속하기", href: "#" },
                    { icon: "💬", title: "디스코드", desc: "커뮤니티 참여", href: "#" },
                    { icon: "📖", title: "규칙", desc: "서버 규칙 확인", href: "#" }
                  ]},
                  { type: "divider" },
                  { type: "quote", text: "제 2의 인생을 TURN CITY에서 시작하세요." }
                ]
              }
            ]
          }
        ]
      },
      {
        title: "규칙",
        items: [
          {
            id: "rules",
            title: "서버 규칙",
            updated: "2026년 6월 1일",
            blocks: [
              { type: "hint", style: "warning", text: "규칙 위반 시 경고 없이 제재될 수 있습니다." },
              { type: "list", style: "ordered", items: [
                "타 유저에 대한 비매너 행위 금지",
                "핵/버그 악용 금지",
                "메타게이밍 · 파워게이밍 금지",
                "RDM · VDM 금지"
              ]}
            ]
          }
        ]
      }
    ]
  }
};
