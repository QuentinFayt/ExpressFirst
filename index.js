const express = require("express");
const path = require("path");
const app = express();
const url = require("url");
const morgan = require("morgan");

app.use(morgan(`[:date[clf] "UserAgent=:user-agent" ":method :url" Status=:status TempsResponse= :response-time ms`))

app.use(express.static(path.join(__dirname,"public")));

const whiteList = ["contact","about"];

app.get("/",(req,ans)=>{
    ans.render(`html.ejs`,{title:"Accueil",home:true});
}).get("/page=:page",(req,ans)=>{
    const param = req.params.page;
    if(whiteList.includes(param)){
        ans.render(`html.ejs`,{title:param,home:false});
    }else{
        ans.redirect(url.format({
            pathname:"/",
            query:req.query
        }));
    }
    ans.end();
}).use((req,resp,next)=>{
    throw new Error("Erreur : URL non prévue => " + req.url);
}).use((err,req,resp,next)=>{
    resp.status(404).render("error404.ejs",{error:err.message});
})/*.use((req,ans,next)=>{
    ans.setHeader("Content-Type","text/html");
    ans.status(404).render("error404.ejs", {error:404});
})*/

app.listen(8555);