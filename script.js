const btnRobar = document.querySelector("#btnRobar");
const btnPasar = document.querySelector("#btnPasar");
const cartaRobada = document.querySelector("#imgCartaRobada");

// Clase para las cartas
class Carta {
  constructor(nombre, puntos, imagen) {
    this.nombre = nombre;
    this.puntos = puntos;
    this.imagen = imagen;
  }

  static getRandomCarta() {
    return Math.floor(Math.random() * 10 + 1);
  }

  static getRandomPathImg() {
    let random = Math.floor(Math.random() * 20) + 1;
    if (random < 10) {
      return `./img/card/robot_0${random}.png`;
    }
    return `./img/card/robot_${random}.png`;
  }
}

// Clase para los jugadores
class Jugador {
  constructor(nombre) {
    this.nombre = nombre;
    this.cartas = [];
    this.puntos = 0;
    this.eliminado = false;
    this.ganador = false;
    this.turno = false;
  }

  agregarCarta(carta) {
    this.cartas.push(carta);
    this.puntos += carta.puntos;
  }

  setTurno(turno) {
    this.turno = turno;
  }

  eliminar() {
    this.eliminado = true;
  }

  setGanador() {
    this.ganador = true;
  }
}

const jugadores = [
  new Jugador("Jugador 1"),
  new Jugador("Jugador 2"),
  new Jugador("Jugador 3"),
];

// Crear el mazo y generar las cartas
const mazo = [];

// Inicializar el turno al jugador 1
jugadores[0].setTurno(true);

// Generar 60 cartas randoms en el mazo
function crearMazo() {
  for (let i = 0; i < 60; i++) {
    if (i < 6) {
      mazo.push(new Carta("Bomba", 0, "img/bomba/bomba.png"));
    } else if (i < 16) {
      mazo.push(new Carta("Saltar", 0, "img/pasarTurno/pasarTurno.png"));
    } else if (i < 22) {
      mazo.push(
        new Carta("Desactivador", 0, "img/herramienta/herramienta.png")
      );
    } else {
      mazo.push(
        new Carta("Robot", Carta.getRandomCarta(), Carta.getRandomPathImg())
      );
    }
  }
  console.log(mazo);
}

// Barajamos las cartas con el método Fisher-Yates Shuffle
function barajarMazo() {
  for (let i = mazo.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [mazo[i], mazo[j]] = [mazo[j], mazo[i]];
  }
  console.log(mazo);
}

// Variable para llevar la cuenta de quién tiene el turno
let iJugadores = 0;

// Metodo para que el jugador al que le toque robe una carta y se muestre en el tablero
function jugarCarta() {
  const jugadorActual = jugadores[iJugadores];

  // Verificar si el jugador está eliminado
  if (jugadorActual.eliminado) {
    console.log(`El jugador ${jugadorActual.nombre} está eliminado y no puede jugar.`);
    cambiarTurno(); // Cambiar turno si el jugador está eliminado
    return; // Saltamos si el jugador está eliminado
  }

  const carta = mazo.pop();

  // El jugador actual toma la carta
  jugadorActual.agregarCarta(carta);

  // Si la carta es una bomba, verificamos si tiene una carta de desactivación
  if (carta.nombre === "Bomba") {
    const indexCartaDesactivador = jugadorActual.cartas.findIndex(
      (carta) => carta.nombre === "Desactivador"
    );

    if (indexCartaDesactivador !== -1) {
      // Si tiene una carta de desactivación, la usamos y no se elimina
      jugadorActual.cartas.splice(indexCartaDesactivador, 1); // Eliminamos la carta de desactivación
      console.log(
        `El jugador ${jugadorActual.nombre} ha usado una carta de desactivación y ha evitado la bomba.`
      );
      alert(
        `El jugador ${jugadorActual.nombre} ha usado una carta de desactivación y ha evitado la bomba.`
      );
    } else {
      // Si no tiene una carta de desactivación, se elimina
      jugadorActual.eliminar();
      console.log(
        `El jugador ${jugadorActual.nombre} ha robado una bomba y ha sido eliminado.`
      );
      alert(
        `El jugador ${jugadorActual.nombre} ha robado una bomba y ha sido eliminado.`
      );
    }
  } else {
    // Si no es una bomba, actualizamos el tablero mostrando la imagen de la carta robada
    cartaRobada.setAttribute("src", carta.imagen);
  }

  // Actualizar marcadores
  actualizarMarcadores();

  // Comprobar si queda solo un jugador no eliminado para finalizar el juego
  if (verificarGanador()) {
    return; // Termina el juego si hay un ganador
  }

  // Cambiar turno al siguiente jugador
  cambiarTurno();
}

function cambiarTurno() {
  // Desactivar el turno de todos los jugadores
  jugadores.forEach((jugador) => jugador.setTurno(false));

  let encontradoJugadorActivo = false;

  while (!encontradoJugadorActivo) {
    iJugadores++;
    if (iJugadores >= jugadores.length) {
      iJugadores = 0; // Reiniciar el índice al primer jugador
    }

    // Verificar si el siguiente jugador no está eliminado
    if (!jugadores[iJugadores].eliminado) {
      jugadores[iJugadores].setTurno(true); // Asignar el turno al jugador actual
      console.log(`Es el turno de: ${jugadores[iJugadores].nombre}`);
      encontradoJugadorActivo = true; // Encontramos un jugador activo
    }
  }

  // Después de cambiar el turno, actualizar los marcadores
  actualizarMarcadores();
}

// Método para verificar si queda solo un jugador no eliminado
function verificarGanador() {
  const jugadoresActivos = jugadores.filter(jugador => !jugador.eliminado);

  if (jugadoresActivos.length === 1) {
    const ganador = jugadoresActivos[0];
    ganador.setGanador();
    console.log(`El juego ha terminado. El ganador es ${ganador.nombre}.`);
    alert(`El juego ha terminado. El ganador es ${ganador.nombre}.`);
    // Mostrar el botón de reinicio
    reemplazarBotonPasarPorReiniciar();

    return true; // Hay un ganador, se termina el juego
  }

  return false; // No hay ganador aún
}

// Función para reemplazar el botón "Pasar Turno" por el botón de reinicio
function reemplazarBotonPasarPorReiniciar() {
  // Obtener el botón "Pasar Turno"
  const botonPasar = document.querySelector("#btnPasar");

  // Cambiar el texto del botón
  botonPasar.textContent = "Reiniciar Juego";

  // Eliminar el evento de pasar turno y asignar el evento de recargar la página
  botonPasar.removeEventListener("click", pasarTurno);
  botonPasar.addEventListener("click", () => {
    location.reload(); // Recargar la página para reiniciar el juego
  });
}

function actualizarMarcadores() {
  jugadores.forEach((jugador, index) => {
    // Seleccionar los elementos HTML correspondientes a cada jugador
    const jugadorElement = document.querySelector(`.contenedorJugador:nth-child(${index + 1}) h2`);
    const numCartasElement = document.querySelector(`#J${index + 1}NumCartas`);
    const puntosElement = document.querySelector(`#J${index + 1}Puntos`);
    const saltoTurnoElement = document.querySelector(`#J${index + 1}saltoTurno`);
    const desactivacionElement = document.querySelector(`#J${index + 1}Desactivacion`);

    // Actualizar el número de cartas
    numCartasElement.textContent = `⚪️ Número de cartas: ${jugador.cartas.length}`;

    // Actualizar los puntos totales
    puntosElement.textContent = `⚪️ Puntos totales: ${jugador.puntos}`;

    // Contar cartas de tipo Saltar y Desactivador
    const numSaltos = jugador.cartas.filter((carta) => carta.nombre === "Saltar").length;
    const numDesactivadores = jugador.cartas.filter((carta) => carta.nombre === "Desactivador").length;

    // Actualizar las cartas de salto de turno
    saltoTurnoElement.textContent = `⚪️ Cartas salto turno: ${numSaltos}`;

    // Actualizar las cartas de desactivación
    desactivacionElement.textContent = `⚪️ Cartas desactivación: ${numDesactivadores}`;

    // Cambiar el color del nombre según el estado del jugador
    if (jugador.eliminado) {
      jugadorElement.style.color = 'red'; // Rojo si el jugador está eliminado
    } else if (jugador.turno) {
      jugadorElement.style.color = 'yellow'; // Amarillo si es su turno
    } else {
      jugadorElement.style.color = 'white'; // Blanco si no es su turno ni está eliminado
    }
  });
}

// Funcion para que cuando el ususario tenga una carta de saltar el turno y pulse el boton de pasar turno se le elimine la carta y salte el turno
function pasarTurno() {
  const jugadorActual = jugadores[iJugadores];

  // Buscar si el jugador tiene una carta "Saltar"
  const indexCartaSaltar = jugadorActual.cartas.findIndex(carta => carta.nombre === "Saltar");

  if (indexCartaSaltar !== -1) {
    // Si el jugador tiene una carta "Saltar", la eliminamos de su mano
    jugadorActual.cartas.splice(indexCartaSaltar, 1);

    // Actualizamos los marcadores de los jugadores
    actualizarMarcadores();

    // Cambiamos el turno al siguiente jugador
    cambiarTurno();

    console.log(`El jugador ${jugadorActual.nombre} ha usado una carta de "Saltar turno".`);
  } else {
    // Si no tiene cartas de "Saltar", no se puede pasar el turno
    console.log(`El jugador ${jugadorActual.nombre} no tiene una carta de "Saltar turno".`);
  }
}

btnRobar.addEventListener("click", function () {
  jugarCarta();
});

btnPasar.addEventListener("click", function () {
  pasarTurno();
});

// Llamada para crear y barajar el mazo
crearMazo();
barajarMazo();
