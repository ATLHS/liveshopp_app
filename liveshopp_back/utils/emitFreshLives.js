const emitFreshLives = (lives) => {
  io.emit('freshLives', { freshLives: lives });
};

module.exports = { emitFreshLives };
