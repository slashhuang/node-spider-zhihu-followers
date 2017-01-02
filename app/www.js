/**
 * Created by slashhuang on 17/1/2.
 */


const request = require('request');
let cheerio = require('cheerio')

let walkIndexPage = (url)=>{
    request.get(url,(err,res)=>{
        if(err){
            console.log(err)
        }
        let $ = cheerio(res);
        //所有的关注者 #Profile-following => .List-item => .UserLink-link
        let queryList = $('#Profile-following');
        queryList.find('.List-item').each((item)=>{
            let nextUrl = item.find('.UserLink-link').attr('href');
            walkFollower(nextUrl)
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
        let $ = cheerio(res);
        //信息collection
        let detailCollection = $('.ProfileHeader-main .ProfileHeader-detailItem');
        detailCollection.each((item)=>{

        })
    });
};
walkFollower('https://www.zhihu.com/people/huang-da-xian-14-14/followers');
