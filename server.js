const express = require('express')
const bodyParser= require('body-parser')
const multer = require('multer');
const fs = require('fs');




 







//mongo
const {MongoClient , ObjectId} = require('mongodb')
const myurl = 'mongodb://localhost:27017';
 
MongoClient.connect(myurl, {useNewUrlParser: true, useUnifiedTopology: true  },(err, client) => {
  if (err) return console.log(err)
  db = client.db('testForUpload') 
})

//CREATE EXPRESS APP
const app = express();
app.use(bodyParser.urlencoded({extended: true}))

//route
app.get('/',function(req,res){
    res.sendFile(__dirname + '/static/index.html');
   
  })



  // SET STORAGE
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        let a = file.originalname.split('.')
        cb(null, `${file.fieldname}-${Date.now()}.${a[a.length-1]}`)
    }
  })
   
  var upload = multer({ storage: storage })



  app.post('/upload/photos', upload.single('myImage'), (req, res) => {
    var img = fs.readFileSync(req.file.path);
 var encode_image = img.toString('base64');
 // Define a JSONobject for the image attributes for saving to database
  
 var finalImg = {
      contentType: req.file.mimetype,
      image:  new Buffer(encode_image, 'base64')
   };

db.collection('quotes').insertOne(finalImg, (err, result) => {
    console.log(result)
 
    if (err) return console.log(err)
 
    console.log('saved to database')
    res.redirect('/')
   
     
  })
})

app.get('/photos', (req, res) => {
    db.collection('quotes').find().toArray((err, result) => {


  
     
          const imgArray= result.map(element => element._id);
                console.log(imgArray);
     
       if (err) return console.log(err)
       res.send(imgArray)
       console.log(req.params.id)
     
      })
    });
    
    app.get('/photos/:id', (req, res) => {
        var id = req.params.id;
console.log(id)
        db.collection('quotes').findOne({'_id': ObjectId(id)}, (err, result) => {
         
            if (err) return console.log(err)
         
           res.contentType('image/jpeg');
           res.send(result.image.buffer)
           
           
            
          })
        })


//   app.post('/uploadfile', upload.single('myFile'), (req, res, next) => {
//     const file = req.file
//     if (!file) {
//       const error = new Error('Please upload a file')
//       error.httpStatusCode = 400
//       return next(error)
//     }
//       res.send(file)
    
//   })
 

app.listen(3000, () => console.log('Server started on port 3000'));