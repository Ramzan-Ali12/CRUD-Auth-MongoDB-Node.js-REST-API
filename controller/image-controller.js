const imgModel = require('../model/image-model')
const multer = require('multer')
const allowedFileTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif']
const filesize = [1024 * 1024 * 5] //5MB

// Disk Storage enging gives you full control On Storing files on Disk
const Storage = multer.diskStorage({
  // destination determines in which folder the Uploaded files Should be Stored
  destination: 'uploads',
  /* filename: It determines the file name inside the folder.
  If no filename is given, each file will be given a random name without file extension.
  */
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname)
  }
})


const Upload = multer({
  storage: Storage,
  fileSize: filesize,
  fileFilter: (req, file, cb) => {
    if (!allowedFileTypes.includes(file.mimetype)) 
    {
      cb('The file type is not allowed. The allowed file types are: image/png, image/jpeg, image/jpg, image/gif')
    } 
    else{
      cb(null, true)
    }
  },
  limits:filesize
}).single('testimage')

exports.UploadImage = async (req, res) => {
  try {
    // Upload the file
    Upload(req, res, err => {
      if (err) {
        return res
          .status(400)
          .send(
            'The file type is not allowed.'
          )
      }
      // Save the file to the database
      const newImage = new imgModel({
        name: req.body.name,
        image: {
          data: Buffer.from(req.file.filename),
          contentType: 'image/png'
        }
      })

      newImage
        .save()
        .then(() => res.send('Image Uploaded Successfully!'))
        .catch(err => console.log(err))
    })
  } catch (error) {
    console.log(error)
  }
}
