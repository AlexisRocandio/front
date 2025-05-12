<template>
    <v-container class="fill-height">
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="6" lg="4">
          <v-card elevation="8">
            <v-card-title class="text-h5 text-center">Iniciar sesión</v-card-title>
            <v-card-text>
              <v-form v-model="formValido" ref="formRef">
                <v-text-field
                  v-model="email"
                  label="Correo"
                  :rules="[validaciones.requerido, validaciones.correo]"
                  prepend-inner-icon="mdi-email"
                  type="email"
                />
  
                <v-text-field
                  v-model="password"
                  label="Contraseña"
                  :rules="[validaciones.requerido]"
                  prepend-inner-icon="mdi-lock"
                  :type="mostrar ? 'text' : 'password'"
                  :append-inner-icon="mostrar ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append-inner="mostrar = !mostrar"
                />
  
                <v-btn
                  block
                  class="mt-4"
                  color="primary"
                  @click="login"
                  :loading="loading"
                  :disabled="loading || !formValido"
                >
                  Ingresar
                </v-btn>
  
                <v-alert
                  type="error"
                  v-if="error"
                  class="mt-4"
                  border="start"
                  prominent
                >
                  {{ error }}
                </v-alert>
              </v-form>
            </v-card-text>
            <v-card-actions class="justify-center mt-2">
              <v-btn text @click="router.push('/registro')">
                ¿No tienes cuenta? Regístrate
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import api from '@/api/back'
import { validaciones } from '@/utils/validaciones'

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const mostrar = ref(false)
const formValido = ref(false)
const formRef = ref(null)
const router = useRouter()

async function login() {
  error.value = ''
  const valid = await formRef.value?.validate()

  if (!valid) return

  loading.value = true

  try {
    const { data } = await api.post('/api/login', {
      email: email.value,
      password: password.value,
    })

    localStorage.setItem('user', JSON.stringify(data.user))
    router.push('/users')
  } catch (e) {
    if (axios.isAxiosError(e) && e.response) {
      const status = e.response.status
      const message = e.response.data?.error || 'Error inesperado'

      switch (status) {
        case 400:
          error.value = 'Faltan datos: ' + message
          break
        case 401:
          error.value = 'Correo o contraseña incorrectos'
          break
        case 403:
          error.value = 'Acceso denegado'
          break
        case 404:
          error.value = 'Recurso no encontrado'
          break
        case 500:
          error.value = 'Error interno del servidor'
          break
        default:
          error.value = `Error inesperado (${status}): ${message}`
      }
    } else {
      error.value = 'Error de red o desconocido'
    }
  } finally {
    loading.value = false
  }
}
</script>
