import { useState } from 'react'
import { renderHook, act } from '@testing-library/react-hooks'
import useFormState from '../src/useFormState'
import createFormValidation, { createArrayFormValidation, mapFormValidation } from '../src/createFormValidation'
// eslint-disable-next-line no-unused-vars
import setupTests from '../setupTests'

it('useFormState sets the initial state correct.', () => {
    const initialValues = {
        firstName: 'test',
        lastName: 'form',
    }
    const { result } = renderHook(() => useFormState(initialValues))
    const { values, errors } = result.current
    expect(values.firstName).toBe(initialValues.firstName)
    expect(values.lastName).toBe(initialValues.lastName)
    expect(Array.isArray(errors)).toBe(true)
    expect(errors.length).toBe(0)
})

it('useFormState updates the initial state when the initialValues change.', () => {
    const initialValues = {
        id: 1,
        name: 'test',
    }
    const { result, rerender } = renderHook(
        (props) => (
            useFormState(props.initialValues, {})
        ), {
        initialProps: { initialValues },
    }
    )
    expect(result.current.values.name).toBe(initialValues.name)
    const newInitialValues = {
        id: 2,
        name: 'rerender',
    }
    rerender({ initialValues: newInitialValues })
    expect(result.current.values.name).toBe(newInitialValues.name)
})

it('useFormState does not update the initial state when the dependencies remains equal.', () => {
    const initialValues = {
        id: 1,
        name: 'test',
    }
    const { result, rerender } = renderHook(
        (props) => (
            useFormState(props.initialValues)
        ), {
        initialProps: { initialValues },
    }
    )
    expect(result.current.values.name).toBe(initialValues.name)
    const newInitialValues = {
        id: 1,
        name: 'test',
    }
    rerender({ initialValues: newInitialValues })
    expect(result.current.values.name).toBe(initialValues.name)
})

it('restForm updates the the state correct.', () => {
    const initialValues = {
        firstName: 'test',
        lastName: 'form',
    }
    const valuesToUpdate = {
        lastName: 'baby',
    }
    const { result } = renderHook(() => useFormState(initialValues))
    expect(result.current.values.firstName).toBe(initialValues.firstName)
    expect(result.current.values.lastName).toBe(initialValues.lastName)
    expect(Array.isArray(result.current.errors)).toBe(true)
    expect(result.current.errors.length).toBe(0)
    act(() => {
        result.current.setValues(valuesToUpdate)
        result.current.resetForm()
    })
    expect(result.current.values.firstName).toBe(initialValues.firstName)
    expect(result.current.values.lastName).toBe(initialValues.lastName)
    expect(Array.isArray(result.current.errors)).toBe(true)
    expect(result.current.errors.length).toBe(0)
})

it('setValues updates the the state correct.', () => {
    const initialValues = {
        firstName: 'test',
        lastName: 'form',
    }
    const valuesToUpdate = {
        lastName: 'baby',
        age: 2,
    }
    const { result } = renderHook(() => useFormState(initialValues))
    expect(result.current.values.firstName).toBe(initialValues.firstName)
    expect(result.current.values.lastName).toBe(initialValues.lastName)
    expect(Array.isArray(result.current.errors)).toBe(true)
    expect(result.current.errors.length).toBe(0)
    act(() => {
        result.current.setValues(valuesToUpdate)
    })
    expect(result.current.values.firstName).toBe(initialValues.firstName)
    expect(result.current.values.lastName).toBe(valuesToUpdate.lastName)
    expect(result.current.values.age).toBe(valuesToUpdate.age)
    expect(Array.isArray(result.current.errors)).toBe(true)
    expect(result.current.errors.length).toBe(0)
})

it('handleChange updates the the state correct.', () => {
    const initialValues = {
        name: 'test',
    }
    const newName = 'hook'
    const { result } = renderHook(() => useFormState(initialValues))
    expect(result.current.values.name).toBe(initialValues.name)
    expect(Array.isArray(result.current.errors)).toBe(true)
    expect(result.current.errors.length).toBe(0)
    act(() => {
        result.current.handleChange('name', newName)
    })
    expect(result.current.values.name).toBe(newName)
    expect(Array.isArray(result.current.errors)).toBe(true)
    expect(result.current.errors.length).toBe(0)
})

it('getInputProps return correct props.', () => {
    const initialValues = {
        name: 'test',
    }
    const newName = 'hook'
    const { result } = renderHook(() => useFormState(initialValues))
    const props = result.current.getInputProps('name')
    expect(props.value).toBe(initialValues.name)
    expect(props.hasError).toBe(false)
    expect(props.name).toBe('name')
    act(() => {
        props.onChange(newName)
    })
    const newProps = result.current.getInputProps('name')
    expect(newProps.value).toBe(newName)
    expect(newProps.hasError).toBe(false)
    expect(newProps.name).toBe('name')
})

it('getNativeInputProps return correct props for text input.', () => {
    const initialValues = {
        name: 'test',
    }
    const newName = 'hook'
    const { result } = renderHook(() => useFormState(initialValues))
    const props = result.current.getNativeInputProps('name')
    expect(props.value).toBe(initialValues.name)
    expect(props.hasError).toBe(false)
    expect(props.name).toBe('name')
    act(() => {
        props.onChange({
            target: {
                name: 'name',
                value: newName,
            },
        })
    })
    const newProps = result.current.getNativeInputProps('name')
    expect(newProps.value).toBe(newName)
    expect(newProps.hasError).toBe(false)
    expect(newProps.name).toBe('name')
})

it('calling handleChange twice updates the the state correct.', () => {
    const initialValues = {
        firstName: 'test',
        lastName: 'hook',
    }
    const newFirstName = 'testNew'
    const newLastName = 'hookNew'
    const { result } = renderHook(() => useFormState(initialValues))
    expect(result.current.values.firstName).toBe(initialValues.firstName)
    expect(result.current.values.lastName).toBe(initialValues.lastName)
    expect(Array.isArray(result.current.errors)).toBe(true)
    expect(result.current.errors.length).toBe(0)
    act(() => {
        result.current.handleChange('firstName', newFirstName)
        result.current.handleChange('lastName', newLastName)
    })
    expect(result.current.values.firstName).toBe(newFirstName)
    expect(result.current.values.lastName).toBe(newLastName)
    expect(Array.isArray(result.current.errors)).toBe(true)
    expect(result.current.errors.length).toBe(0)
})

it('validate makes the form dirty.', () => {
    const { result } = renderHook(() => useFormState())
    expect(result.current.isPristine).toBe(true)
    act(() => {
        result.current.validate()
    })
    expect(result.current.isPristine).toBe(false)
})

it('validate updates the state correctly.', () => {
    const weakPassword = 'password'
    const initialValues = {
        userName: '',
        password: weakPassword,
        repeatPassword: weakPassword,
    }
    const message = 'Invalid'
    const validation = createFormValidation([
        {
            path: 'userName',
            validate: (userName) => userName !== '',
            message,
        },
        {
            path: 'password',
            validate: (password) => password !== weakPassword,
            message,
        },
        {
            path: 'repeatPassword',
            validate: (repeatPassword, values) => repeatPassword !== values.password,
            message,
        },
    ])

    const { result } = renderHook(() => useFormState(initialValues, { validation }))
    expect(result.current.values.userName).toBe(initialValues.userName)
    expect(result.current.values.password).toBe(initialValues.password)
    expect(result.current.values.repeatPassword).toBe(initialValues.repeatPassword)
    expect(Array.isArray(result.current.errors)).toBe(true)
    expect(result.current.errors.length).toBe(0)
    act(() => {
        result.current.validate()
    })
    expect(Array.isArray(result.current.errors)).toBe(true)
    expect(result.current.errors.length).toBe(3)
    expect(result.current.errors).toContainObject({ path: 'userName', message })
    expect(result.current.errors).toContainObject({ path: 'password', message })
    expect(result.current.errors).toContainObject({ path: 'repeatPassword', message })
})

it('handleChange updates the the state correct when the form is dirty.', () => {
    const initialValues = {
        firstName: 'test',
        lastName: 'test',
    }
    const message = 'Invalid'
    const validation = createFormValidation([
        {
            path: 'firstName',
            validate: (firstName) => firstName !== null,
            message,
        },
    ])
    const { result } = renderHook(() => useFormState(initialValues, { validation }))
    expect(result.current.values.firstName).toBe(initialValues.firstName)
    expect(result.current.values.lastName).toBe(initialValues.lastName)
    expect(Array.isArray(result.current.errors)).toBe(true)
    expect(result.current.errors.length).toBe(0)
    act(() => {
        result.current.validate()
        result.current.handleChange('firstName', null)
    })
    expect(result.current.values.firstName).toBe(null)
    expect(result.current.values.lastName).toBe(initialValues.lastName)
    expect(Array.isArray(result.current.errors)).toBe(true)
    expect(result.current.errors.length).toBe(1)
    expect(result.current.errors).toContainObject({ path: 'firstName', message })
})

it('setValues updates the the state correct when the form is dirty.', () => {
    const initialValues = {
        firstName: 'test',
        lastName: 'form',
    }
    const valuesToUpdate = {
        firstName: null,
        lastName: 'new',
        age: 2,
    }
    const message = 'Invalid'
    const validation = createFormValidation([
        {
            path: 'firstName',
            validate: (firstName) => firstName !== null,
            message,
        },
    ])
    const { result } = renderHook(() => useFormState(initialValues, { validation }))
    expect(result.current.values.firstName).toBe(initialValues.firstName)
    expect(result.current.values.lastName).toBe(initialValues.lastName)
    expect(Array.isArray(result.current.errors)).toBe(true)
    expect(result.current.errors.length).toBe(0)
    act(() => {
        result.current.validate()
        result.current.setValues(valuesToUpdate)
    })
    expect(result.current.values.firstName).toBe(null)
    expect(result.current.values.lastName).toBe(valuesToUpdate.lastName)
    expect(result.current.values.age).toBe(valuesToUpdate.age)
    expect(Array.isArray(result.current.errors)).toBe(true)
    expect(result.current.errors.length).toBe(1)
    expect(result.current.errors).toContainObject({ path: 'firstName', message })
})

it('handleChange can update a nested object.', () => {
    const initialStreet = 'street'
    const initialValues = {
        addresses: [{
            street: initialStreet,
        }],
    }
    const newStreet = 'new street'
    const { result } = renderHook(() => useFormState(initialValues))
    expect(result.current.values.addresses[0].street).toBe(initialStreet)
    act(() => {
        result.current.handleChange('addresses.0.street', newStreet)
    })
    expect(result.current.values.addresses[0].street).toBe(newStreet)
})

it('validate can handle nested objects by composing validation functions.', () => {
    const initialValues = {
        name: '',
        addresses: [{
            street: '',
        }, {
            street: '',
        }],
    }
    const message = 'Invalid'

    const addressValidation = createFormValidation([{
        path: 'street',
        validate: (street) => street !== '',
        message,
    }])

    const validation = createFormValidation([
        {
            path: 'name',
            validate: (name) => name !== '',
            message,
        },
        {
            path: 'addresses',
            validation: mapFormValidation(addressValidation),
        },
    ])
    const { result } = (
        renderHook(() => useFormState(initialValues, { validation }))
    )
    expect(result.current.values.addresses).toStrictEqual(initialValues.addresses)
    expect(Array.isArray(result.current.errors)).toBe(true)
    expect(result.current.errors.length).toBe(0)
    act(() => {
        result.current.validate()
    })
    expect(Array.isArray(result.current.errors)).toBe(true)
    expect(result.current.errors.length).toBe(3)
    expect(result.current.errors).toContainObject({ path: 'name', message })
    expect(result.current.errors).toContainObject({ path: 'addresses.0.street', message })
    expect(result.current.errors).toContainObject({ path: 'addresses.1.street', message })
})

it('validate can handle nested objects using wildcards.', () => {
    const initialValues = {
        name: '',
        addresses: [{
            street: '',
        }, {
            street: '',
        }],
    }
    const message = 'Invalid'
    const validation = createFormValidation([
        {
            path: 'name',
            validate: (name) => name !== '',
            message,
        },
        {
            path: 'addresses.*.street',
            validate: (street) => street !== '',
            message,
        },
    ])
    const { result } = (
        renderHook(() => useFormState(initialValues, { validation }))
    )
    expect(result.current.values.addresses).toStrictEqual(initialValues.addresses)
    expect(Array.isArray(result.current.errors)).toBe(true)
    expect(result.current.errors.length).toBe(0)
    act(() => {
        result.current.validate()
    })
    expect(Array.isArray(result.current.errors)).toBe(true)
    expect(result.current.errors.length).toBe(3)
    expect(result.current.errors).toContainObject({ path: 'name', message })
    expect(result.current.errors).toContainObject({ path: 'addresses.0.street', message })
    expect(result.current.errors).toContainObject({ path: 'addresses.1.street', message })
})

it('validate can handle nested objects using createArrayFormValidation.', () => {
    const initialValues = {
        name: '',
        addresses: [{
            street: '',
        }, {
            street: '',
        }],
    }
    const message = 'Invalid'
    const validation = createFormValidation([
        {
            path: 'name',
            validate: (name) => name !== '',
            message,
        },
        {
            path: 'addresses',
            validation: createArrayFormValidation([{
                path: 'street',
                validate: (street) => street !== '',
                message,
            }]),
        },
    ])
    const { result } = (
        renderHook(() => useFormState(initialValues, { validation }))
    )
    expect(result.current.values.addresses).toStrictEqual(initialValues.addresses)
    expect(Array.isArray(result.current.errors)).toBe(true)
    expect(result.current.errors.length).toBe(0)
    act(() => {
        result.current.validate()
    })
    expect(Array.isArray(result.current.errors)).toBe(true)
    expect(result.current.errors.length).toBe(3)
    expect(result.current.errors).toContainObject({ path: 'name', message })
    expect(result.current.errors).toContainObject({ path: 'addresses.0.street', message })
    expect(result.current.errors).toContainObject({ path: 'addresses.1.street', message })
})

it('Validation can handle validationOption changes', () => {
    const useHookWithState = (initialValues, options) => {
        const [hasPartner, setHasPartner] = useState(true)
        const formState = useFormState(
            initialValues, {
            validationOptions: { hasPartner },
            ...options,
        },
            [hasPartner]
        )
        return {
            formState,
            hasPartner,
            setHasPartner,
        }
    }

    const initialValues = {
        name: 'test',
        partnerName: 'test',
    }
    const message = 'Invalid'
    const validation = createFormValidation([{
        path: 'name',
        validate: (name) => name !== '',
        message,
    }, {
        path: 'partnerName',
        validate: (partnerName, values, options) => (
            options.hasPartner === true
            && partnerName !== ''
        ),
        message,
    }])

    const { result } = (
        renderHook(() => useHookWithState(initialValues, { validation }))
    )

    expect(result.current.formState.values.name).toBe(initialValues.name)
    expect(result.current.formState.values.hasPartner).toBe(initialValues.hasPartner)
    expect(Array.isArray(result.current.formState.errors)).toBe(true)
    expect(result.current.formState.errors.length).toBe(0)
    act(() => {
        result.current.setHasPartner(false)
    })
    act(() => {
        result.current.formState.validate()
    })
    expect(result.current.formState.errors).toContainObject({ path: 'partnerName', message })
})

it('useFormState doesnt change the object reference from initialValues', () => {
    const initialValues = {
        user: {
            firstName: 'test',
            lastName: 'form',
            isPrimary: false,
        },
    }
    const { result } = renderHook(() => useFormState(initialValues))
    expect(result.current.values.user).toStrictEqual(initialValues.user)
    act(() => {
        result.current.handleChange('user', (user) => {
            const updatedUser = user
            updatedUser.isPrimary = true
            return updatedUser
        })
    })
    expect(initialValues.user.isPrimary).toEqual(false)
})

it('Validation can handle validation specified paths', () => {
    const initialValues = {
        name: 'test',
        addresses: [{
            street: '',
        }, {
            street: '',
        }],
    }
    const message = 'Invalid'
    const validation = createFormValidation([
        {
            path: 'name',
            validate: (name) => name !== '',
            message,
        },
        {
            path: 'addresses.*.street',
            validate: (street) => street !== '',
            message,
        },
    ])
    const { result } = (
        renderHook(() => useFormState(initialValues, { validation }))
    )
    act(() => {
        result.current.validate(['name'])
    })
    expect(result.current.errors.length).toBe(0)
})

it('Validation can handle validation specified paths to show error', () => {
    const initialValues = {
        name: '',
        addresses: [{
            street: '',
        }, {
            street: '',
        }],
    }
    const message = 'Invalid'
    const validation = createFormValidation([
        {
            path: 'name',
            validate: (name) => name !== '',
            message,
        },
        {
            path: 'addresses.*.street',
            validate: (street) => street !== '',
            message,
        },
    ])

    const { result } = (
        renderHook(() => useFormState(initialValues, { validation }))
    )

    act(() => {
        result.current.validate(['name'])
    })
    expect(Array.isArray(result.current.errors)).toBe(true)
    expect(result.current.errors).toContainObject({ path: 'name', message })
    expect(result.current.errors.length).toBe(1)
})

it('Validation can handle validation specified nested paths to show error', () => {
    const initialValues = {
        name: '',
        addresses: [{
            street: '',
        }, {
            street: '',
        }],
    }
    const message = 'Invalid'
    const validation = createFormValidation([
        {
            path: 'name',
            validate: (name) => name !== '',
            message,
        },
        {
            path: 'addresses.*.street',
            validate: (street) => street !== '',
            message,
        },
    ])

    const { result } = (
        renderHook(() => useFormState(initialValues, { validation }))
    )

    act(() => {
        result.current.validate(['name', 'addresses.*.street'])
    })
    expect(result.current.errors).toContainObject({ path: 'name', message })
    expect(result.current.errors).toContainObject({ path: 'addresses.0.street', message })
    expect(result.current.errors).toContainObject({ path: 'addresses.1.street', message })
    expect(result.current.errors.length).toBe(3)
})

it('Validation can handle validation specified nested paths to validate', () => {
    const initialValues = {
        name: 'test',
        addresses: [{
            street: 'test',
        }, {
            street: 'test',
        }],
    }
    const message = 'Invalid'
    const validation = createFormValidation([
        {
            path: 'name',
            validate: (name) => name !== '',
            message,
        },
        {
            path: 'addresses.*.street',
            validate: (street) => street !== '',
            message,
        },
    ])

    const { result } = (
        renderHook(() => useFormState(initialValues, { validation }))
    )

    act(() => {
        result.current.validate(['name', 'addresses.*.street'])
    })
    expect(result.current.errors.length).toBe(0)
})
