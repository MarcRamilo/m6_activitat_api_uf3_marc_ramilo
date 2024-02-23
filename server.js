const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json'); // Ruta al archivo JSON donde están los datos
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 3001;

server.use(middlewares);
server.use(jsonServer.bodyParser); // Mueve bodyParser antes de tus rutas personalizadas

// Ruta personalizada para eliminar un personaje específico por su ID
server.delete('/characters/:id', (req, res) => {
    const characterId = parseInt(req.params.id);

    router.db.get('characters').remove({ id: characterId }).write();

    // Después de eliminar el personaje, asegúrate de guardar los cambios en la base de datos
    router.db.write();

    res.json({ message: 'Personaje eliminado correctamente' });
});
// Agrega aquí otras rutas personalizadas si las necesitas (por ejemplo, para actualizar o crear personajes)

server.use(router); // Esto debería ir después de definir todas tus rutas personalizadas

server.listen(port, () => {
    console.log(`JSON Server está corriendo en el puerto ${port}`);
});