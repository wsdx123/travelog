# Team Project Introduction

여행자들을 위한 플랫폼, 트레블로그

→ 여행을 떠나려는 자와 이미 여행 중인 자들의 실시간 여행 사진 & 꿀팁 공유 플랫폼

→ 여행지와 여행시기, 누구와의 여행인지에 대한 카테고라이징으로 “내 여행”에 대한 정보를 빠르게 얻고 또 공유할 수 있다.

## Team

Leader: 백연주([**hellokeitha**](https://github.com/hellokeitha))

Member:

- 제준영([**wsdx123**](https://github.com/wsdx123))
- 전동헌([**qaws7791**](https://github.com/qaws7791))
- 나혜인([**hyensss**](https://github.com/hyensss))

## Stack

Frontend: React (using Create-React-App)

Backend: Firebase

## Route

| page name          | route                                | description                       |
| ------------------ | ------------------------------------ | --------------------------------- |
| 홈페이지           | /                                    | 전체 게시글 보여주는 메인 페이지  |
| 로그인             | /SignInPage                          | 로그인 페이지                     |
| 회원가입           | /SignUpPage                          | 회원가입 페이지                   |
| 마이페이지         | /myPage/:myId                        | 사용자 개인정보를 나타내는 페이지 |
| 게시글 작성 페이지 | /postPage?action=write               | 게시물을 작성할 수 있는 페이지    |
| 게시글 수정 페이지 | /postPage?action=edit&postId=:postId | 게시글 수정 페이지                |
| 상세 페이지        | /postPage/:postId                    | 각각 게시물에 대한 상세 페이지    |

---

# Installation

### 1. Create `.env` file in root

write firebase config

```
REACT_APP_FIREBASE_API_KEY=<REACT_APP_FIREBASE_API_KEY>
REACT_APP_FIREBASE_AUTH_DOMAIN=<REACT_APP_FIREBASE_AUTH_DOMAIN>
REACT_APP_FIREBASE_PROJECT_ID=<REACT_APP_FIREBASE_PROJECT_ID>
REACT_APP_FIREBASE_STORAGE_BUCKET=<REACT_APP_FIREBASE_STORAGE_BUCKET>
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=<REACT_APP_FIREBASE_MESSAGING_SENDER_ID>
REACT_APP_FIREBASE_APP_ID=<REACT_APP_FIREBASE_APP_ID>
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Open Server

```bash
npm run start
```
