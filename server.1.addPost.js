
var http=require('http');
var fs=require('fs');
var path=require('path');
var mime=require('mime');
var URL=require('url');
var querystring=require("querystring");
var _=require("underscore");
http.createServer(function(req,res){
    res.GG_render=function(file,tplData){
        fs.readFile(file,function(err,data){
            if(err){
                throw err;
            }
            var html=data;
        // console.log(html);
        //<Buffer 3c 68 74 6d 6c 20 78 6d 6c 6e 73 3d 22 68 74 74 70 3a 2f 2f 77 77 77 2e 77 33 2e 6f 72 67 2f 31 39 39 39 2f 78 68 74 6d 6c 22 3e 0a 3c
        // 68 65 61 64 3e ... >
        if(tplData){
        html=html.toString();
        // console.log(html);
        var fn=_.template(html);
        html=fn({list:tplData});
    }
            res.end(html);
        })
    }
    if(req.url==='/' || req.url==='/index'){
        fs.readFile(path.join(__dirname,'./data/data.json'),'utf8',function(err,data){
           if(err && err.code !="ENOENT"){
               throw err
           }
           var list=JSON.parse(data || '[]');
           res.GG_render(path.join(__dirname,'./views/index.html'),list);
        }) 
    }
    else if(req.url.startsWith('/detail')){
       fs.readFile(path.join(__dirname,'./data/data.json'),'utf8',function(err,data){
    if(err){
        throw err;
    }
        var list=JSON.parse(data || '[]');
         var obj=URL.parse(req.url,true);
         console.log(obj);
         var id=obj.query.id;
        
         for(var i=0;i<list.length;i++){
             var element=list[i];
             if(id==element.id){
                res.GG_render(path.join(__dirname,'./views/detail.html'),element);
                break;
             }
         }
       })
    }
    else if(req.url==='/submit'){

       res. GG_render(path.join(__dirname,'./views/submit.html'));
    }



    else if(req.url.startsWith('/add') && req.method==='GET'){
     fs.readFile(path.join(__dirname,'./data/data.json'),'utf8',function(err,data){
         if(err && err.code !='ENOENT'){
             throw err
         }
         var list=JSON.parse(data || '[]');

         var obj=URL.parse(req.url,true);
         obj.query.id=list.length;
         list.push(obj.query);
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



    else if(req.url==='/add'&&req.method==='POST'){
        //   fs.readFile(path.join(__dirname,'./data/data.json'),'utf8',function(err,data){
        //          if(err && err.code != 'ENOENT'){
        //              throw err
        //          }

        read_render(function(data){
                 var list=JSON.parse(data || '[]');
                 var bufferArr=[];
            req.on('data',function(chunk){
        bufferArr.push(chunk);
            })
            req.on('end',function(){
              var buffer=Buffer.concat(bufferArr);
              var postBody=buffer.toString('utf8');
              postBody=querystring.parse(postBody);
              postBody.id=list.length;
            list.push(postBody);


            write_render(list,function(){

            
            // fs.writeFile(path.join(__dirname,'./data/data.json'),JSON.stringify(list),function(err){
            //     if(err){
            //         throw err;
            //     }
                res.statusCode=301;
                res.statusMessage='Moved Permanently';
                res.setHeader('localtion','/');
                res.end();
            })
            })
          })
    }



    else if(req.url.startsWith('/resources')){
        res.setHeader('content-type',mime.getType(req.url));
        res.GG_render(path.join(__dirname,req.url))
    }
}).listen(9878,function(){
console.log('服务器开启了,http://localhost:9878');
})
// ***********************************************************************************


function write_render(list,callback){


    fs.writeFile(path.join(__dirname,'./data/data.json'),JSON.stringify(list),function(err){
        if(err){
            throw err;
        }
        callback();
    })

}

function read_render(callback){
    fs.readFile(path.join(__dirname,'./data/data.json'),'utf8',function(err,data){
        if(err && err.code != 'ENOENT'){
            throw err
        }
        callback(data);
    })
   
}


/**
 * 
 * 渲染方法（路径，res）
 */
function GG_render(file,res){
    fs.readFile(file,function(err,data){
        if(err){
            throw err;
        }
        res.end(data);
    })
}