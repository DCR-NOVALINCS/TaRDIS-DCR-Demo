import { SnackMessage } from "../types/snackbar"

/**
 * Factory class for creating SnackMessage instances.
 */
export class SnackMessageFactory {
    private static instance: SnackMessageFactory;
    private constructor() { }

    /**
     * Returns the singleton instance of SnackMessageFactory.
     * @returns {SnackMessageFactory} The singleton instance.
     */
    public static getInstance(): SnackMessageFactory {
        if (!SnackMessageFactory.instance) {
            SnackMessageFactory.instance = new SnackMessageFactory();
        }
        return SnackMessageFactory.instance;
    }

    /**
     * Creates a successful SnackMessage with the provided message element.
     * @param {JSX.Element} messageElement - The message element to display.
     * @returns {SnackMessage} The created SnackMessage.
     */
    public success(messageElement: JSX.Element): SnackMessage {
        return { message: messageElement, type: 'success' };
    }

    /**
     * Creates an error SnackMessage with the provided message element.
     * @param {JSX.Element} messageElement - The message element to display.
     * @returns {SnackMessage} The created SnackMessage.
     */
    public error(messageElement: JSX.Element): SnackMessage {
        return { message: messageElement, type: 'error' };
    }
}

/* Error / Success messages */
// const errorMessage: (messageElement: JSX.Element) => SnackMessage
//     = (messageElement: JSX.Element) => ({ message: messageElement, type: 'error' })

// const successMessage: (messageElement: JSX.Element) => SnackMessage
//     = (messageElement: JSX.Element) => ({ message: messageElement, type: 'success' })

// export { errorMessage, successMessage }
// export type { SnackMessage }
