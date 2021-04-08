const webdriver = require("selenium-webdriver");
//const chromedriver = require("chromedriver");

function sleep(ms){
    return new Promise((resolve) => setTimeout(resolve, ms));
}
/*function seleniumGoogleTest(){
    var driver = new webdriver.Builder().forBrowser("chrome").build();
    driver.get("https://www.google.com").then(function() {
        console.log("Click on about");
        driver.findElement(webdriver.By.linkText("About")).click();
        });
}
seleniumGoogleTest();*/


function seleniumUITest(){
    var driver = new webdriver.Builder().forBrowser("chrome").build();
    driver.get("http://localhost:8000/admin/dashboard").then(function() {
        console.log("Click on upload and interview");
        driver.findElement(webdriver.By.linkText("UPLOAD & INTERVIEW")).click();
        });
}
seleniumUITest();
function seleniumResumeTest(){
    var driver = new webdriver.Builder().forBrowser("chrome").build();
    driver.get("https://localhost:8000").then(function() {
        console.log("Click on example resumes");
        driver.findElement(webdriver.By.linkText("EXAMPLE RESUMES")).click();
        });
}
seleniumResumeTest();
function seleniumResTest(){
    var driver = new webdriver.Builder().forBrowser("chrome").build();
    driver.get("https://localhost:8000").then(function() {
        console.log("Click on other resources");
        driver.findElement(webdriver.By.linkText("OTHER RESOURCES")).click().then(function(){
            sleep(3000).then(() => {
                console.log("Click on upload & interview");
                driver.findElement(webdriver.By.linkText("UPLOAD & INTERVIEW")).click();
            });
        });
    });
    seleniumResTest();
}

/*
function seleniumTest(){
    var driver = new webdriver.Builder().forBrowser("chrome").build();
    driver.get("https://localhost:8001").then(function() {
        console.log("click on home button");
        driver.findElement(webdriver.By.linkText("HOME")).click().then(function(){
            sleep(3000).then(() => {
                console.log("Click on upload & interview");
                driver.findElement(webdriver.By.linkText("UPLOAD & INTERVIEW")).click();
            });
        });
    });
}*/