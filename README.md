<h1 align="center">use-form-state</h1>
<div align="center">

[![Current release](https://img.shields.io/npm/wappla/use-form-state.svg)](https://www.npmjs.com/package/use-form-state)  [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://github.com/wappla/use-form-state/blob/master/LICENSE)  [![GitHub pull-requests](https://img.shields.io/github/issues-pr/wappla/use-form-state.svg?style=flat-square)](https://github.com/wappla/use-form-state/pulls/)  [![GitHub issues](https://img.shields.io/github/issues/wappla/use-form-state.svg?style=flat-square)](https://github.com/wappla/use-form-state/issues/)
  <h3>
    <a href="#getting-started">
      Installation
    </a>
    <span> | </span>
    <a href="#contributing">
      Contributing
    </a>
    <span> | </span>
    <a href="#license">
      License
    </a>
  </h3>
    <sub>Built with ❤︎ by
  <a href="#about-us">Wappla</a> and
  <a href="https://github.com/wappla/use-form-state/graphs/contributors">
    contributors
  </a>
</div>

<details>
    <summary>Table of Contents</summary>
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Getting Started](#getting-started)
- [Examples](#examples)
  - [Basic Usage](#basic-usage)
- [API](#api)
  - [useFormState](#useformstate)
    - [initialValues](#initialvalues)
    - [formOptions](#formoptions)
      - [formOptions.validation](#formoptionsvalidation)
      - [formOptions.validationOptions](#formoptionsvalidationoptions)
      - [formOptions.valuesToInput](#formoptionsvaluestoinput)
      - [formOptions.debug](#formoptionsdebug)
    - [values](#values)
    - [errors](#errors)
    - [isDirty](#isdirty)
    - [isValid](#isvalid)
    - [isPristine](#ispristine)
    - [setValues](#setvalues)
    - [handleChange](#handlechange)
    - [handleNativeChange](#handlenativechange)
    - [validate](#validate)
    - [updateErrors](#updateerrors)
    - [resetForm](#resetform)
    - [getInputProps](#getinputprops)
    - [getNativeInputProps](#getnativeinputprops)
    - [valuesToInput](#valuestoinput)
    - [getValue](#getvalue)
    - [getErrorMessages](#geterrormessages)
    - [hasError](#haserror)
  - [createFormValidation](#createformvalidation)
    - [path](#path)
    - [validate](#validate-1)
      - [validate.currentValue](#validatecurrentvalue)
      - [validate.allValues](#validateallvalues)
      - [validate.validationOptions](#validatevalidationoptions)
    - [message](#message)
- [Contributing](#contributing)
- [Versioning](#versioning)
- [Authors](#authors)
- [About us](#about-us)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->
</details>

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

## Contributing

Please read [CONTRIBUTING.md](https://github.com/wappla/use-form-state) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/wappla/use-form-state/tags). 

## Authors

* **Sander Peeters** - *Initial work* - [Sander Peeters](https://github.com/SanderPeeters)

See also the list of [contributors](https://github.com/wappla/use-form-state/graphs/contributors) who participated in this project.

## About us

[Wappla BVBA](https://www.wappla.com/)
We shape, build and grow ambitious digital products.

## License

This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/wappla/use-form-state/blob/master/LICENSE) file for details