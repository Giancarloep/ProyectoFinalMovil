//Como el nombre lo dice solo es para validar los textos como email, y telefono
export const isRequiredValid = (text: string): boolean => {
  return text.trim().length > 0;
};

export const isEmailValid = (email: string): boolean => {
  return email.includes('@') && email.includes('.');
};

export const isPhoneValid = (phone: string): boolean => {
  return phone.length >= 8 && phone.length <= 10;
};