/**
 * GemIInI SudaGene Platform - API Database Contracts
 * Strictly aligns frontend payloads with Google Apps Script (Code.gs) & PocketBase schemas.
 */

export const ACTION_TYPES = {
    BLS_REGISTER: 'bls_register',
    LOOKUP_MEMBER: 'lookup_member',
    VERIFY_ID: 'verify_id',
    CONFIRM_PAYMENT: 'confirm_payment'
};

export const CONTRACT_KEYS = {
    FULL_NAME: 'fullName',
    EMAIL: 'email',
    PHONE: 'phone',
    UNIVERSITY: 'university',
    GRAD_YEAR: 'gradYear',
    LOCATION: 'location',
    TRACK: 'track',
    PAYMENT_METHOD: 'paymentMethod',
    FEE_AMOUNT: 'feeAmount',
    PROVIDER_REF: 'providerRef',
    REFERRAL_ID: 'referralId',
    GP_AWARDED: 'gpAwarded',
    IDEMPOTENCY_KEY: 'idempotencyKey'
};

/**
 * Standardize intake payload into the canonical contract
 */
export function buildRegistrationPayload(raw) {
    return {
        action: ACTION_TYPES.BLS_REGISTER,
        fullName: String(raw.fullName || '').trim(),
        email: String(raw.email || '').trim().toLowerCase(),
        phone: String(raw.phone || '').trim(),
        university: String(raw.university || 'General Registry').trim(),
        gradYear: String(raw.gradYear || '2024'),
        location: String(raw.location || 'Egypt'),
        track: String(raw.track || 'SMC'),
        paymentMethod: String(raw.paymentMethod || 'VODAFONE'),
        feeAmount: Number(raw.feeAmount || 3000),
        providerRef: String(raw.providerRef || '').trim(),
        referralId: String(raw.referralId || 'GA-000').trim().toUpperCase(),
        gpAwarded: Number(raw.gpAwarded || 200),
        idempotencyKey: String(raw.idempotencyKey || `IDEM-${Date.now()}`),
        timestamp: new Date().toISOString()
    };
}
