/**
 * Created by slashhuang on 17/1/2.
 */


const request = require('request');
let cheerio = require('cheerio')

$.html()
console.log(request);
let getMetaPage = (url)=>{
    request.get(url,(err,res)=>{
        if(err){
            console.log(err)
        }
        let $ = cheerio(res);
        //所有的关注者
        let queryList = $('#Profile-following');
    });
};
let walkFollower = (url)=>{
    request.get(url,(err,res)=>{
        if(err){
            console.log(err)
        }
        let followerHtml = cheerio(res);
    });
};
walkFollower('https://www.zhihu.com/people/huang-da-xian-14-14/followers');
