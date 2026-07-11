export async function loginUser(email: string) {
  // Simulación de POST al servidor para auth
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        user: {
          id: '123',
          name: 'Demo Kinti',
          email,
        },
      });
    }, 1000);
  });
}
