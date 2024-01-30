module.exports = {
    localStorageUser: "clogMobileUser",
    localStoragePageBeforeLogin: "clogMobilePageBeforeLogin",


    // Login options: "local", "ldap", "oauth"
    // loginMethod: "local",  
    // loginMethod: "ldap",
    loginMethod: "oauth",


    // The is software user rather than software copyright
    softwareUser: "中国科学院高能物理研究所（IHEP）",


    // Software copyright
    softwareCopyright: "Copyright © 2024 中国科学院高能物理研究所（IHEP）",


    // oauthUrl: 'https://login.csns.ihep.ac.cn/oauth2/authorize',
    // tokenUrl: 'https://login.csns.ihep.ac.cn/oauth2/token',
    // logoutUrl: 'https://login.csns.ihep.ac.cn/logout',


    // Development environment
    homePage: 'http://localhost:8080',
    serverPath: "http://localhost:3000/api",
    clientID: 'clientID',
    clientSecret: 'clientSecret',
    redirectUrl: 'http://10.1.44.253:8080/oauth/redirect',


    // Test environment
    // homePage: 'http://10.1.236.131',
    // serverPath: "http://10.1.236.131:3000/api",
    // clientID: 'clientID',
    // clientSecret: 'clientSecret',
    // redirectUrl: 'http://10.1.236.131/oauth/redirect',


    // Production environment
    // homePage: 'http://accdev.csns.ihep.ac.cn',
    // serverPath: "http://accdev.csns.ihep.ac.cn:3000/api",
    // clientID: 'clientID',
    // clientSecret: 'clientSecret',
    // redirectUrl: 'http://accdev.csns.ihep.ac.cn/oauth/redirect',
}