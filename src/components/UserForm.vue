<template>
  <el-form label-width="auto">
    <el-form-item
      label="회원 그룹명"
      :error="getErrorMessage('name')"
    >
      <el-input
        v-model="name"
        placeholder="회원 그룹명을 입력하세요."
        @blur="handleBlurGroupName($event, true)"
      />
    </el-form-item>

    <el-form-item
      label="회원 목록"
      :error="getErrorMessage('users')"
    >
      <template #default>
        <div>
          <el-button
            type="primary"
            plain
            size="small"
            @click="handleClickAddUserButton()"
          >
            추가
          </el-button>
        </div>
        <el-table
          :data="userTableData"
          empty-text="회원 목록이 없습니다."
          style="width: 100%"
          class="user-table"
        >
          <el-table-column
            prop="name"
            label="이름"
            width="180"
          >
            <template #default="{ $index }">
              <el-form-item :error="getUserErrorMessage($index, 'name')">
                <el-input
                  v-model="users[$index].value.name"
                  placeholder="회원명을 입력하세요."
                  @blur="handleBlurUserName($index)"
                />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            prop="age"
            label="나이"
            width="180"
          >
            <template #default="{ $index }">
              <el-form-item :error="getUserErrorMessage($index, 'age')">
                <el-input
                  v-model.number="users[$index].value.age"
                  placeholder="회원 나이를 입력하세요."
                  @blur="handleBlurUserAge($index)"
                />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            prop="email"
            label="이메일"
          >
            <template #default="{ $index }">
              <el-form-item :error="getUserErrorMessage($index, 'email')">
                <el-input
                  v-model="users[$index].value.email"
                  placeholder="회원 이메일을 입력하세요."
                  @blur="handleBlurUserEmail($index)"
                />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column width="120">
            <template #header> 관리 </template>
            <template #default="{ $index }">
              <el-button
                size="small"
                type="danger"
                @click="handleClickDeleteUserButton($index)"
              >
                삭제
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-form-item>

    <el-form-item>
      <el-button
        type="primary"
        @click="handleClickSubmitButton()"
        >등록</el-button
      >
      <el-button @click="handleClickResetButton()">초기화</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { Path, useField, useFieldArray, useForm } from 'vee-validate';
  import { ElMessage } from 'element-plus';
  import * as yup from 'yup';

  interface UserGroupForm {
    name: string;

    users: {
      name: string;
      email: string;
      age: string;
    }[];
  }

  type FormPath = Path<UserGroupForm>;

  type UserKey = keyof UserGroupForm['users'][0];

  const USER_KEYS: Readonly<UserKey[]> = ['name', 'age', 'email'];

  const schema = yup.object({
    users: yup
      .array(
        yup.object({
          name: yup
            .string()
            .trim()
            .required('회원명을 입력해주세요.')
            .matches(/^[가-힣a-zA-Z\s]+$/, '한글/영어만 입력해주세요.')
            .min(2, '최소 2글자 이상으로 입력해주세요.')
            .max(30, '최대 30글자로 입력해주세요.'),
          email: yup
            .string()
            .trim()
            .required('이메일을 입력해주세요.')
            .email('올바른 이메일을 입력해주세요.')
            .max(50, '최대 50글자로 입력해주세요.'),
          age: yup
            .string()
            .trim()
            .required('나이를 입력해주세요.')
            .max(3, '최대 3글자로 입력해주세요.')
            .matches(/^\d+$/, '숫자만 입력해주세요.'),
        })
      )
      .min(1, '최소 1명 이상의 회원을 등록해주세요.'),
  });

  const {
    errors: formErrors,
    values: formValues,
    resetForm,
    setFieldError,
    validate: validateForm,
  } = useForm<UserGroupForm>({
    initialValues: {
      name: '',
      users: [
        {
          age: '',
          email: '',
          name: '',
        },
      ],
    },
  });

  const { value: name, handleBlur: handleBlurGroupName } = useField<UserGroupForm['name']>(
    'name',
    yup
      .string()
      .trim()
      .required('회원 그룹명을 입력해주세요.')
      .matches(/^[가-힣a-zA-Z0-9\s]+$/, '한글/영어/숫자만 입력해주세요.')
      .min(2, '최소 2글자 이상으로 입력해주세요.')
      .max(30, '최대 30글자로 입력해주세요.'),
    {
      validateOnValueUpdate: false,
    }
  );

  const { push: pushUser, remove: removeUser, fields: users } = useFieldArray<UserGroupForm['users'][0]>('users');

  const validateField = async (path: FormPath) => {
    try {
      // 특정 필드에 대해 yup 검증 수행
      await schema.validateAt(path, formValues);

      setFieldError(path, '');
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        setFieldError(path, error.message);
      }
    }
  };

  // // users[0].name => users.0.name
  // const errorKeyToPath = (path: FormPath): FormPath => {
  //   return path.replace(/\[(\w+)\]/g, '.$1') as FormPath;
  // }

  // // users.0.name => users[0].name
  // const pathToErrorKey = (key: FormPath): FormPath => {
  //   return key.replace(/\.(\d+)/g, '[$1]') as FormPath;
  // };


  const handleBlurUserName = (index: number) => {
    validateField(`users.${index}.name`);
  };

  const handleBlurUserEmail = (index: number) => {
    validateField(`users.${index}.email`);
  };

  const handleBlurUserAge = (index: number) => {
    validateField(`users.${index}.age`);
  };

  const clearErrors = (paths: FormPath[]) => {
    paths.forEach((path) => {
      setFieldError(path, '');
    });
  };

  const validateUserFields = async () => {
    try {
      await schema.validate(formValues, { abortEarly: false });
      return true;
    } catch (errors) {
      console.dir(errors);

      if (errors instanceof yup.ValidationError) {
        const seen = new Set<FormPath>();

        errors.inner.forEach((error) => {
          if (error.path) {
            if (!seen.has(error.path as FormPath)) {
              setFieldError(error.path as FormPath, error.message);
              seen.add(error.path as FormPath)
            }
          }
        });

        // users 배열은 검증이 통과했을 경우
        // useFieldArray로 선언한 users 필드의 경우 검증 성공했을 경우 명시적으로
        // 에러를 제거합니다.
        if (!errors.inner.some(({ path }) => path === 'users')) {
          clearErrors(['users']);
        }
      }

      return false;
    }
  };

  const validateAll = async () => {
    const validateResults = await Promise.all([validateForm(), validateUserFields()]);
    return validateResults.every(Boolean);
  };

  const getErrorMessage = (path: FormPath) => {
    return formErrors.value[path];
  };

  const getUserErrorMessage = (index: number, key: UserKey) => {
    const path = `users[${index}].${key}` as FormPath;
    return getErrorMessage(path);
  };

  const userTableData = computed(() => users.value.map((it) => it.value));

  const handleClickAddUserButton = () => {
    pushUser({
      name: '',
      email: '',
      age: '',
    });

    clearErrors(['users']);
  };

  /**
   * 지정된 인덱스의 사용자에 대한 오류 메시지를 삭제합니다.
   * 다음 사용자의 오류 메시지를 이동시켜 공백을 채웁니다.
   * 마지막 사용자의 오류 메시지를 지웁니다.
   *
   * @param {number} deletedIndex - 삭제할 사용자의 인덱스.
   * @param {number} prevLastIndex - 삭제 전 마지막 사용자의 인덱스.
   */
   const deleteErrorAtIndex = (deletedIndex: number, prevLastIndex: number) => {
    // 삭제할 사용자가 마지막 인덱스가 아닌 경우, 다음 사용자의 오류 메시지를 이동시켜 공백을 채웁니다.
    if (deletedIndex < prevLastIndex) {
      for (let index = deletedIndex; index < prevLastIndex; index += 1) {
        USER_KEYS.forEach((key) => {
          // 현재 사용자의 경로를 가져옵니다.
          const path = `users[${index}].${key}` as FormPath;
          // 다음 사용자의 경로를 가져옵니다.
          const nextPath = `users[${index + 1}].${key}` as FormPath;

          // 현재 사용자의 오류 메시지를 다음 사용자의 오류 메시지로 설정합니다.
          setFieldError(path, getErrorMessage(nextPath));
        });
      }
    }

    // 마지막 사용자의 오류 메시지를 지웁니다.
    clearErrors(
      // 마지막 사용자의 오류 메시지 경로를 가져옵니다.
      USER_KEYS.map((key) => `users[${prevLastIndex}].${key}` as FormPath)
    );
  };

  const handleClickDeleteUserButton = (deletedIndex: number) => {
    const prevLastIndex = users.value.length - 1;

    removeUser(deletedIndex);

    deleteErrorAtIndex(deletedIndex, prevLastIndex);
  };

  const handleClickSubmitButton = async () => {
    const isValid = await validateAll();

    if (isValid) {
      console.log('values', JSON.stringify(formValues, null, 2));
      ElMessage.success('회원 그룹이 등록되었습니다.');
    } else {
      ElMessage.error('입력한 정보를 확인해주세요.');
    }
  };

  const handleClickResetButton = () => {
    resetForm();

    // setFieldError를 통해 추가된 에러 제거
    const errorKeys = (Object.keys(formErrors.value) as FormPath[]).filter((key) => key !== 'name');
    clearErrors(errorKeys);
  };
</script>

<style scoped>
  .user-table :deep(.el-form-item__error) {
    position: static;
  }
</style>
