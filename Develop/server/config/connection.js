const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://jshigoodies:tyghbn99@clustertest.mzaz4qo.mongodb.net/test', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
//add these might help?

module.exports = mongoose.connection;
