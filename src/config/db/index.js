const mongoose = require('mongoose')

const data = process.env.DATA 

async function connect(){
        try {
            await mongoose.connect(`${data}`,{
                //  useCreateIndex:true,
                // useUnifiedTopology: true,  
                useNewUrlParser: true,
                useUnifiedTopology: true,     
            })
            console.log('connected to DB!')
        } catch (error) {
            handleError(error);
            console.log('connect failure!')
        }

}

module.exports = { connect }



