#!/bin/bash
# start.sh - lancer frontend et backend en parallèle

# Charger le .env racine
export $(grep -v '^#' .env | xargs)

# Lancer le backend NestJS
echo "Starting backend..."
cd backend
npm run start:dev &
BACKEND_PID=$!

# Lancer le frontend Next.js
echo "Starting frontend..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

# Attendre que les deux process terminent
wait $BACKEND_PID $FRONTEND_PID
