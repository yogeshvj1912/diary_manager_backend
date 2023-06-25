const express = require("express")
const mongodb = require("mongodb")
const mongoclient = mongodb.MongoClient;
const URL = "mongodb+srv://admin:iXatwYMuvUwaIeMd@cluster0.jvegpfy.mongodb.net/?retryWrites=true&w=majority"
const app = express()
const bcrypt = require("bcryptjs");
const jwt=require("jsonwebtoken")
const secret ="587vnzmcy9dbsuwtlhx2i1r3fpgoake6"
const cors = require("cors")


app.use(express.json())

app.use(cors({
    origin: "https://fastidious-daifuku-107870.netlify.app"
   
}))

app.get("/",(req,res)=>{
    res.json("hello world")
})
const authorize=(req,res,next)=>{
    if(req.headers.authorization){
        try{
        const verify=jwt.verify(req.headers.authorization,secret);
        if (verify) {
            next()
        }}catch(error){
            res.status(401).json({message:"Unauthorized"})
        }
     
    }else{
        res.status(401).json({message:"Unauthorized"})
    }
}

 
 

// get method
app.get("/events",authorize,async (req, res) => {

    try {
        const connection = await mongoclient.connect(URL);

        const db = connection.db("diary_manager")

        const collection = db.collection("events")

        const users = await collection.find({}).toArray();

        await connection.close();
        res.json(users);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Somthing went wrong" })
    }
})




// post method
app.post("/event",authorize,async (req, res) => {


    try {
        const connection = await mongoclient.connect(URL);

        const db = connection.db("diary_manager")

        const collection = db.collection("events")

        const operation = await collection.insertOne(req.body);

        await connection.close();
        res.json({ message: "Successfully inserted" });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Somthing went wrong" })
    }
})



app.delete("/event/:userId",async (req, res) => {

    try {
        const connection = await mongoclient.connect(URL);

        const db = connection.db("diary_manager")

        const collection = db.collection("events")

        const users = await collection.deleteOne({
            _id:new mongodb.ObjectId(req.params.userId)
        })

        await connection.close();
        res.json(users);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Somthing went wrong" })
    }
})




//holiday post menthod

app.post("/holiday",async (req, res) => {


    try {
        const connection = await mongoclient.connect(URL);

        const db = connection.db("diary_manager")

        const collection = db.collection("holiday")

        const operation = await collection.insertMany(req.body);

        await connection.close();
        res.json({ message: "Successfully inserted" });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Somthing went wrong" })
    }
})


// get method
app.get("/holiday",async (req, res) => {

    try {
        const connection = await mongoclient.connect(URL);

        const db = connection.db("diary_manager")

        const collection = db.collection("holiday")

        const users = await collection.find({}).toArray();

        await connection.close();
        res.json(users);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Somthing went wrong" })
    }
})



app.post("/register", async (req, res) => {


    try {
        const connection = await mongoclient.connect(URL);

        const db = connection.db("diary_manager")

        const collection = db.collection("login")

        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(req.body.password, salt)

        req.body.password = hash;
        const users = await collection.insertOne(req.body);

       
        res.send({
            users,
            message:"hello"
        })
        await connection.close();
        // res.json(users)
        // res.send("hello")
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Somthing went wrong" })
    }
})


app.post("/login", async (req, res) => {


    try {
        const connection = await mongoclient.connect(URL);

        const db = connection.db("diary_manager")
        const collection = db.collection("login")
        const user = await collection.findOne({email : req.body.email})
        if(user){
        const compare= await bcrypt.compare(req.body.password,user.password)
        if(compare){
        const token= jwt.sign({id:user._id},secret)
        console.log(token);
        await connection.close();
        res.json({message:"Login Success",token});
        }else{
            res.json({message:"password is wrong"})
        }
        }else{
            res.status(401).json({message:"user not found"})
        }

     

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Somthing went wrong" })
    }
})




app.listen(8000)
