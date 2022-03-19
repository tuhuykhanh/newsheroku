const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');

const CategorySchema = new Schema({
    name: {
      type: String,
      required: [true, "Please add your category"],
      trim: true,
      unique: true,
      maxLength: [50, "Name is up to 50 chars long."]
    },
    slug: { 
      type: String, 
      slug: 'name',
      unique:true 
  },
  }, {
    timestamps: true
  })
  
mongoose.plugin(slug)
module.exports = mongoose.model('categorys', CategorySchema)