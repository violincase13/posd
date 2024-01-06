conn = new Mongo();
db = conn.getDB("database");

db.createCollection("news");
db.createCollection("checkpoints");