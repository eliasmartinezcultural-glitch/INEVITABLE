# INEVITABLE — GAME DESIGN DOCUMENT 1.0

## 1. Visión

**INEVITABLE** es un city-builder histórico y narrativo de escala territorial. El jugador no “crea” la historia de San Patricio del Chañar desde cero: participa en una simulación alternativa de su transformación, mientras los acontecimientos documentados permanecen como hitos fijos.

### Fantasía del jugador

> “Estoy viendo cómo una tierra productiva se convierte, con decisiones humanas, en una localidad.”

### Bucle principal

**DECISIÓN → CONSECUENCIA → CAMBIO DEL TERRITORIO → NUEVA NECESIDAD → MISIÓN → NUEVA DECISIÓN**

## 2. Pilares

### P1 — Territorio primero
El mapa es el escenario y el sistema. Agua, caminos, parcelas, viviendas e infraestructura deben ser visibles.

### P2 — Historia responsable
Un hecho documentado nunca se transforma en ficción. Toda alternativa del jugador se marca como hipotética.

### P3 — Las personas importan
La población no es solamente un contador. Familias, trabajo, vivienda, acceso y necesidades generan presión sobre el territorio.

### P4 — Decisiones con memoria
Una decisión tomada décadas atrás puede producir una consecuencia mucho después.

### P5 — Crecimiento orgánico
La localidad crece alrededor de necesidades, conexiones y oportunidades, no alrededor de una cuadrícula obligatoria.

### P6 — Complejidad oculta
El motor puede ser profundo, pero la interfaz debe ser simple.

## 3. Referentes mecánicos

### Foundation
Referencia para urbanismo orgánico, caminos naturales, aldeanos, construcción modular y cadenas productivas.

### Banished
Referencia para población, familias, trabajos, necesidades y supervivencia comunitaria.

### Anno
Referencia para cadenas de producción, transformación y necesidades de población.

### Frostpunk
Referencia para decisiones con costos reales y dilemas.

### Workers & Resources
Referencia para infraestructura física, logística y relaciones entre producción, transporte y servicios.

### Against the Storm
Referencia para misiones, objetivos, eventos y presión de corto plazo.

**Regla:** se toman principios de diseño, nunca estética, contenido ni identidad narrativa.

## 4. Estructura temporal

### Prólogo
**Antes del pueblo**

El jugador conoce el territorio.

### Capítulo 1
**1966 — La tierra cambia de escala**

Primeras transformaciones documentadas.

### Capítulo 2
**1968–1971 — Agua y producción**

Riego, sistematización, parcelas y producción.

### Capítulo 3
**1973 — Nace la localidad**

Hito histórico fijo: 21 de mayo de 1973.

### Capítulo 4
**1974 — Primeras estructuras**

Institucionalización y organización inicial.

### Capítulo 5
**1975–1979 — Consolidar**

Crecimiento, infraestructura y cambios regionales.

### Capítulo 6
**Década de 1980**

Se investigará antes de fijar eventos específicos.

### Capítulo 7
**Década de 1990**

Expansión productiva y urbana; investigación documental pendiente.

### Capítulo 8
**2000–2010**

Crecimiento urbano y planificación.

### Capítulo 9
**2010–2019**

Nueva escala territorial e infraestructura.

### Capítulo 10
**2020–2026**

Presiones contemporáneas, vivienda, expansión y planificación.

### Epílogo
**2026 — El pueblo que construiste**

## 5. Modelo de historia

Cada acontecimiento del motor tiene:

- year
- title
- status
- source
- description
- gameImpact
- playerInfluence

Valores de status:

- historical
- simulation
- hypothetical

### Regla de presentación

**HISTÓRICO:** “Esto ocurrió.”

**HIPOTÉTICO:** “En esta partida ocurrió esta alternativa.”

**SIMULACIÓN:** “El sistema modela esta consecuencia.”

## 6. Territorio

El mapa se divide conceptualmente en:

- río
- monte
- suelo productivo
- áreas de riego
- parcelas
- corredores de circulación
- área de asentamiento
- expansión urbana
- infraestructura

No se afirma precisión catastral en el mapa de juego salvo que exista una fuente específica.

### Capas

1. Terreno
2. Agua
3. Producción
4. Caminos
5. Vivienda
6. Servicios
7. Infraestructura
8. Población

## 7. Agua

El agua es infraestructura, no una moneda.

Cadena:

**CAPTACIÓN → CONDUCCIÓN → DISTRIBUCIÓN → PARCELA → PRODUCCIÓN → DRENAJE**

Variables:

- capacidad
- cobertura
- mantenimiento
- demanda
- pérdidas
- disponibilidad
- presión productiva

Un canal nuevo modifica físicamente el mapa.

## 8. Producción

Primera versión: sistema deliberadamente pequeño.

Recursos:

- agua
- alimentos
- madera
- materiales
- producción agrícola
- dinero
- trabajadores

Cadena:

**TIERRA → PRODUCCIÓN → COSECHA → ALMACENAMIENTO → TRANSPORTE → COMERCIO**

Las cadenas se ampliarán solo cuando la investigación histórica justifique nuevos elementos.

## 9. Población

La población se simula en dos escalas.

### Población agregada
Para rendimiento y comportamiento general.

### Agentes representativos
Familias y personajes visibles que permiten contar historias.

Cada familia puede tener:

- integrantes
- edades
- vivienda
- trabajo
- ingresos
- necesidades
- satisfacción
- trayectoria

No se simula individualmente cada habitante de una ciudad grande.

## 10. Familias

Una familia genera presión territorial.

Ejemplo:

**Familia Pérez**

- 4 integrantes
- 2 trabajadores
- 1 niño
- 1 adulto mayor
- vivienda
- trabajo agrícola
- acceso al camino
- necesidad futura de servicios

Las familias pueden:

- crecer
- mudarse
- cambiar de trabajo
- sufrir falta de vivienda
- beneficiarse de nueva infraestructura
- abandonar determinadas zonas si el sistema se vuelve inviable

## 11. Personajes

Los personajes importantes representan tensiones, no simples decoraciones.

Arquetipos iniciales:

- productor
- trabajador rural
- organizador comunitario
- técnico
- comerciante
- educador
- constructor
- autoridad institucional

Los personajes históricos reales solo se incorporarán con documentación suficiente.

## 12. Vivienda

Estados:

**NECESIDAD → LOTE → PLAN → OBRA → CASA → HOGAR**

Variables:

- capacidad
- acceso
- servicios
- proximidad al trabajo
- calidad
- costo

La vivienda debe reaccionar al crecimiento poblacional.

## 13. Caminos

Los caminos tienen una característica especial:

### deseo de circulación

Las personas generan rutas entre:

- casa
- trabajo
- servicios
- comercio

Una ruta usada repetidamente puede convertirse en sendero y luego en camino consolidado.

Esto produce crecimiento orgánico.

## 14. Infraestructura

Cada obra tiene:

1. planificación
2. materiales
3. mano de obra
4. construcción
5. puesta en servicio
6. mantenimiento

La infraestructura nunca es solamente un botón.

## 15. Economía

Variables principales:

- tesorería
- costo de construcción
- producción
- comercio
- mantenimiento
- inversión
- reservas

Regla:

> Crecer rápido genera capacidad, pero también obligaciones.

## 16. Confianza comunitaria

Nueva variable estratégica.

La confianza mide cómo las decisiones afectan la cohesión social.

Sube con:

- vivienda resuelta
- servicios accesibles
- infraestructura confiable
- cumplimiento de objetivos
- decisiones percibidas como justas

Baja con:

- promesas incumplidas
- crecimiento desordenado
- falta de vivienda
- servicios insuficientes
- decisiones que benefician a un sector y perjudican sistemáticamente a otro

No es “felicidad”. Es una variable de gobernabilidad comunitaria.

## 17. Misiones

Las misiones nacen de necesidades.

Tipos:

### Historia
Vinculadas a un hito documentado.

### Desarrollo
Construir o resolver algo.

### Comunidad
Atender población.

### Producción
Aumentar capacidad.

### Infraestructura
Conectar sistemas.

### Crisis
Resolver una consecuencia inesperada.

### Exploración
Conocer una parte del territorio.

## 18. Eventos

Los eventos deben ser sistémicos.

Ejemplo:

**La producción creció.**

→ aumenta demanda de transporte.

→ aparecen demoras.

→ baja eficiencia.

→ aparece misión:

**SACAR LA PRODUCCIÓN**

El evento nace de la partida.

## 19. Decisiones

Cada decisión debe mostrar:

- problema
- opciones
- costo inmediato
- posible beneficio
- posibles consecuencias
- incertidumbre cuando corresponda

Nunca mostrar una única “respuesta correcta”.

### Ejemplo

**¿Qué priorizamos?**

A — Agua  
B — Vivienda  
C — Caminos

Cada opción modifica el sistema.

## 20. Memoria

El juego guarda decisiones significativas.

Ejemplo conceptual:

priorized_water_1968 = true

Décadas después:

housing_pressure += historicalMemoryFactor

La memoria no significa castigo arbitrario. Significa que el territorio conserva las consecuencias de las decisiones.

## 21. Progresión

No usar niveles RPG.

La progresión se produce por:

**NECESIDAD + CAPACIDAD + CONTEXTO HISTÓRICO**

Ejemplo:

No se desbloquea una escuela porque el jugador tiene “nivel 5”.

Se desbloquea cuando:

- existe población suficiente
- existe demanda
- existe capacidad económica
- corresponde históricamente
- existe infraestructura mínima

## 22. Condiciones de crisis

No habrá game over frecuente.

Estados:

- estable
- tensionado
- crítico
- colapso

Una crisis puede ser:

- habitacional
- hídrica
- productiva
- logística
- económica
- comunitaria

El jugador debe recuperarse.

## 23. Final

Al llegar a 2026:

### MAPA FINAL

### PERFIL TERRITORIAL

### PERFIL SOCIAL

### PERFIL PRODUCTIVO

### PERFIL DE INFRAESTRUCTURA

### CRISIS SUPERADAS

### DECISIONES CLAVE

### DIFERENCIA ENTRE HISTORIA DOCUMENTADA Y LÍNEA HIPOTÉTICA

No existe un único final correcto.

Existe un legado.

## 24. Motor de simulación

Arquitectura prevista:

GameState

contiene:

- year
- month
- territory
- water
- production
- population
- families
- buildings
- roads
- economy
- community
- missions
- events
- decisions
- historyLog

El motor ejecuta ciclos:

tick → necesidades → producción → transporte → economía → eventos → misiones → visualización

## 25. Arquitectura web

/
├── index.html
├── styles.css
├── app.js
├── data/
│   ├── history.js
│   ├── territory.js
│   ├── buildings.js
│   ├── characters.js
│   ├── missions.js
│   └── events.js
├── engine/
│   ├── state.js
│   ├── simulation.js
│   ├── economy.js
│   ├── population.js
│   ├── infrastructure.js
│   ├── history.js
│   └── save.js
├── ui/
│   ├── map.js
│   ├── hud.js
│   ├── mission-panel.js
│   ├── decision-panel.js
│   └── timeline.js
└── docs/

La primera implementación puede consolidarse en menos archivos para facilitar mantenimiento, pero la lógica debe conservar esta separación conceptual.

## 26. Rendimiento

Objetivo:

- 60 FPS cuando sea posible
- SVG ligero
- animaciones CSS
- simulación por intervalos
- no recalcular todo el mundo en cada frame
- agentes visibles limitados
- población grande agregada

La simulación y la representación visual estarán separadas.

## 27. Guardado

localStorage.

Tres ranuras:

- Partida 1
- Partida 2
- Partida 3

Más:

- reiniciar
- exportar estado
- importar estado, si posteriormente resulta útil

No requiere servidor.

## 28. Vertical Slice 1

Antes de construir 1966–2026 completo, se implementará un único fragmento totalmente jugable:

### 1968 — HACER POSIBLE EL AGUA

El jugador:

1. observa el territorio;
2. identifica área productiva;
3. elige trazado de infraestructura;
4. asigna recursos;
5. construye;
6. ve aparecer el canal;
7. cambia la capacidad productiva;
8. aparecen trabajadores;
9. surge una nueva necesidad;
10. recibe una nueva misión.

Si este fragmento funciona, la arquitectura sirve para el resto.

## 29. Criterio de calidad

INEVITABLE no se considerará listo porque “funciona”.

Debe cumplir:

- el mapa se entiende sin explicación larga;
- las decisiones tienen consecuencias visibles;
- la historia documentada está separada de la ficción;
- el territorio cambia;
- las personas importan;
- el jugador sabe qué puede hacer;
- el jugador sabe por qué importa;
- la interfaz no tapa el mapa;
- funciona en móvil;
- funciona sin backend;
- una partida puede guardarse;
- una segunda partida puede producir una línea diferente.

## 30. Ley fundacional

> **INEVITABLE no simula solamente una ciudad. Simula el proceso mediante el cual territorio, agua, producción, personas, infraestructura y decisiones terminan formando una localidad.**
