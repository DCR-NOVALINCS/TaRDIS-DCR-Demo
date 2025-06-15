type SnackMessage = {
    message: JSX.Element,
    type: 'error' | 'info' | 'success' | 'warning'
}

/* Error / Success messages */
const errorMessage: (messageElement: JSX.Element) => SnackMessage
    = (messageElement: JSX.Element) => ({ message: messageElement, type: 'error' })

const successMessage: (messageElement: JSX.Element) => SnackMessage
    = (messageElement: JSX.Element) => ({ message: messageElement, type: 'success' })

export { errorMessage, successMessage }
export type { SnackMessage }
