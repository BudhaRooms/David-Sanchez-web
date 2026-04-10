export type Database = {
  public: {
    Tables: {
      apartamentos: {
        Row: {
          id: string
          nombre: string
          ubicacion: string
          imagen_url: string | null
          created_at: string
        }
      }
      habitaciones: {
        Row: {
          id: string
          id_apartamento: string
          nombre: string
          atributos: string[]
          imagen_url: string | null
          video_url: string | null
          created_at: string
        }
      }
    }
  }
}
