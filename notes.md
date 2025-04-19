# Estados de la Mascota Tontisima

```mermaid
graph TD
    Inicio[**Inicio**] -->|felicidad > 50| Feliz[**Feliz:** La mascota está contenta y activa.]
    Inicio -->|hambre > 70| Hambriento[**Hambriento:** La mascota necesita comida.]
    Inicio -->|energia == 0| Cansado[**Cansado:** La mascota necesita descansar.]
    Inicio -->|salud < 50| Enfermo[**Enfermo:** La mascota está enferma y necesita cuidados.]
    
    Feliz -->|felicidad < 30| Aburrido[**Aburrido:** La mascota necesita atención o entretenimiento.]
    Aburrido -->|hambre > 70| Hambriento
    Hambriento -->|energia == 0| Cansado
    Cansado -->|descansar| Dormido[**Dormido:** La mascota está recuperando energía.]
    Dormido -->|energia == 100| Feliz
    
    Enfermo -->|tratamiento exitoso| Recuperado[**Recuperado:** La mascota se ha curado y vuelve a estar feliz.]
    Recuperado --> Feliz
```
