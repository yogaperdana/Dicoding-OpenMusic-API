exports.up = (pgm) => {
  pgm.createTable('songs', {
    id: {
      type: 'VARCHAR(30)',
      primaryKey: true,
    },
    title: {
      type: 'TEXT',
      notNull: true,
    },
    year: {
      type: 'INTEGER',
      notNull: true,
    },
    performer: {
      type: 'TEXT',
      notNull: true,
    },
    genre: {
      type: 'VARCHAR(60)',
    },
    duration: {
      type: 'INTEGER',
    },
    inserted_at: {
      type: 'VARCHAR(30)',
      notNull: true,
    },
    updated_at: {
      type: 'VARCHAR(30)',
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('songs');
};
