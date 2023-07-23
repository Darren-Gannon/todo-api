'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
    CREATE TABLE [Boards](
      [id] [char](36) NOT NULL,
      [title] [nvarchar](255) NULL,
      [createdAt] [datetimeoffset](7) NOT NULL,
      [updatedAt] [datetimeoffset](7) NOT NULL,
      PRIMARY KEY ([id]),
    );
    CREATE TABLE [States](
      [id] [char](36) NOT NULL,
      [title] [nvarchar](255) NULL,
      [orderIndex] [int] NULL,
      [createdAt] [datetimeoffset](7) NOT NULL,
      [updatedAt] [datetimeoffset](7) NOT NULL,
      [boardId] [char](36) NULL,
      PRIMARY KEY ([id]),
      FOREIGN KEY ([boardId]) REFERENCES [Boards]([id]) ON DELETE CASCADE,
    );  
    CREATE TABLE [Tasks](
      [id] [char](36) NOT NULL,
      [title] [nvarchar](255) NULL,
      [description] [nvarchar](255) NULL,
      [createdAt] [datetimeoffset](7) NOT NULL,
      [updatedAt] [datetimeoffset](7) NOT NULL,
      [boardId] [char](36) NULL,
      [stateId] [char](36) NULL,
      PRIMARY KEY ([id]),
      FOREIGN KEY ([boardId]) REFERENCES [Boards]([id]) ON DELETE CASCADE,
      FOREIGN KEY ([stateId]) REFERENCES [States]([id]),
    );
    `)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`    
      DROP TABLE Tasks
      DROP TABLE States
      DROP TABLE Boards
    `)
  }
};
