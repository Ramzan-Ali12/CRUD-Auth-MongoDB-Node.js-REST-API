const axios=require("axios");
//  Get request to axios

exports.homeRoutes = (req, res) => {
    // axios to display data to frontend
    axios.get("http://localhost:3000/api/users")
    .then(responce =>{
        res.render('index',{users:responce.data});

    })
    .catch(err=>{
       res.send(err);
    });
}

// add_userRoute

exports.add_user = (req, res) => {
    res.render('add_user')
}

exports.update_user = (req, res) => {
    // question it's logic is not understand
    axios.get("http://localhost:3000/api/users",{params:{id:req.query.id}})
    .then(userdata=>{
        
        res.render('update_user',{user:userdata.data})
  
    })
    .catch(err=>{
        res.send(err);
    })
}