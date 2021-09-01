exports.up = (pgm) => {
  pgm.createTable('playlistsongs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    song_id: {
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
          references: 'songs(id)',
          columns: 'song_id',
          onDelete: 'CASCADE',
        },
      ],
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('playlistsongs');
};
