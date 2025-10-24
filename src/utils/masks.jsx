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
  
  // Remove tudo que não é dígito
  const cleanValue = value.replace(/\D/g, '');
  
  // Aplica a máscara baseada no tamanho
  // Formato: 000.000.000-0 (9-10 dígitos)
  if (cleanValue.length <= 3) {
    return cleanValue;
  } else if (cleanValue.length <= 6) {
    return cleanValue.replace(/(\d{3})(\d{0,3})/, '$1.$2');
  } else if (cleanValue.length <= 9) {
    return cleanValue.replace(/(\d{3})(\d{3})(\d{0,3})/, '$1.$2.$3');
  } else {
    return cleanValue.replace(/(\d{3})(\d{3})(\d{3})(\d{0,1})/, '$1.$2.$3-$4');
  }
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

// 🆕 NOVA FUNÇÃO: Formata CNPJ
export const formatCNPJ = (cnpj) => {
  if (!cnpj) return '';
  const cleanCNPJ = removeMask(cnpj);
  if (cleanCNPJ.length !== 14) return cnpj;
  
  return cleanCNPJ.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
};


export const formatRG = (rg) => {
  if (!rg) return '';
  const cleanRG = removeMask(rg);
  
  if (cleanRG.length <= 3) {
    return cleanRG;
  } else if (cleanRG.length <= 6) {
    return cleanRG.replace(/(\d{3})(\d{0,3})/, '$1.$2');
  } else if (cleanRG.length <= 9) {
    return cleanRG.replace(/(\d{3})(\d{3})(\d{0,3})/, '$1.$2.$3');
  } else {
    return cleanRG.replace(/(\d{3})(\d{3})(\d{3})(\d{0,1})/, '$1.$2.$3-$4');
  }
};

// 🆕 FUNÇÃO UNIVERSAL: Detecta e formata automaticamente
export const formatDocument = (document) => {
  if (!document) return '';
  
  const cleanDoc = removeMask(document);
  
  if (cleanDoc.length === 11) {
    return formatCPF(document);
  } else if (cleanDoc.length === 14) {
    return formatCNPJ(document);
  }
  
  return document;
};

// 🆕 FUNÇÃO: Valida formato de CNPJ
export const isValidCNPJ = (cnpj) => {
  if (!cnpj) return false;
  const cleanCNPJ = removeMask(cnpj);
  return cleanCNPJ.length === 14;
};

// 🆕 FUNÇÃO: Valida formato de CPF
export const isValidCPF = (cpf) => {
  if (!cpf) return false;
  const cleanCPF = removeMask(cpf);
  return cleanCPF.length === 11;
};

// Função existente para telefone
export const formatTelefone = (telefone) => {
  if (!telefone) return '';
  const cleanTel = removeMask(telefone);
  
  if (cleanTel.length === 11) {
    return cleanTel.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (cleanTel.length === 10) {
    return cleanTel.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  
  return telefone;
};