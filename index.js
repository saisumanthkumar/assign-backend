const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const env = require('dotenv')
const model = require('./model')
// const data = require('./sample_data');

env.config()
const app = express()
const PORT = process.env.PORT || 3001

try{
    mongoose.connect(process.env.DATABASE,{useNewUrlParser: true});
    console.log('Database Connected')
}catch(err){
    console.log(err)
}

app.use(express.json())
app.use(cors())

// for(let i=0; i< data.length; i++){
//     new model(data[i]).save()
// }

app.get('/',async (req,res)=> {
    return res.json('WELCOME');
})

app.get('/filter1',async (req,res)=> {
    const data = await model.find()
    let filtered_data = []
    for(let i=0; i<data.length; i++){
        if(data[i].car === "BMW" || data[i].car === "Mercedes-Benz"){
            let price = data[i].income
            price = parseFloat(price.split('$')[1])
            if(price < 5) {filtered_data.push(data[i])}
        }
    }
    return res.json(filtered_data)
})

app.get('/filter2',async (req,res)=> {
    const data = await model.find()
    let filtered_data = []
    for(let i=0; i<data.length; i++){
        if(data[i].gender === "Male"){
            let price = data[i].phone_price
            price = parseInt(price)
            if(price > 10000) {filtered_data.push(data[i])}
        }
    }
    return res.json(filtered_data)
})

app.get('/filter3',async (req,res)=> {
    const data = await model.find()
    let filtered_data = []
    for(let i=0; i<data.length; i++){
        if(data[i].last_name[0] === "M" && data[i].quote.length > 15){
            let lastName = data[i].last_name.toLowerCase()
            let email = data[i].email.toLowerCase()
            if(email.split(lastName).length >= 2){
                filtered_data.push(data[i])
            }
        }
    }
    return res.json(filtered_data)
})

app.get('/filter4',async (req,res)=> {
    const data = await model.find()
    let filtered_data = []
    for(let i=0; i<data.length; i++){
        if(data[i].car === "BMW" || data[i].car === "Mercedes-Benz" || data[i].car === "Audi"){
            let email = data[i].email.toLowerCase()
            if(email.match(/\d+/g) === null){
                filtered_data.push(data[i])
            }
        }
    }
    return res.json(filtered_data)
})

app.get('/filter5',async (req,res)=> {
    const data = await model.find()
    let filtered_data = {}
    for(let i=0; i<data.length; i++){
        let income = data[i].income
        income = parseFloat(income.split('$')[1])
        if(filtered_data[data[i].city]){
            let users = filtered_data[data[i].city].users
            let total = filtered_data[data[i].city].average_income*users + income;
            filtered_data[data[i].city].users = users+1;
            filtered_data[data[i].city].average_income = total/(users+1);
        }
        else{
            filtered_data[data[i].city] = {
                'users':1,
                'average_income': income
            }
        }
    }
    let cities = Object.keys(filtered_data)
    cities.sort(function(a,b){
        if(filtered_data[a].users > filtered_data[b].users){
            return -1;
        }
        else if(filtered_data[a].users == filtered_data[b].users){
            if(filtered_data[a].average_income > filtered_data[b].average_income){
                return -1;
            }
        }
        return 1;
    });
    let top = [];
    for(let i=0; i<10;i++){
        top.push({
            'city':cities[i],
            'users':filtered_data[cities[i]].users,
            'average_income':filtered_data[cities[i]].average_income
        })
    }
    return res.json(top)
})

app.listen(PORT, () => {
    console.log(`server listening on ${PORT}`);
})