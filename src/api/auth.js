// auth.js (versión mock solo para login)

export const loginUser = async (email, password) => {
  // Simulación de retardo de red
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === "test@example.com" && password === "123456") {
        resolve({
          success: true,
          token: "fake_jwt_token_123456",
          user: {
            id: 1,
            email: "test@example.com",
            name: "Test User"
          }
        });
      } else {
        resolve({
          success: false,
          message: "Credenciales incorrectas"
        });
      }
    }, 1000); // simula una llamada de red
  });
};

// import { API_URL } from "../config";

// // Registro de usuario
// export const registerUser = async (email, password) => {
//   const response = await fetch(`${API_URL}/register.php`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ email, password }),
//   });

//   return await response.json();
// };

// // Login
// export const loginUser = async (email, password) => {
//   const response = await fetch(`${API_URL}/login.php`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     credentials: "include", // solo útil en web, pero lo dejamos como referencia
//     body: JSON.stringify({ email, password }),
//   });

//   return await response.json();
// };

// // Ver sesión activa
// export const checkSession = async () => {
//   const response = await fetch(`${API_URL}/session.php`, {
//     method: "GET",
//     credentials: "include",
//   });

//   return await response.json();
// };

// // Logout
// export const logoutUser = async () => {
//   const response = await fetch(`${API_URL}/logout.php`, {
//     method: "POST",
//     credentials: "include",
//   });

//   return await response.json();
// };
