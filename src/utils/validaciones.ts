export const validaciones = {
    requerido: (v: string) => !!v || 'Este campo es obligatorio',
  
    correo: (v: string) =>
      /.+@.+\..+/.test(v) || 'Correo electrónico inválido',
  }
  