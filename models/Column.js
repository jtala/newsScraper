var mongoose = require("mongoose");

var Schema = mongoose.Schema;


var ColumnSchema = new Schema({
    title: {
        type: String,
        required: true
    },

    link: {
        type: String,
        required: true
    },

    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
      }
});

var Column = mongoose.model("Column", ColumnSchema);

module.exports = Column;
