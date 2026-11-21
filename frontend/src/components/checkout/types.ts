import type { DeliveryAddress } from "@/types";

export type AddressTag = "Home" | "Work";

export interface SavedCheckoutAddress extends DeliveryAddress {
  id: string;
  addressType: AddressTag;
}

export type PaymentMethodId = "card" | "upi" | "cod";

export interface CardFormState {
  cardNumber: string;
  expiry: string;
  cvv: string;
  nameOnCard: string;
}

export type AddressFormErrors = Partial<
  Record<
    | "fullName"
    | "phoneNumber"
    | "houseNumber"
    | "streetName"
    | "city"
    | "state"
    | "pinCode",
    string
  >
>;

export type CardFormErrors = Partial<Record<keyof CardFormState, string>>;

export function validateAddressField(
  field: keyof AddressFormErrors,
  value: string
): string | undefined {
  const trimmed = value.trim();
  switch (field) {
    case "fullName":
      if (!trimmed) return "Full name is required.";
      if (trimmed.length < 2) return "Enter at least 2 characters.";
      return undefined;
    case "phoneNumber": {
      const digits = trimmed.replace(/\D/g, "");
      if (!digits) return "Phone number is required.";
      if (digits.length !== 10) return "Enter a valid 10-digit phone number.";
      return undefined;
    }
    case "houseNumber":
      if (!trimmed) return "Building / Suite is required.";
      return undefined;
    case "streetName":
      if (!trimmed) return "Street name is required.";
      return undefined;
    case "city":
      if (!trimmed) return "City is required.";
      return undefined;
    case "state":
      if (!trimmed) return "State is required.";
      return undefined;
    case "pinCode": {
      const digits = trimmed.replace(/\D/g, "");
      if (!digits) return "PIN code is required.";
      if (digits.length !== 6) return "Enter a valid 6-digit PIN code.";
      return undefined;
    }
    default:
      return undefined;
  }
}

export function validateAddressForm(
  address: Omit<SavedCheckoutAddress, "id">
): AddressFormErrors {
  const fields: (keyof AddressFormErrors)[] = [
    "fullName",
    "phoneNumber",
    "houseNumber",
    "streetName",
    "city",
    "state",
    "pinCode",
  ];
  const errors: AddressFormErrors = {};
  for (const field of fields) {
    const err = validateAddressField(field, address[field] ?? "");
    if (err) errors[field] = err;
  }
  return errors;
}

export function formatCardNumber(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
}

export function formatExpiry(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export function validateCardField(
  field: keyof CardFormState,
  value: string
): string | undefined {
  const trimmed = value.trim();
  switch (field) {
    case "cardNumber": {
      const digits = trimmed.replace(/\D/g, "");
      if (!digits) return "Card number is required.";
      if (digits.length < 15 || digits.length > 16)
        return "Enter a valid 15 or 16-digit card number.";
      return undefined;
    }
    case "expiry": {
      if (!trimmed) return "Expiry date is required.";
      const match = /^(\d{2})\/(\d{2})$/.exec(trimmed);
      if (!match) return "Use MM/YY format.";
      const month = Number(match[1]);
      if (month < 1 || month > 12) return "Enter a valid month (01–12).";
      return undefined;
    }
    case "cvv": {
      const digits = trimmed.replace(/\D/g, "");
      if (!digits) return "CVV is required.";
      if (digits.length < 3 || digits.length > 4)
        return "Enter a 3 or 4-digit CVV.";
      return undefined;
    }
    case "nameOnCard":
      if (!trimmed) return "Name on card is required.";
      if (trimmed.length < 2) return "Enter the cardholder name.";
      return undefined;
    default:
      return undefined;
  }
}

export function validateCardForm(card: CardFormState): CardFormErrors {
  const errors: CardFormErrors = {};
  (Object.keys(card) as (keyof CardFormState)[]).forEach((field) => {
    const err = validateCardField(field, card[field]);
    if (err) errors[field] = err;
  });
  return errors;
}

export function validateUpiId(upiId: string): string | undefined {
  const trimmed = upiId.trim();
  if (!trimmed) return "UPI ID is required.";
  if (!/^[a-zA-Z0-9._-]{2,}@[a-zA-Z]{2,}$/.test(trimmed)) {
    return "Enter a valid UPI ID (e.g., name@bank).";
  }
  return undefined;
}
