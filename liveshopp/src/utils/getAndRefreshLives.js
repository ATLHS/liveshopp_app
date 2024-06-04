import cron from 'node-cron';

import socket from '../services/config/clientSocketIoConfig';

export const getAndRefreshLives = () => {
  const refreshLives = () => {
    socket.emit('refreshLives');
  };

  // Émet l'événement lors de l'initialisation
  refreshLives();

  // Programme un cron job pour émettre l'événement selon l'expression cron
  const cronJob = cron.schedule('0,30 * * * *', () => {
    refreshLives();
  });

  // Retourne les fonctions de nettoyage
  return () => {
    cronJob.stop();
  };
};

export const getAndRefreshSellerLives = () => {
  const refreshLives = () => {
    socket.emit('refreshLives');
  };

  // Émet l'événement lors de l'initialisation
  refreshLives();

  // Programme un cron job pour émettre l'événement selon l'expression cron
  const cronJob = cron.schedule('0,30 * * * *', () => {
    refreshLives();
  });

  // Retourne les fonctions de nettoyage
  return () => {
    cronJob.stop();
  };
};
