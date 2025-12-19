const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get('/favicon.ico', (req, res) => res.status(204).end());

// ==========================================
// BASE DE DATOS DE PREGUNTAS
// ==========================================
const questionsDB = [
{ cat: "Familia", q: "¿Fecha de nacimiento papito Moncho?:", a: ["3 enero 1974", "4 enero 1926", "6 enero 1926", "7 enero 1936"], correct: 2 },
{ cat: "Familia", q: "¿Fecha de nacimiento Mamanena?:", a: ["2 junio 1944", "2 junio 1945", "2 junio 1927", "2 junio 1946"], correct: 0 },
{ cat: "Familia", q: "¿Qué frase típica dice siempre Mamanena", a: ["Cho", "Puerco", "Dianche", "Vos animal"], correct: 0 },
{ cat: "Familia", q: "¿A qué edad se casó Mamanena?:", a: ["15 años", "20 años", "17 años", "16 años"], correct: 2 },
{ cat: "Familia", q: "¿Cuál es el niet@ favorito Mamanena?:", a: ["Fernando", "Peto", "Nena", "Candy"], correct: 2 },
{ cat: "Familia", q: "¿Cuál es el niet@ favorito de Papito?:", a: ["Fernando", "Braulio", "Candy", "Nena"], correct: 1 },
{ cat: "Familia", q: "¿Quién es más bromista de la familia?", a: ["Lupe", "Beatriz", "Francis", "Ceci"], correct: 0 },
{ cat: "Familia", q: "¿Quien es el más borracho de la familia?", a: ["Fernando", "Calixto", "Tio Chepe", "Peto"], correct: 2 },
{ cat: "Familia", q: "¿Quién tiene las recetas más deliciosas?", a: ["Ceci", "Mamanena", "Francis", "Beatriz"], correct: 2 },
{ cat: "Familia", q: "¿Quién llega tarde a las reuniones familiares?", a: ["Familia Portillo Quinteros", "Familia Bautista Quinteros", "Familia Diaz Quinteros", "Familia Quinteros Leiva"], correct: 0 },
{ cat: "Familia", q: "¿Quién fue el primer yerno o nuera en llegar a la familia?", a: ["Johnny", "Elmer (Nena)", "Elmer Mena", "Irene Eguizabal"], correct: 0 },
{ cat: "Familia", q: "¿Qué grupo era el mas travies@ cuando eran niños?:", a: ["Milena, Monica, Ale", "Nena, Peto, Fer", "Braulio, Candy, Nena", "Daniela, Ignacio, Adriana"], correct: 0 },
{ cat: "Familia", q: "¿Quién guarda secretos familiares?", a: ["Francis", "Candy", "Fernando", "Beatriz"], correct: 1 },
{ cat: "Familia", q: "¿Quién es mas probable que haga trampa en un juego?", a: ["Candy", "Ceci", "Beatriz", "Braulio"], correct: 3 },
{ cat: "Familia", q: "¿Quién siempre se equivoca de nombre?", a: ["Lupe", "Ceci", "Mamanena", "Tia vero"], correct: 0 },
{ cat: "Familia", q: "¿Quien ha tenidos más “casi algo”", a: ["Peto", "Luisito", "Braulio", "Fernando"], correct: 0 },
{ cat: "Familia", q: "¿Quien siempre quiere tener la Razón?", a: ["Francis", "Ceci", "Cali", "Beatriz"], correct: 0 },
{ cat: "Familia", q: "¿Quién es el hijo favorito de los abuelos?", a: ["Francis", "Caly", "Rober", "Koky"], correct: 0 },
{ cat: "Familia", q: "¿Quién es la hija favorita de los abuelos?", a: ["Beatriz", "Veronica", "Ceci", "Lupe"], correct: 0 },
{ cat: "Familia", q: "¿De quien es la frase “vamos por san martin”?", a: ["Familia Portillo Quinteros", "Familia Portillo Quinteros", "Familia Portillo Quinteros", "Todas las anteriores"], correct: 3 },
{ cat: "Familia", q: "¿Quién es la persona mas deportista de la familia?", a: ["Valentina", "André", "Ignacio", "Adriana"], correct: 1 },
{ cat: "Familia", q: "¿Quién prepara mejor la receta familiar “costillas”", a: ["Braulio", "Francis", "Beatriz", "Todas las anteriores"], correct: 3 },
{ cat: "Familia", q: "¿Qué persona fue a visitar la china (Nia Elcira)?", a: ["Nia Elcira", "Mamanena", "Francis", "Caly"], correct: 2 },
{ cat: "Familia", q: "¿Que tí@ es un primo más?", a: ["Francis", "Koky", "Ceci", "Beatriz"], correct: 0 },
{ cat: "Familia", q: "¿Quién guarda las fotos familiares", a: ["Francis", "Beatriz", "Caly", "Veronica"], correct: 0 },
{ cat: "Familia", q: "¿Quién tiene más hijos?", a: ["Lupe", "Beatriz", "Caly", "Koky"], correct: 0 },
{ cat: "Familia", q: "¿Qué herman@ se casó primero?", a: ["Lupe", "Rober", "Caly", "Koky"], correct: 2 },
{ cat: "Familia", q: "¿Cual ha sido la mejor boda de los tiempos?", a: ["Lupe", "Beatriz", "Caly", "Koky"], correct: 3 },
{ cat: "Familia", q: "¿Quién vomitó los baños de la casona?", a: ["Braulio", "Peto", "Fernando", "Francis"], correct: 0 },
{ cat: "Familia", q: "¿Quién tiene los ronquidos más fuertes?", a: ["Tio chepe", "Fernando", "Francis", "Braulio"], correct: 0 },
{ cat: "Familia", q: "¿Quién pone más apodos?", a: ["Ceci", "Beatriz", "Francis", "Caly"], correct: 0 },
{ cat: "Familia", q: "¿Quien todavía no se aprende todos los nombres de la familia?", a: ["Paty", "Ricardo", "Elmer", "Irene"], correct: 1 },
{ cat: "Familia", q: "¿Quién se levanta mil veces a la cocina?", a: ["Ceci", "Beatriz", "Candy", "Lupe"], correct: 2 },
{ cat: "Familia", q: "¿Quién come en sopera todo tipo de comida?", a: ["Lupe", "Beatriz", "Ceci", "Mamanena"], correct: 0 },
{ cat: "Familia", q: "¿Quién promete no tomar y termina tomando?", a: ["Braulio", "Irene", "Fer", "Francis"], correct: 1 },
{ cat: "Familia", q: "¿Quién inventa nuevas reglas en los juegos?", a: ["Francis", "Candy", "Ale", "Monica"], correct: 0 },
{ cat: "Familia", q: "¿Quién es el más dramatic@ de la familia?", a: ["Candy", "Fernando", "Elmer", "Beatriz"], correct: 3 },
{ cat: "Familia", q: "¿Cuál era el juego favorito de los primos?", a: ["Escondelero", "Mica", "Cantarito", "Cantarro"], correct: 0 },
{ cat: "Familia", q: "¿Cuál hermano fue el primero en ir a fiestas?", a: ["Ramon", "Caly", "Koky", "Rober"], correct: 0 },
{ cat: "Familia", q: "¿Sinónimo de “Negar algo”?", a: ["Puerco", "Ve", "Cho", "Fock"], correct: 2 },
{ cat: "Familia", q: "¿Quién es el mas terco de la familia?", a: ["Caly", "Beatriz", "Francis", "Candy"], correct: 0 },
{ cat: "Familia", q: "¿Quién es la tia más bailarina?", a: ["Mayra", "Lupe", "Ceci", "Beatriz"], correct: 0 },
{ cat: "Familia", q: "¿Quién es la tía más enojada?", a: ["Veronica", "Lupe", "Ceci", "Beatriz"], correct: 0 },
{ cat: "Familia", q: "¿Qué es lo que nunca falta en las navidades?", a: ["Cervezas", "Regalos de Valentina y André", "Abrazos", "Besos"], correct: 1 },
{ cat: "Familia", q: "¿Quien controla la música en las festividades?", a: ["Ale", "Monica", "Fer", "Candy"], correct: 2 }

];

let rooms = {};

io.on('connection', (socket) => {
    console.log(`🔌 Cliente: ${socket.id}`);
    
    socket.on('createRoom', () => {
        const roomId = Math.floor(1000 + Math.random() * 9000).toString();
        rooms[roomId] = {
            hostId: socket.id,
            players: {},
            currentQuestion: null,
            state: 'lobby',
            roundsPlayed: 0,
            totalRounds: 5 // Valor por defecto
        };
        socket.join(roomId);
        socket.emit('roomCreated', roomId);
    });

    socket.on('joinRoom', ({ roomId, name }) => {
        const room = rooms[roomId];
        if (room && room.state === 'lobby') {
            const avatars = ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮'];
            const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
            
            room.players[socket.id] = { 
                id: socket.id, 
                name: name, 
                score: 0, 
                avatar: randomAvatar,
                hasAnswered: false 
            };
            
            socket.join(roomId);
            io.to(room.hostId).emit('updatePlayerList', Object.values(room.players));
            socket.emit('joinedSuccess', roomId);
        } else {
            socket.emit('errorMsg', 'Sala no existe o ya empezó.');
        }
    });

    // MODIFICADO: Ahora recibe el límite de preguntas
    socket.on('startGame', ({ roomId, limit }) => {
        const room = rooms[roomId];
        if (room) {
            room.totalRounds = parseInt(limit) || 5; // Guardar el límite elegido
            room.state = 'playing';
            room.roundsPlayed = 0;
            sendNextQuestion(roomId);
        }
    });

    socket.on('submitAnswer', ({ roomId, answerIndex, timeLeft }) => {
        const room = rooms[roomId];
        if (!room || !room.currentQuestion) return;

        const player = room.players[socket.id];
        if (!player || player.hasAnswered) return;

        player.hasAnswered = true;
        const correctIdx = parseInt(room.currentQuestion.correct);
        const receivedIdx = parseInt(answerIndex);
        const isCorrect = (receivedIdx === correctIdx);
        const correctAnswerText = room.currentQuestion.a[correctIdx];

        if (isCorrect) {
            const maxPoints = 1000;
            const speedBonus = Math.floor((timeLeft / 30) * 500); 
            player.score += (maxPoints + speedBonus);
        }
        
        socket.emit('answerResult', { isCorrect, correctText: correctAnswerText });

        const sortedPlayers = Object.values(room.players).sort((a, b) => b.score - a.score);
        io.to(room.hostId).emit('updateLeaderboard', sortedPlayers);

        const allPlayers = Object.values(room.players);
        const activePlayers = allPlayers.filter(p => p.id !== room.hostId); 
        const allAnswered = activePlayers.every(p => p.hasAnswered);

        if (allAnswered && activePlayers.length > 0) {
            io.to(roomId).emit('roundEnded', { correctIndex: correctIdx });
        }
    });

    socket.on('nextQuestion', (roomId) => {
        sendNextQuestion(roomId);
    });

    socket.on('timeUp', (roomId) => {
        const room = rooms[roomId];
        if(room && room.currentQuestion) {
             io.to(roomId).emit('roundEnded', { correctIndex: room.currentQuestion.correct });
        }
    });

    function sendNextQuestion(roomId) {
        const room = rooms[roomId];
        if(!room) return;

        // MODIFICADO: Usa la variable de la sala, no la global
        if (room.roundsPlayed >= room.totalRounds) {
            const sortedPlayers = Object.values(room.players).sort((a, b) => b.score - a.score);
            const winner = sortedPlayers.length > 0 ? sortedPlayers[0] : null;
            io.to(roomId).emit('gameOver', { winner: winner });
            return; 
        }

        Object.values(room.players).forEach(p => p.hasAnswered = false);
        room.roundsPlayed++; 

        const q = questionsDB[Math.floor(Math.random() * questionsDB.length)];
        room.currentQuestion = q;
        
        io.to(roomId).emit('newQuestion', {
            cat: q.cat,
            q: q.q,
            options: q.a,
            time: 30,
            currentRound: room.roundsPlayed,
            totalRounds: room.totalRounds // Enviar total dinámico al cliente
        });
    }

    socket.on('disconnect', () => {
        Object.keys(rooms).forEach(roomId => {
            const room = rooms[roomId];
            if (room.players[socket.id]) {
                delete room.players[socket.id];
                io.to(room.hostId).emit('updatePlayerList', Object.values(room.players));
            }
            if (room.hostId === socket.id) delete rooms[roomId];
        });
    });
});

const port = process.env.PORT || 3000;
http.listen(port, () => {
    console.log(`✅ SERVIDOR LISTO EN PUERTO ${port}`);
});

