import mongoose from 'mongoose'

 let connection = mongoose.connect('mongodb://localhost:27017/Contellect').then(() => {
	console.log('Db connected');
});

export default connection