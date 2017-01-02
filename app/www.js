/**
 * Created by slashhuang on 17/1/2.
 */


const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const shell =require('shelljs');

let walkIndexPage = (url)=>{
    request.get(url,(err,res)=>{
        if(err){
            console.log(err)
        }
        res.setEncoding('utf-8'); //防止中文乱码
        let $ = cheerio.load(res.body);
        //所有的关注者 #Profile-following => .List-item => .UserLink-link
        let queryList = $('#Profile-following');
        queryList.find('.List-item').each(function(index,item){
            let nextUrl =  $(this).find('.UserLink-link').attr('href');
            let target = `https://www.zhihu.com${nextUrl}`;
            walkFollower(target)
        });
    });
};
let saveImg = (url,name)=>{
    request
        .get(url)
        .on('error', function(err) {
            console.log(err)
        })
        .pipe(fs.createWriteStream(`./resource/img/${name}`))
};
/**
 * .ProfileHeader-main
 * .Avatar图片地址
 *
 *
 * .ProfileHeader-detailItem => ProfileHeader-detailLabel
 *                           => ProfileHeader-detailValue
 *                                  =>.ProfileHeader-field(去除img拿txt)
 * @param url
 */
let walkFollower = (url)=>{
    request.get(url,(err,res)=>{
        if(err){
            console.log(err)
        }
        res.setEncoding('utf-8'); //防止中文乱码
        let $ = cheerio.load(res.body);
        //信息collection
        let detailCollection = $('.ProfileHeader-main');
        let name = detailCollection.find('.ProfileHeader-name').text();
        let jsonData = {};
        detailCollection.find('.ProfileHeader-info .ProfileHeader-infoItem')
            .each(function(index,item){
                let labelName = $(this).find('svg').attr('class').replace('Icon Icon--','');
                let context = cheerio.load($(this).html());
                context('div').remove();
                console.log(context.html(),'---');
                let labelVal = context.html();
                jsonData[labelName] = labelVal;
                let fileName = `./resource/${name}`;
                // shell.touch(fileName);
                fs.createWriteStream(fileName).write(JSON.stringify(jsonData,2,2))
        })
    });
};
walkIndexPage('https://www.zhihu.com/people/huang-da-xian-14-14/followers');
