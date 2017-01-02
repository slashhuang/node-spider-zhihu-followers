/**
 * Created by slashhuang on 17/1/2.
 */


const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');

let walkIndexPage = (url)=>{
    request.get(url,(err,res)=>{
        if(err){
            console.log(err)
        }
        let $ = cheerio.load(res.body);
        //所有的关注者 #Profile-following => .List-item => .UserLink-link
        let queryList = $('#Profile-following');
        queryList.find('.List-item').each(function(index,item){
            let nextUrl =  $(this).find('.UserLink-link').attr('href');
            let target = `https://www.zhihu.com${nextUrl}`;
            console.log(target);
            walkFollower(`https://www.zhihu.com${nextUrl}`)
        });
    });
};
let saveImg = (url,name)=>{
    request
        .get(url)
        .on('error', function(err) {
            console.log(err)
        })
        .pipe(fs.createWriteStream(`./resouce/img/${name}`))
};
/**
 * .ProfileHeader-main
 * .Avatar图片地址
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
        let $ = cheerio.load(res.body);
        //信息collection
        let detailCollection = $('.ProfileHeader-main').eq(0);
        console.log(detailCollection.html())

        let name = detailCollection.find('.ProfileHeader-name').text();
        let jsonData = {};
        detailCollection.find('.ProfileHeader-detailItem')
            .each(function(index,item){
                console.log('============')
                let labelName = item.find('.ProfileHeader-detailLabel');
                let labelVal = '';
                let labelValContainer = item.find('.ProfileHeader-detailValue');
                let children = labelValContainer.children();
                if(!children){
                    labelVal = labelValContainer.text();
                }else{
                    if(labelValContainer.find('span')) {
                        labelVal = labelValContainer.find('span').text();
                    }else if(labelValContainer.find('.ProfileHeader-field')){
                        labelVal = children.last().text();
                    }
                }

                jsonData[labelName] =labelVal;
                fs.createWriteStream(`./resouce/${name}`).write(JSON.stringify(jsonData,2,2))
        })
    });
};
walkIndexPage('https://www.zhihu.com/people/huang-da-xian-14-14/followers');
