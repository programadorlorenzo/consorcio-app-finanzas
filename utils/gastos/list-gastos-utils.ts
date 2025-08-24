// Función para obtener el color del estado
export const getEstadoColor = (estado: string): string => {
  switch (estado) {
    case "PENDIENTE":
      return "#F39C12";
    case "FINALIZADO":
      return "#27AE60";
    case "RECHAZADO":
      return "#E74C3C";
    default:
      return "#95A5A6";
  }
};
