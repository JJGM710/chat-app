const { Usuarios } = require('../classes/usuarios');
const { io } = require('../server');
const { crearMensaje } = require('../utils/utilidades');

const usuarios = new Usuarios();

io.on('connection', (client) => {
	client.on('entrarChat', (data, callback) => {
		if (!data.nombre || !data.sala) {
			return callback('hey');
		}

		client.join(data.sala);
		usuarios.agregarPersona(client.id, data.nombre, data.sala);

		client.broadcast
			.to(data.sala)
			.emit('listaPersonas', usuarios.getPersonasPorSala(data.sala));

		client.broadcast
			.to(data.sala)
			.emit(
				'crearMensaje',
				crearMensaje('Administrador', `${data.nombre} entro`)
			);
		callback(usuarios.getPersonasPorSala(data.sala));
	});

	client.on('enviarMensaje', (data, callback) => {
		let persona = usuarios.getPersonaById(client.id);

		let mensaje = crearMensaje(persona.nombre, data.mensaje);

		client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);

		callback(mensaje);
	});

	client.on('disconnect', () => {
		let personaBorrada = usuarios.borrarPersona(client.id);

		if (personaBorrada.nombre) {
			client.broadcast
				.to(personaBorrada.sala)
				.emit(
					'crearMensaje',
					crearMensaje('Administrador', `${personaBorrada.nombre} salio`)
				);
			client.broadcast
				.to(personaBorrada.sala)
				.emit(
					'listaPersonas',
					usuarios.getPersonasPorSala(personaBorrada.sala)
				);
		}
	});

	client.on('mensajePrivado', (data) => {
		let persona = usuarios.getPersonaById(client.id);

		client.broadcast
			.to(data.para)
			.emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));
	});
});
