<template>
  <v-container class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card elevation="8">
          <v-card-title class="text-h5 text-center"> !Hola¡ Crea una cuenta</v-card-title>
          <v-card-text>
            <v-form v-model="valid">
              <v-text-field
                v-model="nombre"
                label="Nombre"
                :rules="[rules.requerido]"
                required
              />
              <v-text-field
                v-model="correo"
                label="Correo"
                :rules="[rules.requerido, rules.correo]"
                required
              />
              <v-text-field
                v-model="password"
                label="Contraseña"
                type="password"
                :rules="[rules.requerido]"
                required
              />

              <v-btn
                class="mt-4"
                color="primary"
                block
                :loading="loading"
                :disabled="!valid"
                @click="register"
              >
                Registrarse
              </v-btn>

              <v-alert type="error" v-if="error" class="mt-4">
                {{ error }}
              </v-alert>

              <v-alert type="success" v-if="success" class="mt-4">
                {{ success }}
              </v-alert>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import api from '@/api/back'
  import { validaciones as rules } from '@/utils/validaciones'
  
  const nombre = ref('')
  const correo = ref('')
  const password = ref('')
  const loading = ref(false)
  const error = ref('')
  const success = ref('')
  const valid = ref(false)
  const router = useRouter()
  
  async function register() {
    error.value = ''
    success.value = ''
    loading.value = true
  
    try {
      await api.post('/api/users', {
        name: nombre.value,
        email: correo.value,
        password: password.value,
      })
  
      success.value = 'Usuario creado correctamente. Redirigiendo...'
      setTimeout(() => {
        router.push('/')
      }, 2000)
    } catch (e: any) {
      error.value = e.response?.data?.error || 'Error al registrar usuario'
    } finally {
      loading.value = false
    }
  }
  </script>
  