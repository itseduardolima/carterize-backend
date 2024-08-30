import { BadRequestException } from '@nestjs/common';
import { Validations } from './validations';

export class CreditCardValidate {
  private static instance: CreditCardValidate;

  public static getInstance(): CreditCardValidate {
    if (!CreditCardValidate.instance) {
      CreditCardValidate.instance = new CreditCardValidate();
    }
    return CreditCardValidate.instance;
  }

  private NO_SPECIAL_CHARACTER = /[!@#$%^&*(),.?":{}|<>]/;

  private validateNotEmpty(fieldName: string, value: string | number) {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      throw new BadRequestException(`O campo ${fieldName} não pode estar vazio!`);
    }
  }

  validateBankName(bankName: string) {
    this.validateNotEmpty('banco', bankName);
    Validations.getInstance().verifyLength('banco', bankName, 3, 50);

    if (this.validate(this.NO_SPECIAL_CHARACTER, bankName)) {
      throw new BadRequestException('O nome do banco não pode conter caracteres especiais!');
    }

    return bankName;
  }

  validateCardHolderName(cardHolderName: string) {
    this.validateNotEmpty('titular', cardHolderName);
    Validations.getInstance().verifyLength('titular', cardHolderName, 3, 50);

    if (this.validate(this.NO_SPECIAL_CHARACTER, cardHolderName)) {
      throw new BadRequestException('O nome do titular não pode conter caracteres especiais!');
    }

    return cardHolderName;
  }

  validateLastFourDigits(digits: string) {
    this.validateNotEmpty('últimos 4 dígitos', digits);
    if (!/^\d{4}$/.test(digits)) {
      throw new BadRequestException('Os últimos 4 dígitos do cartão devem conter exatamente 4 números!');
    }

    return digits;
  }

  validateCreditLimit(limit: number) {
    this.validateNotEmpty('limite de crédito', limit);
    if (limit <= 0) {
      throw new BadRequestException('O limite de crédito deve ser um valor positivo!');
    }

    return limit;
  }

  private validate(regex: RegExp, value: string): boolean {
    return regex.test(value);
  }
}