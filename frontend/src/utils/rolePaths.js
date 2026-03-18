export const getTutorialesPath = (role) => {
  if (role === "admin") return "/admin/tutoriales";
  if (role === "user") return "/tutoriales/categorias/general";
  return null;
};

export const getCalificarPath = (role) => {
  return null;
};

export const getProgresoPath = (role) => {
  return null;
};
