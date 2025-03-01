export interface IbanInfo {
  formattedIban: string;
  country: string;
  countryCode: string;
  checkDigits: string;
  bankCode?: string;
  accountNumber: string;
  bic: string;
  bankName: string;
}