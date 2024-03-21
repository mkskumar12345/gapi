const knex = require("../db");


exports.up = function (knex) {
    return knex.schema.createTable("projects", function (table) {
      table.increments("id").primary().notNullable().defaultTo(null);
      table.integer("user_id").notNullable();
     table.integer("work_category").notNullable().defaultTo(0).comment('0: complaint, 1: demand, 2: others');
      table.text("remarks").nullable();
      table.integer("district_id").notNullable();
      table.integer("block_id").notNullable();
      table.integer("village_id").notNullable();
      table.date("start_date").notNullable();
      table.date("completion_date").notNullable();
      table.string("allotted_cost").notNullable();
      table.string("estimated_cost").notNullable();
      table.string("photo1", 255).nullable();
      table.string("photo2", 255).nullable();
      table.string("photo3", 255).nullable();
      table.string("photo4", 255).nullable();
      table.integer('project_status').notNullable().defaultTo(0).comment('0: pending, 1: completed, 2: rejected');
      table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
      table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable("projects");
  };
  