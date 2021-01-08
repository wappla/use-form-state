import dotProp from 'dot-prop-immutable'
import { flatten } from './utils'

const DEFAULT_MESSAGE = 'Invalid'

const isArray = (value) => (
    value
    && typeof value === 'object'
    && value.constructor === Array
)

const composeFullPath = (path, parentPath) => {
    if (typeof parentPath === 'undefined') {
        return path
    }
    return `${parentPath}.${path}`
}

export function createFieldValidation(
    validate,
    message,
    defaultMessage = DEFAULT_MESSAGE
) {
    return (path, values, options, parentPath) => {
        if (path.includes('*')) {
            const pathParts = path.split('.*.')
            const [rootPart] = pathParts
            const rootValue = dotProp.get(values, rootPart)
            return rootValue
                .map((nestedValues, i) => {
                    const validation = createFieldValidation(validate, message, defaultMessage)
                    return validation(
                        pathParts[1],
                        nestedValues,
                        options,
                        `${rootPart}.${i}`
                    )
                })
                .reduce(flatten, [])
        }
        const value = dotProp.get(values, path)
        if (typeof value !== 'undefined' && !validate(value, values, options)) {
            let finalMessage = defaultMessage
            if (typeof message === 'function') {
                finalMessage = message(value, values, options)
            }
            if (typeof message !== 'undefined') {
                finalMessage = message
            }
            return [{
                path: composeFullPath(path, parentPath),
                message: finalMessage,
            }]
        }
        return []
    }
}

export function createValidationRules(formRules, defaultMessage) {
    return formRules.map((rule) => {
        let { validation } = rule
        if (typeof validation === 'undefined') {
            validation = createFieldValidation(
                rule.validate,
                rule.message,
                defaultMessage
            )
        }
        return {
            path: rule.path,
            validation,
        }
    })
}

export default function createFormValidation(
    formRules,
    defaultMessage
) {
    const validationRules = createValidationRules(formRules, defaultMessage)
    return (values, options, parentPath) => (
        validationRules
            .map((rule) => {
                const messages = rule.validation(rule.path, values, options, parentPath)
                if (!isArray(messages)) {
                    throw Error('A validation function must return an array of messages.')
                }
                return messages
            })
            .reduce(flatten, [])
    )
}

export function mapFormValidation(formValidation) {
    return (path, values, options, parentPath) => {
        const value = dotProp.get(values, path)
        return (
            value
                .map((childValues, i) => (
                    formValidation(
                        childValues,
                        options,
                        composeFullPath(`${path}.${i}`, parentPath)
                    )
                ))
                .reduce(flatten, [])
        )
    }
}

export function nestFormValidation(formValidation) {
    return (path, value, otherValues, options) => formValidation(value, options, path)
}

export function createArrayFormValidation(formRules, defaultMessage) {
    return mapFormValidation(createFormValidation(formRules, defaultMessage))
}

export function createNestedFormValidation(formRules, defaultMessage) {
    return nestFormValidation(createFormValidation(formRules, defaultMessage))
}
