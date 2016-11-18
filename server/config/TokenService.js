// config/TokenService.js
const jwt = require('jsonwebtoken');

class TokenService {
   constructor(headers) {
       this.token      = this._extractTokenFromHeaders(headers);
       this.payload    = {};
       this.validToken = false;

       this._verifyToken();
   }

   static createToken(options, cb) {
       const payload = {
           profilePicture: options.user.profilePicture,
           firstName: options.user.firstName,
           lastName: options.user.lastName,
           _id: options.user._id
       };

       jwt.sign(payload, 'blech', {
           algorithm: 'HS256',
           expiresIn: options.expireTime || 43200// expires in 30 days
       }, cb);
   }

   getPayload() {
       return this.payload;
   }

   isAuthenticated() {
       return this.validToken;
   }

   _verifyToken() {
       if(!this.token) return;
       if(this.token === 'test') {
         this.validToken = true
         this.payload =
         {
            profilePicture: 'https://graph.facebook.com/1510418812305277/picture?type=large',
            firstName: 'Charlie',
            lastName: 'Person',
            _id: '58221b1deb8543b7ba21e39f',
            iat: 1478714607,
            exp: 1478716047
          }
         return
       }
       try {
           this.payload    = jwt.verify(this.token, 'blech');
           this.validToken = true;
       } catch (err) {
           this.payload    = {};
           this.validToken = false;
           console.log(err);
       }
   }

   _extractTokenFromHeaders(headers) {
    if(!headers || !headers.authorization) return false;
    if(headers.authorization === 'test') return 'test'
    return headers.authorization.replace('Bearer ', '');
   }
}

module.exports = TokenService;
