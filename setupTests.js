/* eslint-disable no-console */
import '@testing-library/jest-dom/extend-expect'

// TODO https://github.com/testing-library/react-testing-library/issues/281#issuecomment-480349256
const originalError = console.error
beforeAll(() => {
    expect.extend({
        toContainObject(received, argument) {
            const pass = this.equals(received,
                expect.arrayContaining([
                    expect.objectContaining(argument),
                ]))

            if (pass) {
                return {
                    message: () => (`expected ${this.utils.printReceived(received)} not to contain object ${this.utils.printExpected(argument)}`),
                    pass: true,
                }
            }
            return {
                message: () => (`expected ${this.utils.printReceived(received)} to contain object ${this.utils.printExpected(argument)}`),
                pass: false,
            }
        },
    })

    console.error = (...args) => {
        if (/Warning.*not wrapped in act/.test(args[0])) {
            return
        }
        originalError.call(console, ...args)
    }
})

afterAll(() => {
    console.error = originalError
})

const toContainObject = (received, argument) => {
    const pass = this.equals(received,
        expect.arrayContaining([
            expect.objectContaining(argument),
        ]))

    if (pass) {
        return {
            message: () => (`expected ${this.utils.printReceived(received)} not to contain object ${this.utils.printExpected(argument)}`),
            pass: true,
        }
    }
    return {
        message: () => (`expected ${this.utils.printReceived(received)} to contain object ${this.utils.printExpected(argument)}`),
        pass: false,
    }
}

expect.extend({ toContainObject })
