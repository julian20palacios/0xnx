export const getTutorialesPath = (role) => {
  if (role === "admin") return "/admin/tutoriales";
  if (role === "user") return "/user/tutoriales";
  return null;
};

export const getCalificarPath = (role) => {
  return null;
};

export const getProgresoPath = (role) => {
  return null;
};
