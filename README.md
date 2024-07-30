# Vee-validate4 playground

vee-validate4 `useForm`, `useField`, `useFieldArray`를 사용해서 간단한 회원 그룹 등록 폼을 만드는 예제 프로젝트입니다.

## Install & Development

```bash
npm i

npm run dev
```

## Features

- yup 스키마를 이용해서 useFieldArray 검증하고, 검증 결과에 따라 에러 메시지를 노출
- useFieldArray의 추가, 삭제 기능
- useFieldArray 아이템 삭제 시 `useForm` `errors` 객체 업데이트
- blur 이벤트가 발생할 때만 입력한 값을 검증
