> ** Important:** quan fagis obtenir dades ves a db.json i elimina la primera clau [] és a dir que quedi aixi, és important perque sino no et funcionarà la ruta:http://localhost:3001/characters/id_charecter :
ABANS:
{
  "characters": [
    [
      {
DESPUES:
{
  "characters": [
      {
        
# Guia d'Instal·lació i Execució

Aquesta guia proporciona instruccions pas a pas per instal·lar Node.js i JSON Server, així com per executar un arxiu `server.js` en un entorn local.

## Requisits Previs

Necessitaràs tenir instal·lat Git i Node.js al teu sistema. Aquesta guia assumeix que estàs treballant en un sistema basat en UNIX (com Linux o macOS) o Windows.

## Instal·lació de Node.js

1. **Windows**: Descarrega l'instal·lador des de [nodejs.org](https://nodejs.org/) i segueix les instruccions de instal·lació.

2. **Linux/MacOS**: Pots instal·lar Node.js utilitzant nvm (Node Version Manager) per una gestió més fàcil de múltiples versions de Node.js. Executa els següents comandaments al teu terminal:

## Instal·lació de JSON Server

Primer, instal·la Node.js utilitzant nvm (Node Version Manager) amb aquests comandaments:

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
# O bé
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash

# Tanca i torna a obrir el terminal, i després instal·la Node.js
nvm install node

## Un cop hagis instal·lat Node.js, pots instal·lar JSON Server globalment al teu sistema mitjançant npm (el gestor de paquets de Node.js) amb el següent comandament:

npm install -g json-server

## Preparació del Projecte
Instala les dependències del projecte amb npm:

npm install

## Execució de server.js
Per iniciar el teu servidor JSON Server i servir la teva API falsa, executa:

node server.js

Això iniciarà JSON Server i exposarà la teva API al port especificat dins de server.js (per defecte suele ser el port 3000). Pots accedir a la teva API navegant a http://localhost:port des del teu navegador, substituint port pel número de port correcte.