exports.up = (pgm) => {
  pgm.createTable('playlists', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    name: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  }, {
    constraints: {
      foreignKeys: {
        references: 'users(id)',
        columns: 'owner',
        onDelete: 'CASCADE',
      },
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('playlists');
};
