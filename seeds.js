var mongoose = require("mongoose");    
var blog = require("./models/blog");  

var data = [
    {
        title:"AAA",
        URL: "https://static.parade.com/wp-content/uploads/2018/03/golden-puppy-life-national-geographic-ftr-1.jpg",
        content: "Im AAA"
    },
    {
        title:"BBB",
        URL: "https://static.parade.com/wp-content/uploads/2018/03/golden-puppy-life-national-geographic-ftr-1.jpg",
        content: "Im BBB"
    }
]

function seedDB(){
    
    
    
    /*
    
    
    blog.remove({}, function(err){
        if (err)
        { 
            console.log(err);
        }
        
        console.log("remove dog");
       
       
        data.forEach(function(seed){
            console.log(seed.URL);
            console.log(seed.title);
            console.log(seed.content);
            console.log("=================================");
            
            var D_title = seed.title;
            var U_name = seed.URL;
            var U_Des = seed.content;
            var new_temp = {title : D_title, URL:U_name, content:U_Des};
            
            blog.create(new_temp, function(err){
              if (err)
              {
                console.log(err);
              }
              else
              {
                console.log("Add");
              }
            });
            
            
        });
    });
    */
}

module.exports = seedDB;
