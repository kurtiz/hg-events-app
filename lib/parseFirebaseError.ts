export const parseFirebaseError = (errorCode: string): string => {
    const errorMessages: { [key: string]: string } = {
        'auth/email-already-in-use': 'This email is already in use. Please try logging in or use another email.',
        'auth/invalid-email': 'The email address is invalid. Please check and try again.',
        'auth/weak-password': 'The password is too weak. Please use a stronger password.',
        'auth/operation-not-allowed': 'This operation is not allowed. Please contact support.',
        'auth/user-disabled': 'This account has been disabled. Please contact support.',
        'auth/network-request-failed': 'Network error. Please check your internet connection and try again.',
        'auth/invalid-credential': 'Invalid credentials, please check and try again.',
        'auth/user-not-found': 'No user found with this email. Please check and try again.',
        'auth/wrong-password': 'Incorrect password. Please check and try again.',
        'auth/too-many-requests': 'Too many requests. Please try again later.',
        'auth/account-exists-with-different-credential': 'An account already exists with the same email but different sign-in credentials.',
    };

    // Strip the prefix "Firebase: Error ()" and trim the error code for cleaner matching
    const cleanErrorCode = errorCode.replace('Firebase: Error (', '').replace(').', '').trim();

    return errorMessages[cleanErrorCode] || 'An unexpected error occurred. Please try again later.';
};
