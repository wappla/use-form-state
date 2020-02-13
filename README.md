<h1 align="center">
    Wappla - useFormState
</h1>

## Motivation

Managing form state in React can be unwieldy sometimes. There are plenty of great solutions already available that make managing forms state a breeze. But like every other package they mostly just don't completely cover your specific needs. So we decided to create or own custom hook with additional form validation!

Luckily, the recent introduction of [React Hooks](https://reactjs.org/docs/hooks-intro.html) and the ability to write custom hooks have enabled new possibilities when it comes sharing state logic. Form state is no exception!

`use-form-state` is a small React Hook that attempts to [simplify managing form state](#examples), using the native form input elements you are familiar with, but also with the opportunity to use it on custom input elements.

## Getting Started

To get it started, add `use-form-state` to your project:

```shell
npm install --save use-form-state
```

Please note that `use-form-state` requires `react@^16.12.0` as a peer dependency.

## Examples

### Basic Usage

```jsx
import useFormState from 'use-form-state'

export const LoginForm = ({ onSubmit }) => {
    const { getNativeInputProps } = useFormState()

    return (
        <form onSubmit={onSubmit}>
            <input {...getNativeInputProps('email')} required />
            <input {...getNativeInputProps('password')} required />
        </form>
    )
}
```

From the example above, as the user submits the form, the `formState` object will look something like this:

```js
{
    values: {
        email: 'development@wappla.com',
        password: '123456789',
    },
    errors: [],
    isDirty: true
    isValid: true,
    isPristine: false,
    setValues: Function,
    handleChange: Function,
    handleNativeChange: Function,
    validate: Function,
    updateErrors: Function,
    resetForm: Function,
    getInputProps: Function,
    getNativeInputProps: Function,
    valuesToInput: Function,
    getValue: Function,
    getErrorMessages: Function,
    hasError: Function,
}
```


## API

### useFormState

```jsx
import useFormState from 'use-form-state'

export const FormComponent = () => {
    const {
        values,
        errors,
        isDirty,
        isValid,
        isPristine,
        setValues,
        handleChange,
        handleNativeChange,
        validate,
        updateErrors,
        resetForm,
        getInputProps,
        getNativeInputProps,
        valuesToInput,
        getValue,
        getErrorMessages,
        hasError,
    } = useFormState(initialValues, formOptions)
    return (
        // ...
    )
}
```

#### initialValues

`useFormState` takes an optional initial values object with keys as the name property of the form inputs, and values as the initial values of those inputs.

#### formOptions

`useFormState` also accepts an optional form options object as a second argument with following properties:

##### formOptions.validation
Function that returns an array of validators created by [createFormValidation](#createFormValidation)

*Example:*
See return value of [createFormValidation](#createFormValidation)

*Default:* empty array

##### formOptions.validationOptions
Adds extra options that can be used in the validation. See [validate.validationOptions](#validation.validationOptions) for more info 

*Example:*
```js
const isCompany = user.type === 'company'

const formState = useFormState(initialValues, {
    validationOptions: {
        isCompany,
    }
})
```

*Default:* empty object

##### formOptions.valuesToInput
Function that can be used to manipulate the values used in the form state before submitting the form. This can be useful when the name of the input field differs from the API or when you need to parse/format dates for example.

*Example:*
```js
const formState = useFormState(initialValues, {
    valuesToInput: ({
        firstName,
        birthDate,
        ...otherValues,
    }) => ({
        ...otherValues,
        first_name: firstName,
        birth_date: birthDate.toISOString(),
    })
})
```

*Default:* values from state

##### formOptions.debug
When set to `true`, `useFormState` will log its state to the console when changes are made.

*Default:* false

#### values
#### errors
#### isDirty
#### isValid
#### isPristine
#### setValues
#### handleChange
#### handleNativeChange
#### validate
#### updateErrors
#### resetForm
#### getInputProps
#### getNativeInputProps
#### valuesToInput
#### getValue
#### getErrorMessages
#### hasError

### createFormValidation

```js
import useFormState, { createFormValidation } from 'use-form-state'

export const FormComponent = () => {
    const formState = useFormState(initialValues, {
        validation: createFormValidation([{
            path: 'firstName',
            validate: (name) => name !== '',
            message: 'First name is required!',
        }, {
            path: 'birthDate',
            validate: (date) => date > new Date(),
            message: 'Date must be after now.',
        }, {
            path: 'vatNumber',
            validate: (vatNumber, values, { isCompany }) => (
                isCompany && vatNumber !== ''
            ),
            message: 'VAT number is required for a company.',
        }])
    })
    return (
        // ...
    )
}
```

#### path
Required

`path` references the name to the value in the formState where you want to add the validation on.

#### validate
Required

Function that validates the given value and returns the result of the expresion.

##### validate.currentValue
The first argument of `validate` is the value from the formState based on the given `path`.

##### validate.allValues
Second argument includes all the values from the formState.

##### validate.validationOptions
`validationOptions` is an optional argument you can use as external "dependency" for your validation expression.

#### message
The `message` you want to display near the form input to show the user what went wrong.

*Default*: 'Invalid'