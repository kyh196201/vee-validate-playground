<template>
  <el-form label-width="auto">
    <el-form-item
      label="회원 그룹명"
      :error="errors.name"
    >
      <el-input
        v-model="name"
        placeholder="회원 그룹명을 입력하세요."
        @blur="validateName()"
      />
    </el-form-item>

    <el-form-item 
			label="회원 목록"
      :error="errors.users"
		>
      <div>
        <el-button
          type="primary"
          plain
          size="small"
          @click="addUser()"
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
            <el-form-item :error="getErrorMessage($index, 'name')">
              <el-input
                v-model="fields[$index].value.name"
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
            <el-form-item :error="getErrorMessage($index, 'age')">
              <el-input
                v-model.number="fields[$index].value.age"
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
            <el-form-item :error="getErrorMessage($index, 'email')">
              <el-input
                v-model="fields[$index].value.email"
                placeholder="회원 이메일을 입력하세요."
                @blur="handleBlurUserEmail($index)"
              />
            </el-form-item>
          </template>
        </el-table-column>
				<el-table-column width="120">
					<template #header>
						관리
					</template>
					<template #default="{ $index }">
						<el-button
							size="small"
							type="danger"
							@click="deleteUser($index)"
						>
							삭제
						</el-button>
					</template>
				</el-table-column>
      </el-table>
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

type UserKey = keyof UserGroupForm['users'][0];

const schema = yup.object({
  name: yup
    .string()
    .trim()
    .required('회원 그룹명을 입력해주세요.')
    .matches(/^[가-힣a-zA-Z0-9\s]+$/, '한글/영어/숫자만 입력해주세요.')
    .min(2, '최소 2글자 이상으로 입력해주세요.')
    .max(30, '최대 30글자로 입력해주세요.'),
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
  errors,
  values,
  resetForm,
  setFieldError,
  // setFieldValue,
	setErrors,
} = useForm<UserGroupForm>({
  initialValues: {
    name: '',
    users: [],
  },
});

const { value: name,  } = useField<UserGroupForm['name']>('name', undefined, {
  validateOnValueUpdate: false,
});

const {
  push: pushUser,
	remove: removeUser,
  // replace: replaceUser,
  fields,
  // update: updateUser,
} = useFieldArray<UserGroupForm['users'][0]>('users');

const validateField = async (path: Path<UserGroupForm>) => {
  try {
    // 특정 필드에 대해 yup 검증 수행
    await schema.validateAt(path, values);
    setFieldError(path, '');
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      setFieldError(path, error.message);
    }
  }
};

const validateName = () => {
  validateField('name');
};

const handleBlurUserName = (index: number) => {
  validateField(`users.${index}.name`);
};

const handleBlurUserEmail = (index: number) => {
  validateField(`users.${index}.email`);
};

const handleBlurUserAge = (index: number) => {
  validateField(`users.${index}.age`);
};

const validateForm = async () => {
  try {
    // FIXME: formErrors를 초기화하기 위해서 resetForm을 실행했습니다.
    // resetForm({
    //   values: {
    //     options: formValues.options,
    //   },
    // });
    await schema.validate(values, { abortEarly: false });
    return true;
  } catch (errors) {
    if (errors instanceof yup.ValidationError) {
      errors.inner.forEach((error) => {
        if (error.path) {
          setFieldError(error.path as Path<UserGroupForm>, error.message);
        }
      });
    }

    return false;
  }
};

const getErrorMessage = (index: number, key: UserKey) => {
  const path = `users[${index}].${key}` as Path<UserGroupForm>;
  return errors.value[path];
};

const userTableData = computed(() => fields.value.map((it) => it.value));

const addUser = () => {
  pushUser({
    name: '',
    email: '',
    age: '',
  });
};

const deleteUser = (index: number) => {
	removeUser(index);

	const newErrors = { ...errors.value };
	const userKeys: UserKey[] = ['name', 'age', 'email'];
	userKeys.forEach((key) => {
		newErrors[`users[${index}].${key}` as Path<UserGroupForm>] = '';
	});

	setErrors(newErrors);
}

const handleClickSubmitButton = async () => {
  const isValid = await validateForm();
  if (isValid) {
    console.log('values', values);
		ElMessage.success('회원 그룹이 등록되었습니다.');
  } else {
    ElMessage.error('입력한 정보를 확인해주세요.');
  }
};

const handleClickResetButton = () => {
	resetForm();

	const newErrors = { ...errors.value };
	// setFieldError를 통해 추가된 에러 제거 
	Object.keys(newErrors).forEach((key) => {
		newErrors[key as Path<UserGroupForm>] = '';
	});

	setErrors(newErrors);
}
</script>

<style scoped>
.user-table :deep(.el-form-item__error) {
  position: static;
}
</style>
