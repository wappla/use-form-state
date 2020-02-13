import { useReducer } from 'react'
import dotProp from 'dot-prop-immutable'
import clonedeep from 'lodash.clonedeep'
import useDeepCompareEffect from 'use-deep-compare-effect'
import { containsNoErrors } from './utils'

const INITIAL_STATE = {
    values: {},
    errors: [],
    isDirty: false,
    isPristine: true,
    isValid: false,
}

const SET_STATE = 'SET_STATE'
const SET_VALUE = 'SET_VALUE'
const UPDATE_VALUES = 'UPDATE_VALUES'
const UPDATE_ERRORS = 'UPDATE_ERRORS'
const VALIDATE = 'VALIDATE'
const RESET_FORM = 'RESET_FORM'

const reducer = (state, action) => {
    const {
        validation,
        validationOptions,
    } = state
    switch (action.type) {
        case SET_VALUE: {
            const { key, value } = action
            let newState = dotProp.set(state, `values.${key}`, value)
            if (!newState.isPristine) {
                const newErrors = validation(newState.values, validationOptions)
                newState = dotProp.set(newState, 'errors', newErrors)
            }
            return {
                ...newState,
                isDirty: true,
            }
        }
        case UPDATE_VALUES: {
            const { values } = action
            const newValues = {
                ...state.values,
                ...values,
            }
            let newState = dotProp.set(state, 'values', newValues)
            let newErrors = []

            if (!state.isPristine) {
                newErrors = validation(newState.values, validationOptions)
            }
            newState = dotProp.set(newState, 'errors', newErrors)
            return {
                ...newState,
                isDirty: true,
            }
        }
        case UPDATE_ERRORS: {
            const { errors } = action
            return dotProp.set(state, 'errors', errors)
        }
        case VALIDATE: {
            const errors = validation(state.values, validationOptions)
            const isValid = containsNoErrors(errors)
            return {
                ...state,
                isPristine: false,
                isValid,
                errors,
            }
        }
        case RESET_FORM: {
            const { initialValues, initialValidation } = action
            const errors = []
            return {
                ...INITIAL_STATE,
                values: initialValues,
                validation: initialValidation,
                errors,
            }
        }
        case SET_STATE: {
            return action.state
        }
        default:
            throw new Error(`Unknown form state action '${action.type}'.`)
    }
}

const useFormState = (
    initialValues = {},
    options = {}
) => {
    const {
        validation = () => [],
        validationOptions,
        valuesToInput,
        debug = false,
    } = options

    const initialState = {
        ...INITIAL_STATE,
        values: initialValues,
        validation,
        validationOptions,
    }
    const [state, dispatch] = useReducer(reducer, initialState)
    useDeepCompareEffect(() => {
        const initialValuesClone = clonedeep(initialValues)
        dispatch({
            type: SET_STATE,
            state: {
                ...INITIAL_STATE,
                values: initialValuesClone,
                validation,
                validationOptions,
            },
        })
    }, [initialValues, validationOptions])


    if (debug) {
        // eslint-disable-next-line no-console
        console.log(state)
    }

    const resetForm = () => {
        dispatch({
            type: RESET_FORM,
            initialValues,
            initialValidation: validation,
            initialValidationOptions: validationOptions,
            errors: [],
        })
    }

    const setErrors = (errors) => {
        dispatch({
            type: UPDATE_ERRORS,
            errors,
        })
    }

    const setValues = (values) => {
        dispatch({
            type: UPDATE_VALUES,
            values,
        })
    }

    const setValue = (key, value) => {
        dispatch({
            type: SET_VALUE,
            key,
            value,
        })
    }

    const handleNativeChange = (e) => {
        const {
            name, type, value, checked, files,
        } = e.target
        let finalValue = value
        if (type === 'checkbox') {
            finalValue = checked
        } else if (type === 'file') {
            [finalValue] = files
        }
        setValue(name, finalValue)
    }

    const validate = () => {
        const errors = validation(state.values, validationOptions)
        const isValid = containsNoErrors(errors)
        dispatch({
            type: VALIDATE,
        })
        return isValid
    }

    const getValue = (path) => dotProp.get(state.values, path, '')

    const getErrorMessages = (path) => (
        state.errors
            .filter((error) => error.path === path)
            .map(({ message }) => message)
    )

    const hasError = (path) => (
        typeof state.errors.find((error) => error.path === path) !== 'undefined'
    )

    const getNativeInputProps = (path) => ({
        value: getValue(path),
        hasError: hasError(path),
        onChange: handleNativeChange,
        name: path,
    })

    const getInputProps = (path) => ({
        value: getValue(path),
        hasError: hasError(path),
        onChange: (value) => setValue(path, value),
        name: path,
    })

    return {
        errors: state.errors,
        values: state.values,
        isDirty: state.isDirty,
        isValid: state.isValid,
        isPristine: state.isPristine,
        setValues,
        handleChange: setValue,
        handleNativeChange,
        validate,
        updateErrors: setErrors,
        resetForm,
        getInputProps,
        getNativeInputProps,
        valuesToInput: () => valuesToInput(state.values),
        getValue,
        getErrorMessages,
        hasError,
    }
}

export default useFormState
