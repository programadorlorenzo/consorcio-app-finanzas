// Función para convertir guiones bajos en espacios y capitalizar
export const formatDisplayText = (text: string) => {
  if (!text) return text;
  return text
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase());
};
