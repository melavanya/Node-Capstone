const mongoose = require('mongoose');
mongoose.Promise = global.Promise;


const MovieSchema = mongoose.Schema({
  title: {type: String,unique: true},
});

MovieSchema.methods.retrieve = function() {
  return {
    id: this._id,
    title: this.title || '',
    overview: this.overview || '',
    poster: this.poster || '',
    duration: this.duration || '',
    rating: this.rating || ''
  };
}

const Movie = mongoose.model('Movie', MovieSchema);

module.exports = {Movie};
