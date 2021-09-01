exports.up = (pgm) => {
  pgm.createTable('collaborations', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  }, {
    constraints: {
      foreignKeys: [
        {
          references: 'playlists(id)',
          columns: 'playlist_id',
          onDelete: 'CASCADE',
        },
        {
          references: 'users(id)',
          columns: 'user_id',
          onDelete: 'CASCADE',
        },
      ],
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('collaborations');
};
