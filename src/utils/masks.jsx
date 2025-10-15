// src/utils/masks.js
export const maskCPF = (value) => {
  if (!value) return '';
  
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
};

export const maskCNPJ = (value) => {
  if (!value) return '';
  
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
};

export const maskTelefone = (value) => {
  if (!value) return '';
  
  value = value.replace(/\D/g, '');
  
  if (value.length <= 10) {
    return value
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  } else {
    return value
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  }
};

export const maskRG = (value) => {
  if (!value) return '';
  
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{1})\d+?$/, '$1');
};

export const removeMask = (value) => {
  return value ? value.replace(/\D/g, '') : '';
};

export const detectDocumentType = (value) => {
  const cleanValue = removeMask(value);
  
  if (cleanValue.length <= 11) {
    return 'CPF';
  } else {
    return 'RG';
  }
};

export const applyDocumentMask = (value) => {
  const cleanValue = removeMask(value);
  
  if (cleanValue.length <= 11) {
    return maskCPF(value);
  } else {
    return maskRG(value);
  }
};

export const formatCPF = (cpf) => {
  if (!cpf) return '';
  const cleanCPF = removeMask(cpf);
  if (cleanCPF.length !== 11) return cpf;
  
  return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};