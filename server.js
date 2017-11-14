
var http=require('http');
var fs=require('fs');
var path=require('path');
var mime=require('mime');
var URL=require('url');
http.createServer(function(req,res){
//  console.log(req.url);
    if(req.url==='/' || req.url==='/index'){
        fs.readFile(path.join(__dirname,'./views/index.html'),function(err,data){
            if(err){
                throw err;
            }
            res.end(data);
        })
       
    }
    else if(req.url==='/detail'){
        fs.readFile(path.join(__dirname,'./views/detail.html'),function(err,data){
            if(err){
                throw err;
            }
            res.end(data);
        })

    }
    else if(req.url==='/submit'){
        fs.readFile(path.join(__dirname,'./views/submit.html'),function(err,data){
            if(err){
                throw err
            }
            res.end(data);
        })

    }


    else if(req.url.startsWith('/add') && req.method==='GET'){
     fs.readFile(path.join(__dirname,'./data/data.json'),'utf8',function(err,data){
         if(err && err.code !='ENOENT'){
             throw err
         }
         var list=JSON.parse(data || '[]');
         var obj=URL.parse(req.url,true);
        //  console.log(obj)
        //  console.log(req.url)
        //  console.log(obj.query);
        //  console.log(list.push(obj.query));
         list.push(obj.query);
        // console.log(obj.query)
         fs.writeFile(path.join(__dirname,'./data/data.json'),JSON.stringify(list),'utf8',function(err){
             if(err){
                 throw err;
             }
             res.statusCode=301;
             res.statusMessage='Moved Permanently',
             res.setHeader('location','/');
             res.end();
             
         })
        
         
     })
    }





    else if(req.url.startsWith('/resources')){
        res.setHeader('content-type',mime.getType(req.url));
        fs.readFile(path.join(__dirname,req.url),function(err,data){
            if(err){
                throw err;
            }
            res.end(data);
        })
    }
}).listen(7878,function(){

console.log('服务器开启了,http://localhost:7878');


})