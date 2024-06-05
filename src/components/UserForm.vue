<template>
	<form>
		<fieldset
			v-for="(field, index) in fields"
			:key="index"
		>
			<div class="field">
				<label class="label">Name</label>
				<div class="control">
					<input class="input" type="text" placeholder="name" v-model="field.value.name">
				</div>
			</div>
	
			<!-- <div class="field">
				<label class="label">Username</label>
				<div class="control">
					<input class="input is-success" type="text" placeholder="Text input" value="bulma">
				</div>
				<p class="help is-success">This username is available</p>
			</div> -->
	
			<div class="field">
				<label class="label">Email</label>
				<div class="control">
					<input class="input is-danger" type="email" placeholder="email" v-model="field.value.email">
				</div>
				<p class="help is-danger">This email is invalid</p>
			</div>
		</fieldset>

		<div class="field is-grouped">
			<div class="control">
				<button class="button is-link" type="button">Submit</button>
			</div>
			<!-- <div class="control">
				<button class="button is-link is-light">Cancel</button>
			</div> -->
		</div>
	</form>

	<pre>
		{{ values }}
	</pre>

	<div>errors</div>
	<pre>
		{{ errors }}
	</pre>
</template>

<script setup lang="ts">
	import { useFieldArray, useForm } from 'vee-validate';
	import * as yup from 'yup';

	interface Form {
		users: {
			name: string;
			email: string;
		}[];
	}

	const schema = yup.object({
    users: yup
      .array(
        yup.object({
					name: yup.string().required(),
					email: yup.string().required().email(),
          // options: yup
          //   .array(
          //     yup.object({
          //       name1: yup
          //         .string()
          //         .required(requiredMessage)
          //         .test({
          //           message: requiredMessage,
          //           test: (value) => value.trim().length > 0,
          //         }),
          //       name2: yup.string().when({
          //         is: () => props.allOptionNames.length > 1,
          //         then(schema) {
          //           return schema.required(requiredMessage).test({
          //             message: requiredMessage,
          //             test: (value) => value.trim().length > 0,
          //           });
          //         },
          //       }),
          //       name3: yup.string().when({
          //         is: () => props.allOptionNames.length > 2,
          //         then(schema) {
          //           return schema.required(requiredMessage).test({
          //             message: requiredMessage,
          //             test: (value) => value.trim().length > 0,
          //           });
          //         },
          //       }),
          //       price: yup
          //         .string()
          //         .required(requiredMessage)
          //         .test('is-valid-number', requiredMessage, (value) => !isNaN(Number(value.trim()))),
          //     }),
          //   )
          //   .required(requiredMessage),
          // totalStock: yup
          //   .string()
          //   .required(requiredMessage)
          //   .test('is-valid-number', requiredMessage, (value) => !isNaN(Number(value.trim()))),
          // barcode: yup.string(),
          // manageCode: yup.string(),
          // useYn: yup.string().required(requiredMessage),
        }),
      )
      .required(),
  });

	const {
    errors,
    values,
    // resetForm,
    // setFieldError,
    // setFieldValue,
  } = useForm<Form>({
    initialValues: {
      users: [
				{
					name: '',
					email: '',
				},
			],
    },
  });

	const {
    // push: pushOption,
    // replace: replaceOptions,
    fields,
    // update: updateOption,
  } = useFieldArray<Form['users'][0]>('users');

	/**
	 * - submit
	 * - validate
	 * - if success
	 * 	- log values
	 * - if fail
	 * 	- log errors & alert message
	 */
</script>

<style lang="scss" scoped>

</style>