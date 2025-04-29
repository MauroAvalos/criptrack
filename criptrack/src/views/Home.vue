<template>
  <div class="home">
    <div class="card">
      <h1>Bienvenido a Criptrack</h1>
      <p v-if="isAuthenticated">¡Hola, {{ username }}! Estás logueado.</p>
      <p v-else>Por favor, inicia sesión para continuar.</p>
    </div>
  </div>
</template>

<script>
import { user } from '../store/user';
import { useRouter } from 'vue-router';
import { computed } from 'vue';

export default {
  name: 'HomePage',
  setup() {
    const router = useRouter();

    const isAuthenticated = computed(() => user.isAuthenticated);
    const username = computed(() => `${user.nombre} ${user.apellido}`);

    const logout = () => {
      user.logout();
      router.push('/login');
    };

    return {
      isAuthenticated,
      username,
      logout,
    };
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

.home {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
  font-family: 'Poppins', sans-serif;
}

.card {
  background-color: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 40px;
  border-radius: 16px;
  text-align: center;
  color: #a0d5cf;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  max-width: 600px;
  width: 100%;
}

h1 {
  font-size: 2.2rem;
  margin-bottom: 20px;
  color: #4deeea;
}

p {
  font-size: 1.15rem;
  color: #a0d5cf;
  margin-top: 10px;
}

button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #4deeea;
  color: #1e1e1e;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #34d5d0;
}
</style>
